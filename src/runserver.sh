#!/bin/bash

## create imgs index file
rm -f imgs/index.txt;
touch imgs/index.txt;
for file in $(ls imgs); do printf '%s\n' "$file" >> 'imgs/index.txt'; done;

PORT=8000;

if [ $# -eq 1 ]
  then
    $PORT=$1;
fi

python3 -m http.server $PORT
