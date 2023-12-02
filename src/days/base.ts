export abstract class Day {
  abstract part1(): unknown;
  abstract part2(): unknown;

  run(): void {
    console.log(`${this.constructor.name}:\n`);
    console.log(`\tPart 1: ${this.part1()}`);
    console.log(`\tPart 2: ${this.part2()}`);
  }

  get input(): string {
    return Deno.readTextFileSync(
      `src/inputs/${this.constructor.name.toLowerCase()}.txt`
    );
  }
}
