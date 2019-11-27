#!/bin/bash

for i in $(seq $1 $2)
do
    devid=simul-$i
    echo ${devid}
    node twin_change.js --registrationid ${devid} &
    sleep 3
done