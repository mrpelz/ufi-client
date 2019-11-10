#!/bin/bash

git add .
git commit --allow-empty --amend --no-edit
git push origin --force

npm run deploy
