#!/bin/bash

if [[ ${FLEX_MODE} = 'development' ]]; then
  echo "//////////////////////// Running development start ////////////////////////";

  dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- next start ./ --port $FLEX_GATEWAY_PORT --hostname $FLEX_GATEWAY_HOSTNAME

  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
  # # standalone
  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
  # dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- \
  #   cross-env PORT=$FLEX_GATEWAY_PORT \
  #   cross-env HOSTNAME=$FLEX_GATEWAY_HOSTNAME \
  #   node .next/standalone/apps/gateway/server.js
else
  echo "//////////////////////// Running production start ////////////////////////";

  dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- next start ./ --port $FLEX_GATEWAY_PORT --hostname localhost

  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
  # # standalone
  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
  # dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- \
  #   cross-env PORT=$FLEX_GATEWAY_PORT \
  #   cross-env HOSTNAME=localhost \
  #   node .next/standalone/apps/gateway/server.js
fi
