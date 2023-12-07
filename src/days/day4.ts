import { intersects } from "../utils/set.ts";
import { Day } from "./base.ts";

export class Day4 extends Day {
  getWinningNumbers(card: string) {
    const groups =
      /Card\s+(?<id>\d+):\s(?<winning>[\d\s]+)\s\|\s(?<numbers>[\d\s]+)/.exec(
        card.trim()
      )?.groups;
    if (!groups) {
      return new Set();
    }

    const winning = new Set(
      groups.winning.match(/\d+/g)?.map((n) => parseInt(n.trim()))
    );
    const numbers = new Set(
      groups.numbers.match(/\d+/g)?.map((n) => parseInt(n.trim()))
    );
    return intersects(winning, numbers);
  }

  part1() {
    return this.input
      .split("\n")
      .map((l) => {
        const winning = this.getWinningNumbers(l);
        if (winning.size === 0) {
          return 0;
        }
        return Math.pow(2, winning.size - 1);
      })
      .reduce((a, b) => a + b, 0);
  }

  part2() {
    const cards = this.input.split("\n");
    return cards
      .map((l) => {
        const winning = this.getWinningNumbers(l);
        return winning.size;
      })
      .reduce((acc, winning, idx) => {
        if (winning === 0) {
          return acc;
        }

        // count copies of the winning numbers
        for (let i = 0; i < acc[idx]; i++) {
          for (let i = idx + 1; i <= idx + winning; i++) {
            acc[i] += 1;
          }
        }

        for (let i = idx; i <= idx + winning; i++) {
          acc[i] += 1;
        }

        return acc;
      }, new Array(cards.length).fill(0));
  }

  override get input(): string {
    return `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
    Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
    Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
    Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
    Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
    Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;
  }
}
