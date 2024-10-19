import { Request, Response } from 'express'
import BookRepository from '../repositories/book/BookRepository.js'
import UserRepository from '../repositories/user/UserRepositoryFirebase.js'
import InvalidParamsError from '../errors/InvalidParams.js'
import Algorythm from '../models/Algorythm.js'
import ReviewRepository from '../repositories/review/ReviewRepositoryFirebase.js'
import SqliteBookRepository from '../repositories/book/SqliteBookRepository.js'

class BookController {
  readonly repository
  readonly userRepository
  readonly reviewRepository
  readonly sqliteBookRepository

  constructor(
    bookRepository: BookRepository,
    userRepository: UserRepository,
    reviewRepository: ReviewRepository,
    sqliteBookRepository: SqliteBookRepository
  ) {
    this.repository = bookRepository
    this.userRepository = userRepository
    this.reviewRepository = reviewRepository
    this.sqliteBookRepository = sqliteBookRepository
  }

  getBooks = async (req: Request, res: Response) => {
    const { page, userId } = req.query
    const limit = 20
    if (page && typeof page !== 'string')
      throw new InvalidParamsError('"page" query must be a string')

    if (typeof userId !== 'string')
      throw new InvalidParamsError('"userId" query must be a string')

    const algorythm = await Algorythm.execute(
      userId,
      this.userRepository,
      this.reviewRepository
    )

    let isbns =
      algorythm.length !== 0
        ? algorythm
        : await this.sqliteBookRepository.getBooks(Number(page), limit)

    const viewed = await this.userRepository.getViewedBooks(userId)

    if (isbns.length > 0)
      isbns = isbns
        .map(({ isbn }) => isbn)
        .filter(isbn => !viewed.includes(isbn))
        .filter(
          async isbn => (await this.repository.getBookByISBN(isbn)) !== null
        )

    let currentPage = Number(page)

    while (isbns.length < limit) {
      currentPage++

      const additionalBooks = await this.sqliteBookRepository.getBooks(
        currentPage,
        limit
      )

      let newBooks = additionalBooks
        .filter(({ isbn }) => !isbns.includes(isbn))
        .map(({ isbn }) => isbn)

      if (newBooks.length === 0) break

      newBooks = newBooks.filter(isbn => !viewed.includes(isbn))

      if (newBooks.length >= limit) {
        const lastPos = newBooks.length - isbns.length
        newBooks.splice(lastPos, isbns.length)
      }

      isbns = [...isbns, ...newBooks]
    }

    const getBooksDataAsync = isbns.map(isbn =>
      this.repository.getBookByISBN(isbn, 'title,author,publisher,description')
    )
    const booksData = await Promise.all(getBooksDataAsync)
    const books = booksData.filter(book => book !== null)

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

  getBooksByTitle = async (req: Request, res: Response) => {
    const { title } = req.query
    if (typeof title !== 'string' || title === '')
      throw new InvalidParamsError('"title" query must contain text')

    const books = await this.repository.getBooksByTitle(title)
    res.status(200).json({ books })
  }

  addToTable = async (req: Request, res: Response) => {
    const { isbn, userId } = req.body

    if (!isbn || typeof isbn !== 'string') {
      throw new InvalidParamsError(
        '"isbn" query must be a string and cannot be undefined'
      )
    }

    if (!userId || typeof userId !== 'string') {
      throw new InvalidParamsError(
        '"userId" query must be a string and cannot be undefined'
      )
    }

    const bookAdded = await this.userRepository.addBookToTable(userId, isbn)
    if (bookAdded != 'err') {
      res.status(200).json({ table: bookAdded })
    } else {
      res
        .status(400)
        .json({ error: 'You have more than 20 books on the table!' })
    }
  }

  getBooksInTable = async (req: Request, res: Response) => {
    const { userId } = req.query

    if (!userId || typeof userId !== 'string') {
      throw new InvalidParamsError(
        '"userId" query must be a string and cannot be undefined'
      )
    }

    const books = await this.userRepository.getBooksInTable(userId)
    res.status(200).json({ table: books })
  }

  removeBookInTable = async (req: Request, res: Response) => {
    const { isbn, userId } = req.body

    if (!isbn || typeof isbn !== 'string') {
      throw new InvalidParamsError(
        '"isbn" query must be a string and cannot be undefined'
      )
    }

    if (!userId || typeof userId !== 'string') {
      throw new InvalidParamsError(
        '"userId" query must be a string and cannot be undefined'
      )
    }

    const bookRemoved = await this.userRepository.removeBookInTable(
      userId,
      isbn
    )
    res.status(200).json({ table: bookRemoved })
  }

  shelve = async (req: Request, res: Response) => {
    const { isbn, userId } = req.body

    if (!isbn || typeof isbn !== 'string') {
      throw new InvalidParamsError(
        '"isbn" query must be a string and cannot be undefined'
      )
    }

    if (!userId || typeof userId !== 'string') {
      throw new InvalidParamsError(
        '"userId" query must be a string and cannot be undefined'
      )
    }

    const bookAdded = await this.userRepository.shelve(userId, isbn)
    if (bookAdded != 'err') {
      res.status(200).json({ shelve: bookAdded })
    } else {
      res
        .status(400)
        .json({ error: 'You have more than 100 books on the shelf!' })
    }
  }

  getBooksInShelf = async (req: Request, res: Response) => {
    const { userId } = req.query

    if (!userId || typeof userId !== 'string') {
      throw new InvalidParamsError(
        '"userId" query must be a string and cannot be undefined'
      )
    }

    const books = await this.userRepository.getBooksInShelf(userId)
    res.status(200).json({ shelve: books })
  }

  unshelve = async (req: Request, res: Response) => {
    const { isbn, userId } = req.body

    if (!isbn || typeof isbn !== 'string') {
      throw new InvalidParamsError(
        '"isbn" query must be a string and cannot be undefined'
      )
    }

    if (!userId || typeof userId !== 'string') {
      throw new InvalidParamsError(
        '"userId" query must be a string and cannot be undefined'
      )
    }

    const bookRemoved = await this.userRepository.unshelve(userId, isbn)
    res.status(200).json({ shelve: bookRemoved })
  }

  discardBook = async (req: Request, res: Response) => {
    const { isbn, userId } = req.body

    if (!isbn || typeof isbn !== 'string') {
      throw new InvalidParamsError(
        '"isbn" query must be a string and cannot be undefined'
      )
    }

    if (!userId || typeof userId !== 'string') {
      throw new InvalidParamsError(
        '"userId" query must be a string and cannot be undefined'
      )
    }

    const bookDiscarded = await this.userRepository.discardBook(userId, isbn)
    res.status(200).json({ book: bookDiscarded })
  }

  getViewedBooks = async (req: Request, res: Response) => {
    const { userId } = req.query

    if (!userId || typeof userId !== 'string') {
      throw new InvalidParamsError(
        '"userId" query must be a string and cannot be undefined'
      )
    }

    const books = await this.userRepository.getViewedBooks(userId)
    res.status(200).json({ viewed: books })
  }

  getReviewFromUser = async (req: Request, res: Response) => {
    const { userId, isbn } = req.query

    if (typeof userId !== 'string')
      throw new InvalidParamsError('"userId" query must be a string')
    if (typeof isbn !== 'string')
      throw new InvalidParamsError('"isbn" query must be a string')

    const reviewValue = await this.userRepository.getReviewFromUser(
      userId,
      isbn
    )
    res.status(200).json({ review: reviewValue })
  }

  algorythm = async (req: Request, res: Response) => {
    const { userId } = req.query

    if (typeof userId !== 'string')
      throw new InvalidParamsError('"userId" query must be a string')

    const algorythm = await Algorythm.execute(
      userId,
      this.userRepository,
      this.reviewRepository
    )
    res.status(200).json({ result: algorythm })
  }
}

export default BookController
