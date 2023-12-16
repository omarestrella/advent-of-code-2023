import { difference } from "../utils/set.ts";
import { Day } from "./base.ts";

const cards = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];

type PokerHand =
  | "five-kind"
  | "four-kind"
  | "full-house"
  | "three-kind"
  | "two-pair"
  | "pair"
  | "high-card";

const handOrder: PokerHand[] = [
  "high-card",
  "pair",
  "two-pair",
  "three-kind",
  "full-house",
  "four-kind",
  "five-kind",
];

function pokerHand(hand: string): PokerHand {
  const values = hand
    .split("")
    .sort((a, b) => cards.indexOf(a) - cards.indexOf(b))
    .map((c) => cards.indexOf(c));
  const uniqueValues = new Set(values);
  const cardCounts = values.map((v) => values.filter((x) => x === v).length);
  const maxCount = Math.max(...cardCounts);

  if (uniqueValues.size === 1) {
    return "five-kind";
  } else if (uniqueValues.size === 2) {
    if (maxCount === 4) {
      return "four-kind";
    }
    return "full-house";
  } else if (uniqueValues.size === 3) {
    if (maxCount === 3) {
      return "three-kind";
    }
    return "two-pair";
  } else if (uniqueValues.size === 4) {
    return "pair";
  }
  return "high-card";
}

function compareHands(a: number[], b: number[]) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] < b[i]) {
      return -1;
    } else if (a[i] > b[i]) {
      return 1;
    }
  }
  return 0;
}

export class Day7 extends Day {
  part1() {
    const lines = this.input.split("\n").map((line) => line.trim());
    const hands = lines.map((line) => {
      const [hand, bet] = line.split(" ");
      return [hand, parseInt(bet)];
    }) as [string, number][];

    // const groupedResults = hands
    //   .map(([hand, bet]) => {
    //     return {
    //       hand: pokerHand(hand),
    //       bet,
    //       originalHand: hand,
    //       values: hand.split("").map((c) => cards.indexOf(c)),
    //     };
    //   })
    //   .reduce((acc, hand) => {
    //     if (!acc[hand.hand]) {
    //       acc[hand.hand] = [];
    //     }
    //     acc[hand.hand].push(hand);
    //     return acc;
    //   }, {} as Record<PokerHand, { hand: string; bet: number; values: number[] }[]>);

    // const rankedBets = handOrder
    //   .filter((h) => h in groupedResults)
    //   .flatMap((hand) => {
    //     const sorted = groupedResults[hand]
    //       .sort((a, b) => {
    //         return compareHands(a.values, b.values);
    //       })
    //       .map((r) => r.bet);

    //     return sorted;
    //   });

    // return rankedBets.reduce((acc, bet, idx) => acc + bet * (idx + 1), 0);
  }

  part2() {
    return 1;
  }

  // get input(): string {
  //   // return `32T3K 765
  //   // T55J5 684
  //   // KK677 28
  //   // KTJJT 220
  //   // QQQJA 483`;
  //   return `2345A 1
  //   Q2KJJ 13
  //   Q2Q2Q 19
  //   T3T3J 17
  //   T3Q33 11
  //   2345J 3
  //   J345A 2
  //   32T3K 5
  //   T55J5 29
  //   KK677 7
  //   KTJJT 34
  //   QQQJA 31
  //   JJJJJ 37
  //   JAAAA 43
  //   AAAAJ 59
  //   AAAAA 61
  //   2AAAA 23
  //   2JJJJ 53
  //   JJJJ2 41`;
  // }
}
