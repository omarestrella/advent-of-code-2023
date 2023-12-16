import { areSame, transpose } from "../utils/array.ts";
import { clamp } from "../utils/number.ts";
import { differences } from "../utils/array.ts";
import { Day } from "./base.ts";

function getReflectionPoints(pattern: string[][]) {
  const points = [];
  for (let i = 0; i < pattern.length - 1; i++) {
    const firstPattern = pattern[i];
    const nextPattern = pattern[i + 1];
    if (areSame(firstPattern, nextPattern)) {
      points.push([i, i + 1]);
    }
  }
  return points;
}

function getEdges(reflection: number[], pattern: string[][]) {
  const [first, second] = reflection;

  const closestEdge = clamp(
    pattern.length / 2 < second ? pattern.length - 1 : 0,
    0,
    pattern.length - 1
  );
  const otherEdge = clamp(
    pattern.length / 2 < second
      ? second - (pattern.length - second)
      : first + second,
    0,
    pattern.length - 1
  );

  const min = Math.min(closestEdge, otherEdge);
  const max = Math.max(closestEdge, otherEdge);

  return [min, max];
}

function getMatchingEdges(reflection: number[], pattern: string[][]) {
  const [min, max] = getEdges(reflection, pattern);

  if (areSame(pattern[min], pattern[max])) {
    return [min, max];
  }
}

function updatePatternForSmudge(pattern: string[][]) {
  // console.log(pattern.map((p) => p.join("")).join("\n"));

  for (let i = 0; i < pattern.length - 1; i++) {
    const firstPattern = pattern[i];
    const nextPattern = pattern[i + 1];

    // found a potential mirror, check for smudges
    if (areSame(firstPattern, nextPattern)) {
      const [min, max] = getEdges([i, i + 1], pattern);
      const indices = new Array(Math.floor((max - min) / 2))
        .fill(0)
        .map((_, i) => [i + min, max - i]);
      for (const [a, b] of indices) {
        const diff = differences(pattern[a], pattern[b]);
        if (diff.length === 1) {
          pattern[a][diff[0]] = pattern[b][diff[0]];
          return true;
        }
      }
    } else {
      // check if smudging to create a mirror is possible
      const diff = differences(firstPattern, nextPattern);
      if (diff.length === 1) {
        // if we smudge, check that the mirror is still valid by doing the full indices check
        const origFirstPattern = [...firstPattern];
        firstPattern[diff[0]] = nextPattern[diff[0]];
        const [min, max] = getEdges([i, i + 1], pattern);
        const indices = new Array(Math.floor((max - min) / 2))
          .fill(0)
          .map((_, i) => [i + min, max - i]);

        if (indices.every(([a, b]) => areSame(pattern[a], pattern[b]))) {
          return true;
        } else {
          // RESET! I hate all this stateful code, but its late, and I want to sleep
          firstPattern[diff[0]] = origFirstPattern[diff[0]];
        }
      }
    }
  }

  return false;
}

function findReflectionPoint(pattern: string[][], adjustForSmudge = false) {
  let reflections = getReflectionPoints(pattern);

  if (adjustForSmudge) {
    const smudged = updatePatternForSmudge(pattern);
    if (!smudged) {
      return;
    }

    reflections = getReflectionPoints(pattern);
  }

  for (let i = 0; i < reflections.length; i++) {
    const edge = getMatchingEdges(reflections[i], pattern);
    if (!edge) {
      continue;
    }
    const [min, max] = edge;
    const indices = new Array(Math.floor((max - min) / 2))
      .fill(0)
      .map((_, i) => [i + min, max - i]);
    if (indices.every(([a, b]) => areSame(pattern[a], pattern[b]))) {
      return reflections[i];
    }
  }
}

export class Day13 extends Day {
  part1() {
    const patterns = this.input
      .split("\n\n")
      .map((s) => s.split("\n").map((s) => s.trim().split("")));

    const results = patterns.map((pattern) => {
      const verticalPattern = transpose(pattern);
      const h = findReflectionPoint(pattern);
      const v = findReflectionPoint(verticalPattern);
      return {
        h,
        v,
      };
    });

    const sum = results.reduce((acc, { h, v }) => {
      if (h) {
        return acc + h[1] * 100;
      }
      if (v) {
        return acc + v[1];
      }
      return acc;
    }, 0);

    return sum;
  }

  part2() {
    const patterns = this.input
      .split("\n\n")
      .map((s) => s.split("\n").map((s) => s.trim().split("")));

    const results = patterns.map((pattern) => {
      const verticalPattern = transpose(pattern);
      const h = findReflectionPoint(pattern, true);
      const v = findReflectionPoint(verticalPattern, true);
      return {
        h,
        v,
      };
    });

    const sum = results.reduce((acc, { h, v }) => {
      if (h) {
        return acc + h[1] * 100;
      }
      if (v) {
        return acc + v[1];
      }
      return acc;
    }, 0);

    return sum;
  }

  get testInput(): string {
    return `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;
  }

  get testInput2(): string {
    return `#.#.###
..#..##
..#..##
#.#..##
..#####
....###
.######
.##..##
.###.##
##.#...
##..#..`;
  }

  get testInput3(): string {
    return `..#..#.###.#.##
.....#...#.#.##
.....#...#.#.##
..#..#.###.#.##
##.#..##....##.
..#.###.#.#....
#####....#.##..
..#...#....#..#
##..##.######.#
...#..#..#####.
##..#..#.##....
...##.#####...#
.#.###....##..#`;
  }

  get testInput4(): string {
    return `###.#.##.
##..####.
##......#
##....#.#
###.#..#.
.#.#.#.#.
###.##.##
..#..#.#.
..#..#.#.`;
  }
}
