#!/bin/bash

set -e

DYNAMODB_ENDPOINT=${DYNAMODB_ENDPOINT:-http://host.docker.internal:8000}
DYNAMODB_TABLE_NAME=${DYNAMODB_TABLE_NAME:-todos-local}

SCRIPT_DIR_FULL_PATH="$PWD/$(dirname $0)"

rm -rf dist cdk.out

npm run build:dev

npm run cdk:synth -- \
    --no-staging \
    --context awsEndpoint=$DYNAMODB_ENDPOINT \
              dynamoTableArn=arn:aws:dynamodb:us-east-1:123456789012:table/$DYNAMODB_TABLE_NAME \
              dynamoTableName=$DYNAMODB_TABLE_NAME

npm run build:dev:watch &
PIDS[0]=$!

DYNAMODB_TABLE_NAME=$DYNAMODB_TABLE_NAME DYNAMODB_ENDPOINT=$DYNAMODB_ENDPOINT docker-compose -f $SCRIPT_DIR_FULL_PATH/docker-compose.yml up &
PIDS[1]=$!

trap "kill ${PIDS[*]}" SIGINT

wait
