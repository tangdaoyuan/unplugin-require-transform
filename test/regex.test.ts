import { describe, expect, it } from 'vitest'
import { REQUIRE_RE } from '@/utils'

describe('require regex matcher runs', () => {
  it('match special symbols', () => {
    expect('require("@/assets/logo.png")'.match(REQUIRE_RE)).not.toBeNull()
    expect('require("./assets/logo.png")'.match(REQUIRE_RE)).not.toBeNull()
    expect('require("~/assets/logo.png")'.match(REQUIRE_RE)).not.toBeNull()
    expect('require("~/assets/lo-go.png")'.match(REQUIRE_RE)).not.toBeNull()
  })
})
