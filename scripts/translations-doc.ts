import { writeFileSync } from "node:fs";
import { content } from "../content";
import { translationNotes } from "../content/translation-notes";
import { translationsDoc } from "../lib/texts";

// npm run translations: rewrites docs/TRANSLATIONS.md from content/.
writeFileSync(new URL("../docs/TRANSLATIONS.md", import.meta.url), translationsDoc(content, translationNotes));
console.log("Wrote docs/TRANSLATIONS.md");
