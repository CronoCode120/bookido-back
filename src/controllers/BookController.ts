import { Request, Response } from 'express'
import BookRepository from '../repositories/OpenLibraryBookRepository.js'

class BookController {
  readonly repository

  constructor(bookRepository: BookRepository) {
    this.repository = bookRepository
  }

  getBooks = async (_req: Request, res: Response) => {
    const books = await this.repository.getBooksByPublisher('alpha decay')
    res.status(200).json({ books })
  }
}

export default BookController
