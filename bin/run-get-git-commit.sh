#!/bin/bash

# if [[ ! -z ${CI} ]]; then
#   if [[ ! -z ${CI_COMMIT_SHORT_SHA} ]]; then
#     GIT_COMMIT=${CI_COMMIT_SHORT_SHA}
#   elif [[ ! -z ${GIT_COMMIT_SHORT_SHA} ]]; then
#     GIT_COMMIT=${GIT_COMMIT_SHORT_SHA}
#   else
#     GIT_COMMIT=$(git ls-remote ${FLEX_REPO} --branches ${FLEX_BRANCH} | awk '{ print substr($1,1,8) }')
#   fi
# else
#   GIT_COMMIT=$(git rev-parse --short HEAD)
# fi

GIT_COMMIT=$(git ls-remote ${FLEX_REPO} --branches ${FLEX_BRANCH} | awk '{ print substr($1,1,8) }')

echo ${GIT_COMMIT}

# https://gist.github.com/dciccale/5560837
