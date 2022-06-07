export const REQUIRE_RE = /(?<!\/.*)(=[\s]*|[\"]|^)(require\s*\(['"](?<import>[\w\.\/\-\@\~]+)['"]\))(\x20*[;]{0,1})/gm
export const STATIC_IMPORT_RE = /([\s;]|^)(import[\w,{}\s*]*from\s*['"].+['"])\x20*[;\n]{0,1}/gm
