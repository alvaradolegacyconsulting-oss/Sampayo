import { writeFileSync } from "node:fs";
import { content } from "../content";
import { reviewNotes } from "../content/review-notes";
import { reviewDoc } from "../lib/review";

// npm run review: rewrites docs/REVIEW.md, the page Omar marks up. Run it after any text change.
writeFileSync(new URL("../docs/REVIEW.md", import.meta.url), reviewDoc(content, reviewNotes));
console.log("Wrote docs/REVIEW.md");
