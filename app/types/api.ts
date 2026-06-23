export type ApiErrorResponse = {
  success: false
  message: string
  data: null
}

export type ApiValidationErrorItem = {
  message: string
  rule: string
  field: string
}

export type ApiValidationError = {
  errors: ApiValidationErrorItem[]
}

export type ApiSuccessResponse = {
  success: true
  message: string
  data: null
}
