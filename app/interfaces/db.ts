export type JSON<T = any> = T

/**
 * If you ever have a completely random JSON column (like a webhook payload)
 * where you don't know the exact shape, use this instead of `any` for better security.
 */
export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonObject | JsonArray
export interface JsonObject {
  [key: string]: JsonValue
}
export interface JsonArray extends Array<JsonValue> {}
