const getEditionData = (books: any[]) => {
  const editions = books.flatMap((book: any) => {
    const bookData: { [key: string]: any } = {}

    if (book.subject) bookData['subjects'] = book.subject
    if (book.author_name) bookData['author'] = book.author_name

    const newData = book.editions.docs.map((edition: any) => {
      const { author_name, ...editionData } = edition
      return {
        ...editionData,
        ...bookData
      }
    })

    return newData
  })

  return editions
}

export default getEditionData
