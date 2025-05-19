#!/bin/bash

# cd $FLEX_PROJ_ROOT/bin;

if [[ ${NAME} == 'DESKTOP-T9M49JD' ]]
then
  # echo 0
  echo NODE_TLS_REJECT_UNAUTHORIZED=0
elif [[ ! -z ${CI} ]]
then
  # echo 0
  echo NODE_TLS_REJECT_UNAUTHORIZED=0
else
  # echo 1
  echo NODE_TLS_REJECT_UNAUTHORIZED=1
fi
