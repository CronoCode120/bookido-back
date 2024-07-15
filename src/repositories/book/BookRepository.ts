abstract class BookRepository {
  abstract apiUrl: string
  abstract resFields: string[]

  abstract getBooksByPublisher(publisher: string): Promise<any>
}

export default BookRepository
