import { getModelForClass, prop } from '@typegoose/typegoose'

export class Permission {
  @prop({ unique: true, required: true, index: true })
    title!: string

  @prop()
    description!: string
}

// Create the user model from the User class
const permissionModel = getModelForClass(Permission)
export default permissionModel
