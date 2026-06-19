import path from 'node:path'
import url from 'node:url'

export default {
  path: path.dirname(url.fileURLToPath(import.meta.url)) + '/../',
  title: 'Sync API',
  version: '1.0.0',
  tagIndex: 3,
  debug: true,
  info: {
    title: 'Sync API',
    version: '1.0.0',
    description: 'API documentation',
  },
  ignore: ['/swagger', '/docs'],
  snakeCase: true,
  common: {
    parameters: {},
    headers: {},
  },
  securitySchemes: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
    },
  },
}
