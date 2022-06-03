export const requireBaseSegment = `
import { ref } from 'vue'
import router from 'vue-router'
require('http')
`

export const requireAbsoluteSegment = `
import { ref } from 'vue'
const http = require('http')
`

export const requireRelativeSegment = `
import { ref } from 'vue'
const http = require('./http')
`
