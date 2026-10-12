#!/bin/zsh
# sync-demo.sh: inline the demo scripts into the pages (dev tool, not part of any demo fragment).
#
#   assets/js/bsd-demo.js  -> classes.html, forms.html, blocks.html
#                             between <!-- bsd-demo:start --> and <!-- bsd-demo:end -->
#   assets/js/demo-init.js -> index.html, 404.html
#                             between <!-- bw-demo:start --> and <!-- bw-demo:end -->
#
# Everything between a page's marker lines is replaced with <script>, the contents of its
# source file, and </script>.
# Idempotent: a page whose content would not change is not rewritten.
# Exits non-zero (and writes nothing) if a page lacks exactly one start and one end marker.
#
# Run from anywhere: zsh tools/sync-demo.sh
# Dependencies: zsh, awk, grep, cmp, mktemp (macOS defaults).

set -euo pipefail

root=${0:A:h:h}

# page  source  marker name
jobs=(
  classes.html assets/js/bsd-demo.js bsd-demo
  forms.html   assets/js/bsd-demo.js bsd-demo
  blocks.html  assets/js/bsd-demo.js bsd-demo
  index.html   assets/js/demo-init.js bw-demo
  404.html     assets/js/demo-init.js bw-demo
)

# Check every source and page before touching any of them
for page src name in $jobs; do
  if [[ ! -s $root/$src ]]; then
    print -u2 "sync-demo: missing or empty $root/$src"
    exit 1
  fi
  file=$root/$page
  if [[ ! -f $file ]]; then
    print -u2 "sync-demo: missing $file"
    exit 1
  fi
  start_marker="<!-- ${name}:start -->"
  end_marker="<!-- ${name}:end -->"
  starts=$(grep -cxF -- "$start_marker" $file || true)
  ends=$(grep -cxF -- "$end_marker" $file || true)
  if [[ $starts != 1 || $ends != 1 ]]; then
    print -u2 "sync-demo: $page needs exactly one '$start_marker' and one '$end_marker' line (found $starts and $ends)"
    exit 1
  fi
done

for page src name in $jobs; do
  file=$root/$page
  start_marker="<!-- ${name}:start -->"
  end_marker="<!-- ${name}:end -->"
  tmp=$(mktemp "$file.XXXXXX")
  # First file: the script source (kept line by line); second file: the page.
  # Exit status 2 means the end marker came before the start marker.
  if ! awk -v start="$start_marker" -v end="$end_marker" '
    FNR == NR { js[++n] = $0; next }
    $0 == start {
      print
      print "<script>"
      for (i = 1; i <= n; i++) print js[i]
      print "</script>"
      inside = 1
      next
    }
    $0 == end {
      if (!inside) exit 2
      inside = 0
    }
    !inside { print }
  ' $root/$src $file > $tmp; then
    rm -f $tmp
    print -u2 "sync-demo: $page has its end marker before its start marker"
    exit 1
  fi
  if cmp -s $tmp $file; then
    rm -f $tmp
    print "sync-demo: $page unchanged"
  else
    # Keep the page's permissions, then replace it
    chmod $(stat -f %Lp $file) $tmp
    mv $tmp $file
    print "sync-demo: $page updated"
  fi
done
