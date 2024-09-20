const groupBy = (array: any[], key: string) => {
    return array.reduce((acc, x) => {
        const { [key]: _, ...rest } = x
        const groupKey = x[key];
        (acc[groupKey] = acc[groupKey] || []).push(rest)
        return acc
    }, {} as { [key: string]: any[] })
  }

export default groupBy