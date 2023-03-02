import { object, optional, string, type TypeOf } from 'zod'

export const registerUserSchema = object({
  body: object({
    username: string({ required_error: 'Username is required' }),
    email: string({ required_error: 'Email is required' }).email(
      'Invalid email'
    ),
    password: string({ required_error: 'Password is required' })
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string({ required_error: 'Please confirm your password' })
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match'
  })
})

export const loginUserSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email(
      'Invalid email or password'
    ),
    password: string({ required_error: 'Password is required' }).min(
      8,
      'Invalid email or password'
    )
  })
})

export const patchUserSchema = object({
  body: object({
    username: optional(string({ required_error: 'Username is required' })),
    email: optional(string({ required_error: 'Email is required' }).email(
      'Invalid email'
    )),
    permissions: optional(
      string({ required_error: 'Permissions are required' }).array()
    )
  }),
  params: object({
    id: string({ required_error: 'User id is required' })
  })
})

export const changeUserPasswordSchema = object({
  body: object({
    currentPassword: string({ required_error: 'Current password is required' }),
    newPassword: string({ required_error: 'New password is required' })
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    newPasswordConfirm: string({
      required_error: 'Please confirm your new password'
    })
  }).refine((data) => data.newPassword === data.newPasswordConfirm, {
    path: ['newPasswordConfirm'],
    message: 'Passwords do not match'
  })
})

export const deleteUserSchema = object({
  params: object({
    id: string({ required_error: 'User id is required' })
  }
  )
})
export const getUserByIdSchema = object({
  params: object({
    id: string({ required_error: 'User id is required' })
  }
  )
})

export const createUserSchema = object({
  body: object({
    username: string({ required_error: 'Username is required' }),
    email: string({ required_error: 'Email is required' }).email(
      'Invalid email'
    ),
    password: string({ required_error: 'Password is required' })
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string({ required_error: 'Please confirm your password' }),
    permissions: string({ required_error: 'Permissions are required' }).array()
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match'
  })
})

export const refreshTokenSchema = object({
  body: object({
    refreshToken: string({ required_error: 'Refresh token is required' })
  }
  )
})

export type RefreshTokenSchema = TypeOf<typeof refreshTokenSchema>
export type CreateUserSchema = TypeOf<typeof createUserSchema>
export type PatchUserSchema = TypeOf<typeof patchUserSchema>
export type ChangeUserPasswordSchema = TypeOf<typeof changeUserPasswordSchema>
export type DeleteUserSchema = TypeOf<typeof deleteUserSchema>
export type GetUserByIdSchema = TypeOf<typeof getUserByIdSchema>
export type RegisterUserSchema = TypeOf<typeof registerUserSchema>
export type LoginUserSchema = TypeOf<typeof loginUserSchema>
