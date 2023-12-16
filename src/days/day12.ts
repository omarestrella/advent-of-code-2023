import { Day } from "./base.ts";

function calculateSprings(spring: string, rules: number[]) {
  const r = rules.map((n) => `#{${n}}`).join("\\.{1,}");
  const checker = new RegExp(r);

  function parse(spring: string, remainingRules = rules) {
    if (remainingRules.length === 0) {
      return spring;
    }

    const [rule, ...rest] = remainingRules;

    const match = spring.match(checker);
    if (!match) {
      spring = spring.replace(
        new RegExp(`\\?{${rule}}`),
        `${"#".repeat(rule)}.`
      );

      return parse(spring, rest);
    }

    return spring;
  }

  console.log(parse(spring));
}

export class Day12 extends Day {
  part1() {
    const lines = this.input.split("\n").map((s) => s.trim());
    const springData = lines.map((line) => {
      const [springStr, rulesStr] = line.split(" ");

      const rules = rulesStr.split(",").map((n) => parseInt(n));
      const spring = springStr;

      return {
        spring,
        rules,
      };
    });

    console.log(springData);

    console.log(calculateSprings(springData[1].spring, springData[1].rules));

    return 1;
  }
  part2() {
    return 1;
  }

  get input(): string {
    return `???.### 1,1,3
    .??..??...?##. 1,1,3
    ?#?#?#?#?#?#?#? 1,3,1,6
    ????.#...#... 4,1,1
    ????.######..#####. 1,6,5
    ?###???????? 3,2,1`;
  }
}
