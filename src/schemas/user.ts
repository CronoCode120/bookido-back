import { z } from 'zod'

const userSchema = z.object({
  id: z.string({
    required_error: 'User must have an id',
    invalid_type_error: 'User id must be a string'
  }),
  username: z
    .string({
      required_error: 'User must have a name',
      invalid_type_error: 'User name must be a string'
    })
    .min(5, 'User name must have at least 5 characters'),
  password: z
    .string({
      required_error: 'User must have a password',
      invalid_type_error: 'User password must be a string'
    })
    .min(6, 'User password must have at least 6 characters'),
  email: z.string({
    required_error: 'User must have an email',
    invalid_type_error: 'User email must be a string'
  })
})

export type UserType = z.infer<typeof userSchema>

export const validateUser = (user: UserType) => {
  const params = userSchema.safeParse(user)
  if (!params.success) throw new Error(params.error.message)

  return params.data
}
