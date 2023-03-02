import { object, optional, string, type TypeOf } from 'zod'

export const deletePermissionSchema = object({
  params: object({
    id: string({ required_error: 'Permission id is required' })
  }
  )
})

export const getPermissionByIdSchema = object({
  params: object({
    id: string({ required_error: 'Permission id is required' })
  }
  )
})

export const createPermissionSchema = object({
  body: object({
    title: string({ required_error: 'Permission name is required' }),
    description: string({ required_error: 'Permission description is required' })

  })
})

export const patchPermissionSchema = object({
  body: object({
    title: optional(string({ required_error: 'Permission name is required' })),
    description: optional(string({ required_error: 'Permission description is required' }))
  }),
  params: object({
    id: string({ required_error: 'Permission id is required' })
  })
})

export type DeletePermissionSchema = TypeOf<typeof deletePermissionSchema>
export type GetPermissionByIdSchema = TypeOf<typeof getPermissionByIdSchema>
export type CreatePermissionSchema = TypeOf<typeof createPermissionSchema>
export type PatchPermissionSchema = TypeOf<typeof patchPermissionSchema>
