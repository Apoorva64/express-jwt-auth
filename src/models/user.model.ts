import {
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop, type Ref
} from '@typegoose/typegoose'
import bcrypt from 'bcryptjs'
import { Permission } from './permission.model'

@index({ email: 1 })
@pre<User>('save', async function () {
  // Hash password if the password is new or was updated
  if (!this.isModified('password')) return
  // Hash password with costFactor of 12
  // noinspection JSPotentiallyInvalidUsageOfClassThis
  this.set('password', await bcrypt.hash(this.password, 12))
})
@modelOptions({
  schemaOptions: {
    // Add createdAt and updatedAt fields
    timestamps: true
  }
})

// Export the User class to be used as TypeScript type
export class User {
  @prop()
    username!: string

  @prop({ unique: true, required: true })
    email!: string

  @prop({ required: true, select: false })
    password!: string

  @prop({ ref: () => Permission, type: () => [Permission] })
    permissions!: Array<Ref<Permission>>

  // Instance method to check if passwords match
  async comparePasswords (hashedPassword: string, candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, hashedPassword)
  }
}

// Create the user model from the User class
const userModel = getModelForClass(User)
export default userModel
