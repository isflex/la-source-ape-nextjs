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
  # Amplify Standard build container is 8GiB total. Cap the Next build's V8 heap
  # below the container so GC keeps RSS down and there is headroom for the
  # processes the build forks (sass-embedded child, static-gen workers).
  # Without this the heap cap equals the whole container and forks fail with
  # SIGKILL / spawn ENOMEM. CI-only; local keeps the inherited 8192.
  export NODE_OPTIONS="--max-old-space-size=6144"

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
