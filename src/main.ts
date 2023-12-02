import { Number } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { Day } from "./days/base.ts";

await main();

async function main() {
  const day = await Number.prompt({
    message: "What day?",
  });

  try {
    const mod = await import(`./days/day${day}.ts`);
    const instance = new mod[`Day${day}`]();
    (instance as Day).run();
    await main();
  } catch {
    console.log("Day not implemented yet");
    await main();
  }
}
