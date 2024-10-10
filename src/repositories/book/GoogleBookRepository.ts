import BookRepository from './BookRepository.js'
import filterRepeatedEditions from '../../utils/filterRepeatedEditions.js'

class GoogleBookRepository extends BookRepository {
  apiUrl = 'https://www.googleapis.com/books/v1/volumes'
  resFields = [
    'items/id',
    'items/volumeInfo(title,publisher,industryIdentifiers)'
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

  getBooksByTitle = async (title: string) => {
    const url = new URL(this.apiUrl)
    url.searchParams.set('q', 'intitle:' + title.replaceAll(' ', '+'))
    url.searchParams.set('fields', 'items/id')

    const res = await fetch(url)
    const data = await res.json()

    const foundIds: string[] = data.items.map(({ id }: { id: string }) => id)

    const getBooksAsync = foundIds.map(id =>
      this.getBookById(id, 'title,publisher,industryIdentifiers')
    )

    return filterRepeatedEditions(await Promise.all(getBooksAsync))
  }

  getBookById = async (id: string, fields: string) => {
    const url = new URL(this.apiUrl + '/' + id)
    if (fields) {
      url.searchParams.set('fields', `volumeInfo(${fields})`)
    }

    const res = await fetch(url)
    const data = await res.json()

    const { industryIdentifiers, ...info } = data.volumeInfo
    const isbn = industryIdentifiers?.find(
      ({ type }: { type: string }) => type === 'ISBN_13'
    )

    if (isbn) return { ...info, isbn: isbn.identifier }
    else return { ...info }
  }

  getBookByISBN = async (isbn: string, fields: string) => {
    const checkedFields = fields
      .split(',')
      .map(field => (field === 'author' ? 'authors' : field))
      .join(',')
    const url = new URL(this.apiUrl)
    url.searchParams.set('q', `isbn:${isbn}`)
    url.searchParams.set(
      'fields',
      `items/volumeInfo(${checkedFields + ',imageLinks'})`
    )

    const res = await fetch(url)
    const data = await res.json()
    console.log(data)

    const { imageLinks, ...info } = data.items[0].volumeInfo
    if (!imageLinks) return { ...info }

    const cover =
      imageLinks['medium'] ??
      imageLinks['large'] ??
      imageLinks['extraLarge'] ??
      imageLinks['small'] ??
      imageLinks['thumbnail'] ??
      imageLinks['smallThumbnail']

    return { cover, ...info }
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
