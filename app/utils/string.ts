import crypto from 'node:crypto'

export function generateVerificationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''

  for (let i = 0; i < 6; i++) {
    code += chars[crypto.randomInt(0, chars.length)]
  }

  return code
}
