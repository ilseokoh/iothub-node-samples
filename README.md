# iothub-node-samples
Azure IoT Hub Samples for node

## Sample code list

### DPS
 - update_enrollment_group.js : Get the group enrollment info from DPS and update symmetric key (Service)
 - register_symmkeygroup.js : provision device with group enrollment symm key (Device)

## Generate TwinChageEvent
 - twin_change.js : start a device with DPS provisioning and change device twin reported value periodically. 

Run and stop 100 devices
```bash
    ./run.sh 1 100
    ./stop.sh
```
