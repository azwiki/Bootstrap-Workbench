#!/bin/zsh
# sync-demo.sh: copy assets/js/bsd-demo.js into the demo pages (dev tool, not part of the
# #bs-demo fragment).
#
# In classes.html, forms.html and blocks.html, everything between the marker lines
#   <!-- bsd-demo:start -->
#   <!-- bsd-demo:end -->
# is replaced with <script>, the contents of assets/js/bsd-demo.js, and </script>.
# Idempotent: a page whose content would not change is not rewritten.
# Exits non-zero (and writes nothing) if a page lacks exactly one start and one end marker.
#
# Run from anywhere: zsh tools/sync-demo.sh
# Dependencies: zsh, awk, grep, cmp, mktemp (macOS defaults).

set -euo pipefail

root=${0:A:h:h}
src=$root/assets/js/bsd-demo.js
pages=(classes.html forms.html blocks.html)
start_marker='<!-- bsd-demo:start -->'
end_marker='<!-- bsd-demo:end -->'

if [[ ! -s $src ]]; then
  print -u2 "sync-demo: missing or empty $src"
  exit 1
fi

# Check every page before touching any of them
for page in $pages; do
  file=$root/$page
  if [[ ! -f $file ]]; then
    print -u2 "sync-demo: missing $file"
    exit 1
  fi
  starts=$(grep -cxF -- "$start_marker" $file || true)
  ends=$(grep -cxF -- "$end_marker" $file || true)
  if [[ $starts != 1 || $ends != 1 ]]; then
    print -u2 "sync-demo: $page needs exactly one '$start_marker' and one '$end_marker' line (found $starts and $ends)"
    exit 1
  fi
done

for page in $pages; do
  file=$root/$page
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
  ' $src $file > $tmp; then
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
