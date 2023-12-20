import * as tty from "https://deno.land/x/tty@0.1.4/mod.ts";

export abstract class Day {
  abstract part1(): unknown;
  abstract part2(): unknown;

  async run(): Promise<void> {
    console.log(`${this.constructor.name}:`);
    const part1Start = performance.now();
    console.log(`  Part 1: ${await Promise.resolve(this.part1())}`);
    const part1End = performance.now();
    const part2Start = performance.now();
    console.log(`  Part 2: ${await Promise.resolve(this.part2())}\n`);
    const part2End = performance.now();

    console.log("Timings:");
    console.log(`  Part 1: ${(part1End - part1Start).toFixed(2)} ms`);
    console.log(`  Part 2: ${(part2End - part2Start).toFixed(2)} ms`);
  }

  get input(): string {
    return Deno.readTextFileSync(
      `src/inputs/${this.constructor.name.toLowerCase()}.txt`
    );
  }

  logClearScreen() {
    tty.clearScreenSync();
  }

  logGoHome() {
    tty.goHomeSync();
  }

  log(...args: unknown[]) {
    console.log(...args);
  }
}
