export const REQUIRE_RE = /(=[\s]*|^)(require\s*\(['"](?<import>[\w-]+)['"]\))(\s*[;]{0,1})/gm
export const STATIC_IMPORT_RE = /([\s;]|^)(import[\w,{}\s*]*from\s*['"].+['"])\s*[;\n]{0,1}/gm
