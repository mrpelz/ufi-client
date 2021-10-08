#!/bin/bash

ssh root@ufi.mgmt.wurstsalat.cloud << EOF
  cd /opt/ufi-client/
  scripts/remote-pull.sh
EOF
