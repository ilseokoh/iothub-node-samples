// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

var iotHubTransport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var crypto = require('crypto');
const uuidv4 = require('uuid/v4');


var ProvisioningTransport = require('azure-iot-provisioning-device-mqtt').Mqtt;
// Feel free to change to using any of the following if you would like to try another protocol.
// var ProvisioningTransport = require('azure-iot-provisioning-device-http').Http;
// var ProvisioningTransport = require('azure-iot-provisioning-device-amqp').Amqp;
// var ProvisioningTransport = require('azure-iot-provisioning-device-amqp').AmqpWs;
// var ProvisioningTransport = require('azure-iot-provisioning-device-mqtt').MqttWs;

var SymmetricKeySecurityClient = require('azure-iot-security-symmetric-key').SymmetricKeySecurityClient;
var ProvisioningDeviceClient = require('azure-iot-provisioning-device').ProvisioningDeviceClient;

//
// For the public clouds the address of the provisioning host would be: global.azure-devices-provisioning.net
//
var provisioningHost = "global.azure-devices-provisioning.net";

//
// You can find your idScope in the portal overview section for your dps instance.
//
var idScope = "0ne001CA0FC";

var symmetricKey = "NFmITMXCPGz3bshQy4ghyPd+aisfaqIuBhkpGYxcDDJda3HlpzfMlH3A+94YcYws+BP4rUcU/y+pukwPGve1jg==";

// Parse args
var argv = require('yargs')
  .usage('Usage: $0 --registrationid <DEVICE ID>')
  .option('registrationid', {
    alias: 'd',
    describe: 'provisioning registration id',
    type: 'string',
    demandOption: true
  })
  .argv;

  var registrationId = argv.registrationid;

function computeDerivedSymmetricKey(masterKey, regId) {
    return crypto.createHmac('SHA256', Buffer.from(masterKey, 'base64'))
        .update(regId, 'utf8')
        .digest('base64');
}
//var symmetricKey = computeDerivedSymmetricKey(symmetricKey, registrationId);

var provisioningSecurityClient = new SymmetricKeySecurityClient(registrationId, symmetricKey);

var provisioningClient = ProvisioningDeviceClient.create(provisioningHost, idScope, new ProvisioningTransport(), provisioningSecurityClient);
// Register the device.
provisioningClient.register(function (err, result) {
    if (err) {
        console.log("error registering device: " + err);
    } else {
        console.log('registration succeeded');
        console.log('assigned hub=' + result.assignedHub);
        console.log('deviceId=' + result.deviceId);
        var connectionString = 'HostName=' + result.assignedHub + ';DeviceId=' + result.deviceId + ';SharedAccessKey=' + symmetricKey;

        var hubClient = Client.fromConnectionString(connectionString, iotHubTransport);

        hubClient.open(function (err) {
            if (err) {
                console.error('Could not connect: ' + err.message);
            } else {
                console.log("Connected.");

                // Create device Twin
                // hubClient.getTwin(function (err, twin) {
                //     if (err) {
                //         console.error('could not get twin');
                //         process.exit(-1);
                //     } else {
                //         console.log('twin created');

                //         var patch = {
                //             correlationId: uuidv4(),
                //             firmwareVersion: 1,
                //             weather: {
                //                 temperature: 72,
                //                 humidity: 17
                //             }
                //         };

                //         const intervalObj = setInterval(() => {
                //             patch.correlationId = uuidv4();
                //             patch.firmwareVersion += 1;

                //             // send the patch
                //             twin.properties.reported.update(patch, function (err) {
                //                 if (err) {
                //                     console.log('twin error' + patch.firmwareVersion);
                //                 } else {
                //                     console.log('twin state reported' + patch.firmwareVersion + ", uuid " + patch.correlationId);
                //                 }
                //             });
                //         }, 1000);
                //     }
                // });
            }
        });
    }
});
