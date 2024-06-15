import { Request, Response } from 'express'
import BookRepository from '../repositories/BookRepository.ts'

class BookController {
  readonly repository

  constructor(bookRepository: BookRepository) {
    this.repository = bookRepository
  }

  getBooks = async (_req: Request, res: Response) => {
    const books = await this.repository.getFilteredBooks()
    res.status(200).json({ books })
  }
}

export default BookController
