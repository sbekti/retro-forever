var spawn = require('child_process').spawn;

function startEmu() {
  var command = 'qemu-system-x86_64';
  var args = [
    '-m', '128',
    '-hda', process.env.EMU_DISK,
    '-net', 'nic,model=pcnet',
    '-net', 'user',
    '-cpu', 'pentium',
    '-boot', 'c',
    '-vnc', ':2',
    '-monitor', 'tcp:0.0.0.0:4444,server,nowait',
    '-usbdevice', 'tablet',
    '-snapshot'
  ];
  var options = {
    stdio: 'inherit'
  };

  var instance = spawn(command, args, options);
  instance.on('close', function(code) {
    console.log(new Date + ' - qemu closed with code: ' + code);
    setTimeout(function() {
      startEmu();
    }, 500);
  });
}

function startCPULimit() {
  var command = 'cpulimit';
  var args = [
    '-e', 'qemu-system-x86_64',
    '-l', '50'
  ];
  var options = {
    stdio: 'inherit'
  };

  var instance = spawn(command, args, options);
  instance.on('close', function(code) {
    console.log(new Date + ' - cpulimit closed with code: ' + code);
    setTimeout(function() {
      startCPULimit();
    }, 500);
  });
}

startEmu();
startCPULimit();
