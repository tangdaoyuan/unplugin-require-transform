export const REQUIRE_RE = /([\s;]|^)(require\s*\(['"](?<import>.+)['"]\))/gm
export const STATIC_IMPORT_RE = /([\s;]|^)(import[\w,{}\s*]*from\s*['"].+['"])/gm
