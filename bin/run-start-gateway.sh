#!/bin/bash

if [[ ${FLEX_MODE} = 'development' ]]; then
  echo "//////////////////////// Running development start ////////////////////////";
  dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- next start ./ --port $FLEX_GATEWAY_PORT --hostname $FLEX_GATEWAY_HOSTNAME
else
  echo "//////////////////////// Running production start ////////////////////////";
  # dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- next start ./ --port $FLEX_GATEWAY_PORT --hostname $FLEX_GATEWAY_DEPLOYED_REMOTE_1_HOSTNAME
  # dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- next start ./ --port $FLEX_GATEWAY_PORT --hostname $FLEX_GATEWAY_DEPLOYED_REMOTE_2_HOSTNAME
  dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- next start ./ --port $FLEX_GATEWAY_PORT --hostname localhost
  # dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- node .next/standalone/apps/gateway/server.js
fi
