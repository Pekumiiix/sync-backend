import emitter from '@adonisjs/core/services/emitter'
import UserRegistered from '#events/user_registered'
import FolderCreated from '#events/folder_created'

const SendVerificationEmail = () => import('#listeners/send_verification_email')
const CreateDefaultFolders = () => import('#listeners/create_default_folders')
const AssignFolderOwner = () => import('#listeners/assign_folder_owner')

emitter.on(UserRegistered, SendVerificationEmail)
emitter.on(UserRegistered, CreateDefaultFolders)
emitter.on(FolderCreated, AssignFolderOwner)
