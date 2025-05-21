#!/bin/bash

if [[ ! -z ${CI} ]]
then
  echo 'CI mode';
  cd $FLEX_APP/bin;
  pnpm config set prefer-frozen-lockfile true;
  pnpm config set auto-install-peers false;
  pnpm config set link-workspace-packages true;
  pnpm config set node-linker 'hoisted';
  pnpm config set enable-pre-post-scripts true;
  pnpm config set store-dir '.pnpm-store';
else
  echo 'local mode';
  cd $FLEX_PROJ_ROOT/bin;
  pnpm config set prefer-frozen-lockfile false;
  pnpm config set auto-install-peers true;
  pnpm config set link-workspace-packages true;
  # pnpm config set use-node-version 20.15.0;
fi

source ~/.profile;

echo "prefer-frozen-lockfile : $(pnpm config get prefer-frozen-lockfile)";
echo "auto-install-peers : $(pnpm config get auto-install-peers)";
echo "link-workspace-packages : $(pnpm config get link-workspace-packages)";
echo "node-linker : $(pnpm config get node-linker)";
echo "enable-pre-post-scripts : $(pnpm config get enable-pre-post-scripts)";
echo "store-dir : $(pnpm config get store-dir)";
