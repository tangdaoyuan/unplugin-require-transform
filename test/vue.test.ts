import { describe, expect, it } from 'vitest'
import { sfcSegment_Options, sfcSegment_Setup, sfcSegment_SetupScript } from './fixtures/vue'
import { transformVUE } from '@/transform'

describe('.vue files runs', () => {
  it('basic file', () => {
    const code = transformVUE(sfcSegment_Options, 'test/fixtures/vue.ts', {})
    expect(code).toMatchInlineSnapshot(`
      "
      <template>
        Hello World!
      </template>
      <script>
      import { def } from 'vue'
      import \$_2 from 'router'
      import \$_1 from 'http'
      const http = \$_1;
      const router = \$_2;
      
      export default {
        name: 'OptionsApi',
        data: function() {
          return {
            http
          }
        }
      }
      </script>
      "
    `)
  })
  it('with setup', () => {
    const code = transformVUE(sfcSegment_Setup, 'test/fixtures/vue.ts', {})
    expect(code).toMatchInlineSnapshot(`
      "
      <template>
        Hello World!
      </template>
      <script>
      import \$_1 from 'http'
      export default {
        setup() {
          const http = \$_1;
          return {
            http
          }
        }
      }
      </script>
      "
    `)
  })
  it('with setupScript', () => {
    const code = transformVUE(sfcSegment_SetupScript, 'test/fixtures/vue.ts', {})
    expect(code).toMatchInlineSnapshot(`
      "
      <template>
        Hello World!
      </template>
      <script setup>
      import \$_1 from 'http'
      const http = \$_1;
      </script>
      "
    `)
  })
})
