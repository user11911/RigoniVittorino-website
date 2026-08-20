#!/usr/bin/env bash
# Chromium (via Playwright) fails to launch in this sandbox out of the box —
# libnspr4.so, libnss3.so, and libasound2 are missing, and there's no
# passwordless sudo to `apt-get install` them system-wide. `apt-get download`
# works without root though (it just fetches the .deb into the cwd), so this
# extracts the needed shared libraries into a local directory and prints the
# LD_LIBRARY_PATH export needed to use them — no system changes, no root.
#
# Usage: source this script (so the export reaches your shell), or run it and
# copy the export line into whatever command actually launches Chromium:
#   source scripts/enable-playwright-libs.sh
#   npx playwright test   # or any node script using playwright's chromium.launch()
#
# The extracted libs are NOT checked into the repo (this just downloads
# public Ubuntu packages on demand) — re-run this once per fresh sandbox/job,
# it takes a few seconds.
set -euo pipefail

LIBDIR="${PLAYWRIGHT_LIBFIX_DIR:-/tmp/playwright-libfix}"
LIBPATH="$LIBDIR/extracted/usr/lib/x86_64-linux-gnu"

if [ ! -f "$LIBPATH/libnspr4.so" ] || [ ! -f "$LIBPATH/libasound.so.2" ]; then
  mkdir -p "$LIBDIR"
  cd "$LIBDIR"
  apt-get download libnspr4 libnss3 libasound2t64 2>/dev/null || apt-get download libnspr4 libnss3 libasound2
  for f in *.deb; do dpkg -x "$f" extracted; done
  cd - > /dev/null
fi

export LD_LIBRARY_PATH="$LIBPATH:${LD_LIBRARY_PATH:-}"
echo "LD_LIBRARY_PATH set. To reuse in a subshell/script, run:" >&2
echo "  export LD_LIBRARY_PATH=\"$LIBPATH:\$LD_LIBRARY_PATH\"" >&2
