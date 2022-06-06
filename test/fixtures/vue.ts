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
  <img :src="require('../assets/logo.png')" />
</template>
<script setup></script>
`

export const sfcSegment_NoneScript = `
<template>
  <img :src="require('../assets/logo.png')" />
</template>
`
