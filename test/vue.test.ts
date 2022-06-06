import { describe, expect, it } from 'vitest'
import { sfcSegment_NoneScript, sfcSegment_Options, sfcSegment_Setup, sfcSegment_SetupScript, sfcSegment_TemplateScript, sfcSegment_TemplateScript_OptionsAPI, sfcSegment_TemplateScript_SetupFunc } from './fixtures/vue'
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
  it('with only setup', () => {
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
  it('with only setupScript', () => {
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
  it('with template in setupScript', () => {
    const code = transformVUE(sfcSegment_TemplateScript, 'test/fixtures/vue.ts', {})
    expect(code).toMatchInlineSnapshot(`
      "
      <template>
        <img :src=\\"\$_1\\" />
        <img :src=\\"\$_2\\" />
      </template>
      <script setup>
      import \$_2 from '../assets/logo2.png'
      import \$_1 from '../assets/logo1.png'
      </script>
      "
    `)
  })
  it('with template in no script', () => {
    const code = transformVUE(sfcSegment_NoneScript, 'test/fixtures/vue.ts', {})
    expect(code).toMatchInlineSnapshot(`
      "<script setup>
      import \$_2 from 'test'
      import \$_1 from '../assets/logo.png'
      </script>
      <template>
        <img :src=\\"\$_1\\" />
        <a :href=\\"\$_2\\" >anchor</a>
      </template>
      "
    `)
  })
  it('with template in setup function', () => {
    const code = transformVUE(sfcSegment_TemplateScript_SetupFunc, 'test/fixtures/vue.ts', {})
    expect(code).toMatchInlineSnapshot(`
      "
      <template>
        <img :src=\\"\$_1\\" />
        <img :src=\\"\$_2\\" />
      </template>
      <script>
      import \$_2 from '../assets/icon.png'
      import \$_1 from '../assets/logo.png'
      export default {
        setup() {
          const test = 1
          return {
      \$_1,
      \$_2,
            test
          }
        }
      }
      </script>
      "
    `)
  })
  it('with template in data function', () => {
    const code = transformVUE(sfcSegment_TemplateScript_OptionsAPI, 'test/fixtures/vue.ts', {})
    expect(code).toMatchInlineSnapshot(`
      "
      <template>
        <img :src=\\"\$_1\\" />
      </template>
      <script>
      import \$_1 from '../assets/logo.png'
      export default {
        data() {
          return {\$_1,
      }
        }
      }
      </script>
      "
    `)
  })
})
