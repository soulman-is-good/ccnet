"use strict";

var Class = require('./class'),
  EventEmitter = require('events').EventEmitter,
  commands = require('./commands'),
  POLYNOMIAL = 0x08408;

/**
 * CashCode NET Class
 * config includes
 * @param string device device address. e.g. /dev/ttyS0 or COM1
 * @param hex type device type as follows:
 * <ul>
 * <li>0x01 - Bill-to-Bill unit
 * <li>0x02 - Coin Exchanger
 * <li>0x03 - Bill Validator
 * <li>0x04 - Card Reader
 * </ul>
 * @class ccnet
 * @type @exp;Class@call;extend
 */
var ccnet = Class.extend({
  serialPort: null,
  opened: false,
  busy: false,
  name: null,
  type: null,
  commands: null,
  states: null,
  initialize: function (config) {
    if (!config.device) {
      throw new Error('No device defined');
    }
    if (commands[config.type] === false) {
      throw new Error('Not yet implemented');
    }
    if (!commands[config.type]) {
      throw new Error('Wrong peripheral address');
    }
    var SerialPort = require("serialport").SerialPort,
      self = this;
    this.serialPort = new SerialPort(config.device, {
      baudrate: 9600,
      stopbits: 1,
      databits: 8
    }, false);
    this.serialPort.on('error', function (err) {
      self.error(err);
    });
    this.serialPort.on('close', function () {
      self.opened = false;
      console.log("CLOSED");
    });
    this.serialPort.open(function () {
      console.log('OPENED');
      self.type = config.type;
      self.states = commands[config.type].states;
      self.commands = commands[config.type].commands;
      for (var command in self.commands) {
        (function (command) {
          self[command] = function (data, callback) {
            return self.execute.call(self, command, data, callback);
          };
        }(command));
      }
      self.opened = true;
      self.serialPort.on('data', function (data) {
        console.log(data);
      });
      self.emit('ready');
    });
  },
  execute: function (command, data, callback) {
    var self = this;
    this.busy = true;
    if ('function' === typeof data) {
      callback = data;
      data = [];
    } else {
      callback = this.normalizeCallback(callback);
    }
    if (!data) {
      data = [];
    }
    if (!(data instanceof Buffer)) {
      data = new Buffer(data);
    }
    command = new Buffer([self.commands[command.toLowerCase()]]);
    //TODO: data length > 255
    var length = data.length + 6;
    var packet = Buffer.concat([new Buffer([0x02, this.type, length]), command, data]);
    var crc = this.getCRC16(packet, true);
    packet = Buffer.concat(packet, crc);
    this.serialPort.write(packet, function (err) {
      if (err) {
        self.busy = false;
        callback(err);
      } else {
        self.serialPort.drain(function (err) {
          self.busy = false;
          callback(err);
        });
      }
    });
  },
  getCRC16: function (data, asBuffer) {
    asBuffer = asBuffer ? true : false;
    var CRC = 0, i, j, length = data.length;
    for (i = 0; i < length; i++) {
      CRC ^= data[i];
      for (j = 0; j < 8; j++) {
        CRC >>= 1;
        if (CRC & 0x0001) {
          CRC ^= POLYNOMIAL;
        }
      }
    }
    if (asBuffer) {
      var buf = new Buffer(2);
      buf.writeUInt16BE(CRC, 0);
      CRC = buf;
    }
    return CRC;
  },
  error: function (err) {
    this.opened = false;
    if (EventEmitter.listenerCount(this, 'error') > 0) {
      this.emit('error', err);
    } else {
      throw err;
    }
  }
});

ccnet.prototype.__proto__ = EventEmitter.prototype;

module.exports = ccnet;