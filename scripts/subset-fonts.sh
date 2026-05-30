#!/usr/bin/env bash
set -e

FONTS_DIR="src/app/fonts"
CONTENT_GLOB="src/content/*.ts src/app/**/*.tsx src/components/**/*.tsx src/app/*.tsx content/posts/*.mdx content/daily/*.mdx content/daily/*.md"

# Collect used characters
CHARS=$(cat $CONTENT_GLOB 2>/dev/null | python3 -c "
import sys, unicodedata
text = sys.stdin.read()
chars = set()
for c in text:
    if unicodedata.category(c) in ('Lo','Ll','Lu','Nd','Po','Sm','So','Pc','Pd','Pe','Ps','Pi','Pf'):
        chars.add(c)
for i in range(32, 127):
    chars.add(chr(i))
for c in '，。、：；！？「」『』【】《》〈〉—…·～\\'\\'""\u00a0':
    chars.add(c)
print(''.join(sorted(chars)))
")

CHARS_FILE=$(mktemp)
echo "$CHARS" > "$CHARS_FILE"

for WEIGHT in Regular Medium SemiBold Bold; do
  SRC="$FONTS_DIR/SourceHanSerifCN-${WEIGHT}.otf"
  OUT="$FONTS_DIR/SourceHanSerifCN-${WEIGHT}.woff2"
  if [ -f "$SRC" ]; then
    pyftsubset "$SRC" \
      --text-file="$CHARS_FILE" \
      --flavor=woff2 \
      --output-file="$OUT" \
      --layout-features="*" \
      --no-hinting
    echo "✓ ${WEIGHT}: $(du -sh "$OUT" | cut -f1)"
  else
    echo "⚠ skipped ${WEIGHT}: OTF source not found"
  fi
done

rm "$CHARS_FILE"
