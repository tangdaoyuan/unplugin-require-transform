export function lastPosition(iterator: IterableIterator<RegExpMatchArray>, defaultValue = -1) {
  const _matchers = [...iterator]
  if (_matchers.length === 0)
    return defaultValue

  const matcher = _matchers[_matchers.length - 1]
  if (!matcher)
    return defaultValue

  return (matcher?.index || 0) + (matcher[0]?.length || 0)
}
