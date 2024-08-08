interface BookRepository {}

abstract class BookRepository implements BookRepository {
  abstract apiUrl: string
  abstract resFields: string[]

  abstract getBooksByPublisher(page: string, publisher: string): Promise<any>

  abstract getDescriptionByISBN(isbn: string): Promise<string>
}

export default BookRepository
