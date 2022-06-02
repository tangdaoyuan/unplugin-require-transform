export const requireBaseSegment = `
import { ref } from 'vue'
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
