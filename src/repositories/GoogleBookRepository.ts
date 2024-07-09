import BookRepository from './BookRepository.ts'

class GoogleBookRepository extends BookRepository {
  apiUrl = 'https://www.googleapis.com/books/v1/volumes'
  resFields = [
    'items/id',
    'items/volumeInfo(title,categories,publisher,language)'
  ]

  getBooksByPublisher = async (publisher: string) => {
    const url = new URL(this.apiUrl)
    url.searchParams.set('q', `inpublisher:"${publisher}"`)
    url.searchParams.set('fields', this.resFields.join(','))

    const res = await fetch(url)
    const data = await res.json()

    return data
  }

  getBookByISBN = async (isbn: string) => {
    const url = new URL(this.apiUrl)
    url.searchParams.set('q', `isbn:${isbn}`)

    const res = await fetch(url)
    const data = await res.json()
  }
}

export default GoogleBookRepository
