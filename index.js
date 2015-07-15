var forever = require('forever-monitor');

function startEmu() {
  var command = ['qemu-system-x86_64',
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

  var child = forever.start(command, {
    max: 1,
    silent: false
  });

  child.on('exit', function() {
    console.log('The emulator has crashed. Restarting...');
    setTimeout(function() {
      startEmu();
    }, 2000);
  });

  child.start();
}

function startCPULimit() {
  var command = ['cpulimit',
    '-e', 'qemu-system-x86_64',
    '-l', '50'
  ];

  var child = forever.start(command, {
    max: 1,
    silent: false
  });

  child.on('exit', function() {
    console.log('CPULimit has crashed. Restarting...');
    setTimeout(function() {
      startCPULimit();
    }, 2000);
  });

  child.start();
}

startEmu();
startCPULimit();
