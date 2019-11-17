#!/bin/bash

git pull --rebase

git submodule foreach git reset --hard HEAD
git submodule update
git submodule foreach "git checkout master; git pull"
git submodule foreach git clean -f

git apply patch-preact.diff > /dev/null 2>&1 || true
