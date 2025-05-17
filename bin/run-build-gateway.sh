#!/bin/bash

if [[ ! -v ${CI} || ! -z ${CI} ]]
then
  echo "//////////////////////// Running local mode ////////////////////////";
  # turbo run turbo:build:gateway;
  concurrently -k -n BUILD,HTTP -s first 'pnpm --filter=gateway buildGateway' 'pnpm start:client';
else
  echo "//////////////////////// Running CI mode ////////////////////////";
  # turbo run turbo:build:gateway;
  concurrently -k -n BUILD,HTTP -s first 'pnpm --filter=gateway buildGateway' 'pnpm start:client';
fi
