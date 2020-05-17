#!/bin/bash

git pull --rebase

/bin/systemctl restart ufi.service
echo "restart done"
