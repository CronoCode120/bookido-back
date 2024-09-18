import { Request, Response } from 'express'
import ReviewRepository from '../repositories/review/ReviewRepositoryFirebase.js'
import UserRepository from '../repositories/user/UserRepositoryFirebase.js'
import InvalidParamsError from '../errors/InvalidParams.js'

class ReviewController {
  readonly repository
  readonly userRepository

  constructor(reviewRepository: ReviewRepository, userRepository: UserRepository) {
    this.repository = reviewRepository
    this.userRepository = userRepository
  }

  addReview = async (req: Request, res: Response) => {
    const { userId, isbn, value, review } = req.body
    
    if (!isbn || typeof isbn !== 'string') {
      throw new InvalidParamsError('"isbn" query must be a string and cannot be undefined');
    }

    if (!userId || typeof userId !== 'string') {
      throw new InvalidParamsError('"userId" query must be a string and cannot be undefined');
    }

    const reviewAdded = await this.repository.addReview(userId, isbn, value, review)
    await this.userRepository.addReview(userId, isbn, value, review)
    res.status(200).json({ reviews: reviewAdded })
  }

  getReviews = async (req: Request, res: Response) => {
    const { isbn } = req.query

    if (typeof isbn !== 'string')
        throw new InvalidParamsError('"isbn" query must be a string')

    const reviews = await this.repository.getReviews(isbn)
    res.status(200).json({ reviews })
  }

  getReviewFromBook = async (req: Request, res: Response) => {
    const { isbn, userId } = req.query

    if (typeof isbn !== 'string')
      throw new InvalidParamsError('"isbn" query must be a string')
    if (typeof userId !== 'string')
      throw new InvalidParamsError('"userId" query must be a string')

    const reviewValue = await this.repository.getReviewFromBook(isbn, userId)
    res.status(200).json({ review: reviewValue })
  }

  getReviewFromUser = async (req: Request, res: Response) => {
    const { userId, isbn } = req.query

    if (typeof userId !== 'string')
      throw new InvalidParamsError('"userId" query must be a string')
    if (typeof isbn !== 'string')
      throw new InvalidParamsError('"isbn" query must be a string')

    const reviewValue = await this.repository.getReviewFromUser(userId, isbn)
    res.status(200).json({ review: reviewValue })
  }
}

export default ReviewController
