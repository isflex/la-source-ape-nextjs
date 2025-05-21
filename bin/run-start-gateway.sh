#!/bin/bash

if [[ ${FLEX_MODE} = 'development' ]]; then
  echo "//////////////////////// Running development start ////////////////////////";
  dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- next start ./ --port $FLEX_GATEWAY_PORT --hostname $FLEX_GATEWAY_HOSTNAME
else
  echo "//////////////////////// Running production start ////////////////////////";
  dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- next start ./ --hostname $FLEX_GATEWAY_DEPLOYED_REMOTE_HOSTNAME

  # echo "//////////////////////// Running development start ////////////////////////";
  # dotenvx run -f $FLEX_PROJ_ROOT/env/public/.env.$FLEX_MODE -- next start ./ --port 3001 --hostname localhost
fi
