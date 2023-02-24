import mongoose from 'mongoose'
import config from 'config'
import asyncHandler from 'express-async-handler'
import { createUser, findUser } from '../services/user.service'

const connectDB = async (): Promise<void> => {
  try {
    const dbUrl = config.get<string>('dbUrl')
    console.log('Connecting to database...')
    await mongoose.connect(dbUrl)
    // check if super admin exists
    const superAdmin = await findUser({ role: config.get<string>('superAdminRole') })
    if (superAdmin == null) {
      console.log('Creating super admin...')
      await createUser({
        email: config.get<string>('superAdminEmail'),
        role: config.get<string>('superAdminRole'),
        password: config.get<string>('superAdminPassword'),
        username: config.get<string>('superAdminUsername')
      })
    }
    console.log('Database connected...')
  } catch (error: any) {
    setTimeout(asyncHandler(connectDB), 5000)
    console.log('Database connection failed...')
    console.log(error)
  }
}

export default connectDB
