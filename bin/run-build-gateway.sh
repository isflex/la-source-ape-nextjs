#!/bin/bash

run_local () {
  echo "//////////////////////// Running local start ////////////////////////";
  concurrently -k -n BUILD,HTTP -s first 'pnpm --filter=gateway buildGateway' 'pnpm start:client';
}

run_ci () {
  echo "//////////////////////// Running CI start ////////////////////////";
  concurrently -k -n BUILD,HTTP -s first 'pnpm --filter=gateway buildGateway' 'pnpm start:client';
}

if [[ ! -v CI ]]; then
  run_local;
elif [[ -z "$CI" ]]; then
  run_local;
else
  run_ci;
fi
