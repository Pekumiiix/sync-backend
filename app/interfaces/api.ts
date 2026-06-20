/**
 * Standard 404 or 400 Error Response
 */
export interface ApiErrorResponse {
  success: boolean
  message: string
  data: null
}

export interface ApiValidationErrorItem {
  message: string
  rule: string
  field: string
}

/**
 * 2. The main 422 Response now cleanly references the array
 */
export interface ApiValidationError {
  errors: ApiValidationErrorItem[]
}

/**
 * Standard 200 Success Response with no data (e.g., Delete actions)
 */
export interface ApiSuccessMessage {
  success: boolean
  message: string
  data: null
}
