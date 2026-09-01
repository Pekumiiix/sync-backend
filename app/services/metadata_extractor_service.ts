import axios from 'axios'
import * as cheerio from 'cheerio'
import http from 'node:http'
import https from 'node:https'
import dns from 'node:dns'
import crypto from 'node:crypto'
import redis from '@adonisjs/redis/services/main'
import type { UrlData } from '#interfaces/bookmarks'

export default class MetadataExtractorService {
  private readonly CACHE_TTL_SECONDS = 60 * 60 * 24
  private readonly USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'

  private readonly httpAgent: http.Agent
  private readonly httpsAgent: https.Agent

  constructor() {
    this.httpAgent = new http.Agent({ lookup: this.ssrfSafeLookup })
    this.httpsAgent = new https.Agent({ lookup: this.ssrfSafeLookup })
  }

  async extract(targetUrl: string): Promise<UrlData> {
    this.validateUrl(targetUrl)
    const cacheKey = `metadata:${crypto.createHash('sha256').update(targetUrl).digest('hex')}`

    try {
      const cached = await redis.get(cacheKey)
      if (cached) return JSON.parse(cached) as UrlData
    } catch (error) {
      console.error('Redis cache GET failed:', error)
    }

    const metadata = await this.extractWithAxios(targetUrl)

    try {
      await redis.set(cacheKey, JSON.stringify(metadata), 'EX', this.CACHE_TTL_SECONDS)
    } catch (error) {
      console.error('Redis cache SET failed:', error)
    }

    return metadata
  }

  async extractWithAxios(targetUrl: string): Promise<UrlData> {
    try {
      const response = await axios.get(targetUrl, {
        httpAgent: this.httpAgent,
        httpsAgent: this.httpsAgent,
        headers: {
          'User-Agent': this.USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 15000,
        maxContentLength: 5 * 1024 * 1024,
        responseType: 'text',
      })

      const $ = cheerio.load(response.data)

      const parsedUrl = new URL(targetUrl)
      const hostname = parsedUrl.hostname

      const rawImage =
        $('meta[property="og:image"]').attr('content') ||
        $('meta[name="twitter:image"]').attr('content') ||
        null

      const rawFavicon =
        $('link[rel="icon"]').attr('href') ||
        $('link[rel="shortcut icon"]').attr('href') ||
        '/favicon.ico'

      return {
        title:
          $('meta[property="og:title"]').attr('content') ||
          $('meta[name="twitter:title"]').attr('content') ||
          $('title').text() ||
          hostname,
        description:
          $('meta[property="og:description"]').attr('content') ||
          $('meta[name="twitter:description"]').attr('content') ||
          $('meta[name="description"]').attr('content') ||
          null,
        coverImageUrl: this.resolveUrl(rawImage, targetUrl),
        url: $('meta[property="og:url"]').attr('content') || targetUrl,
        websiteName: $('meta[property="og:site_name"]').attr('content') || null,
        faviconUrl: this.resolveUrl(rawFavicon, targetUrl),
        domain: hostname.replace('www.', ''),
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Metadata extraction failed: ${error.message}`)
      }
      throw error
    }
  }

  private ssrfSafeLookup = (
    hostname: string,
    options: dns.LookupOptions,
    callback: (err: NodeJS.ErrnoException | null, address: any, family: any) => void
  ): void => {
    dns.lookup(hostname, options, (err, addresses, family) => {
      if (err) return callback(err, addresses, family)

      const isAll = options && options.all

      if (isAll) {
        const addrs = addresses as dns.LookupAddress[]
        for (const addr of addrs) {
          if (this.isPrivateIP(addr.address)) {
            const securityErr = new Error(
              `SSRF Blocked: Private IP (${addr.address})`
            ) as NodeJS.ErrnoException
            securityErr.code = 'ECONNREFUSED'
            return callback(securityErr, addresses, family)
          }
        }
      } else {
        // Handle String response: '104.244.42.1'
        const ip = addresses as string
        if (this.isPrivateIP(ip)) {
          const securityErr = new Error(`SSRF Blocked: Private IP (${ip})`) as NodeJS.ErrnoException
          securityErr.code = 'ECONNREFUSED'
          return callback(securityErr, addresses, family)
        }
      }

      callback(null, addresses, family)
    })
  }

  private isPrivateIP(ip: string): boolean {
    const parts = ip.split('.').map(Number)
    if (parts.length !== 4) return false

    return (
      parts[0] === 10 ||
      parts[0] === 127 ||
      parts[0] === 0 ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168) ||
      (parts[0] === 169 && parts[1] === 254)
    )
  }

  private validateUrl(urlString: string): void {
    try {
      const parsed = new URL(urlString)
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error('Only HTTP/HTTPS protocols are allowed.')
      }
    } catch {
      throw new Error('Invalid URL provided.')
    }
  }

  private resolveUrl(parsedPath: string | undefined | null, baseUrl: string): string | null {
    if (!parsedPath) return null

    try {
      return new URL(parsedPath, baseUrl).href
    } catch {
      return null
    }
  }
}
