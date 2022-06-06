import type { TransformResult } from 'unplugin'
import MagicString from 'magic-string'
import type { Options } from '../types'
import { REQUIRE_RE, STATIC_IMPORT_RE } from '../utils'
import { lastPosition } from './_util'

export function transform(_code: string, _id: string, _options: Options): TransformResult {
  if (_id.endsWith('.ts'))
    transformTS(_code, _id, _options)

  if (_id.endsWith('.vue'))
    return transformVUE(_code, _id, _options)

  return _code
}

/**
 * Transform TypeScript code
 *
 * @param _code
 * @param _id
 * @param _options
 * @returns
 */
export function transformTS(_code: string, _id: string, _options: Options): TransformResult {
  if (!_code.match(REQUIRE_RE))
    return _code

  const lastImportPos = lastPosition(_code.matchAll(STATIC_IMPORT_RE))
  const matchers = _code.matchAll(REQUIRE_RE)
  const source = new MagicString(_code)

  const gen = createImporterGenerator()

  for (const matcher of matchers) {
    if (!matcher.groups?.import)
      continue

    const { importer, exporter } = gen(matcher.groups?.import)
    if (matcher[0]?.[0] === '=') {
      source.overwrite(
        matcher.index!,
        matcher.index! + matcher[0].length,
        `= ${exporter};`,
      )
    }
    else {
      source.remove(matcher.index!, matcher.index! + matcher[0].length)
    }
    source.prependRight(
      lastImportPos,
      `${importer}\n`,
    )
  }

  source.append('\n')

  return {
    code: source.toString(),
    map: source.generateMap(),
  }
}

/**
 * Transform Vue code
 *
 * @param _code
 * @param _id
 * @param _options
 * @returns
 */
export function transformVUE(_code: string, _id: string, _options: Options): TransformResult {
  if (!_code.match(REQUIRE_RE))
    return _code

  const script = getScriptTag(_code)
  if (script.lost)
    _code = `${script.content}${_code}`

  const magicString = new MagicString(_code)

  const lastImportPos = lastPosition(_code.matchAll(STATIC_IMPORT_RE), script.startEnd!)
  const matchers = _code.matchAll(REQUIRE_RE)
  const gen = createImporterGenerator()
  const returnValues: string[] = []

  for (const matcher of matchers) {
    if (!matcher.groups?.import)
      continue
    if (matcher.index! > script.start! && matcher.index! < script.start! + script.len!) {
      if (matcher[0]?.[0] === '=') {
        const { importer, exporter } = gen(matcher.groups?.import)
        magicString.overwrite(
          matcher.index!,
          matcher.index! + matcher[0].length,
          `= ${exporter};`,
        )
        magicString.prependRight(
          lastImportPos,
          `${importer}\n`,
        )
      }
      else {
        magicString.remove(matcher.index!, matcher.index! + matcher[0].length)
      }
    }
    else {
      // position in <template>
      const { importer, exporter } = gen(matcher.groups?.import)
      magicString.overwrite(
        matcher.index! + 1,
        matcher.index! + matcher[0].length,
        `${exporter}`,
      )
      magicString.prependRight(
        lastImportPos,
        `${importer}\n`,
      )
      returnValues.push(exporter)
    }
  }
  transformScriptReturn(magicString, script, returnValues)

  return magicString.toString()
}

function transformScriptReturn(source: MagicString, script: any, values: string[]) {
  if (!values.length)
    return

  // 1. setup (script)
  // 2. options
  // 3. setupFunc
  if (script.type === 'setup')
    return

  if (script.type === 'options')
    source.prependRight(script.scriptReturnStart, `${values.join(',\n')},\n`)

  if (script.type === 'setupFunc')
    source.prependRight(script.scriptReturnStart, `${values.join(',\n')},\n`)
}

function getScriptTag(code: string) {
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

function createImporterGenerator() {
  let index = 0
  return (specifier: string) => {
    index++
    return {
      importer: `import $_${index} from '${specifier}'`,
      exporter: `$_${index}`,
    }
  }
}
