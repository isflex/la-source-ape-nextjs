#!/bin/bash

run_local () {
  if [[ ${FLEX_GATEWAY_BUILD_STANDALONE} = 'false' ]]; then

  echo "//////////////////////// Running local gateway build ////////////////////////";
  dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- next build --webpack;

  else

  echo "//////////////////////// Running local gateway build standalone ////////////////////////";
  dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- next build --webpack && node ./copy-assets.mjs;

  fi
}

run_ci () {
  if [[ ${FLEX_GATEWAY_BUILD_STANDALONE} = 'false' ]]; then

  echo "//////////////////////// Running CI gateway build ////////////////////////";
  dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- next build --webpack;

  else

  echo "//////////////////////// Running CI gateway build standalone ////////////////////////";
  dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- next build --webpack && node ./copy-assets.mjs;

  fi
}

if [[ ! -v CI ]]; then
  run_local;
elif [[ -z "$CI" ]]; then
  run_local;
else
  run_ci;
fi
