import { zip } from "../utils/array.ts";
import { Day } from "./base.ts";

export class Day6 extends Day {
  part1() {
    const nums = this.input.split("\n").map((group) => {
      const [, nums] = group.trim().split(":");
      return nums.match(/\d+/g)?.map((m) => parseInt(m));
    }) as number[][];

    const races = zip(...nums);

    // (time - msHeld) * msHeld
    const results = races.map(([time, distanceToBeat]) => {
      const winningHolds: number[] = [];
      for (let i = 1; i < time; i++) {
        if ((time - i) * i > distanceToBeat) {
          winningHolds.push(i);
        }
      }
      return winningHolds;
    });

    return results.map((r) => r.length).reduce((a, b) => a * b, 1);
  }

  part2() {
    const [time, distanceToBeat] = this.input.split("\n").map((group) => {
      const [, nums] = group.trim().split(":");
      return parseInt(
        nums
          .match(/\d+/g)
          ?.map((m) => m.trim())
          ?.join("") ?? "0"
      );
    }) as number[];

    const winningHolds: number[] = [];
    for (let i = 1; i < time; i++) {
      if ((time - i) * i > distanceToBeat) {
        winningHolds.push(i);
      }
    }
    return winningHolds.length;
  }
}
