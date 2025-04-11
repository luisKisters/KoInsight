#!/bin/bash

set -e

# === Config ===
GHCR_USER="GeorgeSG"
REPO_NAME="KoInsight"
PACKAGE_DIRS=("apps/server" "apps/web" "packages/common")
IMAGE_NAME="ghcr.io/$GHCR_USER/$REPO_NAME"

# === Bump version using changesets or npm version ===
VERSION=$(npm version patch --no-git-tag-version)

# === Apply version to each package.json ===
for DIR in "${PACKAGE_DIRS[@]}"; do
  jq --arg v "$VERSION" '.version = $v' "$DIR/package.json" > "$DIR/package.tmp.json" && mv "$DIR/package.tmp.json" "$DIR/package.json"
done

# === Commit version bump ===
git add .
git commit -m "chore: release v$VERSION"

# === Tag and push ===
git tag "v$VERSION"
git push origin master
git push origin "v$VERSION"

# === Build Docker image ===
docker build -t "$IMAGE_NAME:$VERSION" -t "$IMAGE_NAME:latest" .

# === Push image to GHCR ===
docker push "$IMAGE_NAME:$VERSION"
docker push "$IMAGE_NAME:latest"

echo "✅ Released version $VERSION"
