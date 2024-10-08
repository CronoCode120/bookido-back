import { Genre } from '../../types.js'

abstract class UserRepository {
  abstract db: unknown
  abstract collection: string

  abstract create(id: string, email: string, username: string): Promise<string>
  abstract assignGenres(userId: string, genres: Genre[]): Promise<void>
}

export default UserRepository
