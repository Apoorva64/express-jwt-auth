import jwt, { type SignOptions } from 'jsonwebtoken'
import path from 'path'
import * as fs from 'fs'
const privateKey = fs.readFileSync(path.join(__dirname, '..', '..', 'keys', 'pkcs8.key'), 'utf8')
export const publicKey = fs.readFileSync(path.join(__dirname, '..', '..', 'keys', 'publickey.crt'), 'utf8')
export const signJwt = (payload: Record<string, unknown>, options: SignOptions = {}): string => {
  return jwt.sign(payload, privateKey, {
    ...(options),
    algorithm: 'RS256'
  })
}

export const verifyJwt = <T>(token: string): T | null => {
  try {
    return jwt.verify(token, publicKey, {
      algorithms: ['RS256']
    }) as T
  } catch (error: any) {
    return null
  }
}
