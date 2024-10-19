abstract class AuthUser {
  abstract auth: unknown

  abstract createUser(email: string, password: string): Promise<string>
  abstract login(email: string, password: string): Promise<string>
  abstract updateEmail(newEmail: string): Promise<unknown>
  abstract reauthenticateUser(currentPasswd: string): Promise<boolean>
  abstract changeUserPassword(newPassword: string): Promise<unknown>
}

export default AuthUser
