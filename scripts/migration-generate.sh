#!/bin/bash

source ./scripts/migration-base-paths.sh

read -r -p 'Migration name: ' migrationName && \
npm run build && \
npm run typeorm -- migration:generate \
-d "$migrationConfigPath" "$migrationBasePath""$migrationName"
