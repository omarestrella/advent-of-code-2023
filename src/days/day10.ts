import { Day } from "./base.ts";

type Pipe = {
  symbol: string;
  x: number;
  y: number;
};

function getNextPosition(
  pipe: Pipe,
  seenPipes: Set<Pipe>,
  pipesMap: Map<string, Pipe>
) {
  const eastPipe = pipesMap.get(`${pipe.x + 1},${pipe.y}`);
  const westPipe = pipesMap.get(`${pipe.x - 1},${pipe.y}`);
  const northPipe = pipesMap.get(`${pipe.x},${pipe.y - 1}`);
  const southPipe = pipesMap.get(`${pipe.x},${pipe.y + 1}`);

  switch (pipe.symbol) {
    case "┌": {
      if (eastPipe && seenPipes.has(eastPipe)) {
        return [pipe.x, pipe.y + 1];
      }
      return [pipe.x + 1, pipe.y];
    }
    case "┐": {
      if (westPipe && seenPipes.has(westPipe)) {
        return [pipe.x, pipe.y + 1];
      }
      return [pipe.x - 1, pipe.y];
    }
    case "─": {
      if (eastPipe && seenPipes.has(eastPipe)) {
        return [pipe.x - 1, pipe.y];
      }
      return [pipe.x + 1, pipe.y];
    }
    case "│": {
      if (northPipe && seenPipes.has(northPipe)) {
        return [pipe.x, pipe.y + 1];
      }
      return [pipe.x, pipe.y - 1];
    }
    case "└": {
      if (northPipe && seenPipes.has(northPipe)) {
        return [pipe.x + 1, pipe.y];
      }
      return [pipe.x, pipe.y - 1];
    }
    case "┘": {
      if (northPipe && seenPipes.has(northPipe)) {
        return [pipe.x - 1, pipe.y];
      }
      return [pipe.x, pipe.y - 1];
    }
    default:
      throw new Error(`Unknown symbol ${pipe.symbol}`);
  }
}

export class Day10 extends Day {
  getData() {
    const pipelines = [] as Pipe[][];
    const pipesMap = new Map<string, Pipe>();
    let startingPipe: Pipe | undefined;

    this.input
      .replaceAll("L", "└")
      .replaceAll("J", "┘")
      .replaceAll("-", "─")
      .replaceAll("7", "┐")
      .replaceAll("F", "┌")
      .replaceAll("|", "│")
      .split("\n")
      .forEach((str, y) => {
        const pipes = [] as Pipe[];
        str
          .trim()
          .split("")
          .forEach((char, x) => {
            if (char === ".") {
              pipes.push({
                x,
                y,
                symbol: char,
              });
              return;
            }

            const pipe = {
              // hard code the pipe, cause why not
              symbol: char === "S" ? "┌" : char,
              // symbol: char === "S" ? "┐" : char,
              x,
              y,
            } as Pipe;

            pipes.push(pipe);
            pipesMap.set(`${x},${y}`, pipe);

            if (char === "S") {
              startingPipe = pipe;
            }
          });
        pipelines.push(pipes);
      });

    return {
      pipelines,
      pipesMap,
      startingPipe,
    };
  }
  part1() {
    const { pipelines, pipesMap, startingPipe } = this.getData();

    const seen = new Set<Pipe>([startingPipe!]);
    const [x, y] = getNextPosition(startingPipe!, seen, pipesMap);
    let pipe = pipesMap.get(`${x},${y}`);
    let distance = 0;
    let meet = false;

    while (!meet && pipe) {
      const [x, y] = getNextPosition(pipe, seen, pipesMap);
      if (seen.has(pipe)) {
        meet = true;
      }
      seen.add(pipe);
      pipe = pipesMap.get(`${x},${y}`);
      distance += 1;
    }

    return distance / 2;
  }

  part2() {
    const { pipelines, pipesMap, startingPipe } = this.getData();
    const seen = new Set<Pipe>([startingPipe!]);
    const [x, y] = getNextPosition(startingPipe!, seen, pipesMap);
    let pipe = pipesMap.get(`${x},${y}`);
    let distance = 0;
    let meet = false;

    while (!meet && pipe) {
      const [x, y] = getNextPosition(pipe, seen, pipesMap);
      if (seen.has(pipe)) {
        meet = true;
      }
      seen.add(pipe);
      pipe = pipesMap.get(`${x},${y}`);
      distance += 1;
    }

    const insidePipes = new Set<Pipe>();
    const toPrint = pipelines
      .map((pipes) => {
        let count = 0;
        let prevTurn: Pipe | null = null;
        return pipes
          .map((pipe, idx, pipesLine) => {
            let symbol = ".";
            if (seen.has(pipe)) {
              if (pipe.symbol !== "─") {
                if (
                  (pipe.symbol === "│" && prevTurn?.symbol === "│") ||
                  (pipe.symbol === "┘" && prevTurn?.symbol === "┌") ||
                  (pipe.symbol === "┐" && prevTurn?.symbol === "└")
                ) {
                  count -= 1;
                } else {
                  count += 1;
                }

                if (
                  pipe.symbol === "┌" ||
                  pipe.symbol === "┐" ||
                  pipe.symbol === "└" ||
                  pipe.symbol === "┘"
                ) {
                  prevTurn = pipe;
                }
              }

              symbol = pipe.symbol;
            } else {
              if (count % 2 === 1) {
                symbol = "#";
              } else {
                symbol = ".";
              }
            }

            return symbol;
          })
          .join("");
      })
      .join("\n");
    console.log(toPrint);

    return 1;
  }

  printPipes() {
    const input = this.input
      .split("\n")
      .map((str) => str.trim())
      .join("\n")
      .replaceAll("L", "└")
      .replaceAll("J", "┘")
      .replaceAll("-", "─")
      .replaceAll("7", "┐")
      .replaceAll("F", "┌")
      .replaceAll("|", "│");
    console.log(input);
  }

  get input(): string {
    // return `...........
    // .S-------7.
    // .|F-----7|.
    // .||.....||.
    // .||.....||.
    // .|L-7.F-J|.
    // .|..|.|..|.
    // .L--J.L--J.
    // ...........`;

    return `.F----7F7F7F7F-7....
      .|F--7||||||||FJ....
      .||.FJ||||||||L7....
      FJL7L7LJLJ||LJ.L-7..
      L--J.L7...LJS7F-7L7.
      ....F-J..F7FJ|L7L7L7
      ....L7.F7||L7|.L7L7|
      .....|FJLJ|FJ|F7|.LJ
      ....FJL-7.||.||||...
      ....L---J.LJ.LJLJ...`;
  }
}
