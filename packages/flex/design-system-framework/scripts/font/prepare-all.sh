#!/usr/bin/env bash

cp scripts/src/*.ttf src/assets/fonts/

for filename in src/assets/fonts/opensans-*.ttf; do
  ./scripts/font/optimize.sh "$filename"
  ./scripts/font/convert "$filename"
done
