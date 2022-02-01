#!/bin/sh

if [ -n "$BASE_URI" ]; then
  # Ugly work-around for broken Next.js public runtime config
  grep -Irl "#{BaseUri}#" .next/ | xargs sed -i "s~#{BaseUri}#~$BASE_URI~g"
fi

node server.js