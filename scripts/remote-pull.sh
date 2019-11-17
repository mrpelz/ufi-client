#!/bin/bash

git pull --rebase
git submodule update
git apply patch-preact.diff
