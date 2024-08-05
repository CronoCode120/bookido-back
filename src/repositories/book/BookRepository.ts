abstract class BookRepository {
  abstract apiUrl: string
  abstract resFields: string[]

  abstract getBooksByPublisher(page: string, publisher: string): Promise<any>
}

export default BookRepository
