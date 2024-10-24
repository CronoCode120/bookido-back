import { Request, Response } from 'express'
import UserRepository from '../repositories/user/UserRepository.js'
import User from '../models/User.js'
import AuthUser from '../models/Auth.js'
import validateNewPasswords from '../utils/comparePasswd.js'
import InvalidParamsError from '../errors/InvalidParams.js'

class UserController {
  readonly auth
  readonly repository

  constructor(auth: AuthUser, userRepository: UserRepository) {
    this.auth = auth
    this.repository = userRepository
  }

  register = async (req: Request, res: Response) => {
    try {
      const { username, email, password, genres } = req.body
      const user = User.create({ username, email, password })

      const userId = await this.auth.createUser(user.email, user.password)

      await this.repository.create(userId, user.email, user.username)

      if (genres && genres.length > 3) {
        await this.repository.assignGenres(userId, genres)
      }

      res.status(201).json({ userId })
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'An unknown error occurred' })
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

  updateEmail = async (req: Request, res: Response) => {
    const { userId, newEmail } = req.body
    const result = await this.auth.updateEmail(newEmail)
    if (result) res.status(400).json({ result })
    else {
      const newEmailOnFirestore =
        await this.repository.updateUserEmailInFirestore(userId, newEmail)
      if (newEmailOnFirestore)
        res.status(400).json({ error: newEmailOnFirestore })
    }
  }

  updateUsername = async (req: Request, res: Response) => {
    const { userId, newUsername } = req.body
    const result = await this.repository.updateUsername(userId, newUsername)
    if (result) res.status(400).json({ error: result })
  }

  updatePasswd = async (req: Request, res: Response) => {
    const { currentPasswd, newPasswd, repeatPasswd } = req.body
    if (!validateNewPasswords(newPasswd, repeatPasswd)) {
      res.status(400).json({ error: 'passwds do not match' })
      return
    }
    const reauthenticated = await this.auth.reauthenticateUser(currentPasswd)
    reauthenticated
      ? await this.auth.changeUserPassword(newPasswd)
      : res.status(400).json({ error: 'not logged in or cannot update passwd' })
  }

  updateGenres = async (req: Request, res: Response) => {
    const { userId, genres } = req.body
    if (genres.length >= 3) {
      await this.repository.assignGenres(userId, genres)
      res.status(201).json({ res: 'genres updated' })
    } else {
      res.status(400).json({ error: 'not enough genres' })
    }
  }

  getGenres = async (req: Request, res: Response) => {
    const { userId } = req.query
    if (typeof userId !== 'string')
      throw new InvalidParamsError('"userId" query must be a string')
    const genres = await this.repository.getGenres(userId)
    res.status(201).json({ genres })
  }

  getUser = async (req: Request, res: Response) => {
    const { userId } = req.params
    const user = await this.repository.getUser(userId)
    res.status(200).json({ user })
  }
}

export default UserController
