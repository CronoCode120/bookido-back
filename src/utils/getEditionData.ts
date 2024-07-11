const getEditionData = (books: any[]) => {
  const editions = books.flatMap((book: any) => {
    const bookData = {
      subjects: book.subject,
      author: book.author_name
    }

    const newData = book.editions.docs.map((edition: any) => {
      const { author_name, isbn, ...editionData } = edition
      const cover = Array.isArray(isbn) && isbn[0]
      return {
        ...editionData,
        ...bookData,
        isbn,
        cover
      }
    })

    return newData
  })

  return editions
}

export default getEditionData
