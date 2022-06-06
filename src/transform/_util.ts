export function lastPosition(iterator: IterableIterator<RegExpMatchArray>) {
  const _matchers = [...iterator]
  if (_matchers.length === 0)
    return -1

  const matcher = _matchers[_matchers.length - 1]
  if (!matcher)
    return -1

  return (matcher?.index || 0) + (matcher[0]?.length || 0)
}
