#!/usr/bin/env bash
BLUE='\033[0;34m'
LBLUE='\033[1;36m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW=$(tput setaf 3)
NC='\033[0m' # No Color

set -euo pipefail

printf "${LBLUE}Deploy to S3: start${NC}\n";

source ./devops/local/scripts/load-project-env.sh
./devops/local/scripts/check-env-vars.sh

printf "${LBLUE}Sync /dist to S3 ...${NC}\n";
aws s3 sync ./dist $S3_BUCKET --delete

printf "${LBLUE}Deploy to S3: completed${NC}\n";
