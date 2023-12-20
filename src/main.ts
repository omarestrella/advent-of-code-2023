import { Number } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { Day } from "./days/base.ts";

async function main() {
  const day = await Number.prompt({
    message: "What day?",
  });

  try {
    const mod = await import(`./days/day${day}.ts`);
    const instance = new mod[`Day${day}`]();
    await (instance as Day).run();
    await main();
  } catch (e) {
    console.log("Day not implemented yet", e);
    await main();
  }
}

if (Deno.args.length === 1) {
  const day = Deno.args[0];
  try {
    const mod = await import(`./days/day${day}.ts`);
    const instance = new mod[`Day${day}`]();
    await (instance as Day).run();
  } catch (e) {
    console.log("Day not implemented yet", e);
  }
} else {
  await main();
}
