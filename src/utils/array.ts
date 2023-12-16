export function chunk<T>(array: T[], size: number) {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}

export function zip<T>(...arrays: T[][]) {
  return arrays[0].map((_, i) => arrays.map((array) => array[i]));
}

export function transpose<T>(array: T[][]) {
  return zip(...array);
}

export function areSame<T>(a: T[], b: T[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

export function differences<T>(a: T[], b: T[]) {
  return a
    .map((x, i) => (x !== b[i] ? i : null))
    .filter((x) => x != null) as number[];
}

export function takeWhile<T>(array: T[], predicate: (x: T) => boolean) {
  const results = [];
  for (const item of array) {
    if (!predicate(item)) {
      break;
    }
    results.push(item);
  }
  return results;
}
