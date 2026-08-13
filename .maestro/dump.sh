#!/bin/bash
# Dump the current on-screen Maestro view hierarchy as flat text.
# Works around `maestro hierarchy` not existing in CLI 2.0.10 by running a
# deliberately-failing assertVisible and extracting `hierarchyRoot` from the
# debug artifacts.
set -euo pipefail
UDID="${UDID:-A28CF508-04E7-4B5C-A204-E6BCAE626C5E}"
DIR="$(cd "$(dirname "$0")" && pwd)"
BEFORE=$(ls -1d "$HOME"/.maestro/tests/*/ 2>/dev/null | wc -l)
~/.maestro/bin/maestro --device "$UDID" test "$DIR/_dump-hierarchy.yaml" >/dev/null 2>&1 || true
LATEST=$(ls -1dt "$HOME"/.maestro/tests/*/ | head -1)
python3 - "$LATEST" <<'PY'
import json, sys, glob, os
d = sys.argv[1]
f = glob.glob(os.path.join(d, "commands-*.json"))[0]
cmds = json.load(open(f))
root = None
for c in cmds:
    root = c.get("metadata", {}).get("error", {}).get("hierarchyRoot") or root
if root is None:
    print("NO HIERARCHY CAPTURED"); sys.exit(1)
def walk(n, depth=0):
    a = n.get("attributes", {})
    txt = a.get("accessibilityText") or a.get("text") or ""
    rid = a.get("resource-id", "")
    hint = a.get("hintText", "")
    b = a.get("bounds", "")
    parts = []
    if rid:  parts.append(f"id={rid!r}")
    if txt:  parts.append(f"text={txt!r}")
    if hint: parts.append(f"hint={hint!r}")
    parts.append(b)
    if a.get("checked") == "true": parts.append("CHECKED")
    if a.get("selected") == "true": parts.append("SELECTED")
    print("  " * depth + " ".join(parts))
    for ch in n.get("children", []):
        walk(ch, depth + 1)
walk(root)
PY
