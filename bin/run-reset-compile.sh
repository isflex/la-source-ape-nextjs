#!/bin/bash

cd $FLEX_PROJ_ROOT
pnpm exec rimraf -g '**/.turbo' -g '**/.webpack-cache' -g '**/.eslintcache'
# pnpm exec rimraf -g '**/prebuild'
# pnpm exec rimraf -g '**/bundle'
pnpm exec rimraf -g '**/dist' '!packages/flex/config/typed-scss-modules/dist'
# pnpm exec rimraf -g 'apps/**/dist'
pnpm exec rimraf -g '**/*.tsbuildinfo'
pnpm exec rimraf -g '**/build'
# pnpm exec rimraf -g '**/server-build'
pnpm exec rimraf -g '**/node_modules'
