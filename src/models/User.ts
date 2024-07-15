import { UserType, validateUser } from '../schemas/user.js'

class User {
  readonly email
  readonly username
  readonly password

  static create = ({ email, username, password }: UserType) =>
    new User({ email, username, password })

  constructor(userParams: UserType) {
    const { username, email, password } = validateUser(userParams)

    this.username = username
    this.email = email
    this.password = password
  }
}

export default User
