/**
 * import(s)
 */

var expect = require('expect.js');
var format = require('util').format;
var spawn = require('child_process').spawn;
var msgpack = require('msgpack-js');
var amqp = require('amqplib/callback_api');
var hasBin = require('has-binary-data');
var parser = require('socket.io-parser');


/**
 * test(s)
 */

describe('socket.io-rabbitmq-server', function () {
  var emitter, client, server;

  function emit () {
    var args = Array.prototype.slice.call(arguments);
    var packet = {
      type: hasBin(args) ? parser.BINARY_EVENT : parser.EVENT,
      data: args,
      nsp: '/'
    };
    var key = new Buffer('socket.io-rabbitmq#emitter ', 'binary');
    var payload = msgpack.encode([packet, { rooms: {}, flags: {} }]);
    emitter.send(Buffer.concat([key, payload]));
  }

  function getOffset (msg) {
    var offset = 0;
    for (var i = 0; i < msg.length; i++) {
      if (msg[i] === 0x20) { // space
        offset = i;
        break;
      }
    }
    return offset;
  }


  before(function (done) {
    server = spawn('bin/socket.io-rabbitmq-server', [
      '--subaddress', '127.0.0.1',
      '--subport', '5672',
      '--pubaddress', '127.0.0.1',
      '--pubport', '5673'
    ]);
    done();
  });

  after(function (done) {
    server.kill();
    done();
  });


  it('should be run', function (done) {

    //TODO:

    // emit !!
    setInterval(function () {
      emit(args[0], args[1]);
    }, 10);
  });
});
