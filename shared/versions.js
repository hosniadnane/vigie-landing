// Version helpers shared by the browser scanner and the monitoring service (no Node or DOM APIs).
// Canonical copy: app/src/shared/versions.js. `npm run sync-web` copies it to landing/shared/versions.js.

/**
 * Compares two version strings segment by segment: numbers numerically, labels in natural order (beta9 < beta10),
 * and a pre-release label (1.0.0-rc1) below the plain release (1.0.0). Returns -1, 0 or 1.
 * @param {string} a @param {string} b
 */
export function compareVersions(a, b) {
  const parts = (v) => String(v).replace(/^v/i, "").split(/[.\-+_]/);
  const pa = parts(a);
  const pb = parts(b);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] ?? "0";
    const y = pb[i] ?? "0";
    const nx = /^\d+$/.test(x);
    const ny = /^\d+$/.test(y);
    if (nx && ny) {
      const d = Number(x) - Number(y);
      if (d) return Math.sign(d);
    } else if (nx !== ny) {
      return nx ? 1 : -1;
    } else {
      const d = x.localeCompare(y, "en", { numeric: true });
      if (d) return Math.sign(d);
    }
  }
  return 0;
}

/**
 * The version to upgrade to: the smallest fixed version above the installed one. Advisories often list
 * fixes on several release branches (log4j: 2.3.1, 2.12.2, 2.15.0), and only the next one up is useful.
 * Falls back to the highest fixed version when none is above, and to null when there is none.
 * @param {string} current @param {string[]} fixed
 */
export function pickFixedVersion(current, fixed) {
  if (!fixed || !fixed.length) return null;
  const above = fixed.filter((f) => compareVersions(f, current) > 0).sort(compareVersions);
  return above.length ? above[0] : [...fixed].sort(compareVersions).at(-1);
}
