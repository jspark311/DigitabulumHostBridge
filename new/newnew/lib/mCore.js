'use strict'

var SYNC_PACKET_DEF = new Buffer([0x04, 0x00, 0x00, 0x55], 'hex');

// template for DHB middle-man interaction
var inherits = require('util').inherits;
var ee = require('events').EventEmitter;
var uuid = require('node-uuid');

var merge = require('lodash.merge');
var receiver = require('./mCore/receiver.js');
var messageParser = require('./mCore/messageParser.js');
var mLegend = require('./mCore/messageLegend.js');
var mFlags = require('./mCore/messageFlags.js');
var messageAction = require('./mCore/messageAction.js');
var messageBuilder = require('./mCore/messageBuilder.js')

var types = require('./mCore/types.js');
var defs = require('./mCore/messageLegend.js');

// Config for mConnector to act on
var config = {
  name: 'MHB',
  version: '1.0.0',
  inputs: {
    'data': 'data'
  },
  outputs: { // these will be definitions in connector
    'ERROR': 'log'
      //etc
  },
  state: {
    'LED_1': 'number',
    'GLOVE_MODEL': 'string'
  }
};

// mEngine Factory function
function mCore() {
  ee.call(this);
  var that = this;
  this.config = config;
  this.parent = this; // freaky way of doing a chained assignment from session
  this.uuid = uuid.v4();

  this.receiver = new receiver();
  this.messageParser = new messageParser(mLegend, mFlags)
  this.buildBuffer = messageBuilder;

  this.defs = types;
  this.types = defs;

  this.outMsgQueue = [];

  // Emits OUT
  var fromEngine = function(type, data) {
    that.emit('fromEngine', type, data)
  }
  var fromCore = function(type, data) {
    that.emit('fromCore', type, data)
  }

  // Inputs from session
  var toEngine = function(type, data) {
    switch (type) {
      case 'send':
        // build new
        var built = that.buildBuffer(that.defs, that.types, data)
        if (built) {
          fromCore('data', built);
        } else {
          console.log('wut')
        }
        break;
      case 'sync':
        // Initiate a sync cycle. We notice the desync first.
        fromCore('data', SYNC_PACKET_DEF);
        break;
      case 'state':
        // do something
        break;
      default:
        that.mCore('log', "not a valid type")
        break;
    }
  }

  // Inputs from Transport
  var toCore = function(type, data) {
    switch (type) {
      case 'data':
        that.receiver.parser.write(data);
        break;
      default:
        that.fromEngine('log', "not a valid type")
        break;
    }
  }

  // input listeners
  this.on('toEngine', toEngine);
  this.on('toCore', toCore);
  this.on('doneParsing', fromEngine);

  this.receiver.parser.on('readable', function() {
    var jsonBuff;
    while (jsonBuff = that.receiver.parser.read()) {
      that.messageParser.parse(jsonBuff);
      messageAction(jsonBuff.messageId).bind(that)(jsonBuff);
    }
  });

};
inherits(mCore, ee);

mCore.prototype.getConfig = function() {
  return config;
}

module.exports = mCore;
