#!/bin/bash

if [[ ! -v ${CI} || ! -z ${CI} ]]
then
  echo "//////////////////////// Running local build ////////////////////////";
  export FLEX_INSTALL_PROD=true;
  yes | pnpm install --prod --frozen-lockfile;
else
  echo "//////////////////////// Running CI Build ////////////////////////";
  export FLEX_INSTALL_PROD=true;
  yes | pnpm install --prod --frozen-lockfile;
  # turbo run build --filter=!gateway{./apps/la-source/ape/gateway/build/standalone/**/*};
  # turbo run build --filter=!gateway;
  # turbo run build --dry-run --filter=!gateway;
fi
