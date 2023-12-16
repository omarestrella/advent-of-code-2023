import { zip } from "../utils/array.ts";
import { Day } from "./base.ts";

export class Day9 extends Day {
  getDifferences() {
    const lines = this.input.split("\n").map((line) =>
      line
        .trim()
        .split(" ")
        .map((n) => parseInt(n))
    );
    return lines.map((line) => {
      const diffs = [line];
      let process = true;
      do {
        const diff: number[] = [];
        for (let i = 1; i < line.length; i++) {
          diff.push(line[i] - line[i - 1]);
        }
        line = diff;
        diffs.push(diff);

        process = diff.some((n) => n !== 0);
      } while (process);

      return diffs;
    });
  }

  part1() {
    const sums = this.getDifferences().map((diffs) => {
      return diffs.map((d) => d.pop()!).reduceRight((acc, num) => acc + num, 0);
    });

    return sums.reduce((acc, sum) => acc + sum, 0);
  }

  part2() {
    const sums = this.getDifferences().map((diffs) => {
      return diffs.map((d) => d[0]).reduceRight((acc, num) => num - acc, 0);
    });

    return sums.reduce((acc, sum) => acc + sum, 0);
  }
}
