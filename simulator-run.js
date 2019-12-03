const lineReader = require('line-reader');
const { exec } = require('child_process');

// Parse args
var argv = require('yargs')
  .usage('Usage: $0 --ids <filename> --simulator <js filename>')
  .option('ids', {
    alias: 'f',
    describe: 'filename for list of ids',
    type: 'string',
    demandOption: true
  })
  .option('simulator', {
    alias: 's',
    describe: 'simulator js file',
    type: 'string',
    demandOption: true
  })
  .argv;

  var filename = argv.ids;
  var jsfilename = argv.simulator;

lineReader.eachLine(filename, function(line) {
    var cmd = "node " + jsfilename + " -d \"" + line + "\" &"
    console.log(cmd);

    // run a simulator with id 
    const myShellScript = exec(cmd, (err, stdout, stderr) => {
        if (err) {
          //some err occurred
          console.error(err)
        } else {
         // the *entire* stdout and stderr (buffered)
         console.log(`stdout: ${stdout}`);
         console.log(`stderr: ${stderr}`);
        }
      });
    
      myShellScript.stdout.on('data', (data)=>{
        console.log(data); 
        // do whatever you want here with data
    });
    myShellScript.stderr.on('data', (data)=>{
        console.error(data);
    });
});