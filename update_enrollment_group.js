// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

var uuid = require('uuid');

var provisioningServiceClient = require('azure-iot-provisioning-service').ProvisioningServiceClient;

var connectionString = "[Azure DPS connection string]";
var serviceClient = provisioningServiceClient.fromConnectionString(connectionString);

var primaryKey = new Buffer(uuid.v4()).toString('base64');
var secondaryKey = new Buffer(uuid.v4()).toString('base64');

console.log("p key: " + primaryKey);
console.log("s key: " + secondaryKey);

// var enrollment = {
//     "enrollmentGroupId": "node-simul-group",
//     "attestation": {
//         "type": "symmetricKey",
//         "symmetricKey": {
//                 "primaryKey": primaryKey, 
//                 "secondaryKey": secondaryKey
//             }
//     },
//     "initialTwin": {
//         "tags": {
//             "provision": "node-simul-group"
//         },
//         "properties": {
//             "desired": {
//                 "temp": 32
//             }
//         }
//     },
//     "etag": "IjAxMDA3ODIyLTAwMDAtMDAwMC0wMDAwLTVjYWIzNWI5MDAwMCI=",
//     "provisioningStatus": "enabled",
//     "reprovisionPolicy": {
//         "updateHubAssignment": true,
//         "migrateDeviceData": true
//     },
//     "createdDateTimeUtc": "2019-04-08T11:51:19.7912725Z",
//     "lastUpdatedDateTimeUtc": "2019-04-08T11:51:19.7912725Z",
//     "allocationPolicy": "static",
//     "iotHubs": [
//         "KrCentralIoTHub.azure-devices.net"
//     ]
// }

serviceClient.getEnrollmentGroup('node-simul-group', function (err, enrollment) { 
    if (err) { 
        console.log('error get the group enrollment: ' + err);
    } else { 
        console.log(JSON.stringify(enrollment));

        // set primary and secondary key
        enrollment.attestation.symmetricKey = {
            "primaryKey": primaryKey, 
            "secondaryKey": secondaryKey
        }

        serviceClient.createOrUpdateEnrollmentGroup(enrollment, function (err, enrollmentResponse) {
            if (err) {
              console.log('error creating the group enrollment: ' + err);
            } else {
              console.log("enrollment record returned: " + JSON.stringify(enrollmentResponse, null, 2));
            }
          });
    }
});