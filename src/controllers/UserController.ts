import { Request, Response } from 'express'
import UserRepository from '../repositories/user/UserRepository.js'
import User from '../models/User.js'
import AuthUser from '../models/Auth.js'

class UserController {
  readonly auth
  readonly repository

  constructor(auth: AuthUser, userRepository: UserRepository) {
    this.auth = auth
    this.repository = userRepository
  }

  register = async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body
      const user = User.create({ username, email, password })

      const userId = await this.auth.createUser(user.email, user.password)

      await this.repository.create(userId, user.email, user.username)

      res.status(201).json({ userId })
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(400).json({ error: 'An unknown error occurred' })
      }
    }
  }

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const userId = await this.auth.login(email, password)
    if (userId != 'err') {
      res.status(201).json({ userId })
    } else {
      res.status(400).json({ error: 'Invalid email or password' })
    }
  }
}

export default UserController
