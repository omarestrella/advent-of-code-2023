import { Day } from "./base.ts";

export class Day2 extends Day {
  parseGame(str: string) {
    const groups = /Game (?<id>\d+):(?<cubes>.*;?)/.exec(str.trim())?.groups;
    if (!groups) {
      throw new Error("Invalid input");
    }

    const id = groups.id;
    const cubes = groups.cubes.split(";").map((cube) => cube.trim());
    // [ ["3", "red"], ["4", "blue"] ]
    const colors = cubes.flatMap((cube) =>
      cube.split(",").map((color) => color.trim().split(" "))
    );
    return {
      id,
      colors,
    } as {
      id: string;
      colors: [string, "red" | "green" | "blue"][];
    };
  }

  part1() {
    const limitRed = 12;
    const limitGreen = 13;
    const limitBlue = 14;

    return this.input
      .split("\n")
      .map((str) => {
        const { id, colors } = this.parseGame(str);

        return colors.filter(([count, color]) => {
          switch (color) {
            case "red":
              return parseInt(count) <= limitRed;
            case "green":
              return parseInt(count) <= limitGreen;
            case "blue":
              return parseInt(count) <= limitBlue;
            default:
              return false;
          }
        }).length === colors.length
          ? parseInt(id)
          : 0;
      })
      .reduce((acc, val) => acc + val, 0);
  }

  part2() {
    return this.input
      .split("\n")
      .map((str) => {
        const { colors } = this.parseGame(str);

        const counts = colors.reduce(
          (counts, [count, color]) => {
            counts[color] = Math.max(counts[color], parseInt(count));
            return counts;
          },
          {
            red: 0,
            green: 0,
            blue: 0,
          }
        );

        return counts.red * counts.green * counts.blue;
      })
      .reduce((acc, val) => acc + val, 0);
  }
}
