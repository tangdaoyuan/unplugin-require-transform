# unplugin-require-transform
transform `require` into `import` for ESM runtime compatibility

## Why?

> When old project migrate from webpack to vite, you may just want to run it instead of modifying every `require` syntax to new `import` syntax.

## Install

```sh
npm i unplugin-require-transform --save-dev
```

## Usage

```ts
import { defineConfig } from 'vite'
import VitePluginRequireTransform from 'unplugin-require-transform/vite'

export default defineConfig({
  plugins: [
    vue(),
    VitePluginRequireTransform(),
    // ...etc
  ],
})
```

## TODO
- [x]  vue `require` transform
- [ ]  dedupe `import` 
