import mongoose from 'mongoose'
import config from 'config'
import asyncHandler from 'express-async-handler'

const connectDB = async (): Promise<void> => {
  try {
    const dbUrl = config.get<string>('dbUrl')
    await mongoose.connect(dbUrl)
    console.log('Database connected...')
  } catch (error: any) {
    console.log(error.message)
    setTimeout(asyncHandler(connectDB), 5000)
  }
}

export default connectDB
