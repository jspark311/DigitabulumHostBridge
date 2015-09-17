'use strict'
var inherits = require('util').inherits;
var ee = require('events').EventEmitter;

var inspect = require('util').inspect;

var _cloneDeep = require('lodash.clonedeep');
var _has = require('lodash.has');
var _merge = require('lodash.merge');
var _defaultsDeep = require('lodash.defaultsdeep');

// Global default MHB and engine list;
var MHB = require('./mCore.js');

/** This is an array of possible Engines that might connect to a session. */
var engines = [];

/** This is the default config for an mSession. */
var config = {
  state: {},
  input: {},
  output: {}
};

/**
 * A generated session object constructor
 *
 * @class
 * @param  {object} transport An instantiated mTransport
 * @param  {object} core      An instantiated mCore
 */
function session(transport, core) {
  ee.call(this);
  this.config = {};

  this.transport = transport;

  if (core === undefined) {
    this.core = new MHB();
  } else {
    this.core = core;
  }
  // initial assignment
  this.engine = this.core;

  this.uuid = this.core.uuid; // We inherit core's UUID.

  var that = this;

  // sender emits... logic shouldn't go here
  var toCore = function(type, data) {
    that.core.emit('toCore', type, data)
  }
  var toEngine = function(type, data) {
    that.engine.emit('toEngine', type, data);
  }
  var toTransport = function(type, data) {
    that.transport.emit('toTransport', type, data);
  }

  // notice the origin....
  var toClient = function(origin, type, data) {
    that.emit('toClient', origin, type, data);
  }

  // input logic
  // default cast for ALL unknown types is to emit to the client.  This allows
  // us to debug
  var fromCore = function(type, data) {
    switch (type) {
      case 'data':
        toTransport('data', data);
        break;
      case 'log': // passthrough
      default:
        toClient('core', type, data);
    }
  }

  var fromEngine = function(type, data) {
    switch (type) {
      case 'client':
        if (data.message === 'SELF_DESCRIBE') {
          swapEngine(data.args[0], data.args[1]) // ?? Need to inspect JSONbuff
        }
        //toClient('engine', type, data)
        break;
      case 'transport':
        toTransport('connected', false);
        break;
      case 'config':
        if (_has(that.config, 'engine')) {
          _defaultsDeep(that.config['engine'], _cloneDeep(data));
        } else {
          that.config['engine'] = _cloneDeep(data);
        }
        break;
      case 'log': // passthrough
      default:
        toClient('engine', type, data);
        break;
    }
    if (_has(that.config, ['engine', 'outputs', type, 'state']) && data !==
      undefined) {
      that.config.engine.state[that.config.engine.outputs[type].state].value =
        data;
    } else {
      // didn't find a state to update...
    }
  }

  var fromTransport = function(type, data) {
    switch (type) {
      case 'data':
        toCore('data', data)
        break;
      case 'connected':
        toClient('transport', 'log', ['Connection change: ' + data, 4]);
        toCore('connected', data);
        break;
      case 'config':
        if (_has(that.config, 'transport')) {
          _defaultsDeep(that.config['transport'], _cloneDeep(data));
        } else {
          that.config['transport'] = _cloneDeep(data);
        }
        break;
      case 'log': // passthrough
      default:
        toClient('transport', type, data)
        break;
    }
    // updates the state value based on the "outputs" definition.
    if (_has(that.config, ['transport', 'outputs', type, 'state']) && data !==
      undefined) {
      that.config.transport.state[that.config.transport.outputs[type].state].value =
        data;
    } else {
      // didn't find a state to update...
    }
  }

  // this is essentially our inbound API. May want to expand this a bit?
  // For example: add some custom types that translate in to others
  // IE: emit('macro', 'sendBufferDataToDevice', whatever)
  // result: toCore('data', whatever)
  // Current approach assumes client knows about dest and type architecture.
  var fromClient = function(destination, type, data) {
    switch (destination) {
      case 'session':
        switch (type) {
          case 'setClientConfig':
            that.config['client'] = _cloneDeep(data);
            break;
          case 'getLiveConfig':
            // passes the config object by REFERENCE.  Client should NOT
            // manipulate this (only issue actions)
            toClient('session', 'config', that.config);
            break;
          case 'assign':
            // The client is assigning an engine ahead of connection.
            if (data && data.length >= 2) {
              swapEngine(data[0], data[1]);

            } else {
              toClient('session', 'log', ['Need a name and a version.', 2]);
            }
            break;
          case 'connect':
            toTransport(type, data);
            break;
          case 'scan':
            toTransport('scan', data);
            break;
          default:
            // log?
        }
        break;

        // TODO: We might phase these out as our debugging needs diminish.
      case 'transport':
        toTransport(type, data);
        break;
      case 'engine':
        toEngine(type, data);
        break;
      default:
        toClient('session', 'log', ['Unknown emit destination: ' +
          destination + " | " + type, 2
        ]);
    }
  };


  // special case functions

  var swapEngine = function(name, version) {
    var engineConfig;
    for (var i = 0; i < engines.length; i++) {
      engineConfig = engines[i].config;
      if (name === engineConfig['describe']['identity']) {
        that.engine.removeListener('fromEngine', fromEngine);
        that.engine = new engines[i].init(that.engine)
        that.engine.on('fromEngine', fromEngine);
        toClient('session', 'log', ['Found and attached engine for "' + name + '"', 4]);
        // double check this later...
        toEngine('config');
        break;
      }
    }
    toClient('session', 'log', ['No version found in self-describe.', 2])
  };

  // instantiates local config, passes in the session config and requests
  // other configs
  this.config['session'] = _cloneDeep(config);

  // CONNECTED LISTENERS

  //fromCore is ALWAYS the initial listener...
  this.core.on('fromCore', fromCore);
  this.transport.on('fromTransport', fromTransport);
  this.on('fromClient', fromClient);

  // needs to be removed and reset to the new Engine when changing...
  this.engine.on('fromEngine', fromEngine);

  // instantiation emits (AFTER LISTENERS!!!)
  toEngine('config');
  toTransport('config');
}


inherits(session, ee);

/**
 * Return a UUID identifying the session.
 * The core is what actually represents the state of the session, and thus
 *   it is the source of the unique identifier.
 *
 * @return {string} The UUID for this session.
 */
session.prototype.getUUID = function() {
  return this.core.uuid;
}


// EXPOSED SESSION FACTORY

/**
 * Constructor information for mSession
 *
 * @class {object} This is the empty generator class
 */
function mSession() {
  this.core = MHB;
}

/**
 * Adds an "mEngine" to the engine search array
 *
 * @param  {function} engine This requires an UNINSTANTIATED mEngine function
 */
mSession.prototype.addEngine = function(engine) {
  engines.push(engine);
}

/**
 * Replaces the MHB default core (not reccomended)
 *
 * @param  {object} core This requires an INSTANTIATED mCore
 */
mSession.prototype.replaceCore = function(core) {
  this.core = core;
  this.uuid = this.core.uuid;
}

/**
 * This returns a new session object with the given transport
 *
 * @param  {object} transport Requires a "new-ed" mTransport
 * @return {object} Returns an "newed" session object
 */
mSession.prototype.init = function(transport) {
  return new session(transport);
}


module.exports = mSession;