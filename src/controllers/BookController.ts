import { Request, Response } from 'express'
import BookRepository from '../repositories/book/OpenLibraryBookRepository.js'
import InvalidParamsError from '../errors/InvalidParams.js'

class BookController {
  readonly repository

  constructor(bookRepository: BookRepository) {
    this.repository = bookRepository
  }

  getBooks = async (req: Request, res: Response) => {
    const { page } = req.query
    if (page && typeof page !== 'string')
      throw new InvalidParamsError('"page" query must be a string')

    const books = await this.repository.getBooksByPublisher(page, 'alpha decay')
    res.status(200).json({ books })
  }

  getBookByISBN = async (req: Request, res: Response) => {
    const { isbn } = req.params
    const { fields } = req.query

    if (!isbn) throw new InvalidParamsError('ISBN is not provided')

    const book = await this.repository.getBookByISBN(isbn, fields as string)
    res.status(200).json({ book })
  }

  getDescriptionByISBN = async (req: Request, res: Response) => {
    const { isbn } = req.query
    if (typeof isbn !== 'string' && typeof isbn !== 'undefined')
      throw new InvalidParamsError('"isbn" query must be a string')

    const desc = await this.repository.getDescriptionByISBN(isbn)
    res.status(200).json({ description: desc })
  }
}

export default BookController
