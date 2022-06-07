export function lastImporterPosition(iterator: IterableIterator<RegExpMatchArray>, defaultValue = -1) {
  const _matchers = [...iterator]
  if (_matchers.length === 0)
    return defaultValue

  const matcher = _matchers[_matchers.length - 1]
  if (!matcher)
    return defaultValue

  return (matcher?.index || 0) + (matcher[0]?.length || 0)
}

export interface Importer {
  importer: string
  exporter: string
}

export function createImporterGenerator() {
  let index = 0
  const cache = new Map<string, Importer>()
  return (specifier: string) => {
    if (cache.has(specifier))
      return cache.get(specifier)!

    index++
    const exporter = `$_${index}`
    const res = {
      importer: `import ${exporter} from '${specifier}'`,
      exporter: `${exporter}`,
    }
    cache.set(specifier, res)
    return res
  }
}

export function getScriptTag(code: string) {
  const scriptMatcher = code.match(/(?<prefix>\<script(\s.*(?<type>setup))*>[\n]*)[\S\s]*\<\/script\>/m)

  let script = {
    start: 0,
    len: 0,
    type: 'setup',
    startEnd: 0,
    content: '',
    lost: false,
    scriptReturnStart: 0,
  }
  if (!scriptMatcher) {
    const appendStr = '<script setup>\n</script>'
    script.start = 0
    script.startEnd = 15
    script.len = appendStr.length
    script.content = appendStr
    script.lost = true
  }
  else {
    let type = scriptMatcher.groups?.type
    let scriptReturnStart = 0
    if (!type) {
      /**
       * matcher such as:
       *
       * [
       *  'setup() {\n  return {',
       *  ...
       *]
       */
      const setupMatcher = scriptMatcher[0].match(/setup\s*\(.*\)\s*\{[\s\S]*return\s*\{\n*/)
      const dataMatcher = scriptMatcher[0].match(/data\s*\(.*\)\s*\{[\s\S]*return\s*\{\n*/)

      if (setupMatcher) {
        type = 'setupFunc'
        scriptReturnStart = scriptMatcher.index! + setupMatcher.index! + setupMatcher[0].length
      }

      if (dataMatcher) {
        type = 'options'
        scriptReturnStart = scriptMatcher.index! + dataMatcher.index! + dataMatcher[0].length
      }
    }

    script = {
      start: scriptMatcher.index || 0,
      len: scriptMatcher?.[0]?.length,
      type: type || 'unknown',
      startEnd: (scriptMatcher?.index || 0) + (scriptMatcher?.groups?.prefix.length || 0),
      content: scriptMatcher?.[0] || '',
      lost: false,
      scriptReturnStart,
    }
  }
  return script
}
