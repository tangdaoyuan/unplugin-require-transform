import { createUnplugin } from 'unplugin'
import { defaultOptions } from './options'
import { transform } from './transform'
import type { GeneralOptions } from './types'

export default createUnplugin((_options?: GeneralOptions) => {
  const options = { ...defaultOptions, ..._options }

  return {
    name: 'unplugin-require-transform',
    enforce: 'pre',
    transformInclude(id: string) {
      return id.endsWith('.ts') || id.endsWith('.vue')
    },
    transform(code: string, id: string) {
      return transform(code, id, options)
    },
  }
})
