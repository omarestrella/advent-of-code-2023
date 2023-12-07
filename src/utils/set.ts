export function intersects(a: Set<unknown>, b: Set<unknown>) {
  return new Set([...a].filter((x) => b.has(x)));
}
