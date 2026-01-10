#!/bin/bash
set -a
source "$(dirname "$0")/../.env"
set +a

curl -X POST https://api.pushover.net/1/messages.json \
  -d "token=$PUSHOVER_TOKEN" \
  -d "user=$PUSHOVER_USER" \
  -d "message=$1"
