#!/bin/bash

# cd $FLEX_PROJ_ROOT/bin;

if [[ ${FLEX_MODE} = 'development' ]]
then
  echo dev
else
  echo prod
fi
