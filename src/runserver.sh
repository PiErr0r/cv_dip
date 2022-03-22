#!/bin/bash

PORT=8000;

if [ $# -eq 1 ]
  then
    $PORT=$1;
fi

python3 -m http.server $PORT
