#!/bin/bash

git add .
git commit --allow-empty --amend --no-edit
git push -u origin master --force
git push -u github master --force

npm run deploy
