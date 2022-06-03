import { describe, expect, it } from 'vitest'
import { requireBaseSegment } from './fixtures/base'
import { transformTS } from '@/transform'

describe('.ts files runs', () => {
  it('basic file', () => {
    const code = transformTS(requireBaseSegment, 'test/fixtures/base.ts', {})
    expect(code).toMatchInlineSnapshot(`
      {
        "code": "
      import { ref } from 'vue'
      require('http')
      ",
        "map": SourceMap {
          "file": null,
          "mappings": "AAAA;AACA;AACA;",
          "names": [],
          "sources": [
            null,
          ],
          "sourcesContent": [
            null,
          ],
          "version": 3,
        },
      }
    `)
  })
})
