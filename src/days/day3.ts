import { intersects } from "../utils/set.ts";
import { Day } from "./base.ts";

export class Day3 extends Day {
  getSymbols(input: string) {
    return new Set(input.match(/[^\d.\s]/g));
  }

  part1() {
    const partNumbers: number[] = [];

    const symbols = this.getSymbols(this.input);

    this.input
      .split("\n")
      .map((l) => l.trim())
      .forEach((line, idx, input) => {
        const before = input[idx - 1];
        const after = input[idx + 1];
        const numbers = Array.from(line.match(/(\d+)/g) ?? []).map((number) => {
          const startIdx = line.indexOf(number);
          return {
            number,
            startIdx,
            endIdx: line.indexOf(number) + number.length - 1,
          };
        });

        if (!numbers) {
          return;
        }

        const addedNumbers = new Set();

        numbers.forEach((number) => {
          if (
            symbols.has(line[number.startIdx - 1]) ||
            symbols.has(line[number.endIdx + 1])
          ) {
            partNumbers.push(Number(number.number));
            addedNumbers.add(number);
          }
        });

        if (before) {
          numbers.forEach((number) => {
            if (addedNumbers.has(number)) {
              return;
            }
            const toCheck = before.substring(
              number.startIdx - 1,
              number.endIdx + 2
            );
            if (intersects(new Set(toCheck), symbols).size > 0) {
              partNumbers.push(Number(number.number));
              addedNumbers.add(number);
            }
          });
        }

        if (after) {
          numbers.forEach((number) => {
            if (addedNumbers.has(number)) {
              return;
            }
            const toCheck = after.substring(
              number.startIdx - 1,
              number.endIdx + 2
            );
            if (intersects(new Set(toCheck), symbols).size > 0) {
              partNumbers.push(Number(number.number));
              addedNumbers.add(number);
            }
          });
        }
      });

    console.log(partNumbers);

    // 552284 - too low

    return partNumbers.reduce((a, b) => a + b, 0);
  }

  part2() {
    return 1;
  }

  // override get input(): string {
  //   return `467..114..
  //   ...*......
  //   ..35..633.
  //   ......#...
  //   617*......
  //   .....+.58.
  //   ..592.....
  //   ......755.
  //   ...$.*....
  //   .664.598..`;
  // }
}
