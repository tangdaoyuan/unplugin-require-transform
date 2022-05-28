import { createUnplugin } from 'unplugin'
import { defaultOptions } from './options'
import { transform } from './transform'
import type { GeneralOptions } from './types'

export default createUnplugin<GeneralOptions>((_options, _meta) => {
  const options = { ...defaultOptions, ..._options }

  return {
    name: 'unplugin-require-transform',
    transform(code: string, id: string) {
      return transform(code, id, options)
    },
  }
})
