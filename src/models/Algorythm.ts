import ReviewRepository from '../repositories/review/ReviewRepositoryFirebase.js'
import UserRepository from '../repositories/user/UserRepositoryFirebase.js'
import groupBy from '../utils/groupBy.js'
import { Rating } from '../types.js'

interface BookPoints {
  isbn: string
  totalPoints: number
}

interface OrderedUser {
  userId: string
  totalPoints: number
  shelf: string[]
}

interface UserReview {
  value: Rating
  isbn: string
}

interface UserReviews {
  [userId: string]: UserReview[]
}

class Algorythm {
  readonly userRepository
  readonly reviewRepository

  constructor(
    userRepository: UserRepository,
    reviewRepository: ReviewRepository
  ) {
    this.userRepository = userRepository
    this.reviewRepository = reviewRepository
  }

  static execute = async (
    userId: string,
    userRepository: UserRepository,
    reviewRepository: ReviewRepository
  ) => {
    const algorythm = new Algorythm(userRepository, reviewRepository)
    const shelf = await algorythm.userRepository.getBooksInShelf(userId)

    const reviews = await algorythm.getReviewsFromUser(userId, shelf)
    const users = await algorythm.getUsersWithReviews(reviews, userId)
    const orderedUsers = await algorythm.orderByBestUser(reviews, users)
    const usersShelfs = await algorythm.getUsersShelfs(orderedUsers, userId)
    const orderedBooks = await algorythm.getOrderedBooks(usersShelfs)
    return orderedBooks
  }

  getReviewsFromUser = async (userId: string, shelf: string[]) => {
    const asyncGetReviews = shelf.map(isbn =>
      this.userRepository
        .getValueReviewFromUser(userId, isbn)
        .then(data => ({ isbn, value: data }))
    )
    const reviews = await Promise.all(asyncGetReviews)

    return reviews.filter(book => book !== null)
  }

  getUsersWithReviews = async (reviews: any[], userId: string) => {
    const asyncGetUsers = reviews.map(({ isbn }) =>
      this.reviewRepository.getValuesFromBook(isbn)
    )
    const users = await Promise.all(asyncGetUsers)
    const filteredUsers = users.flat().filter(user => user.userId !== userId)
    const groupedUsers = groupBy(filteredUsers, 'userId')

    return groupedUsers
  }

  orderByBestUser = async (
    myReviews: UserReview[],
    userReviews: UserReviews
  ) => {
    const usersCompared = Object.keys(userReviews).map(userId => {
      const userReview = userReviews[userId]
      const result = { userId, totalPoints: 0 }
      userReview.forEach(({ isbn, value }) => {
        const myValue = myReviews.find(
          ({ isbn: myIsbn }) => isbn === myIsbn
        )?.value
        if (myValue == undefined) {
          return
        }
        result.totalPoints += Algorythm.compare(myValue, value)
      })
      return result
    })
    const orderedPeople = Algorythm.orderingPeople(usersCompared)
    return orderedPeople
  }

  getUsersShelfs = async (orderedUsers: any[], userId: string) => {
    const currentUserShelf = await this.userRepository.getBooksInShelf(userId)
    const currentUserBookIds = new Set(currentUserShelf)

    const usersShelfsAsync = orderedUsers.map(async rankedUser => {
      const shelf = await this.userRepository.getBooksInShelf(rankedUser.userId)
      const filteredShelf = shelf.filter(
        (isbn: string) => !currentUserBookIds.has(isbn)
      )
      return { ...rankedUser, shelf: filteredShelf }
    })

    const usersShelfs = await Promise.all(usersShelfsAsync)
    return usersShelfs
  }

  getOrderedBooks = async (orderedUsers: OrderedUser[]) => {
    const bookPoints: BookPoints[] = []

    const getBookPoints = (myIsbn: string, totalPoints: number) => {
      const bookIndex = bookPoints.findIndex(({ isbn }) => myIsbn === isbn)

      if (bookIndex === -1) bookPoints.push({ isbn: myIsbn, totalPoints })
      else {
        bookPoints[bookIndex].totalPoints += totalPoints
      }
    }

    for (const { userId, shelf, totalPoints } of orderedUsers) {
      const bookPointsAsync = shelf.map(isbn => {
        return this.userRepository
          .getValueReviewFromUser(userId, isbn)
          .then(value => getBookPoints(isbn, value + totalPoints))
      })
      await Promise.all(bookPointsAsync)
    }

    bookPoints.sort(
      ({ totalPoints }, { totalPoints: totalPointsB }) =>
        totalPointsB - totalPoints
    )
    const orderedBooks = bookPoints.map(({ isbn }) => isbn)
    return orderedBooks
  }

  static orderingPeople = (peopleValues: any[]) => {
    const orderedValues = peopleValues.sort(
      (a, b) => b.totalPoints - a.totalPoints
    )
    return orderedValues
  }

  static compare = (a: Rating, b: Rating) => {
    if (a == b) {
      return a == 2 ? 2 : 1
    } else {
      return (a == 2 && b == 0) || (a == 0 && b == 2)
        ? -2
        : (a == 1 && b == 0) || (a == 0 && b == 1)
        ? -1
        : 1
    }
  }
}

export default Algorythm
