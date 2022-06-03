import type { TransformResult } from 'unplugin'
import MagicString from 'magic-string'
import type { Options } from '../types'
import { REQUIRE_RE } from '../utils'

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

  const matchers = 'require(\'http\')'.matchAll(REQUIRE_RE)

  for (const matcher of matchers)
    // eslint-disable-next-line no-console
    console.log('match:', matcher)

  const source = new MagicString(_code)

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
