import express, { type NextFunction, type Request, type Response } from 'express'
import morgan from 'morgan'
import './env.config.loader'
import config from 'config'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './utils/connectDB'
import userRouter from './routes/user.route'
import authRouter from './routes/auth.route'
import asyncHandler from 'express-async-handler'

const app = express()

// Middleware
// 1. Body Parser

app.use(express.json({ limit: '10kb' }))
// 2. Cookie Parser

app.use(cookieParser())
// 3. Logger
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// 4. Cors

app.use(
  cors({
    origin: config.get<string>('origin'),
    credentials: true
  })
)
// 5. Routes
app.use('/api/auth', authRouter)

app.use('/api/users', userRouter)
// Testing

app.get('/healthChecker', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is up and running'
  })
})
// UnKnown Routes

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any
  err.statusCode = 404
  next(err)
})
// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.status == null) {
    err.status = 'error'
  }
  if (err.statusCode == null) {
    err.statusCode = 500
  }
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
  next()
})
const port = config.get<number>('port')
app.listen(port, () => {
  console.log(`Server started on port: ${port}`)
  // ? call the connectDB function here
  asyncHandler(connectDB)
})