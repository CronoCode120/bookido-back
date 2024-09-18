import ReviewRepository from "../repositories/review/ReviewRepositoryFirebase.js"
import UserRepository from "../repositories/user/UserRepositoryFirebase.js"
import { DocumentData } from 'firebase/firestore'

class Algorythm {
    readonly userRepository
    readonly reviewRepository

    constructor(userRepository: UserRepository, reviewRepository: ReviewRepository) {
        this.userRepository = userRepository
        this.reviewRepository = reviewRepository
    }

    static execute = async (userId: string, userRepository: UserRepository, reviewRepository: ReviewRepository) => {
        const algorythm = new Algorythm(userRepository, reviewRepository)
        const shelf = await algorythm.userRepository.getBooksInShelf(userId)

        const reviews = await algorythm.getReviewsFromUser(userId, shelf)
        const users = await algorythm.getUsersWithShelvesFromReviews(reviews, userId)
        return users
    }


    getReviewsFromUser = async (userId: string, shelf: string[]) => {
        const asyncGetReviews = shelf.map(isbn => this.userRepository.getReviewFromUser(userId, isbn)
        .then(data => ({isbn, ...data})))
        const reviews = await Promise.all(asyncGetReviews)

        return reviews.filter(book => book !== null)
    }

    getUsersWithShelvesFromReviews = async (reviews: any[], userId: string) => {
        const asyncGetUsers = reviews.map(({ isbn }) => this.reviewRepository.getReviews(isbn))
        const users = await Promise.all(asyncGetUsers)

        const filteredUsers = users.flat().filter(user => user.userId !== userId)

        /*const usersWithShelves = await Promise.all(filteredUsers.map(async (user) => {
            const shelf = await this.userRepository.getBooksInShelf(user.userId)
            return { ...user, shelf }
        }))

        return usersWithShelves*/
        return filteredUsers
    }
}

export default Algorythm