// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

var Protocol = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var fs = require('fs');

//var connectionString = "HostName=csy-iothub-krc-test.azure-devices.net;DeviceId=central01;SharedAccessKey=WmPGinWRakF3YnzR96LHdAUCXbWc+EBCV2nru5vBLtU=";//process.env.DEVICE_CONNECTION_STRING;
var connectionString = "HostName=KrCentralIoTHub.azure-devices.net;DeviceId=dev0011;SharedAccessKey=g+DpM8k/Eyl+ikhwFPQOQmKmczZsdZvSOPaxqI86r4c="; // "HostName=csy-iothub-krs-test.azure-devices.net;DeviceId=south01;SharedAccessKey=thBfn82IaUng1xFsaV7o/nG8ODO2+6Q2n1zA+uh1C0w=";
if (!connectionString) {
  console.log('Please set the DEVICE_CONNECTION_STRING environment variable.');
  process.exit(-1);
}

var client = Client.fromConnectionString(connectionString, Protocol);

function uploadFile() {
  var date = new Date().getTime();
  var filename = 'newfile' + date + '.txt';

  fs.writeFile(filename, '1234567890', function (err) {
    if (err) throw err;
    console.log("create file: " + filename);

    fs.stat(filename, function (err, fileStats) {
      if (err) {
        console.error('could not read file: ' + err.toString());
        process.exit(-1);
      } else {
        var fileStream = fs.createReadStream(filename);

        client.uploadToBlob(filename, fileStream, fileStats.size, function (err, result) {
          fileStream.destroy();
          if (err) {
            console.error('error uploading file: ' + err.constructor.name + ': ' + err.message);
          } else {
            console.log('Upload successful - ' + result);
          }
        });
      }
    });
  });
}

setInterval(uploadFile, 2000);