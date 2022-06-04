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
  return _code
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
