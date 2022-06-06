import { describe, expect, it } from 'vitest'
import { requireAbsoluteSegment, requireBaseSegment, requireRelativeSegment } from './fixtures/base'
import { transformTS } from '@/transform'

describe('.ts files runs', () => {
  it('basic file', () => {
    const code = transformTS(requireBaseSegment, 'test/fixtures/base.ts', {})
    expect(code).toMatchInlineSnapshot(`
      {
        "code": "
      import { ref } from 'vue'
      import router from 'vue-router'
      import \$_2 from 'path'
      import \$_1 from 'http'
      const http = \$_1;
      
      ",
        "map": SourceMap {
          "file": null,
          "mappings": "AAAA;AACA;AACA;;;AACA,WAAW,MAAkB;",
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
  it('absolute path require', () => {
    const code = transformTS(requireAbsoluteSegment, 'test/fixtures/absolute.ts', {})
    expect(code).toMatchInlineSnapshot(`
      {
        "code": "
      import { ref } from 'vue'
      import \$_1 from 'http'
      const http = \$_1;
      ",
        "map": SourceMap {
          "file": null,
          "mappings": "AAAA;AACA;;AACA,WAAW",
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
  it('relative path require', () => {
    const code = transformTS(requireRelativeSegment, 'test/fixtures/relative.ts', {})
    expect(code).toMatchInlineSnapshot(`
      {
        "code": "
      import { ref } from 'vue'
      import \$_1 from './http'
      const http = \$_1;
      ",
        "map": SourceMap {
          "file": null,
          "mappings": "AAAA;AACA;;AACA,WAAW",
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
