import { Day } from "./base.ts";

export class Day1 extends Day {
  part1() {
    return this.input
      .split("\n")
      .map((str) => str.trim().match(/\d/g))
      .reduce(
        (sum, str) => (str ? sum + +(str[0] + str[str.length - 1]) : sum),
        0
      );
  }

  part2() {
    return this.input
      .split("\n")
      .map((str) =>
        str
          .trim()
          .replaceAll("one", "o1e")
          .replaceAll("two", "t2o")
          .replaceAll("three", "t3e")
          .replaceAll("four", "f4r")
          .replaceAll("five", "f5e")
          .replaceAll("six", "s6x")
          .replaceAll("seven", "s7n")
          .replaceAll("eight", "e8t")
          .replaceAll("nine", "n9e")
          .match(/\d/g)
      )
      .reduce(
        (sum, str) => (str ? sum + +(str[0] + str[str.length - 1]) : sum),
        0
      );
  }
}
