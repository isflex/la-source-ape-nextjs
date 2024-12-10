#!/bin/bash

if [[ ! -z ${CI} ]]
then
  # turbo run turbo:build:gateway;
  concurrently -k -n BUILD,HTTP -s first 'pnpm --filter=gateway buildGateway' 'pnpm start:client';
else
  # turbo run turbo:build:gateway;
  concurrently -k -n BUILD,HTTP -s first 'pnpm --filter=gateway buildGateway' 'pnpm start:client';
fi
