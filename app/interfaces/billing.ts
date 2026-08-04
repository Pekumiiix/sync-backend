export interface CreateCheckoutResponse {
  success: boolean
  message: string
  data: {
    url: string
  }
}
