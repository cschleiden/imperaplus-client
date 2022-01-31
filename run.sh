#!/bin/sh

# Ugly work-around for broken Next.js public runtime config
grep -Irl "#{BaseUri}#" . | xargs sed -i "s~#{BaseUri}#~$BASE_URI~g"
node server.js