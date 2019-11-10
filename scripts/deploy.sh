#!/bin/bash

ssh root@ufi.mom.net.wurstsalat.cloud << EOF
  cd /opt/ufi-client/
  scripts/remote-pull.sh
EOF
