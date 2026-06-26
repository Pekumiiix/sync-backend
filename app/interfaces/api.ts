export interface ApiErrorResponse {
  success: false
  message: string
  data: null
}

export interface ApiValidationErrorItem {
  message: string
  rule: string
  field: string
}

export interface ApiValidationError {
  errors: ApiValidationErrorItem[]
}

export interface ApiSuccessResponse {
  success: true
  message: string
  data: null
}
