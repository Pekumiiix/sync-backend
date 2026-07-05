import { HttpContext } from '@adonisjs/core/http'
import { BaseSerializer } from '@adonisjs/core/transformers'
import { type SimplePaginatorMetaKeys } from '@adonisjs/lucid/types/querybuilder'

/**
 * Custom serializer for API responses that ensures consistent JSON structure
 * across all API endpoints. Wraps response data in a 'data' property and handles
 * pagination metadata for Lucid ORM query results.
 */
class ApiSerializer extends BaseSerializer<{
  Wrap: 'data'
  PaginationMetaData: SimplePaginatorMetaKeys
}> {
  /**
   * Wraps all serialized data under this key in the response object.
   * Example: { data: [...] } instead of returning raw arrays/objects
   */
  wrap: 'data' = 'data'

  /**
   * Validates and defines pagination metadata structure for paginated responses.
   * Ensures that pagination info from Lucid queries is properly formatted.
   *
   * @throws Error if metadata doesn't match Lucid's pagination structure
   */
  definePaginationMetaData(metaData: unknown): SimplePaginatorMetaKeys {
    if (!this.isLucidPaginatorMetaData(metaData)) {
      throw new Error(
        'Invalid pagination metadata. Expected metadata to contain Lucid pagination keys'
      )
    }
    return metaData
  }
}

/**
 * Single instance of ApiSerializer used across the application
 */
const serializer = new ApiSerializer()

const serialize = Object.assign(
  async function <T>(this: HttpContext, data: any, message: string = 'Operation successful') {
    let serializedData: any

    // Guard: Bypass the AdonisJS serializer if data is null or undefined
    if (data === null || data === undefined) {
      serializedData = { data }
    } else {
      serializedData = await serializer.serialize(data, this.containerResolver)
    }

    // Check if the resulting object already has the 'data' wrapper
    const hasDataKey =
      serializedData && typeof serializedData === 'object' && 'data' in serializedData

    // Fallback: wrap the data if the serializer didn't do it automatically
    if (!hasDataKey) {
      serializedData = { data: serializedData ?? data }
    }

    return {
      success: true,
      message: message,
      ...(serializedData as T),
    }
  },
  {
    async withoutWrapping(
      this: HttpContext,
      ...[data, resolver]: Parameters<ApiSerializer['serializeWithoutWrapping']>
    ) {
      if (data === null || data === undefined) return data
      return await serializer.serializeWithoutWrapping(data, resolver ?? this.containerResolver)
    },
  }
)

/**
 * Adds the serialize method to all HttpContext instances.
 * Usage in controllers: return ctx.serialize(data)
 * This ensures all API responses follow the same structure with data wrapping.
 */
HttpContext.instanceProperty('serialize', serialize)

/**
 * Module augmentation to add the serialize method to HttpContext.
 * This allows controllers to use ctx.serialize() for consistent API responses.
 */
declare module '@adonisjs/core/http' {
  export interface HttpContext {
    serialize: typeof serialize
  }
}
