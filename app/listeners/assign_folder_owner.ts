import type FolderCreated from '#events/folder_created'
import Member from '#models/member'

export default class AssignFolderOwner {
  async handle(event: FolderCreated) {
    const { folder, user } = event

    await Member.create({
      folderId: folder.id,
      userId: user.id,
      role: 'owner',
      accessLevel: 'editor',
    })
  }
}
