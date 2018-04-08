#!/bin/sh

# set -eu
#
# if [ "${1-}" = "shell" ]; then
#   shift
#   exec /bin/sh "$@"
# else
#   exec /picolo/cockroach "$@"
# fi

echo enode rpc is $enoderpc
node run.js $enoderpc

#./cockroach start --insecure

tail -f /dev/null
