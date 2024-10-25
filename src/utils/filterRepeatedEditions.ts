const filterRepeatedEditions = (editions: any[]): any[] => {
  const seenEditions: any[] = []

  return editions.filter(edition => {
    const title = edition.title.trim()
    const found = seenEditions.find(
      seen =>
        seen.title.trim() === title &&
        seen.publisher[0].toLowerCase() === edition.publisher[0].toLowerCase()
    )

    if (!found) {
      seenEditions.push(edition)
      return true
    }
    return false
  })
}

export default filterRepeatedEditions
