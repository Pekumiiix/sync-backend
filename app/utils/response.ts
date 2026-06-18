/**
 * Formats error responses consistently across the API
 */
export function apiError(message: string) {
  return {
    success: false,
    message: message,
    data: null,
  }
}
