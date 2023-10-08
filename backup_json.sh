#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
cp /home/chris/projects/weeks-in-hell/data/appState.json /home/chris/projects/weeks-in-hell/data/backup/appState_$TIMESTAMP.json
