import emitter from '@adonisjs/core/services/emitter'
import UserRegistered from '#events/user_registered'

const SendVerificationEmail = () => import('#listeners/send_verification_email')
const CreateDefaultFolders = () => import('#listeners/create_default_folders')

emitter.on(UserRegistered, SendVerificationEmail)
emitter.on(UserRegistered, CreateDefaultFolders)
