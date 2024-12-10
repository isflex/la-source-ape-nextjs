#!/bin/bash

# cd $FLEX_APP/bin;

source ~/.profile;
pnpm kill:all:ports;
pnpm start;
