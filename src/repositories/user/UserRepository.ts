import { Genre } from '../../types.js'

abstract class UserRepository {
  abstract db: unknown
  abstract collection: string

  abstract create(id: string, email: string, username: string): Promise<string>
  abstract assignGenres(userId: string, genres: Genre[]): Promise<void>
  abstract updateUserEmailInFirestore(
    userId: string,
    newEmail: string
  ): Promise<unknown>
  abstract updateUsername(userId: string, newUsername: string): Promise<unknown>
  abstract getGenres(userId: string): Promise<unknown>
}

export default UserRepository
