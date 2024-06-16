import BookRepository from './BookRepository.ts'

class GoogleBookRepository extends BookRepository {
  apiUrl = 'https://www.googleapis.com/books/v1/volumes'
  resFields = []

  getBooksByPublisher = async (publisher: string) => {
    const url = new URL(this.apiUrl)
    url.searchParams.set('publisher', publisher)

    const res = await fetch(url)
    const data = await res.json()

    return data
  }
}

export default GoogleBookRepository
