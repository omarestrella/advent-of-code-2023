import * as tty from "https://deno.land/x/tty@0.1.4/mod.ts";
import { Day } from "./base.ts";
import { rgb24 } from "https://deno.land/std@0.196.0/fmt/colors.ts";

export class Day18 extends Day {
  part1() {
    const plan = [
      ...this.input.matchAll(
        /(?<direction>[RLDU]) (?<amount>\d+) \(#(?<hex>[\wd]+)\)/g
      ),
    ].map((m) => ({ ...m.groups!, amount: parseInt(m.groups!.amount) })) as {
      direction: string;
      amount: number;
      hex: string;
    }[];

    const ground: string[][] = [];
    const groundColorMap = new Map<string, string>();
    const vertices: number[][] = [];
    const edges = new Set<string>();
    const boundaries = new Set<string>();

    let current;
    let x = 80;
    let y = 170;
    // let x = 0;
    // let y = 0;

    while ((current = plan.shift()) != null) {
      vertices.push([x, y]);
      for (let i = 0; i < current.amount; i++) {
        switch (current.direction) {
          case "R":
            ground[y] = ground[y] || [];
            ground[y][x + i] = "#";
            groundColorMap.set(`${x + i},${y}`, "86C4DE");
            // groundColorMap.set(`${x + i},${y}`, current.hex);
            edges.add(`${x + i},${y}`);
            break;
          case "L":
            ground[y] = ground[y] || [];
            ground[y][x - i] = "#";
            groundColorMap.set(`${x - i},${y}`, "86C4DE");
            // groundColorMap.set(`${x - i},${y}`, current.hex);
            edges.add(`${x - i},${y}`);
            break;
          case "D":
            ground[y + i] = ground[y + i] || [];
            ground[y + i][x] = "#";
            groundColorMap.set(`${x},${y + i}`, "86C4DE");
            boundaries.add(`${x},${y + i}`);
            // groundColorMap.set(`${x},${y + i}`, current.hex);
            break;
          case "U":
            ground[y - i] = ground[y - i] || [];
            ground[y - i][x] = "#";
            groundColorMap.set(`${x},${y - i}`, "86C4DE");
            boundaries.add(`${x},${y - i}`);
            // groundColorMap.set(`${x},${y - i}`, current.hex);
            break;
        }
      }

      if (current.direction === "R") {
        x += current.amount;
      } else if (current.direction === "L") {
        x -= current.amount;
      } else if (current.direction === "D") {
        y += current.amount;
      } else {
        y -= current.amount;
      }
    }

    const points: number[][] = [];
    ground.forEach((line, y) => {
      let intersectionCount = 0;
      [...line].forEach((cell, x) => {
        // ugh, whatever
        if (
          cell === "#" &&
          boundaries.has(`${x},${y}`) &&
          !edges.has(`${x},${y}`)
        ) {
          points.push([x, y]);
          intersectionCount += 1;
        } else if (cell == null && intersectionCount % 2 === 1) {
          groundColorMap.set(`${x},${y}`, "cccccc");
          points.push([x, y]);
        }
      });
    });

    this.print(ground, groundColorMap);

    console.log(points);

    return points.length;
  }

  part2() {
    return 1;
  }

  print(grid: string[][], colorMap: Map<string, string>) {
    // tty.writeSync("  ", Deno.stdout);
    // new Array(grid[0].length).fill(null).forEach((_, i) => {
    //   tty.writeSync(i.toString(), Deno.stdout);
    // });
    // tty.writeSync("\n", Deno.stdout);

    grid.forEach((line, y) => {
      // tty.writeSync(`${y} `, Deno.stdout);
      [...line].forEach((cell, x) => {
        const hex = colorMap.get(`${x},${y}`);
        if (hex) {
          tty.writeSync(rgb24(cell ?? ".", Number(`0x${hex}`)), Deno.stdout);
        } else {
          tty.writeSync(" ", Deno.stdout);
        }
      });
      tty.writeSync("\n", Deno.stdout);
    });
  }

  testInput = `R 6 (#70c710)
    D 5 (#0dc571)
    L 2 (#5713f0)
    D 2 (#d2c081)
    R 2 (#59c680)
    D 2 (#411b91)
    L 5 (#8ceee2)
    U 2 (#caa173)
    L 1 (#1b58a2)
    U 2 (#caa171)
    R 2 (#7807d2)
    U 3 (#a77fa3)
    L 2 (#015232)
    U 2 (#7a21e3)`;
}
