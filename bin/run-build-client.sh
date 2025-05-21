#!/bin/bash

if [[ ! -z ${CI} ]]
then
  turbo run build;
else
  turbo run build;
  # turbo run build --filter=!gateway{./apps/la-source/ape/gateway/build/standalone/**/*};
  # turbo run build --filter=!gateway;
  # turbo run build --dry-run --filter=!gateway;
fi
