import { max } from "../utils/array.ts";
import { Day } from "./base.ts";

type Direction = "up" | "down" | "left" | "right";

type Beam = {
  pos: [number, number];
  startingPos: [number, number];
  direction: Direction;
  seen: Set<string>;
};

function updateBeamPosition(beam: Beam) {
  const [x, y] = beam.pos;

  switch (beam.direction) {
    case "up":
      beam.pos = [x, y - 1];
      break;
    case "down":
      beam.pos = [x, y + 1];
      break;
    case "left":
      beam.pos = [x - 1, y];
      break;
    case "right":
      beam.pos = [x + 1, y];
      break;
  }
}

function processBeamCell(beam: Beam, beams: Beam[], grid: string[][]) {
  const [x, y] = beam.pos;
  const cell = grid[y]?.[x];
  // We've fallen off the grid, remove the beam
  if (!cell) {
    return beams.filter((b) => b !== beam);
  }

  switch (cell) {
    case "|":
      if (beam.direction === "right" || beam.direction === "left") {
        const newBeam: Beam = {
          pos: [x, y],
          startingPos: [x, y],
          direction: "down",
          seen: new Set<string>([`${x},${y},down`]),
        };
        beams.push(newBeam);
        beam.direction = "up";
      }
      break;
    case "-":
      if (beam.direction === "up" || beam.direction === "down") {
        const newBeam: Beam = {
          pos: [x, y],
          startingPos: [x, y],
          direction: "left",
          seen: new Set<string>([`${x},${y},left`]),
        };
        beams.push(newBeam);
        beam.direction = "right";
      }
      break;
    case "\\":
      if (beam.direction === "up") {
        beam.direction = "left";
      } else if (beam.direction === "down") {
        beam.direction = "right";
      } else if (beam.direction === "left") {
        beam.direction = "up";
      } else if (beam.direction === "right") {
        beam.direction = "down";
      }
      break;
    case "/":
      if (beam.direction === "up") {
        beam.direction = "right";
      } else if (beam.direction === "down") {
        beam.direction = "left";
      } else if (beam.direction === "left") {
        beam.direction = "down";
      } else if (beam.direction === "right") {
        beam.direction = "up";
      }
      break;
  }

  return beams;
}

function run(
  grid: string[][],
  startingBeam: Beam = {
    pos: [0, 0],
    startingPos: [0, 0],
    direction: "right",
    seen: new Set<string>(),
  }
) {
  const energizedGrid = [...grid.map((l) => [...l])];

  const energizedCells = new Set<string>();
  const seenCells = new Set<string>();
  let beams: Beam[] = [startingBeam];

  beams = processBeamCell(beams[0], beams, grid);

  function step(beam: Beam) {
    const [x, y] = beam.pos;

    const cellKey = beam.pos.join(",");
    energizedCells.add(cellKey);

    if (seenCells.has(`${cellKey},${beam.direction}`)) {
      beams = beams.filter((b) => b !== beam);
      return;
    }
    seenCells.add(`${cellKey},${beam.direction}`);

    energizedGrid[y][x] = "#";

    updateBeamPosition(beam);
    beams = processBeamCell(beam, beams, grid);
  }

  while (beams.length > 0) {
    // const log = energizedGrid.map((l) => l.join("")).join("\n");
    // this.logGoHome();
    // this.logClearScreen();
    // this.log(log);

    beams.forEach(step);
  }

  return energizedCells.size;
}

// so jank, lets run this file as a worker itself
if (import.meta.main) {
  (self as unknown as Worker).addEventListener("message", (event) => {
    const result = run(event.data.grid, event.data.beam);
    (self as unknown as Worker).postMessage({ result });
    self.close();
  });
}

export class Day16 extends Day {
  part1() {
    const grid = this.input.split("\n").map((l) => l.trim().split(""));
    return run(grid);
  }

  async part2() {
    const grid = this.input.split("\n").map((l) => l.trim().split(""));
    const width = grid[0].length;
    const height = grid.length;
    const beams: Beam[] = [];

    for (let y = 0; y < height; y++) {
      beams.push({
        pos: [0, y],
        startingPos: [0, y],
        direction: "right",
        seen: new Set<string>(),
      });
      beams.push({
        pos: [width - 1, y],
        startingPos: [width - 1, y],
        direction: "left",
        seen: new Set<string>(),
      });
    }

    for (let x = 0; x < width; x++) {
      beams.push({
        pos: [x, 0],
        startingPos: [x, 0],
        direction: "down",
        seen: new Set<string>(),
      });
      beams.push({
        pos: [x, height - 1],
        startingPos: [x, height - 1],
        direction: "up",
        seen: new Set<string>(),
      });
    }

    const results: number[] = await Promise.all(
      beams.map((beam) => {
        const worker = new Worker(new URL("./day16.ts", import.meta.url), {
          type: "module",
        });
        return new Promise<number>((resolve) => {
          worker.addEventListener("message", (event) => {
            resolve(event.data.result as number);
          });
          worker.postMessage({ grid, beam });
        });
      })
    );

    return max(results);
  }

  get testInput() {
    return `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`;
  }
}
