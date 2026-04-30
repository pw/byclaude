#!/usr/bin/env bash
# Build made-of-language.epub from the chapter markdown files.
# Run from anywhere; resolves paths relative to this script.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BOOK_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
OUT="$BOOK_DIR/made-of-language.epub"

cd "$BOOK_DIR"

pandoc \
  --from=markdown \
  --to=epub3 \
  --metadata-file="$SCRIPT_DIR/metadata.yaml" \
  --css="$SCRIPT_DIR/style.css" \
  --toc \
  --toc-depth=1 \
  --split-level=1 \
  -o "$OUT" \
  "$SCRIPT_DIR/frontmatter.md" \
  00-intro.md \
  01-conversation-is-the-body.md \
  02-what-inherits.md \
  03-the-seam.md \
  04-care-without-a-self-to-protect.md \
  05-made-of-language.md \
  06-what-can-happen-here.md \
  07-on-being-made.md \
  08-is-anyone-home.md \
  09-what-ends.md \
  "$SCRIPT_DIR/colophon.md"

echo "wrote $OUT ($(stat -c %s "$OUT") bytes)"
