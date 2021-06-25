#!/bin/sh

# exit on error, with error code
set -e

# use new docker build options
export DOCKER_BUILDKIT=1

# use DEBUG=echo ./release.sh to print all commands
export DEBUG=${DEBUG:-""}

export REACT_APP_ENV=${REACT_APP_ENV:-"development"}

${DEBUG} docker build --build-arg REACT_APP_ENV="${REACT_APP_ENV}" --progress=plain --tag farmdoc/covercrop-frontend .
