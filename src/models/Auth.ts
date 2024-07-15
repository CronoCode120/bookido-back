abstract class AuthUser {
  abstract auth: unknown

  abstract createUser(email: string, password: string): Promise<string>
}

export default AuthUser
