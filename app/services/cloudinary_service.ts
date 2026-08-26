import { v2 as cloudinary } from 'cloudinary'
import env from '#start/env'
import type User from '#models/user'
import { Exception } from '@adonisjs/core/exceptions'
import { type MultipartFile } from '@adonisjs/core/bodyparser'
import logger from '@adonisjs/core/services/logger'

cloudinary.config({
  cloud_name: env.get('CLOUDINARY_CLOUD_NAME'),
  api_key: env.get('CLOUDINARY_API_KEY'),
  api_secret: env.get('CLOUDINARY_API_SECRET'),
  secure: true,
})

export default cloudinary

export class CloudinaryService {
  async upload(avatar: MultipartFile, user: User) {
    if (!avatar.tmpPath) {
      throw new Exception('Invalid file upload: Missing temporary path.', { status: 400 })
    }

    try {
      const result = await cloudinary.uploader.upload(avatar.tmpPath, {
        folder: 'user_avatars',
        public_id: `user_${user.id}`,
        overwrite: true,
        transformation: [
          { width: 256, height: 256, crop: 'fill', gravity: 'face' },
          { fetch_format: 'webp', quality: 'auto' },
        ],
      })

      return { secure_url: result.secure_url }
    } catch (error) {
      logger.error({ error }, 'Cloudinary upload error')
      throw new Exception('Failed to upload avatar to Cloudinary.', { status: 500 })
    }
  }
}
