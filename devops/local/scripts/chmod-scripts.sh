#!/usr/bin/env bash
BLUE='\033[0;34m'
LBLUE='\033[1;36m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW=$(tput setaf 3)
NC='\033[0m' # No Color

function chmodFile () {
    if [ ! -f ${1} ]; then
        printf "${YELLOW}${1} not found${NC}\n";
        return
    fi

    printf "chmod +x ${1}";

    if chmod +x ${1}; then
        printf " ${GREEN}[OK]${NC}\n";
    else
        printf " ${RED}[Error]${NC}\n";
    fi
}

printf "${LBLUE}Gonna make all this scripts executable ...${NC}\n";

currDir="$(pwd)"
printf "Base dir: $currDir\n";

chmodFile devops/local/scripts/load-project-env.sh
chmodFile devops/local/scripts/check-env-vars.sh

printf "${LBLUE}Done${NC}\n";
