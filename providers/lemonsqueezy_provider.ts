import env from '#start/env'
import type { ApplicationService } from '@adonisjs/core/types'
import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js'

export default class LemonsqueezyProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    const apiKey = env.get('LEMON_SQUEEZY_API_KEY')

    lemonSqueezySetup({
      apiKey,
    })
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
