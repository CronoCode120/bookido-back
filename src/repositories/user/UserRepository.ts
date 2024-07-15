abstract class UserRepository {
  abstract db: unknown
  abstract collection: string

  abstract create(id: string, email: string, username: string): Promise<string>
}

export default UserRepository
