const filterByIsbn = (books: any[], isbns: String[]) => {
  const booksToShow = books.filter(
    book =>
      book.isbn && book.isbn.every((isbn: string) => !isbns.includes(isbn))
  )
  return booksToShow
}

export default filterByIsbn
