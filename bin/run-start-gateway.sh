#!/bin/bash

if [[ ${FLEX_MODE} = 'development' ]]; then

  echo "//////////////////////// Running development start ////////////////////////";

  if [[ ${FLEX_GATEWAY_BUILD_STANDALONE} = 'false' ]]; then

  dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- next start ./ --port $FLEX_GATEWAY_PORT --hostname $FLEX_GATEWAY_HOSTNAME

  else

  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
  # # standalone
  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
  dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- \
    cross-env PORT=$FLEX_GATEWAY_PORT \
    cross-env HOSTNAME=$FLEX_GATEWAY_HOSTNAME \
    node .next/standalone/apps/gateway/server.js

  fi

else

  echo "//////////////////////// Running production start ////////////////////////";

  if [[ ${FLEX_GATEWAY_BUILD_STANDALONE} = 'false' ]]; then

  dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- next start ./ --port $FLEX_GATEWAY_PORT --hostname localhost

  else
  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
  # # standalone
  # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
  dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- \
    cross-env PORT=$FLEX_GATEWAY_PORT \
    cross-env HOSTNAME=localhost \
    node .next/standalone/apps/gateway/server.js

  fi

fi
