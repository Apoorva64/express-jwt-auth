import mongoose from 'mongoose'
import config from 'config'
import asyncHandler from 'express-async-handler'
import { createUser, findUser } from '../services/user.service'
import { createPermission, findOnePermission } from '../services/permission.service'
import permissionModel from '../models/permission.model'

const connectDB = async (): Promise<void> => {
  try {
    const dbUrl = config.get<string>('dbUrl')
    console.log('Connecting to database...')
    await mongoose.connect(dbUrl)
    // check if all the permissions exist
    const permissions = config.get<Array<{
      title: string
      description: string
    }>>('defaultPermissions')

    for (const permission of permissions) {
      const existingPermission = await findOnePermission({ title: permission.title })
      if (existingPermission == null) {
        console.log(`Creating permission ${permission.title}...`)
        await createPermission(permission)
      }
    }

    // check if super admin exists
    const superAdmin = await findUser({ email: config.get<string>('superAdminEmail') })
    if (superAdmin == null || superAdmin.permissions.length !== permissions.length) {
      console.log('Creating super admin...')
      // get admin permissions
      const permissions = await permissionModel.find({ title: { $in: config.get<string[]>('superAdminPermissions') } })
      if (superAdmin == null) {
        await createUser({
          email: config.get<string>('superAdminEmail'),
          permissions,
          password: config.get<string>('superAdminPassword'),
          username: config.get<string>('superAdminUsername')
        })
      } else {
        superAdmin.permissions = permissions
        await superAdmin.save()
      }
    }
    console.log('Database connected...')
  } catch (error: any) {
    setTimeout(asyncHandler(connectDB), 5000)
    console.log('Database connection failed...')
    console.log(error)
  }
}

export default connectDB
