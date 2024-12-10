#!/bin/bash
ANSI_GREEN="\033[32;1m"
ANSI_RED="\033[31;1m"
ANSI_RESET="\033[0m"

retry_until() {
    [ $# -lt 3 ] && { usage; return 2; }
    local wait_for="$1"  # e.g., "30s"
    local max_times="$2"  # e.g., "3" (or "0" to have no limit)
    shift 2
    local result=0
    local count=1
    local str_of=''
    [ "$max_times" -gt 0 ] && str_of=" of $max_times"
    while [ "$count" -le "$max_times" ] || [ "$max_times" -le 0 ]; do
        [ "$result" -ne 0 ] && {
            echo -e "\n${ANSI_RED}The command '$*' failed. Retrying, #$count$str_of.${ANSI_RESET}\n" >&2
        }
        "$@" && {
            echo -e "\n${ANSI_GREEN}The command '$*' succeeded on attempt #$count.${ANSI_RESET}\n" >&2
            result=0
            break
        } || result=$?
        count=$((count + 1))
        sleep "$wait_for"
    done
    [ "$max_times" -gt 0 ] && [ "$count" -gt "$max_times" ] && {
        echo -e "\n${ANSI_RED}The command '$*' failed $max_times times.${ANSI_RESET}\n" >&2
    }
    return "$result"
}

# if [[ $1 == 'clean' ]]
# then
#     # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#     # rm -rf ./apps/la-source/ape/on-board/api/dist
#     # rm ./apps/la-source/ape/on-board/api/*.tsbuildinfo

#     # rm -rf ./apps/la-source/ape/on-board/common/dist
#     # rm ./apps/la-source/ape/on-board/common/*.tsbuildinfo

#     rm -rf ./packages/flex/config/aws/dist/esm
#     rm ./packages/flex/config/aws/dist/*.tsbuildinfo

#     # rm -rf ./packages/flex/domain-store/dist
#     # rm ./packages/flex/domain-store/*.tsbuildinfo

#     # rm -rf ./packages/flex/domain-lib-mobx-react-router/dist
#     # rm ./packages/flex/domain-lib-mobx-react-router/*.tsbuildinfo

#     # rm -rf ./packages/flex/design-system-react-ts/dist
#     # rm ./packages/flex/design-system-react-ts/*.tsbuildinfo
#     # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

#     # pnpm clean:all:tsc
# fi

retry_until 5s 5 pnpm compile:tsc:project:references
