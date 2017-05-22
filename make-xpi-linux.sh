#!/bin/bash -ex
V=$(cat extension/manifest.json | grep '"version"' | grep -oP "\d+\.\d+\.\d+")
rm -f "the-onion-notifier-$V.xpi"
cd extension
zip -r "../the-onion-notifier-$V.xpi" . -x '*.git*' -x '*.DS_Store' -x '*Thumbs.db'
