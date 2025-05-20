#!/bin/bash

run_local () {
  echo "//////////////////////// Running local production install ////////////////////////";
  # export FLEX_INSTALL_PROD=true;
  # yes | pnpm install --prod --frozen-lockfile;
  # pnpm prune --prod;
}

run_ci () {
  echo "//////////////////////// Running CI production install ////////////////////////";
  # https://stackoverflow.com/a/53359254 && https://stackoverflow.com/a/16595367 && https://github.com/pnpm/pnpm/issues/881
  find . -not \( -path ./apps/gateway/.amplify -prune \) -name 'node_modules' -type d -prune -print -exec rm -rf '{}' \;
  export FLEX_INSTALL_PROD=true;
  yes | pnpm install --prod --frozen-lockfile;
  pnpm prune --prod;
}

if [[ ! -v CI ]]; then
  run_local;
elif [[ -z "$CI" ]]; then
  run_local;
else
  run_ci;
fi
