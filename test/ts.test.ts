import { describe, expect, it } from 'vitest'
import { Comments, requireAbsoluteSegment, requireBaseSegment, requireImporterDupe, requireRelativeSegment } from './fixtures/base'
import { transformTS } from '@/transform'

const options = {
  sourcemap: false,
}

describe('.ts files runs', () => {
  it('basic file', () => {
    const code = transformTS(requireBaseSegment, 'test/fixtures/base.ts', options)
    expect(code).toMatchInlineSnapshot(`
      {
        "code": "
      import { ref } from 'vue'
      import router from 'vue-router'
      import \$_2 from 'path'
      import \$_1 from 'http'
      const http = \$_1;
      
      
      ",
        "map": null,
      }
    `)
  })
  it('absolute path require', () => {
    const code = transformTS(requireAbsoluteSegment, 'test/fixtures/absolute.ts', options)
    expect(code).toMatchInlineSnapshot(`
      {
        "code": "
      import { ref } from 'vue'
      import \$_1 from 'http'
      const http = \$_1;
      
      ",
        "map": null,
      }
    `)
  })
  it('relative path require', () => {
    const code = transformTS(requireRelativeSegment, 'test/fixtures/relative.ts', options)
    expect(code).toMatchInlineSnapshot(`
      {
        "code": "
      import { ref } from 'vue'
      import \$_1 from './http'
      const http = \$_1;
      
      ",
        "map": null,
      }
    `)
  })
  it('comment', () => {
    const code = transformTS(Comments, 'test/fixtures/comments.ts', options)
    expect(code).toMatchInlineSnapshot(`
      "
      import { ref } from 'vue'
      // const http = require('./http')
      /** const http = require('./http') */
      "
    `)
  })
  it('importer duplicate', () => {
    const code = transformTS(requireImporterDupe, 'test/fixtures/importer-dupe.ts', options)
    expect(code).toMatchInlineSnapshot(`
      {
        "code": "
      import { ref } from 'vue'
      import \$_1 from 'http'
      const http1 = \$_1;
      const http2 = \$_1;
      
      ",
        "map": null,
      }
    `)
  })
})
