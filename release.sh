#!/bin/sh

# Exit on error
set -e

# use DEBUG=echo
export DEBUG=${DEBUG:-""}

export SERVER=${SERVER:-"hub.ncsa.illinois.edu"}

PKG_VERSION=$(cat package.json | grep \"version\" | head -1 | awk -F= "{ print $2 }" | sed 's/[version:,",]//g' | tr -d '[[:space:]]')

# Find out what branch we are on
BRANCH=${BRANCH:-"$(git rev-parse --abbrev-ref HEAD)"}

# Use package version as tag for master & develop
if [ "$BRANCH" = "master" ]; then
	echo "Detected version ${PKG_VERSION}"
	VERSIONS=""
	OLDVERSION=""
	TMPVERSION=$PKG_VERSION
	while [ "$OLDVERSION" != "$TMPVERSION" ]; do
		VERSIONS="${VERSIONS} ${TMPVERSION}"
		OLDVERSION="${TMPVERSION}"
		TMPVERSION=$(echo ${OLDVERSION} | sed 's/\.[0-9]*$//')
	done

	TAG=$VERSIONS
elif [ "${BRANCH}" = "develop" ]; then
    TAG="develop"
else
		# In the future should we allow pushes from branches?
		echo "Pushing from a branch that is not master or develop is not allowed"
		exit 0
fi

# Push image to docker hub
$DEBUG docker login $SERVER

for v in ${TAG}; do
	if [ "$SERVER" != "" ]; then
		${DEBUG} docker tag farmdoc/covercrop-frontend ${SERVER}/farmdoc/covercrop-frontend:${v}
		${DEBUG} docker push ${SERVER}/farmdoc/covercrop-frontend:${v}
	fi
done
