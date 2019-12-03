// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

var Protocol = require('azure-iot-device-mqtt').Mqtt;
// Uncomment one of these transports and then change it in fromConnectionString to test other transports
// var Protocol = require('azure-iot-device-amqp').AmqpWs;
// var Protocol = require('azure-iot-device-http').Http;
// var Protocol = require('azure-iot-device-amqp').Amqp;
// var Protocol = require('azure-iot-device-mqtt').MqttWs;

var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;

// Parse args
var argv = require('yargs')
    .usage('Usage: $0 --connstr <DEVICE ID>')
    .option('connstr', {
        alias: 'd',
        describe: 'connection string for a device',
        type: 'string',
        demandOption: true
    })
    .argv;

// String containing Hostname, Device Id & Device Key in the following formats:
//  "HostName=<iothub_host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>"
var connectionString = argv.connstr;

console.log(connectionString);

// fromConnectionString must specify a transport constructor, coming from any transport package.
var client = Client.fromConnectionString(connectionString, Protocol);

var connectCallback = function (err) {
    if (err) {
        console.error('Could not connect: ' + err.message);
    } else {
        console.log('Client connected');

        // Create a message and send it to the IoT Hub every two seconds
        var sendInterval = setInterval(function () {
            var temperature = 20 + (Math.random() * 10); // range: [20, 30]
            var data = JSON.stringify({
                "mode": "control",
                "attr": {
                    "airInside": {
                        "temperature": temperature,
                        "humidity": 12,
                        "vocs": 1.1,
                        "co2": 23
                    },
                    "airGuide": "HCN11",
                    "iaqGuide": "IAQ01",
                    "batteryPercent": 95,
                }
            });

            var message = new Message(data);
            client.sendEvent(message);
        }, 1000);

        client.on('error', function (err) {
            console.error(err.message);
        });

        client.on('disconnect', function () {

            console.error("disconnected ... " + connectionString);
            clearInterval(sendInterval);
            client.removeAllListeners();
            client.open(connectCallback);
        });
    }
};

client.open(connectCallback);