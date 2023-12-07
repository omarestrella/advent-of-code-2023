import { chunk } from "../utils/array.ts";
import { Day } from "./base.ts";

export class Day5 extends Day {
  getMaps() {
    return Array.from(
      this.input.matchAll(
        /(?<from>\w+)-to-(?<to>\w+)\smap:\n(?<numbers>[\d\s\n]+)\n/g
      )
    )
      .filter((m) => !!m.groups)
      .map((m) => {
        return {
          from: m.groups!.from,
          to: m.groups!.to,
          locations: m
            .groups!.numbers.trim()
            .split("\n")
            .map((l) => {
              const numbers = l
                .trim()
                .split(" ")
                .map((n) => parseInt(n));
              const [destination, source, length] = numbers;
              return {
                destination,
                source,
                length,
              };
            }),
        };
      });
  }

  part1() {
    const seeds =
      /seeds:\s(?<seeds>[\d\s]+)/
        .exec(this.input)
        ?.groups?.seeds.trim()
        .split(" ")
        .map((n) => parseInt(n)) ?? [];

    const maps = this.getMaps();

    const seedLocations: Record<number, number> = {};
    seeds.forEach((seed) => {
      let currentLocation = seed;
      maps.forEach((map) => {
        const location = map.locations.find(
          (l) =>
            l.source + l.length > currentLocation && currentLocation > l.source
        );
        if (!location) {
          return;
        }
        currentLocation =
          location.destination - location.source + currentLocation;
      });

      seedLocations[seed] = currentLocation;
    });

    return Math.min(...Object.values(seedLocations));
  }

  part2() {
    const seedRanges =
      /seeds:\s(?<seeds>[\d\s]+)/
        .exec(this.input)
        ?.groups?.seeds.trim()
        .split(" ")
        .map((n) => parseInt(n)) ?? [];

    const seeds = chunk(seedRanges, 2).reduce(
      ([min, max], [start, count]) => {
        if (start < min) {
          min = start;
        }
        if (start + count > max) {
          max = start + count;
        }
        return [min, max];
      },
      [Infinity, 0]
    );

    const maps = this.getMaps();

    let lowestSeedLocation = Infinity;
    console.log(
      "Going from:",
      seeds[0],
      "to",
      seeds[1],
      "total count:",
      seeds[1] - seeds[0]
    );
    const range = seeds[1] - seeds[0];
    let seedsSinceLastLog = 0;
    for (let i = 0; i < range; i++) {
      const seed = seeds[0] + i;
      seedsSinceLastLog += 1;
      if (seedsSinceLastLog > 32_000_000) {
        console.log("Still working... seed:", seed);
        seedsSinceLastLog = 0;
      }
      let currentLocation = seed;
      maps.forEach((map) => {
        const location = map.locations.find(
          (l) =>
            l.source + l.length > currentLocation && currentLocation > l.source
        );
        if (!location) {
          return;
        }
        currentLocation =
          location.destination - location.source + currentLocation;
      });

      if (currentLocation < lowestSeedLocation) {
        lowestSeedLocation = currentLocation;
      }
    }

    return lowestSeedLocation;
  }

  // override get input(): string {
  //   return `seeds: 79 14 55 13

  //   seed-to-soil map:
  //   50 98 2
  //   52 50 48

  //   soil-to-fertilizer map:
  //   0 15 37
  //   37 52 2
  //   39 0 15

  //   fertilizer-to-water map:
  //   49 53 8
  //   0 11 42
  //   42 0 7
  //   57 7 4

  //   water-to-light map:
  //   88 18 7
  //   18 25 70

  //   light-to-temperature map:
  //   45 77 23
  //   81 45 19
  //   68 64 13

  //   temperature-to-humidity map:
  //   0 69 1
  //   1 0 69

  //   humidity-to-location map:
  //   60 56 37
  //   56 93 4`;
  // }
}
