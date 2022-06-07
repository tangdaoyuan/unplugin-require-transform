export const sfcSegment_Options = `
<template>
  Hello World!
</template>
<script>
import { def } from 'vue'
const http = require('http')
const router = require('router')
require('path')
export default {
  name: 'OptionsApi',
  data: function() {
    return {
      http
    }
  }
}
</script>
`

export const sfcSegment_Setup = `
<template>
  Hello World!
</template>
<script>
export default {
  setup() {
    const http = require('http')
    return {
      http
    }
  }
}
</script>
`

export const sfcSegment_SetupScript = `
<template>
  Hello World!
</template>
<script setup>
const http = require('http')
</script>
`

export const sfcSegment_TemplateScript = `
<template>
  <img :src="require('../assets/logo1.png')" />
  <img :src="require('../assets/logo2.png')" />
</template>
<script setup>
</script>
`

export const sfcSegment_NoneScript = `
<template>
  <img :src="require('../assets/logo.png')" />
  <a :href="require('test')" >anchor</a>
</template>
`

export const sfcSegment_TemplateScript_SetupFunc = `
<template>
  <img :src="require('../assets/logo.png')" />
  <img :src="require('../assets/icon.png')" />
</template>
<script>
export default {
  setup() {
    const test = 1
    return {
      test
    }
  }
}
</script>
`

export const sfcSegment_TemplateScript_OptionsAPI = `
<template>
  <img :src="require('../assets/logo.png')" />
</template>
<script>
export default {
  data() {
    return {}
  }
}
</script>
`

export const sfcSegment_TemplateScript_Dupe = `
<template>
  <img :src="require('../assets/logo.png')" />
  <img :src="require('../assets/logo.png')" />
  <img :src="require('../assets/logo.png')" />
  <img :src="require('../assets/logo.png')" />
</template>
<script>
const logo = require('../assets/logo.png')
export default {
  data() {
    return {}
  }
}
</script>
`
