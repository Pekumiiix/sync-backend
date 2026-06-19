import type UserRegistered from '#events/user_registered'

export default class CreateDefaultFolders {
  async handle(event: UserRegistered) {
    const { user } = event

    await user.related('folders').create({ name: 'Unsorted', isSystem: true })
  }
}
