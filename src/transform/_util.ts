export function lastPosition(iterator: IterableIterator<RegExpMatchArray>) {
  const matcher = Array.from(iterator).at(-1)
  if (!matcher)
    return -1

  return (matcher?.index || 0) + (matcher[0]?.length || 0)
}
