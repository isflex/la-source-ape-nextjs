#!/usr/bin/env bash

file=$1

# Prerequisite: java
# sudo apt-get update
# sudo apt-get install openjdk-11-jre-headless

GLYPHS_WHITELIST="\!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_\`abcdefghijklmnopqrstuvwxyz{|}«»çàèùâêîôûéäëïöüÀÈÙÂÊÎÔÛÉÄËÏÖÜœ’€  "

pnpm fontsubset -s "$GLYPHS_WHITELIST" $file $file
