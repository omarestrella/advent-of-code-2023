import { Day } from "./base.ts";

export class Day3 extends Day {
  getSymbols(input: string) {
    return new Set(input.match(/[^\d.\s]/g));
  }

  isDigit(input: string) {
    return !!input.match(/\d+/g);
  }

  findNumberWithinIndex(line: string, idx: number) {
    const matches = line.matchAll(/\d+/g);
    for (const result of matches) {
      const matchIdx = result.index!;
      const num = result[0];

      if (matchIdx + num.length > idx) {
        return parseInt(num);
      }
    }
    return null;
  }

  part1() {
    const lines = this.input.split("\n").map((l) => l.trim());

    const validParts = lines
      .flatMap((line, idx, lines) => {
        const before = lines[idx - 1];
        const after = lines[idx + 1];

        const results = [];
        const matches = line.matchAll(/\d+/g);
        for (const result of matches) {
          const matchIdx = result.index!;
          const num = result[0];

          const adjacentSymbols = this.getSymbols(
            line.substring(matchIdx - 1, matchIdx + num.length + 1)
          );

          if (adjacentSymbols.size > 0) {
            results.push(parseInt(num));
          }

          if (before) {
            const beforeSymbols = this.getSymbols(
              before.substring(matchIdx - 1, matchIdx + num.length + 1)
            );

            if (beforeSymbols.size > 0) {
              results.push(parseInt(num));
            }
          }

          if (after) {
            const afterSymbols = this.getSymbols(
              after.substring(matchIdx - 1, matchIdx + num.length + 1)
            );
            if (afterSymbols.size > 0) {
              results.push(parseInt(num));
            }
          }
        }

        return results;
      })
      .filter((p) => !!p) as number[];

    return validParts.reduce((a, b) => a + b, 0);
  }

  part2() {
    const lines = this.input.split("\n").map((l) => l.trim());

    const gears = lines
      .flatMap((line, idx, lines) => {
        const before = lines[idx - 1];
        const after = lines[idx + 1];

        const results = [];
        const gearMatches = line.matchAll(/\*/g);
        for (const match of gearMatches) {
          const matchIdx = match.index!;
          const numbers = [];

          if (!match[0]) {
            return;
          }

          console.log("match", match);

          if (this.isDigit(line[matchIdx - 1])) {
            const num = this.findNumberWithinIndex(line, matchIdx - 1);
            if (num) numbers.push(num);
          }
          if (this.isDigit(line[matchIdx + 1])) {
            const num = this.findNumberWithinIndex(line, matchIdx + 1);
            if (num) numbers.push(num);
          }

          const beforeSection = before?.substring(matchIdx - 1, matchIdx + 2);
          if (beforeSection && this.isDigit(beforeSection)) {
            const num = this.findNumberWithinIndex(before, matchIdx - 1);
            if (num) numbers.push(num);
          }

          const afterSection = after?.substring(matchIdx - 1, matchIdx + 2);
          if (afterSection && this.isDigit(afterSection)) {
            const num = this.findNumberWithinIndex(after, matchIdx - 1);
            if (num) numbers.push(num);
          }

          if (numbers.length === 2) {
            results.push(numbers[0] * numbers[1]);
          }
        }

        return results;
      })
      .filter((p) => !!p) as number[];

    // 80065459 - too low

    return gears.reduce((a, b) => a + b, 0);
  }

  get testInput(): string {
    return `467..114..
    ...*......
    ..35..633.
    ......#...
    617*......
    .....+.58.
    ..592.....
    ......755.
    ...$.*....
    .664.598..`;
  }
}
