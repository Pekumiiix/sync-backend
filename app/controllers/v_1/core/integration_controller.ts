import { ApiSuccessResponse } from '#interfaces/api'
import type { GetBrowserIntegrationsResponse } from '#interfaces/browser_integrations'
import { BrowserIntegrationService } from '#services/browser_integration_service'
import BrowserIntegrationTransformer from '#transformers/browser_integration_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class IntegrationsController {
  async index(ctx: HttpContext) {
    const { response, auth } = ctx

    const user = auth.user!

    const integrations = await user.related('browserIntegrations').query()

    const formattedResponse: GetBrowserIntegrationsResponse = ctx.serialize(
      { integrations: BrowserIntegrationTransformer.transform(integrations) },
      'Integrations retrieved successfully!'
    )

    return response.ok(formattedResponse)
  }

  async destroy(ctx: HttpContext) {
    const { response, auth, params } = ctx

    const integrationId = params.integrationId

    const user = auth.user!

    await BrowserIntegrationService.deleteIntegration(user, integrationId)

    const formattedResponse: ApiSuccessResponse = ctx.serialize(
      null,
      'Integration deleted successfully!'
    )

    return response.ok(formattedResponse)
  }
}
