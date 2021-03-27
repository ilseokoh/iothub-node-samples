'use strict';

var provisioningServiceClient = require('azure-iot-provisioning-service').ProvisioningServiceClient;
const path = require('path');

var argv = require('yargs')
  .usage('Usage: $0 --registrationid <Registration ID> --symmkey --connectionstring <DEVICE PROVISIONING CONNECTION STRING> ')
  .option('registrationid', {
    alias: 'e',
    describe: 'Registration ID',
    type: 'string',
    demandOption: true
  })
  .option('symmkey', {
    alias: 's',
    describe: 'Symmetric Key',
    type: 'string',
    demandOption: true
  })
  .option('connectionstring', {
    alias: 'c',
    describe: 'The connection string for the Device Provisioning instance',
    type: 'string',
    demandOption: true
  })
  .argv;

var symmetricKey = argv.symmkey;
var regId = arg.registrationid;
var connectionString = argv.connectionString;
var serviceClient = provisioningServiceClient.fromConnectionString(connectionString);

var enrollment = {
  registrationId: regId,
  attestation: {
    type: 'symmetricKey',
    symmetricKey: {
        primaryKey: symmetricKey,
        secondaryKey: symmetricKey
    }
  }
};

serviceClient.createOrUpdateIndividualEnrollment(enrollment, function (err, enrollmentResponse) {
  if (err) {
    console.log('error creating the individual enrollment: ' + err);
  } else {
    console.log("enrollment record returned: " + JSON.stringify(enrollmentResponse, null, 2));
  }
});