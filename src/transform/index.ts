import type { TransformResult } from 'unplugin'
import MagicString from 'magic-string'
import type { Options } from '../types'
import { REQUIRE_RE, STATIC_IMPORT_RE } from '../utils'
import { createImporterGenerator, getScriptTag, lastImporterPosition } from './_util'

export function transform(_code: string, _id: string, _options: Options): TransformResult {
  if (_id.endsWith('.ts'))
    return transformTS(_code, _id, _options)

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

  const lastImportPos = lastImporterPosition(_code.matchAll(STATIC_IMPORT_RE))
  const matchers = _code.matchAll(REQUIRE_RE)
  const source = new MagicString(_code)
  const importers = new Set<string>()

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

    if (!importers.has(importer)) {
      source.prependRight(
        lastImportPos,
        `${importer}\n`,
      )
      importers.add(importer)
    }
  }

  source.append('\n')

  return {
    code: source.toString(),
    map: _options.sourcemap ? source.generateMap() : null,
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

  const lastImportPos = lastImporterPosition(_code.matchAll(STATIC_IMPORT_RE), script.startEnd!)
  const matchers = _code.matchAll(REQUIRE_RE)
  const gen = createImporterGenerator()
  const returnValues = new Set<string>()
  const importers = new Set<string>()

  function insertImporter(importer: string) {
    if (!importers.has(importer)) {
      magicString.prependRight(
        lastImportPos,
        `${importer}\n`,
      )
      importers.add(importer)
    }
  }
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
        insertImporter(importer)
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
      insertImporter(importer)
      returnValues.add(exporter)
    }
  }

  transformScriptReturn(magicString, script, returnValues)

  return {
    code: magicString.toString(),
    map: _options.sourcemap ? magicString.generateMap() : null,
  }
}

function transformScriptReturn(source: MagicString, script: any, values: Set<string>) {
  if (!values.size)
    return

  // 1. setup (script)
  // 2. options
  // 3. setupFunc
  if (script.type === 'setup')
    return

  if (script.type === 'options')
    source.prependRight(script.scriptReturnStart, `${[...values].join(',\n')},\n`)

  if (script.type === 'setupFunc')
    source.prependRight(script.scriptReturnStart, `${[...values].join(',\n')},\n`)
}
