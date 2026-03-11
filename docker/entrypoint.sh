#!/bin/sh
set -eu

NODE_USER=node
NODE_GROUP=node
TARGET_UID="${PUID:-1000}"
TARGET_GID="${PGID:-1000}"
DATA_DIR="${DATA_DIR:-/data}"

CURRENT_UID="$(id -u "$NODE_USER")"
CURRENT_GID="$(id -g "$NODE_USER")"

if [ "$CURRENT_GID" != "$TARGET_GID" ]; then
  groupmod -o -g "$TARGET_GID" "$NODE_GROUP"
fi

if [ "$CURRENT_UID" != "$TARGET_UID" ]; then
  usermod -o -u "$TARGET_UID" "$NODE_USER"
fi

mkdir -p "$DATA_DIR"
chown -R "$TARGET_UID:$TARGET_GID" "$DATA_DIR"

exec gosu "$TARGET_UID:$TARGET_GID" "$@"
