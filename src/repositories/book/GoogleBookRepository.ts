import BookRepository from './BookRepository.js'

class GoogleBookRepository extends BookRepository {
  apiUrl = 'https://www.googleapis.com/books/v1/volumes'
  resFields = [
    'items/id',
    'items/volumeInfo(title,categories,publisher,language,description)'
  ]

  getBooksByPublisher = async (page: string = '1', publisher: string) => {
    const url = new URL(this.apiUrl)
    url.searchParams.set('q', `inpublisher:"${publisher}"`)
    url.searchParams.set('fields', this.resFields.join(','))
    url.searchParams.set('limit', '20')
    url.searchParams.set('page', page.toString())

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

  getDescriptionByISBN = async (isbn: string) => {
    const url = new URL(this.apiUrl)
    url.searchParams.set('q', `isbn:${isbn}`)
    url.searchParams.set('fields', 'items/volumeInfo(description)')

    const res = await fetch(url)
    const data = await res.json()
    return data.items[0].volumeInfo.description as string
  }
}

export default GoogleBookRepository
