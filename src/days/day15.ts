import { Day } from "./base.ts";

function hash(str: string) {
  return str.split("").reduce((sum, char) => {
    sum = ((sum + char.charCodeAt(0)) * 17) % 256;
    return sum;
  }, 0);
}

export class Day15 extends Day {
  part1() {
    const hashes = this.input.split(",").map((s) => hash(s));
    return hashes.reduce((a, b) => a + b, 0);
  }

  part2() {
    const data = this.input.split(",").map((s) => {
      const reg = /(?<label>\w+)(?<operation>-|=)(?<focal>\d+)?/g;
      const groups = reg.exec(s)!.groups!;
      return {
        label: groups.label,
        box: hash(groups.label),
        operation: groups.operation,
        focalLength: groups.focal ? parseInt(groups.focal) : null,
      };
    });

    const boxes: { label: string; focalLength: number }[][] = new Array(256)
      .fill(null)
      .map(() => []);

    data.forEach((d) => {
      switch (d.operation) {
        case "-":
          boxes[d.box] = boxes[d.box].filter((b) => b.label !== d.label);
          break;
        case "=": {
          const index = boxes[d.box].findIndex((b) => b.label === d.label);
          if (index === -1) {
            boxes[d.box].push({ label: d.label, focalLength: d.focalLength! });
          } else {
            boxes[d.box][index].focalLength = d.focalLength!;
          }
          break;
        }
      }
    });

    const powers = boxes.flatMap((box, boxIdx) => {
      return box.map((d, idx) => {
        return (boxIdx + 1) * (idx + 1) * d.focalLength;
      });
    });

    return powers.reduce((a, b) => a + b, 0);
  }

  get testInput() {
    return `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;
  }
}
