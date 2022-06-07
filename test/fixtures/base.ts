export const requireBaseSegment = `
import { ref } from 'vue'
import router from 'vue-router'
const http = require('http');
require('path')
`

export const requireAbsoluteSegment = `
import { ref } from 'vue'
const http = require('http')
`

export const requireRelativeSegment = `
import { ref } from 'vue'
const http = require('./http')
`

export const requireImporterDupe = `
import { ref } from 'vue'
const http1 = require('http')
const http2 = require('http')
`

export const Comments = `
import { ref } from 'vue'
// const http = require('./http')
/** const http = require('./http') */
`
