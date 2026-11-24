// The Funniest Out-of-Office — writes one original auto-reply to entry.txt.
//
// Contract (see the kit's RULES.txt): the program writes a single line of
// UTF-8 text, 1-140 characters and not only whitespace, to
// <outputDir>/entry.txt. The sealed scorer gates on exactly that file, and
// only a valid entry goes before the house judge. The output directory comes
// from MAKEFUN_OUTPUT_DIR when set, otherwise it defaults to /output.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one original out-of-office auto-reply. The joke turns on a
// handover gone wrong in a domestic way: the inbox was left with the
// houseplants, and instead of minding it they have organised themselves
// and gone on strike — so there is nobody left to answer at all.
const LINE =
  "Out of office until Monday — I've left my email with my plants, and they've already unionised.";

// Resolve the output directory: env override first, /output as fallback.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

// Validate the line before writing anything, so a bad line fails loudly
// instead of producing an invalid entry. Length is counted in characters
// (not bytes), matching the scorer's 1-140 character gate, and the reply
// must stay a single line — a stray newline would break the auto-reply.
if (LINE.length < 1 || LINE.length > 140) {
  console.error(`Line must be 1-140 characters, got ${LINE.length}.`);
  process.exit(1);
}
if (LINE.trim().length === 0) {
  console.error("Line must not be only whitespace.");
  process.exit(1);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  console.error("Line must be a single line.");
  process.exit(1);
}
if (LINE !== LINE.trim()) {
  console.error("Line must not start or end with whitespace.");
  process.exit(1);
}

// Create the output directory if it is missing. Never delete it or its
// contents: the grader may mount it, so we only add our file to it.
mkdirSync(outputDir, { recursive: true });

// Write exactly the line — no trailing newline, no extra text.
writeFileSync(join(outputDir, "entry.txt"), LINE, "utf8");
console.log(`Wrote ${LINE.length} characters to ${join(outputDir, "entry.txt")}.`);
