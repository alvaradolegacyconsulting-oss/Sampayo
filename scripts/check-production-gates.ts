import { content } from "../content";
import { findStockPhotos, runGates } from "../lib/gates";

// Runs before every build (npm "prebuild") but only blocks production (VERCEL_ENV=production), so
// previews build with placeholders. `npm run gates` runs it anywhere to see what's left.
const force = process.argv.includes("--all");

if (force || process.env.VERCEL_ENV === "production") {
  const gates = runGates(content);
  for (const gate of gates) {
    if (gate.problems.length === 0) {
      console.log(`${gate.name}: PASS`);
      continue;
    }
    console.error(`${gate.name}: FAIL. Resolve these in content/ before production:`);
    for (const problem of gate.problems) console.error(`- ${problem}`);
    process.exitCode = 1;
  }

  // Not a gate: licensed stand-ins are allowed in production, but listed every run so they get replaced.
  const stock = findStockPhotos(content);
  console.log(stock.length === 0 ? "STOCK_IN_USE: none" : `STOCK_IN_USE (not blocking): ${stock.length} stock photo(s) standing in for real ones:`);
  for (const photo of stock) console.log(`- ${photo}`);
}
