export function chunk<T>(array: T[], size: number) {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}

export function zip<T>(...arrays: T[][]) {
  return arrays[0].map((_, i) => arrays.map((array) => array[i]));
}
