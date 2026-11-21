// Lockfile parsers shared by the browser scanner and the monitoring service.
// This file must run in both places, so it uses no Node or DOM APIs.
// Canonical copy: app/src/shared/parsers.js. `npm run sync-web` copies it to landing/shared/parsers.js.

/** @typedef {{ eco: string, name: string, version: string }} Component */

/** @param {unknown} v */
export const looksLikeVersion = (v) => typeof v === "string" && /^v?\d/.test(v) && !v.includes("use.local");

/** @param {string} text @returns {Component[]} */
export function parsePackageLock(text) {
  const j = JSON.parse(text);
  const out = [];
  if (j.packages) {
    for (const [key, v] of Object.entries(j.packages)) {
      const i = key.lastIndexOf("node_modules/");
      if (i < 0 || !v || v.link) continue;
      out.push({ eco: "npm", name: v.name || key.slice(i + 13), version: v.version });
    }
  } else if (j.dependencies) {
    const walk = (deps) => {
      for (const [name, v] of Object.entries(deps)) {
        out.push({ eco: "npm", name, version: v.version });
        if (v.dependencies) walk(v.dependencies);
      }
    };
    walk(j.dependencies);
  }
  return out;
}

/** @param {string} text @returns {Component[]} */
export function parseYarnLock(text) {
  const out = [];
  let name = null;
  for (const line of text.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    if (!/^\s/.test(line) && line.trimEnd().endsWith(":")) {
      const first = line.trimEnd().slice(0, -1).split(",")[0].trim().replace(/^"|"$/g, "");
      const at = first.lastIndexOf("@");
      name = at > 0 ? first.slice(0, at) : null;
      if (name && first.includes("@workspace:")) name = null;
      continue;
    }
    const m = line.match(/^\s+version:?\s+"?([^"\s]+)"?\s*$/);
    if (m && name) {
      out.push({ eco: "npm", name, version: m[1] });
      name = null;
    }
  }
  return out;
}

/** @param {string} text @returns {Component[]} */
export function parsePnpmLock(text) {
  const out = [];
  let inPackages = false;
  for (const line of text.split(/\r?\n/)) {
    if (/^\S/.test(line)) {
      inPackages = /^(packages|snapshots):\s*$/.test(line);
      continue;
    }
    if (!inPackages) continue;
    const m = line.match(/^ {2}['"]?\/?([^'":\s][^'"]*?)['"]?:\s*$/);
    if (!m) continue;
    const key = m[1].replace(/\(.*$/, "");
    let name;
    let version;
    const at = key.lastIndexOf("@");
    if (at > 0) {
      name = key.slice(0, at);
      version = key.slice(at + 1);
    } else {
      const slash = key.lastIndexOf("/");
      name = key.slice(0, slash);
      version = key.slice(slash + 1);
    }
    out.push({ eco: "npm", name, version });
  }
  return out;
}

/** @param {string} text @returns {Component[]} */
export function parseRequirements(text) {
  const out = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.split("#")[0].trim();
    const m = line.match(/^([A-Za-z0-9_.\-]+)(\[[^\]]*\])?\s*===?\s*([A-Za-z0-9_.+!\-]+)/);
    if (m) out.push({ eco: "PyPI", name: m[1], version: m[3] });
  }
  return out;
}

/** @param {string} text @param {string} eco @returns {Component[]} */
export function parseTomlPackages(text, eco) {
  const out = [];
  let cur = null;
  const flush = () => {
    if (cur && cur.name && cur.version) out.push({ eco, name: cur.name, version: cur.version });
  };
  for (const line of text.split(/\r?\n/)) {
    if (/^\s*\[\[package\]\]\s*$/.test(line)) {
      flush();
      cur = {};
      continue;
    }
    if (/^\s*\[/.test(line)) {
      flush();
      cur = null;
      continue;
    }
    if (!cur) continue;
    const m = line.match(/^\s*(name|version)\s*=\s*"([^"]+)"/);
    if (m) cur[m[1]] = m[2];
  }
  flush();
  return out;
}

/** @param {string} text @returns {Component[]} */
export function parsePipfileLock(text) {
  const j = JSON.parse(text);
  const out = [];
  for (const section of ["default", "develop"]) {
    for (const [name, v] of Object.entries(j[section] || {})) {
      if (v && typeof v.version === "string") out.push({ eco: "PyPI", name, version: v.version.replace(/^==/, "") });
    }
  }
  return out;
}

/** @param {string} text @returns {Component[]} */
export function parseComposerLock(text) {
  const j = JSON.parse(text);
  return [...(j.packages || []), ...(j["packages-dev"] || [])]
    .filter((p) => p.name && p.version && !p.version.startsWith("dev-"))
    .map((p) => ({ eco: "Packagist", name: p.name, version: p.version.replace(/^v/, "") }));
}

/** @param {string} text @returns {Component[]} */
export function parseGoMod(text) {
  const out = [];
  let inBlock = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.split("//")[0].trim();
    if (/^require\s*\($/.test(line)) {
      inBlock = true;
      continue;
    }
    if (inBlock && line === ")") {
      inBlock = false;
      continue;
    }
    const m = inBlock ? line.match(/^(\S+)\s+(v\S+)$/) : line.match(/^require\s+(\S+)\s+(v\S+)$/);
    if (m) out.push({ eco: "Go", name: m[1], version: m[2] });
  }
  return out;
}

/** @param {string} text @returns {Component[]} */
export function parseGemfileLock(text) {
  const out = [];
  let inSpecs = false;
  for (const line of text.split(/\r?\n/)) {
    if (/^\S/.test(line)) {
      inSpecs = false;
      continue;
    }
    if (/^ {2}specs:\s*$/.test(line)) {
      inSpecs = true;
      continue;
    }
    if (!inSpecs) continue;
    const m = line.match(/^ {4}([A-Za-z0-9_.\-]+) \(([^)]+)\)\s*$/);
    if (m) {
      out.push({
        eco: "RubyGems",
        name: m[1],
        version: m[2].replace(/-(x86|x64|arm|aarch|java|universal|mingw|darwin|linux|musl).*$/, "")
      });
    }
  }
  return out;
}

/**
 * Regex-based so it also runs on the server, where there is no DOMParser.
 * Resolves ${property} versions from <properties> and ${project.version}; skips anything still unresolved.
 * @param {string} text @returns {Component[]}
 */
export function parsePom(text) {
  const xml = text.replace(/<!--[\s\S]*?-->/g, "");
  const props = {};
  const propsBlock = xml.match(/<properties>([\s\S]*?)<\/properties>/);
  if (propsBlock) {
    for (const m of propsBlock[1].matchAll(/<([A-Za-z0-9_.\-]+)>\s*([^<]*?)\s*<\/\1>/g)) props[m[1]] = m[2];
  }
  const topLevel = xml.replace(/<(parent|dependencies|dependencyManagement|build|profiles|reporting|properties)>[\s\S]*?<\/\1>/g, "");
  const projectVersion = topLevel.match(/<version>\s*([^<]+?)\s*<\/version>/);
  if (projectVersion) props["project.version"] = projectVersion[1];
  const resolve = (v) => v.replace(/\$\{([^}]+)\}/g, (whole, k) => props[k] ?? whole);
  const out = [];
  for (const m of xml.matchAll(/<dependency>([\s\S]*?)<\/dependency>/g)) {
    const get = (tag) => (m[1].match(new RegExp(`<${tag}>\\s*([^<]+?)\\s*</${tag}>`)) || [])[1] || "";
    const version = resolve(get("version"));
    if (!version || version.includes("${")) continue;
    out.push({ eco: "Maven", name: `${get("groupId")}:${get("artifactId")}`, version });
  }
  return out;
}

/** @param {string} text @returns {Component[]} */
export function parseGradleLock(text) {
  const out = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([^#:\s]+):([^:\s]+):([^=\s]+)=/);
    if (m) out.push({ eco: "Maven", name: `${m[1]}:${m[2]}`, version: m[3] });
  }
  return out;
}

const PARSERS = {
  "package-lock.json": parsePackageLock,
  "npm-shrinkwrap.json": parsePackageLock,
  "yarn.lock": parseYarnLock,
  "pnpm-lock.yaml": parsePnpmLock,
  "requirements.txt": parseRequirements,
  "poetry.lock": (t) => parseTomlPackages(t, "PyPI"),
  "Pipfile.lock": parsePipfileLock,
  "composer.lock": parseComposerLock,
  "Cargo.lock": (t) => parseTomlPackages(t, "crates.io"),
  "go.mod": parseGoMod,
  "Gemfile.lock": parseGemfileLock,
  "pom.xml": parsePom,
  "gradle.lockfile": parseGradleLock
};

/** @param {string} path @returns {((text: string) => Component[]) | null} */
export function parserFor(path) {
  const base = path.split("/").pop() || "";
  if (PARSERS[base]) return PARSERS[base];
  if (/^requirements.*\.txt$/i.test(base)) return parseRequirements;
  return null;
}

const IGNORED_DIRS = /(^|\/)(node_modules|vendor|test|tests|examples?|fixtures?)\//;

/**
 * Picks the dependency files worth reading from a repository's file list: recognised names only,
 * outside vendored and test folders, shallowest first.
 * @param {string[]} paths @param {number} [limit]
 */
export function findLockfilePaths(paths, limit = 12) {
  return paths
    .filter((p) => parserFor(p) && !IGNORED_DIRS.test(p))
    .sort((a, b) => a.split("/").length - b.split("/").length || a.localeCompare(b))
    .slice(0, limit);
}

/** Stable identity of a component, case-insensitive on the name. @param {Component} c */
export const componentKey = (c) => `${c.eco}|${c.name.toLowerCase()}|${c.version}`;

/**
 * Parses every recognised file and returns the deduplicated components with an exact version.
 * A file that fails to parse is reported with count -1 instead of failing the whole scan.
 * @param {{ path: string, text: string }[]} files
 */
export function extractComponents(files) {
  const seen = new Map();
  const usedFiles = [];
  for (const f of files) {
    const parse = parserFor(f.path);
    if (!parse) continue;
    let comps;
    try {
      comps = parse(f.text).filter((c) => c.name && looksLikeVersion(c.version));
    } catch {
      usedFiles.push({ path: f.path, count: -1 });
      continue;
    }
    usedFiles.push({ path: f.path, count: comps.length });
    for (const c of comps) {
      const key = componentKey(c);
      if (!seen.has(key)) seen.set(key, { ...c, file: f.path });
    }
  }
  return { components: [...seen.values()], usedFiles };
}
