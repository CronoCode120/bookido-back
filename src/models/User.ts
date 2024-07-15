import { UserType, validateUser } from '../schemas/user.js'

class User {
  readonly id
  readonly email
  readonly username
  readonly password

  static create = ({ id, email, username, password }: UserType) =>
    new User({ id, email, username, password })

  constructor(userParams: UserType) {
    const { id, username, email, password } = validateUser(userParams)

    this.id = id
    this.username = username
    this.email = email
    this.password = password
  }
}

export default User
