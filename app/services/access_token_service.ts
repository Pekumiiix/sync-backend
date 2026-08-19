import User from '#models/user'

export class AccessTokenService {
  private async generateAccessToken(user: User, name: string, expiresIn: string) {
    const token = await User.accessTokens.create(user, ['*'], {
      name,
      expiresIn,
    })

    return token
  }

  async createAccessTokenForExtension(user: User, tokenName: string) {
    const token = this.generateAccessToken(user, tokenName, '1 year')

    return token
  }

  async createAccessTokenForWebDashboard(user: User, rememberMe?: boolean) {
    const token = await this.generateAccessToken(
      user,
      'Web dashboard session',
      rememberMe ? '7 days' : '1 day'
    )

    return token
  }
}
