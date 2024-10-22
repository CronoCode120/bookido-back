interface BookRepository {}

abstract class BookRepository implements BookRepository {
  abstract apiUrl: string
  abstract resFields: string[]

  abstract getBooksByPublisher(
    page: string | undefined,
    publisher: string,
    isbns: string[]
  ): Promise<any>

  abstract getBookByISBN(
    isbn: string,
    fields?: string | undefined,
    coverOnly?: boolean
  ): Promise<any>

  abstract getDescriptionByISBN(isbn: string | undefined): Promise<string>

  abstract getBooksByTitle(title: string): Promise<any[]>
}

export default BookRepository
