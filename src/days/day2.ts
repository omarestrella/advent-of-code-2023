import { Day } from "./base.ts";

export class Day2 extends Day {
  // override get input(): string {
  //   return `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
  //   Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
  //   Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
  //   Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
  //   Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;
  // }

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
