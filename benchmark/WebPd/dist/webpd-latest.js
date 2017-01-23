/* Copyright 2013 Chris Wilson

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

/*

This monkeypatch library is intended to be included in projects that are
written to the proper AudioContext spec (instead of webkitAudioContext),
and that use the new naming and proper bits of the Web Audio API (e.g.
using BufferSourceNode.start() instead of BufferSourceNode.noteOn()), but may
have to run on systems that only support the deprecated bits.

This library should be harmless to include if the browser supports
unprefixed "AudioContext", and/or if it supports the new names.

The patches this library handles:
if window.AudioContext is unsupported, it will be aliased to webkitAudioContext().
if AudioBufferSourceNode.start() is unimplemented, it will be routed to noteOn() or
noteGrainOn(), depending on parameters.

The following aliases only take effect if the new names are not already in place:

AudioBufferSourceNode.stop() is aliased to noteOff()
AudioContext.createGain() is aliased to createGainNode()
AudioContext.createDelay() is aliased to createDelayNode()
AudioContext.createScriptProcessor() is aliased to createJavaScriptNode()
AudioContext.createPeriodicWave() is aliased to createWaveTable()
OscillatorNode.start() is aliased to noteOn()
OscillatorNode.stop() is aliased to noteOff()
OscillatorNode.setPeriodicWave() is aliased to setWaveTable()
AudioParam.setTargetAtTime() is aliased to setTargetValueAtTime()

This library does NOT patch the enumerated type changes, as it is
recommended in the specification that implementations support both integer
and string types for AudioPannerNode.panningModel, AudioPannerNode.distanceModel
BiquadFilterNode.type and OscillatorNode.type.

*/
(function (global, exports, perf) {
  'use strict';

  function fixSetTarget(param) {
    if (!param)	// if NYI, just return
      return;
    if (!param.setTargetAtTime)
      param.setTargetAtTime = param.setTargetValueAtTime;
  }

  if (window.hasOwnProperty('webkitAudioContext') &&
      !window.hasOwnProperty('AudioContext')) {
    window.AudioContext = webkitAudioContext;

    if (!AudioContext.prototype.hasOwnProperty('createGain'))
      AudioContext.prototype.createGain = AudioContext.prototype.createGainNode;
    if (!AudioContext.prototype.hasOwnProperty('createDelay'))
      AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode;
    if (!AudioContext.prototype.hasOwnProperty('createScriptProcessor'))
      AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode;
    if (!AudioContext.prototype.hasOwnProperty('createPeriodicWave'))
      AudioContext.prototype.createPeriodicWave = AudioContext.prototype.createWaveTable;


    AudioContext.prototype.internal_createGain = AudioContext.prototype.createGain;
    AudioContext.prototype.createGain = function() {
      var node = this.internal_createGain();
      fixSetTarget(node.gain);
      return node;
    };

    AudioContext.prototype.internal_createDelay = AudioContext.prototype.createDelay;
    AudioContext.prototype.createDelay = function(maxDelayTime) {
      var node = maxDelayTime ? this.internal_createDelay(maxDelayTime) : this.internal_createDelay();
      fixSetTarget(node.delayTime);
      return node;
    };

    AudioContext.prototype.internal_createBufferSource = AudioContext.prototype.createBufferSource;
    AudioContext.prototype.createBufferSource = function() {
      var node = this.internal_createBufferSource();
      if (!node.start) {
        node.start = function ( when, offset, duration ) {
          if ( offset || duration )
            this.noteGrainOn( when || 0, offset, duration );
          else
            this.noteOn( when || 0 );
        };
      } else {
        node.internal_start = node.start;
        node.start = function( when, offset, duration ) {
          if( typeof duration !== 'undefined' )
            node.internal_start( when || 0, offset, duration );
          else
            node.internal_start( when || 0, offset || 0 );
        };
      }
      if (!node.stop) {
        node.stop = function ( when ) {
          this.noteOff( when || 0 );
        };
      } else {
        node.internal_stop = node.stop;
        node.stop = function( when ) {
          node.internal_stop( when || 0 );
        };
      }
      fixSetTarget(node.playbackRate);
      return node;
    };

    AudioContext.prototype.internal_createDynamicsCompressor = AudioContext.prototype.createDynamicsCompressor;
    AudioContext.prototype.createDynamicsCompressor = function() {
      var node = this.internal_createDynamicsCompressor();
      fixSetTarget(node.threshold);
      fixSetTarget(node.knee);
      fixSetTarget(node.ratio);
      fixSetTarget(node.reduction);
      fixSetTarget(node.attack);
      fixSetTarget(node.release);
      return node;
    };

    AudioContext.prototype.internal_createBiquadFilter = AudioContext.prototype.createBiquadFilter;
    AudioContext.prototype.createBiquadFilter = function() {
      var node = this.internal_createBiquadFilter();
      fixSetTarget(node.frequency);
      fixSetTarget(node.detune);
      fixSetTarget(node.Q);
      fixSetTarget(node.gain);
      return node;
    };

    if (AudioContext.prototype.hasOwnProperty( 'createOscillator' )) {
      AudioContext.prototype.internal_createOscillator = AudioContext.prototype.createOscillator;
      AudioContext.prototype.createOscillator = function() {
        var node = this.internal_createOscillator();
        if (!node.start) {
          node.start = function ( when ) {
            this.noteOn( when || 0 );
          };
        } else {
          node.internal_start = node.start;
          node.start = function ( when ) {
            node.internal_start( when || 0);
          };
        }
        if (!node.stop) {
          node.stop = function ( when ) {
            this.noteOff( when || 0 );
          };
        } else {
          node.internal_stop = node.stop;
          node.stop = function( when ) {
            node.internal_stop( when || 0 );
          };
        }
        if (!node.setPeriodicWave)
          node.setPeriodicWave = node.setWaveTable;
        fixSetTarget(node.frequency);
        fixSetTarget(node.detune);
        return node;
      };
    }
  }

  if (window.hasOwnProperty('webkitOfflineAudioContext') &&
      !window.hasOwnProperty('OfflineAudioContext')) {
    window.OfflineAudioContext = webkitOfflineAudioContext;
  }

}(window));


(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * Copyright (c) 2011-2015 Chris McCormick, Sébastien Piquemal <sebpiq@gmail.com>
 *
 *  This file is part of WebPd. See https://github.com/sebpiq/WebPd for documentation
 *
 *  WebPd is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WebPd is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with WebPd.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

var _ = require('underscore')
  , pdfu = require('pd-fileutils.parser')
  , Patch = require('./lib/core/Patch')
  , Abstraction = require('./lib/core/Abstraction')
  , PdObject = require('./lib/core/PdObject')
  , mixins = require('./lib/core/mixins')
  , errors = require('./lib/core/errors')
  , portlets = require('./lib/waa/portlets')
  , waa = require('./lib/waa/interfaces')
  , pdGlob = require('./lib/global')
  , interfaces = require('./lib/core/interfaces')
  , patchIds = _.extend({}, mixins.UniqueIdsMixin)

// Various initializations
require('./lib/index').declareObjects(pdGlob.library)

var Pd = module.exports = {

  // Start dsp
  start: function(opts) {
    opts = opts || {}
    if (!pdGlob.isStarted) {

      if (typeof AudioContext !== 'undefined') {
        pdGlob.audio = opts.audio || new waa.Audio({
          channelCount : pdGlob.settings.channelCount,
          audioContext: opts.audioContext
        })
        pdGlob.clock = opts.clock || new waa.Clock({
          audioContext: pdGlob.audio.context,
          waaClock: opts.waaClock
        })

      // TODO : handle other environments better than like this
      } else {
        pdGlob.audio = opts.audio || interfaces.Audio
        pdGlob.clock = opts.clock || interfaces.Clock
      }

      if (opts.storage) pdGlob.storage = opts.storage
      else if (typeof window !== 'undefined')
        pdGlob.storage = new waa.Storage()
      else pdGlob.storage = interfaces.Storage


      pdGlob.audio.start()
      _.values(pdGlob.patches).forEach(function(patch) { patch.start() })
      pdGlob.isStarted = true
    }
  },

  // Stop dsp
  stop: function() {
    if (pdGlob.isStarted) {
      pdGlob.isStarted = false
      _.values(pdGlob.patches).forEach(function(patch) { patch.stop() })
      pdGlob.audio.stop()
    }
  },

  // Returns true if the dsp is started, false otherwise
  isStarted: function() { return pdGlob.isStarted },

  // Returns the audio engine
  getAudio: function() { return pdGlob.audio },

  // Send a message to a named receiver inside the graph
  send: function(name, args) {
    pdGlob.emitter.emit('msg:' + name, args)
  },

  // Receive a message from a named sender inside the graph
  receive: function(name, callback) {
    pdGlob.emitter.on('msg:' + name, callback)
  },

  // Registers the abstraction defined in `patchData` as `name`.
  // `patchData` can be a string (Pd file), or an object (pd.json)
  registerAbstraction: function(name, patchData) {
    if (_.isString(patchData)) patchData = pdfu.parse(patchData)
    var CustomObject = function(patch, id, args) {
      var patch = new Abstraction(patch, id, args)
      patch.patchId = patchIds._generateId()
      Pd._preparePatch(patch, patchData)
      return patch
    }
    CustomObject.prototype = Abstraction.prototype
    this.registerExternal(name, CustomObject)
  },

  // Register a custom object as `name`. `CustomObject` is a subclass of `core.PdObject`.
  registerExternal: function(name, CustomObject) {
    pdGlob.library[name] = CustomObject
  },

  // Create a new patch
  createPatch: function() {
    var patch = this._createPatch()
    if (pdGlob.isStarted) patch.start()
    return patch
  },

  // Stops and forgets a patch
  destroyPatch: function(patch) {
    patch.stop()
    patch.destroy()
    delete pdGlob.patches[patch.patchId]
  },

  // Loads a patch from a string (Pd file), or from an object (pd.json)
  loadPatch: function(patchData) {
    var patch = this._createPatch()
    if (_.isString(patchData)) patchData = this.parsePatch(patchData)
    this._preparePatch(patch, patchData)
    if (pdGlob.isStarted) patch.start()
    return patch
  },

  parsePatch: function(patchData) {
    if (_.isString(patchData)) patchData = pdfu.parse(patchData)
    return patchData
  },

  _createPatch: function() {
    var patch = new Patch()
    patch.patchId = patchIds._generateId()
    pdGlob.patches[patch.patchId] = patch
    return patch
  },

  // TODO: handling graph better? But ... what is graph :?
  _preparePatch: function(patch, patchData) {
    var createdObjs = {}
      , errorList = []

    // Creating nodes
    patchData.nodes.forEach(function(nodeData) {
      var proto = nodeData.proto
        , obj
      
      try {
        obj = patch._createObject(proto, nodeData.args || [])
      } catch (err) {
        if (err instanceof errors.UnknownObjectError) 
          return errorList.push([ err.message, err ])
        else throw err
      }

      if (obj.type == 'array' && nodeData.data)
        obj.setData(new Float32Array(nodeData.data), true)

      if (proto === 'pd' || proto === 'graph') 
        Pd._preparePatch(obj, nodeData.subpatch)
      createdObjs[nodeData.id] = obj
    })

    // Creating connections
    patchData.connections.forEach(function(conn) {
      var sourceObj = createdObjs[conn.source.id]
        , sinkObj = createdObjs[conn.sink.id]
      if (!sourceObj || !sinkObj) {
        var errMsg = 'invalid connection ' + conn.source.id 
          + '.* -> ' + conn.sink.id + '.*'
        return errorList.push([ errMsg, new Error(errMsg) ])
      }
      try {
        sourceObj.o(conn.source.port).connect(sinkObj.i(conn.sink.port))
      } catch (err) {
        if (err instanceof errors.InvalidPortletError) {
          var errMsg = 'invalid connection ' + conn.source.id + '.' + conn.source.port 
            + ' -> ' + conn.sink.id + '.' + conn.sink.port
          return errorList.push([ errMsg, err ])
        }
      }
    })

    // Binding patch data to the prepared patch
    patch.patchData = patchData

    // Handling errors
    if (errorList.length) throw new errors.PatchLoadError(errorList)
  },

  core: {
    PdObject: PdObject,
    portlets: portlets,
    errors: errors
  },

  // Exposing this mostly for testing
  _glob: pdGlob

}

if (typeof window !== 'undefined') window.Pd = Pd

},{"./lib/core/Abstraction":3,"./lib/core/Patch":5,"./lib/core/PdObject":6,"./lib/core/errors":7,"./lib/core/interfaces":8,"./lib/core/mixins":9,"./lib/global":12,"./lib/index":14,"./lib/waa/interfaces":16,"./lib/waa/portlets":17,"pd-fileutils.parser":20,"underscore":23}],2:[function(require,module,exports){
/*
 * Copyright (c) 2011-2015 Chris McCormick, Sébastien Piquemal <sebpiq@gmail.com>
 *
 *  This file is part of WebPd. See https://github.com/sebpiq/WebPd for documentation
 *
 *  WebPd is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WebPd is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with WebPd.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
var EventEmitter = require('events').EventEmitter
  , _ = require('underscore')
  , utils = require('./core/utils')
  , mixins = require('./core/mixins')
  , PdObject = require('./core/PdObject')
  , Patch = require('./core/Patch')
  , pdGlob = require('./global')
  , portlets = require('./waa/portlets')


exports.declareObjects = function(library) {

  var _BaseControl = PdObject.extend({

    inletDefs: [
      portlets.Inlet.extend({
        message: function(args) {
          this.obj._onMessageReceived(args)
        }
      })
    ],
    outletDefs: [portlets.Outlet],

    init: function(receiveName, sendName, pdInit, defaultValue, initialValue) {
      this._eventReceiver = new mixins.EventReceiver()

      // Assign initial value
      if (pdInit)
        this.value = initialValue
      else this.value = defaultValue

      if (receiveName && receiveName !== '-' && receiveName !== 'empty') {
        this.receiveName = receiveName
        // ! because the extend method instantiates the object for inheritance, 
        // we need this "if"
        if (this._onMessageReceived) {
          this._onMessageReceived = this._onMessageReceived.bind(this)
          this._eventReceiver.on(pdGlob.emitter, 'msg:' + this.receiveName, this._onMessageReceived)
        }
      }

      if (sendName && sendName !== '-' && sendName !== 'empty')
        this.sendName = sendName

      // !!! here we must test for patch because of extend which instantiates an object
      if (pdInit && this.patch) {
        var self = this
        this._onPatchStarted = function() { self._sendMessage([self.value]) }
        this._eventReceiver.on(this.patch, 'started', this._onPatchStarted)
      }
    },

    destroy: function() {
      this._eventReceiver.destroy()
    },

    _sendMessage: function(args) {
      this.o(0).message(args)
      if (this.sendName) 
        pdGlob.emitter.emit('msg:' + this.sendName, args)
    }

  })

  
  library['symbolatom'] = _BaseControl.extend({
    
    type: 'symbolatom',

    init: function(args) {
      var minValue = args[0] || undefined
        , maxValue = args[1] || undefined
        , receiveName = args[2]
        , sendName = args[3]
      _BaseControl.prototype.init.apply(this, [receiveName, sendName, 0, 'symbol', 0])
    },

    _onMessageReceived: function(args) {
      var value = args[0]
      if (value === 'bang' || _.isNumber(value) || value === 'symbol') {
        if (_.isNumber(value)) this.value = 'float'
        else if (value === 'symbol') this.value = args[1]
        this._sendMessage(utils.timeTag(['symbol', this.value], args))
      } else return console.error('invalid ' + value)
    }

  })


  var _BaseNumber = _BaseControl.extend({

    init: function(pdInit, receiveName, sendName, minValue, maxValue, initialValue) {
      this._limitInput = function(value) {
        if (_.isNumber(maxValue)) value = Math.min(value, maxValue)
        if (_.isNumber(minValue)) value = Math.max(value, minValue)
        return value
      }
      _BaseControl.prototype.init.apply(this, [receiveName, sendName, pdInit, 0, initialValue])
    },

    _onMessageReceived: function(args) {
      var value = args[0]
      if (value === 'bang' || _.isNumber(value)) {
        if (_.isNumber(value)) this.value = value
        this._sendMessage(utils.timeTag([this._limitInput(this.value)], args))
      } else return console.error('invalid ' + value)
    }

  })


  library['floatatom'] = _BaseNumber.extend({
    
    type: 'floatatom',

    init: function(args) {
      var minValue = args[0] || undefined
        , maxValue = args[1] || undefined
        , receiveName = args[2]
        , sendName = args[3]
      _BaseNumber.prototype.init.apply(this, [0, receiveName, sendName, minValue, maxValue, 0])
    }

  })


  library['nbx'] = _BaseNumber.extend({

    type: 'nbx',

    init: function(args) {
      var minValue = args[0] || undefined
        , maxValue = args[1] || undefined
        , pdInit = args[2] || 0
        , receiveName = args[3]
        , sendName = args[4]
        , initialValue = args[5] || 0
      _BaseNumber.prototype.init.apply(this, 
        [pdInit, receiveName, sendName, minValue, maxValue, initialValue])
    }

  })


  library['bng'] = _BaseControl.extend({

    type: 'bng',

    init: function(args) {
      var pdInit = args[0] || 0
        , receiveName = args[1]
        , sendName = args[2]
      _BaseControl.prototype.init.apply(this, [receiveName, sendName, pdInit, 'bang', 'bang'])
    },

    _onMessageReceived: function(args) {
      this._sendMessage(utils.timeTag(['bang'], args))
    }

  })


  library['tgl'] = _BaseControl.extend({

    type: 'tgl',

    init: function(args) {
      var pdInit = args[0] || 0
        , receiveName = args[1]
        , sendName = args[2]
        , initialValue = args[3] || 0
        , nonZeroValue = _.isNumber(args[4]) ? args[4] : 1
      _BaseControl.prototype.init.apply(this, [receiveName, sendName, pdInit, 0, initialValue])
      this.nonZeroValue = nonZeroValue
    },

    _onMessageReceived: function(args) {
      var value = args[0]
      if (value === 'bang') {
        if (this.value === 0) this.value = this.nonZeroValue
        else this.value = 0
        this._sendMessage(utils.timeTag([this.value], args))
      } else if (_.isNumber(value)) {
        if (value === 0) this.value = 0
        else this.value = this.nonZeroValue
        this._sendMessage(utils.timeTag([value], args))
      } else return console.error('invalid message received ' + args)
      
    }

  })


  var _BaseSlider = _BaseNumber.extend({

    init: function(args) {
      var minValue = args[0] || 0
        , maxValue = _.isNumber(args[1]) ? args[1] : 127
        , pdInit = args[2] || 0
        , receiveName = args[3]
        , sendName = args[4]
        , initialValue = args[5] || 0
      _BaseNumber.prototype.init.apply(this, 
        [pdInit, receiveName, sendName, minValue, maxValue, initialValue])
    }

  })

  library['hsl'] = _BaseSlider.extend({
    type: 'hsl'
  })


  library['vsl'] = _BaseSlider.extend({
    type: 'vsl'
  })


  var _BaseRadio = _BaseControl.extend({

    init: function(args) {
      var oldNew = args[0]
        , pdInit = args[1]
        , number = _.isNumber(args[2]) ? args[2] : 8
        , receiveName = args[3]
        , sendName = args[4]
        , initialValue = args[5] || 0
      this._limitInput = function(value) { return Math.floor(Math.min(Math.max(value, 0), number - 1)) }
      _BaseControl.prototype.init.apply(this, [receiveName, sendName, pdInit, 0, initialValue])
    },

    _onMessageReceived: function(args) {
      var value = args[0]
      if (value === 'bang' || _.isNumber(value)) {
        if (_.isNumber(value)) this.value = value
        this._sendMessage(utils.timeTag([this._limitInput(this.value)], args))
      } else return console.error('invalid ' + value)
    }

  })

  library['hradio'] = _BaseRadio.extend({
    type: 'hradio'
  })

  library['vradio'] = _BaseRadio.extend({
    type: 'vradio'
  })


  library['vu'] = _BaseControl.extend({

    init: function(args) {
      var receiveName = args[0]
      _BaseControl.prototype.init.apply(this, [receiveName, undefined, 0, 0, 0])
    },

    _onMessageReceived: function(args) {
      this._sendMessage(args)
    }

  })
}
},{"./core/Patch":5,"./core/PdObject":6,"./core/mixins":9,"./core/utils":11,"./global":12,"./waa/portlets":17,"events":18,"underscore":23}],3:[function(require,module,exports){
/*
 * Copyright (c) 2011-2015 Chris McCormick, Sébastien Piquemal <sebpiq@gmail.com>
 *
 *  This file is part of WebPd. See https://github.com/sebpiq/WebPd for documentation
 *
 *  WebPd is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WebPd is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with WebPd.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

var _ = require('underscore')
  , Patch = require('./Patch')

var Abstraction = module.exports = function(patch, id, args) {
  Patch.apply(this, arguments)
}

_.extend(Abstraction.prototype, Patch.prototype, {

  // An abstraction is always root, even if instantiated within another patch,
  // it needs its own id, and is completely encapsulated to its parent.
  getPatchRoot: function() {
    return this
  }

})
},{"./Patch":5,"underscore":23}],4:[function(require,module,exports){
/*
 * Copyright (c) 2011-2015 Chris McCormick, Sébastien Piquemal <sebpiq@gmail.com>
 *
 *  This file is part of WebPd. See https://github.com/sebpiq/WebPd for documentation
 *
 *  WebPd is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WebPd is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with WebPd.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

var _ = require('underscore')
  , inherits = require('util').inherits
  , errors = require('./errors')
  , portlets = require('./portlets')
  , utils = require('./utils')
  

// Base class for objects and patches. Example :
//
//     var node = new MyNode([arg1, arg2, arg3])
//
var BaseNode = module.exports = function(patch, id, args) {
  args = args || []
  var self = this
  this.id = id                      // A patch-wide unique id for the object
  this.patch = patch                // The patch containing that node

  // create inlets and outlets specified in the object's proto
  this.inlets = this.inletDefs.map(function(inletType, i) {
    return new inletType(self, i)
  })
  this.outlets = this.outletDefs.map(function(outletType, i) {
    return new outletType(self, i)
  })

  // initializes the object, handling the creation arguments
  this.init(args)
}


_.extend(BaseNode.prototype, {

/******************** Methods to implement *****************/

  // True if the node is an endpoint of the graph (e.g. [dac~])
  endPoint: false,

  // The node will process its arguments by automatically replacing
  // abbreviations such as 'f' or 'b', and replacing dollar-args
  doResolveArgs: false,

  // Lists of the class of portlets.
  outletDefs: [], 
  inletDefs: [],

  // This method is called when the object is created.
  init: function() {},

  // This method is called when dsp is started,
  // or when the object is added to a patch that is already started.
  start: function() {},

  // This method is called when dsp is stopped
  stop: function() {},

  // This method is called to clean the object, remove event handlers, etc ...
  // For example this is called when a patch is destroyed.
  destroy: function() {},

/************************* Public API **********************/

  // Returns inlet `id` if it exists.
  i: function(id) {
    if (id < this.inlets.length) return this.inlets[id]
    else throw (new errors.InvalidPortletError('invalid inlet ' + id))
  },

  // Returns outlet `id` if it exists.
  o: function(id) {
    if (id < this.outlets.length) return this.outlets[id]
    else throw (new errors.InvalidPortletError('invalid outlet ' + id))
  },


/********************** More Private API *********************/

  // Calls `start` on object's portlets
  startPortlets: function() {
    this.outlets.forEach(function(outlet) { outlet.start() })
    this.inlets.forEach(function(inlet) { inlet.start() })
  },

  // Call `stop` on object's portlets
  stopPortlets: function() {
    this.outlets.forEach(function(outlet) { outlet.stop() })
    this.inlets.forEach(function(inlet) { inlet.stop() })
  }

})


},{"./errors":7,"./portlets":10,"./utils":11,"underscore":23,"util":26}],5:[function(require,module,exports){
/*
 * Copyright (c) 2011-2015 Chris McCormick, Sébastien Piquemal <sebpiq@gmail.com>
 *
 *  This file is part of WebPd. See https://github.com/sebpiq/WebPd for documentation
 *
 *  WebPd is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WebPd is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with WebPd.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

var _ = require('underscore')
  , EventEmitter = require('events').EventEmitter
  , mixins = require('./mixins')
  , utils = require('./utils')
  , BaseNode = require('./BaseNode')
  , errors = require('./errors')
  , pdGlob = require('../global')


var Patch = module.exports = function() {
  BaseNode.apply(this, arguments)
  this.objects = []
  this.endPoints = []
  // A globally unique id for the patch.
  // Should stay null if the patch is a subpatch.
  // Instance of an abstraction on the other hand should have a `patchId`.
  this.patchId = null
  // The patch data in simple pd-json format
  // see : https://github.com/sebpiq/pd-fileutils#specification
  this.patchData = null
  this.blockSize = pdGlob.settings.blockSize
}

_.extend(Patch.prototype, BaseNode.prototype, mixins.UniqueIdsMixin, EventEmitter.prototype, {

  type: 'patch',

  init: function(args) {
    this.args = args
  },

  // When starting a patch, we need to take into account its nested structure,
  // making sure that all objects even in subpatches are started first, and only then we start
  // portlets.
  start: function() {
    this.startObjects()
    this.startPortlets()
  },

  stop: function() {
    this.stopObjects()
    this.stopPortlets()
  },

  destroy: function() {
    this.objects.forEach(function(obj) { obj.destroy() })
  },

  startObjects: function() {
    this.objects.forEach(function(obj) { 
      if (obj.startObjects) obj.startObjects()
      else obj.start() 
    })
  },

  stopObjects: function() {
    this.objects.forEach(function(obj) { 
      if (obj.stopObjects) obj.stopObjects()
      else obj.stop()
    })
  },

  startPortlets: function() {
    this.objects.forEach(function(obj) { obj.startPortlets() })
    this.emit('started')
  },

  stopPortlets: function() {
    this.objects.forEach(function(obj) { obj.stopPortlets() })
    this.emit('stopped')
  },

  // Adds an object to the patch.
  // Also causes the patch to automatically assign an id to that object.
  // This id can be used to uniquely identify the object in the patch.
  // Also, if the patch is playing, the `start` method of the object will be called.
  createObject: function(type, objArgs) {
    var obj = this._createObject(type, objArgs)
    if (pdGlob.isStarted) {
      obj.start()
      obj.startPortlets()
    }
    return obj
  },

  _createObject: function(type, objArgs) {
    var obj
    objArgs = objArgs || []

    // Check that `type` is valid and create the object  
    if (pdGlob.library.hasOwnProperty(type)) {
      var constructor = pdGlob.library[type]
      if (constructor.prototype.doResolveArgs)
        objArgs = this.resolveArgs(objArgs)
      obj = new constructor(this, this._generateId(), objArgs)
    } else throw new errors.UnknownObjectError(type)

    // Assign object unique id and add it to the patch
    this.objects[obj.id] = obj
    if (obj.endPoint) this.endPoints.push(obj)

    // When [inlet], [outlet~], ... is added to a patch, we add their portlets
    // to the patch's portlets
    if (isInletObject(obj)) this.inlets.push(obj.inlets[0])
    if (isOutletObject(obj)) this.outlets.push(obj.outlets[0])

    return obj
  },

  // Takes a list of object arguments which might contain abbreviations
  // and dollar arguments, and returns a copy of that list, abbreviations
  // replaced by the corresponding full word.
  resolveArgs: function(args) {
    var cleaned = args.slice(0)
      , dollar0 = this.getPatchRoot().patchId
      , patchArgs, matched

    patchArgs = [dollar0].concat(this.args)

    // Resolve abbreviations
    args.forEach(function(arg, i) {
      if (arg === 'b') cleaned[i] = 'bang'
      else if (arg === 'f') cleaned[i] = 'float'
      else if (arg === 's') cleaned[i] = 'symbol'
      else if (arg === 'a') cleaned[i] = 'anything'
      else if (arg === 'l') cleaned[i] = 'list'
    })

    // Resolve dollar-args
    return utils.getDollarResolver(cleaned)(patchArgs)
  },

  // Return the root patch. Only different from `this` if the calling patch
  // is a subpatch. If it is an abstraction, the situation is different.
  getPatchRoot: function() {
    if (this.patch) return this.patch.getPatchRoot()
    else return this
  }

})

var isInletObject = function(obj) {
  return [pdGlob.library['inlet'], pdGlob.library['inlet~']].some(function(type) {
    return obj instanceof type
  })
}

var isOutletObject = function(obj) {
  return [pdGlob.library['outlet'], pdGlob.library['outlet~']].some(function(type) {
    return obj instanceof type
  })
}

},{"../global":12,"./BaseNode":4,"./errors":7,"./mixins":9,"./utils":11,"events":18,"underscore":23}],6:[function(require,module,exports){
/*
 * Copyright (c) 2011-2015 Chris McCormick, Sébastien Piquemal <sebpiq@gmail.com>
 *
 *  This file is part of WebPd. See https://github.com/sebpiq/WebPd for documentation
 *
 *  WebPd is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WebPd is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with WebPd.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

var _ = require('underscore')
  , inherits = require('util').inherits
  , portlets = require('./portlets')
  , utils = require('./utils')
  , BaseNode = require('./BaseNode')
  , Patch = require('./Patch')
  , pdGlob = require('../global')

var PdObject = module.exports = function() {
  BaseNode.apply(this, arguments)
}
PdObject.extend = utils.chainExtend

_.extend(PdObject.prototype, BaseNode.prototype, {
  doResolveArgs: true
})

},{"../global":12,"./BaseNode":4,"./Patch":5,"./portlets":10,"./utils":11,"underscore":23,"util":26}],7:[function(require,module,exports){
/*
 * Copyright (c) 2011-2015 Chris McCormick, Sébastien Piquemal <sebpiq@gmail.com>
 *
 *  This file is part of WebPd. See https://github.com/sebpiq/WebPd for documentation
 *
 *  WebPd is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WebPd is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with WebPd.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
var _ = require('underscore')

// Error thrown when Pd.loadPatch failed
var PatchLoadError = exports.PatchLoadError = function PatchLoadError(errorList) {
  this.name = 'PatchLoadError'
  this.errorList = errorList
  this.message = _.pluck(errorList, 0).join('\n')
  this.stack = (new Error()).stack
}
PatchLoadError.prototype = Object.create(Error.prototype)
PatchLoadError.prototype.constructor = PatchLoadError


// Error thrown when trying to create an unknown object
var UnknownObjectError = exports.UnknownObjectError = function UnknownObjectError(type) {
  this.name = 'UnknownObjectError'
  this.message = 'unknown object ' + type
  this.objectType = type
  this.stack = (new Error()).stack
}
UnknownObjectError.prototype = Object.create(Error.prototype)
UnknownObjectError.prototype.constructor = UnknownObjectError


// Error thrown when trying to access an invalid portlet with `.i` or `.o`
var InvalidPortletError = exports.InvalidPortletError = function InvalidPortletError(msg) {
  this.name = 'InvalidPortletError'
  this.message = msg
  this.stack = (new Error()).stack
}
InvalidPortletError.prototype = Object.create(Error.prototype)
InvalidPortletError.prototype.constructor = InvalidPortletError
},{"underscore":23}],8:[function(require,module,exports){
/*
 * Copyright (c) 2011-2015 Chris McCormick, Sébastien Piquemal <sebpiq@gmail.com>
 *
 *  This file is part of WebPd. See https://github.com/sebpiq/WebPd for documentation
 *
 *  WebPd is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WebPd is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with WebPd.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
 
// Scheduler to handle timing
exports.Clock = {

  // Current time of the clock in milliseconds
  time: 0,

  // Schedules `func(event)` to run at `time` and to repeat every `repetition` millisecond.
  // Returns an `Event`, that has attribute `timeTag`, which is the time at which it is scheduled.
  // If `time` is now, event must be executed immediately.
  schedule: function(func, time, repetition) {},

  // Unschedules `event`.
  unschedule: function(event) {}
}

// Audio engine
exports.Audio = {

  // The current sample rate of audio processing
  sampleRate: 44100,

  // Start the audio
  start: function() {},

  // Stop the audio
  stop: function() {},

  // Decode array buffer to a list of channels of Float32Array
  decode: function(arrayBuffer, done) { done(null, arrayBuffer) }
}

// File storage
exports.Storage = {

  // Gets the file stored at `uri` and returns `done(err, arrayBuffer)`
  get: function(uri, done) { }
}
},{}],9:[function(require,module,exports){
/*
 * Copyright (c) 2011-2015 Chris McCormick, Sébastien Piquemal <sebpiq@gmail.com>
 *
 *  This file is part of WebPd. See https://github.com/sebpiq/WebPd for documentation
 *
 *  WebPd is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WebPd is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with WebPd.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
 
var EventEmitter = require('events').EventEmitter
  , _ = require('underscore')
  , pdGlob = require('../global')


// Simple mixin for named objects, such as [send] or [table]
// This also requires the object to be an EventEmitter.
exports.NamedMixin = {

  nameIsUnique: false,

  setName: function(name) {
    if (!_.isString(name))
      return console.error('expected [' + this.type + '] name to be a string, got ' + name)
    var oldName = this.name
    this.emit('changing:name', oldName, name)
    this.name = name
    pdGlob.namedObjects.register(this, this.type, name, this.nameIsUnique, oldName)
    this.emit('changed:name', oldName, name)
  },

  destroy: function() {
    pdGlob.namedObjects.unregister(this, this.type, this.name)
  }

}


// Simple EventEmitter mixin, with a destroy method
var EventEmitterMixin = exports.EventEmitterMixin = _.extend({}, EventEmitter.prototype, {

  destroy: function() {
    this.removeAllListeners()
  }

})


// Helper to reference a named object (which uses the `NamedMixin`)
// Every time for any reason the `resolved` of the reference changes, "changed" is emitted,
// with arguments (newResolved, oldResolved)
var Reference = exports.Reference = function(referencedType) {
  this.referencedType = referencedType
  this._onNewObject = null
  this._onChangedName = null
  this.resolved = null
  this._eventName = 'namedObjects:registered:' + this.referencedType
  this._eventReceiver = new EventReceiver()
}

_.extend(Reference.prototype, EventEmitterMixin, {

  set: function(name) {
    // Try to fetch the referenced object from `namedObjects`
    var self = this
      , resolved = pdGlob.namedObjects.get(this.referencedType, name)[0]

    this.name = name
    this._stopListening()
    if (resolved) 
      this._setResolved(resolved)
    
    // If the object was not found, we listen to subsequent new objects of `referencedType`
    // being registered in case the object we're waiting for comes up.
    else {
      this._setResolved(null)
      this._onNewObject = function(obj) {
        if (obj.name === name) {
          self._stopListening()
          self._setResolved(obj)
        }
      }
      this._eventReceiver.on(pdGlob.emitter, this._eventName, this._onNewObject)
    }
  },

  destroy: function() {
    this._eventReceiver.destroy()
    EventEmitterMixin.destroy.apply(this)
  },

  _setResolved: function(newObj) {
    var self = this
      , oldObj = this.resolved
    this.resolved = newObj

    if (oldObj) oldObj.removeListener('changing:name', self._onChangedName)

    if (newObj) {
      this._onChangedName = function() { self._setResolved(null) }
      this._eventReceiver.on(newObj, 'changing:name', this._onChangedName)
    }
    this.emit('changed', newObj, oldObj)
  },

  _stopListening: function() {
    if (this._onNewObject) {
      this._eventReceiver.removeListener(pdGlob.emitter, this._eventName, this._onNewObject)
      this._onNewObject = null
    }
  }

})


// Simple mixin to add functionalities for generating unique ids.
// Each object extended with this mixin has a separate id counter.
// Therefore ids are not unique globally but unique for object.
exports.UniqueIdsMixin = {

  // Every time it is called, this method returns a new unique id.
  _generateId: function() {
    this._idCounter++
    return this._idCounter
  },

  // Counter used internally to assign a unique id to objects
  // this counter should never be decremented to ensure the id unicity
  _idCounter: -1
}


// This is a object to help managing event handlers, and especially clean
// properly on destruction of the parent object.
var EventReceiver = exports.EventReceiver = function() {
  this._handlers = []
}

_.extend(EventReceiver.prototype, {

  addListener: function(emitter, eventName, handler) {
    this._handlers.push([emitter, eventName, handler])
    emitter.addListener(eventName, handler)
  },

  once: function(emitter, eventName, handler) {
    var self = this
      , handlerData = [emitter, eventName, handler]
    this._handlers.push(handlerData)
    emitter.once(eventName, handler)
  },

  removeListener: function(emitter, eventName, handler) {
    this._handlers = _.reject(this._handlers, function(handlerData) {
      var rejected = (handlerData[0] === emitter
            && handlerData[1] === eventName 
            && handlerData[2] === handler)
      if (rejected) emitter.removeListener(eventName, handler)
      return rejected
    })
  },

  destroy: function() {
    this._handlers.forEach(function(handlerData) {
      handlerData[0].removeListener(handlerData[1], handlerData[2])
    })
    this._handlers = []
  }

})

EventReceiver.prototype.on = EventReceiver.prototype.addListener
},{"../global":12,"events":18,"underscore":23}],10:[function(require,module,exports){
/*
 * Copyright (c) 2011-2015 Chris McCormick, Sébastien Piquemal <sebpiq@gmail.com>
 *
 *  This file is part of WebPd. See https://github.com/sebpiq/WebPd for documentation
 *
 *  WebPd is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WebPd is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with WebPd.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

var _ = require('underscore')
  , utils = require('./utils')

// Base for outlets and inlets. Mostly handles connections and disconnections
var Portlet = exports.Portlet = function(obj, id) {
  this.obj = obj
  this.id = id
  this.connections = []
  this.init()
}

_.extend(Portlet.prototype, {

/******************** Methods to implement *****************/

  // True if the portlet can connect objects belonging to different patches
  crossPatch: false,

  // This method is called when the portlet is initialized.
  init: function() {},

  // This method is called when the object is started
  start: function() {},

  // This method is called after all objects have been stopped
  stop: function() {},

  // This method is called when the portlet receives a message.
  message: function(args) {},

  // This method is called when the portlet gets a new connection,
  // and when the portlet's object is started it is called again.
  connection: function(otherPortlet) {},

  // This method is called when the portlet gets disconnected.
  disconnection: function(otherPortlet) {},


/************************* Public API **********************/

  // Connects the calling portlet with `otherPortlet` 
  // Returns true if a connection was indeed established.
  connect: function(otherPortlet) {
    if (this.connections.indexOf(otherPortlet) !== -1) return false
    if (!(this.crossPatch || otherPortlet.crossPatch)
    && this.obj.patch !== otherPortlet.obj.patch)
      throw new Error('cannot connect objects that belong to different patches')
    this.connections.push(otherPortlet)
    otherPortlet.connect(this)
    this.connection(otherPortlet)
    return true
  },

  // Generic function for disconnecting the calling portlet 
  // from  `otherPortlet`. Returns true if a disconnection was indeed made
  disconnect: function(otherPortlet) {
    var connInd = this.connections.indexOf(otherPortlet)
    if (connInd === -1) return false
    this.connections.splice(connInd, 1)
    otherPortlet.disconnect(this)
    this.disconnection(otherPortlet)
    return true
  }

})
Portlet.extend = utils.chainExtend

// Base inlet
var Inlet = exports.Inlet = Portlet.extend({})

// Base outlet
var Outlet = exports.Outlet = Portlet.extend({})

},{"./utils":11,"underscore":23}],11:[function(require,module,exports){
/*
 * Copyright (c) 2011-2015 Chris McCormick, Sébastien Piquemal <sebpiq@gmail.com>
 *
 *  This file is part of WebPd. See https://github.com/sebpiq/WebPd for documentation
 *
 *  WebPd is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WebPd is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with WebPd.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

var _ = require('underscore')
  , pdGlob = require('../global')

// Regular expressions to deal with dollar-args
var dollarVarRe = /\$(\d+)/,
    dollarVarReGlob = /\$(\d+)/g


// Returns a function `resolver(inArray)`. For example :
//
//     resolver = obj.getDollarResolver([56, '$1', 'bla', '$2-$1'])
//     resolver([89, 'bli']) // [56, 89, 'bla', 'bli-89']
//
exports.getDollarResolver = function(rawOutArray) {
  rawOutArray = rawOutArray.slice(0)

  // Simple helper to throw en error if the index is out of range
  var getElem = function(array, ind) {
    if (ind >= array.length || ind < 0) 
      throw new Error('$' + (ind + 1) + ': argument number out of range')
    return array[ind]
  }

  // Creates an array of transfer functions `inVal -> outVal`.
  var transfer = rawOutArray.map(function(rawOutVal) {
    var matchOnce = dollarVarRe.exec(rawOutVal)

    // If the transfer is a dollar var :
    //      ['bla', 789] - ['$1'] -> ['bla']
    if (matchOnce && matchOnce[0] === rawOutVal) {
      return (function(rawOutVal) {
        var inInd = parseInt(matchOnce[1], 10)
        return function(inArray) { return getElem(inArray, inInd) }
      })(rawOutVal)

    // If the transfer is a string containing dollar var :
    //      ['bla', 789] - ['bla$2'] -> ['bla789']
    } else if (matchOnce) {
      return (function(rawOutVal) {
        var allMatches = []
          , matched
        while (matched = dollarVarReGlob.exec(rawOutVal)) {
          allMatches.push([matched[0], parseInt(matched[1], 10)])
        }
        return function(inArray) {
          var outVal = rawOutVal.substr(0)
          allMatches.forEach(function(matched) {
            outVal = outVal.replace(matched[0], getElem(inArray, matched[1]))
          })
          return outVal
        }
      })(rawOutVal)

    // Else the input doesn't matter
    } else {
      return (function(outVal) {
        return function() { return outVal }
      })(rawOutVal)
    }
  })

  return function(inArray) {
    return transfer.map(function(func, i) { return func(inArray) })
  } 
}


// Helper to be able to extend a prototype `BaseClass` :
// BaseClass.extend = chainExtend
// SubClass = BaseClass.extend({ <name1>: <var1> ... })
// The returned `SubClass` will also have an `extend` method.
exports.chainExtend = function() {
  var sources = Array.prototype.slice.call(arguments, 0)
    , parent = this
    , child = function() { parent.apply(this, arguments) }

  // Fix instanceof
  child.prototype = new parent()

  // extend with new properties
  _.extend.apply(this, [child.prototype, parent.prototype].concat(sources))

  child.extend = this.extend
  return child
}


// Helper function to add a time tag to a list of arguments.
exports.timeTag = function(args, timeTag) {
  if (!timeTag) return args
  else if (_.isNumber(timeTag)) args.timeTag = timeTag
  else args.timeTag = timeTag.timeTag
  return args
}


// Helper function to get the timeTag of a list of arguments.
// Returns current clock time if `args` is not time tagged.
exports.getTimeTag = function(args) {
  return (args && args.timeTag) || (pdGlob.clock && pdGlob.clock.time) || 0
}
},{"../global":12,"underscore":23}],12:[function(require,module,exports){
/*
 * Copyright (c) 2011-2015 Chris McCormick, Sébastien Piquemal <sebpiq@gmail.com>
 *
 *  This file is part of WebPd. See https://github.com/sebpiq/WebPd for documentation
 *
 *  WebPd is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WebPd is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with WebPd.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

var _ = require('underscore')
  , EventEmitter = require('events').EventEmitter


// Global settings
exports.settings = {

  // Current block size
  blockSize: 16384,

  // Current number of channels
  channelCount: 2
}


// true if dsp is started, false otherwise 
exports.isStarted = false


// Global event emitter.
// We whitelist all known events, just as a way to keep a list of them 
var emitter = exports.emitter = new EventEmitter()
emitter.emit = function(eventName) {
  var valid = false
  if (
    _.contains([], eventName)
    || eventName.indexOf('msg:') === 0
    || eventName.indexOf('namedObjects:registered') === 0
    || eventName.indexOf('namedObjects:unregistered') === 0
  ) EventEmitter.prototype.emit.apply(this, arguments)
  else throw new Error('unknown event : ' + eventName)
}

// The library of objects that can be created
exports.library = {}


// List of all patches currently open
exports.patches = {}


// Audio engine. Must implement the `interfaces.Audio`
exports.audio = null


// The clock used to schedule stuff. Must implement the `interfaces.Clock`
exports.clock = null


// File storage
exports.storage = null


// Store containing named objects (e.g. arrays, [send] / [receive], ...).
// Objects are stored by pair (<type>, <obj.name>)
exports.namedObjects = {

  // Registers a named object in the store.
  register: function(obj, type, name, nameIsUnique, oldName) {
    var nameMap, objList

    this._store[type] = nameMap = this._store[type] || {}
    nameMap[name] = objList = nameMap[name] || []

    // Adding new mapping
    if (objList.indexOf(obj) === -1) {
      if (nameIsUnique && objList.length > 0)
        throw new Error('there is already a ' + type + ' with name "' + name + '"')
      objList.push(obj)
    }

    // Removing old mapping
    if (oldName) {
      objList = nameMap[oldName]
      objList.splice(objList.indexOf(obj), 1)
    }

    exports.emitter.emit('namedObjects:registered:' + type, obj)
  },

  // Unregisters a named object from the store
  unregister: function(obj, type, name) {
    var nameMap = this._store[type]
      , objList = nameMap ? nameMap[name] : null
      , ind
    if (!objList) return
    ind = objList.indexOf(obj)
    if (ind === -1) return 
    objList.splice(ind, 1)
    exports.emitter.emit('namedObjects:unregistered:' + type, obj)
  },

  // Returns an object list given the object `type` and `name`.
  get: function(type, name) {
    return ((this._store[type] || {})[name] || [])
  },

  // Removes all the objects.
  reset: function() {
    this._store = {}
  },

  _store: {}
}

},{"events":18,"underscore":23}],13:[function(require,module,exports){
/*
 * Copyright (c) 2011-2015 Chris McCormick, Sébastien Piquemal <sebpiq@gmail.com>
 *
 *  This file is part of WebPd. See https://github.com/sebpiq/WebPd for documentation
 *
 *  WebPd is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WebPd is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with WebPd.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
var _ = require('underscore')
  , utils = require('./core/utils')
  , mixins = require('./core/mixins')
  , PdObject = require('./core/PdObject')
  , Patch = require('./core/Patch')
  , pdGlob = require('./global')
  , portlets = require('./waa/portlets')


exports.declareObjects = function(library) {

  library['receive'] = library['r'] = PdObject.extend(mixins.NamedMixin, mixins.EventEmitterMixin, {

    type: 'receive',

    outletDefs: [portlets.Outlet],
    abbreviations: ['r'],

    init: function(args) {
      var name = args[0]
        , self = this
      this._eventReceiver = new mixins.EventReceiver()
      this._onMessageReceived = this._onMessageReceived.bind(this)
      this._eventReceiver.on(this, 'changed:name', function(oldName, newName) {
        if (oldName) 
          self._eventReceiver.removeListener(pdGlob.emitter, 'msg:' + oldName, self._onMessageReceived)
        self._eventReceiver.on(pdGlob.emitter, 'msg:' + newName, self._onMessageReceived)
      })
      this.setName(name)
    },

    destroy: function() {
      mixins.NamedMixin.destroy.apply(this, arguments)
      this._eventReceiver.destroy()
      mixins.EventEmitterMixin.destroy.apply(this, arguments)
    },

    _onMessageReceived: function(args) {
      this.o(0).message(args)
    }

  })

  library['send'] = library['s'] = PdObject.extend(mixins.NamedMixin, mixins.EventEmitterMixin, {

    type: 'send',

    inletDefs: [

      portlets.Inlet.extend({
        message: function(args) {
          pdGlob.emitter.emit('msg:' + this.obj.name, args)
        }
      })

    ],

    abbreviations: ['s'],

    init: function(args) { this.setName(args[0]) },

    destroy: function() {
      mixins.NamedMixin.destroy.apply(this, arguments)
      mixins.EventEmitterMixin.destroy.apply(this, arguments)
    }

  })

  library['msg'] = PdObject.extend({

    type: 'msg',

    doResolveArgs: false,

    inletDefs: [

      portlets.Inlet.extend({
        message: function(args) {
          var timeTag = args.timeTag
          // For some reason in Pd $0 in a message is always 0.
          args = args.slice(0)
          args.unshift(0)
          // resolve each message group
          for(var i=0 ; i<this.obj.resolvers.length ; i++)
          {
            var resolver = this.obj.resolvers[i]
            this.obj.outlets[0].message(utils.timeTag(resolver(args), timeTag))
          }
        }
      })

    ],

    outletDefs: [portlets.Outlet],

    init: function(args) {
      this.createResolvers(args)
    },

    createResolvers: function(args) {
      // split comma separated message in groups.
      var argsGroups = [[]]
      for(var i=0 ; i<args.length ; i++)
      {
        var arg = args[i]
        if(arg == ","){
          argsGroups.push([])
        }else{
          argsGroups[argsGroups.length-1].push(arg)
        }
      }
      if(argsGroups[argsGroups.length-1].length == 0){
        argsGroups.pop()
      }
      // then create resolvers for each group.
      this.resolvers = []
      for(var i in argsGroups)
      {
        var argsGroup = argsGroups[i]
        this.resolvers.push(utils.getDollarResolver(argsGroup))
      }      
    }

  })

  library['print'] = PdObject.extend({

    type: 'print',

    inletDefs: [

      portlets.Inlet.extend({
        message: function(args) {
          console.log(this.obj.prefix ? [this.obj.prefix].concat(args) : args)
        }
      })

    ],

    init: function(args) {
      this.prefix = (args[0] || 'print');
    }

  })

  library['text'] = PdObject.extend({
    
    type: 'text',

    init: function(args) {
      this.text = args[0]
    }

  })

  library['loadbang'] = PdObject.extend({

    type: 'loadbang',

    outletDefs: [portlets.Outlet],

    init: function() {
      var self = this
      this._eventReceiver = new mixins.EventReceiver()
      this._onPatchStarted = function() {
        self.o(0).message(['bang'])
      }
      this._eventReceiver.on(this.patch, 'started', this._onPatchStarted)
    },

    destroy: function() {
      this._eventReceiver.destroy()
    }

  })

  var _NumberBase = PdObject.extend({

    inletDefs: [

      portlets.Inlet.extend({
        message: function(args) {
          var val = args[0]
          if (val !== 'bang') this.obj.setVal(val)
          this.obj.o(0).message(utils.timeTag([this.obj.val], args))
        }
      }),

      portlets.Inlet.extend({
        message: function(args) {
          var val = args[0]
          this.obj.setVal(val)
        }
      })

    ],

    outletDefs: [portlets.Outlet],

    init: function(args) {
      var val = args[0]
      this.setVal(val || 0)
    },

    setVal: function(val) { this.val = val }

  })

  library['float'] = library['f'] = _NumberBase.extend({

    type: 'float',

    setVal: function(val) {
      if (!_.isNumber(val))
        return console.error('invalid [float] value ' + val)
      this.val = val
    }

  })

  library['int'] = library['i'] = _NumberBase.extend({

    type: 'int',

    setVal: function(val) {
      if (!_.isNumber(val))
        return console.error('invalid [int] value ' + val)
      this.val = Math.floor(val)
    }

  })

  var _TwoVarFunctionBase = PdObject.extend({

    inletDefs: [
      portlets.Inlet.extend({
        message: function(args) {
          var val = args[0]
          if (_.isNumber(val))
            this.obj.valLeft = val
          else if (val !== 'bang')
            console.error('invalid message : ' + args)
          this.obj.o(0).message(utils.timeTag([this.obj.compute()], args))
        }
      }),

      portlets.Inlet.extend({
        message: function(args) {
          var val = args[0]
          if (!_.isNumber(val))
            return console.error('invalid operand for [' + this.obj.type + '] ' + val)
          this.obj.valRight = val
        }
      })
    ],
    outletDefs: [portlets.Outlet],

    init: function(args) {
      this.valRight = args[0] || 0
      this.valLeft = 0
    },
    
    // Must be overriden
    compute: function() { return }
  })

  library['+'] = _TwoVarFunctionBase.extend({
    type: '+',

    compute: function() { return this.valLeft + this.valRight }
  })

  library['-'] = _TwoVarFunctionBase.extend({
    type: '-',
    compute: function() { return this.valLeft - this.valRight }
  })

  library['*'] = _TwoVarFunctionBase.extend({
    type: '*',
    compute: function() { return this.valLeft * this.valRight }
  })

  library['/'] = _TwoVarFunctionBase.extend({
    type: '/',
    compute: function() { return this.valRight == 0 ? 0 : this.valLeft / this.valRight }
  })

  library['min'] = _TwoVarFunctionBase.extend({
    type: 'min',
    compute: function() { return Math.min(this.valLeft, this.valRight) }
  })

  library['max'] = _TwoVarFunctionBase.extend({
    type: 'max',
    compute: function() { return Math.max(this.valLeft, this.valRight) }
  })

  library['mod'] = library['%'] = _TwoVarFunctionBase.extend({
    type: 'mod',
    compute: function() { 
      if(this.valRight <= 0)
        return 0
      if(this.valLeft < 0)
        return this.valRight + this.valLeft % this.valRight
      return this.valLeft % this.valRight
    }
  })

  library['pow'] = _TwoVarFunctionBase.extend({
    type: 'pow',
    compute: function() { return Math.pow(this.valLeft, this.valRight) }
  })

  var _OneVarFunctionBase = PdObject.extend({

    inletDefs: [
      portlets.Inlet.extend({
        message: function(args) {
          var inVal = args[0]
          this.obj.checkInput(inVal)
          this.obj.o(0).message(utils.timeTag([this.obj.compute(inVal)], args))
        }
      })
    ],
    outletDefs: [portlets.Outlet],

    // Must be overriden    
    checkInput: function(inVal) {},

    // Must be overriden
    compute: function() { return }
  })

  var _OneNumVarFunctionBase = _OneVarFunctionBase.extend({
    checkInput: function(inVal) {
      if (!_.isNumber(inVal))
        return console.error('invalid [' + this.type + '] value ' + inVal)
    }
  })

  library['cos'] = _OneNumVarFunctionBase.extend({
    type: 'cos',
    compute: function(inVal) { return Math.cos(inVal) }
  })

  library['sin'] = _OneNumVarFunctionBase.extend({
    type: 'sin',
    compute: function(inVal) { return Math.sin(inVal) }
  })

  library['tan'] = _OneNumVarFunctionBase.extend({
    type: 'tan',
    compute: function(inVal) { return Math.tan(inVal) }
  })

  library['atan2'] = _TwoVarFunctionBase.extend({
    type: 'atan2',
    compute: function() { return Math.atan2(this.valRight, this.valLeft) }
  })

  library['atan'] = _OneNumVarFunctionBase.extend({
    type: 'atan',
    compute: function(inVal) { return Math.atan(inVal) }
  })

  library['exp'] = _OneNumVarFunctionBase.extend({
    type: 'exp',
    compute: function(inVal) { return Math.exp(inVal) }
  })

  library['log'] = _OneNumVarFunctionBase.extend({
    type: 'log',
    compute: function(inVal) { return Math.log(inVal) }
  })

  library['abs'] = _OneNumVarFunctionBase.extend({
    type: 'abs',
    compute: function(inVal) { return Math.abs(inVal) }
  })

  library['sqrt'] = _OneNumVarFunctionBase.extend({
    type: 'sqrt',
    compute: function(inVal) { return Math.sqrt(inVal) }
  })

  library['wrap'] = _OneNumVarFunctionBase.extend({
    type: 'wrap',
    compute: function(inVal) { return inVal - Math.floor(inVal) }
  })

  library['mtof'] = _OneNumVarFunctionBase.extend({
    type: 'mtof',
    maxMidiNote: 8.17579891564 * Math.exp((0.0577622650 * 1499)),
    // TODO: round output ?
    compute: function(note) { 
      var out = 0
      if (!_.isNumber(note))
        return console.error('invalid [mtof] value ' + note)
      if (note <= -1500) out = 0
      else if (note > 1499) out = this.maxMidiNote
      // optimized version of formula : Math.pow(2, (note - 69) / 12) * 440 
      else out = 8.17579891564 * Math.exp((0.0577622650 * note))
      return out 
    }
  })

  library['ftom'] = _OneNumVarFunctionBase.extend({
    type: 'ftom',
    compute: function(freq) { 
      if (!_.isNumber(freq))
        return console.error('invalid [ftom] value ' + freq)
      if (freq <= 0)
        return -1500
      // optimized version of formula : 12 * Math.log(freq / 440) / Math.LN2 + 69
      // which is the same as : Math.log(freq / mtof(0)) * (12 / Math.LN2) 
      // which is the same as : Math.log(freq / 8.1757989156) * (12 / Math.LN2) 
      return Math.log(freq * 0.122312206) * 17.312340491
    }
  })

  library['rmstodb'] = _OneNumVarFunctionBase.extend({
    type: 'rmstodb',
    compute: function(inVal) { return inVal <= 0 ? 0 : 20 * Math.log(inVal) / Math.LN10 + 100 }
  })

  library['dbtorms'] = _OneNumVarFunctionBase.extend({
    type: 'dbtorms',
    compute: function(inVal) { return inVal <= 0 ? 0 : Math.exp(Math.LN10 * (inVal - 100) / 20)}
  })

  library['powtodb'] = _OneNumVarFunctionBase.extend({
    type: 'powtodb',
    compute: function(inVal) { return inVal <= 0 ? 0 : 10 * Math.log(inVal) / Math.LN10 + 100 }
  })

  library['dbtopow'] = _OneNumVarFunctionBase.extend({
    type: 'dbtopow',
    compute: function(inVal) { return inVal <= 0 ? 0 : Math.exp(Math.LN10 * (inVal - 100) / 10)}
  })

  library['samplerate~'] = _OneVarFunctionBase.extend({
    type: 'samplerate~',
    compute: function () { return pdGlob.audio.sampleRate }
  })

  library['spigot'] = PdObject.extend({
    
    type: 'spigot',

    inletDefs: [
      
      portlets.Inlet.extend({
        message: function(args) {
          if (this.obj.passing) this.obj.o(0).message(args)
        }
      }),

      portlets.Inlet.extend({
        message: function(args) {
          var val = args[0]
          this.obj.setPassing(val)
        }
      })

    ],

    outletDefs: [portlets.Outlet],

    init: function(args) {
      var val = args[0]
      this.setPassing(val || 0)
    },

    setPassing: function(val) {
      if (!_.isNumber(val))
        return console.error('invalid [spigot] value ' + val)
      this.passing = Boolean(val)
    }

  })

  library['trigger'] = library['t'] = PdObject.extend({

    type: 'trigger',

    inletDefs: [
      portlets.Inlet.extend({

        message: function(args) {
          var i, length, filter, msg

          for (i = this.obj.filters.length - 1; i >= 0; i--) {
            filter = this.obj.filters[i]
            if (filter === 'bang')
              this.obj.o(i).message(utils.timeTag(['bang'], args))
            else if (filter === 'list' || filter === 'anything')
              this.obj.o(i).message(args)
            else if (filter === 'float' || _.isNumber(filter)) {
              msg = args[0]
              if (_.isNumber(msg)) this.obj.o(i).message(utils.timeTag([msg], args))
              else this.obj.o(i).message(utils.timeTag([0], args))
            } else if (filter === 'symbol') {
              msg = args[0]
              if (msg === 'bang') this.obj.o(i).message(utils.timeTag(['symbol'], args))
              else if (_.isNumber(msg)) this.obj.o(i).message(utils.timeTag(['float'], args))
              else if (_.isString(msg)) this.obj.o(i).message(utils.timeTag([msg], args))
              else throw new Error('Got unexpected input ' + args)
            } else this.obj.o(i).message(utils.timeTag(['bang'], args))
          }
        }

      })
    ],

    init: function(args) {
      var i, length
      if (args.length === 0)
        args = ['bang', 'bang']
      for (i = 0, length = args.length; i < length; i++)
        this.outlets.push(new portlets.Outlet(this, i))
      this.filters = args
    }

  })

  var _PackInlet0 = portlets.Inlet.extend({
    message: function(args) {
      var msg = args[0]
      if (msg !== 'bang') this.obj.memory[0] = msg
      this.obj.o(0).message(utils.timeTag(this.obj.memory.slice(0), args))
    }
  })

  var _PackInletN = portlets.Inlet.extend({
    message: function(args) {
      var msg = args[0]
      this.obj.memory[this.id] = msg
    }
  })

  library['pack'] = PdObject.extend({
    
    type: 'pack',

    outletDefs: [portlets.Outlet],

    init: function(args) {
      var i, length = args.length

      if (length === 0) args = ['float', 'float']
      length = args.length
      this.filters = args
      this.memory = new Array(length)

      for (i = 0; i < length; i++) {
        if (i === 0)
          this.inlets[i] = new _PackInlet0(this, i)
        else 
          this.inlets[i] = new _PackInletN(this, i)
        if (args[i] === 'float') this.memory[i] = 0
        else if (args[i] === 'symbol') this.memory[i] = 'symbol'
        else this.memory[i] = args[i]
      }
    }

  })

  library['select'] = library['sel'] = PdObject.extend({

    type: 'select',

    inletDefs: [

      portlets.Inlet.extend({
        message: function(args) {
          var ind, msg = args[0]
          if ((ind = this.obj.filters.indexOf(msg)) !== -1)
            this.obj.o(ind).message(utils.timeTag(['bang'], args))
          else this.obj.outlets.slice(-1)[0].message(utils.timeTag([msg], args))
        }
      }),

      portlets.Inlet.extend({
        message: function(args) {
          if (this.obj.filters.length <= 1) this.obj.filters = args
        }
      })

    ],

    init: function(args) {
      var i, length
      if (args.length === 0) args = [0]
      if (args.length > 1) this.inlets.pop() 

      for (i = 0, length = args.length; i < length; i++)
        this.outlets[i] = new portlets.Outlet(this, i)
      this.outlets[i] = new portlets.Outlet(this, i)
      this.filters = args
    }

  })

  library['moses'] = PdObject.extend({

    type: 'moses',

    inletDefs: [

      portlets.Inlet.extend({
        message: function(args) {
          var val = args[0]
          if (!_.isNumber(val))
            return console.error('invalid [moses] value ' + val)
          if (val < this.obj.val) this.obj.o(0).message(utils.timeTag([val], args))
          else this.obj.o(1).message(utils.timeTag([val], args))
        }
      }),

      portlets.Inlet.extend({
        message: function(args) {
          var val = args[0]
          this.obj.setVal(val)
        }
      })

    ],

    outletDefs: [portlets.Outlet, portlets.Outlet],

    init: function(args) {
      var val = args[0]
      this.setVal(val || 0)
    },

    setVal: function(val) {
      if (!_.isNumber(val))
        return console.error('invalid [moses] value ' + val)
      this.val = val
    }

  })

  library['clip'] = PdObject.extend({

    type: 'clip',

    inletDefs: [

      portlets.Inlet.extend({
        message: function(args) {
          var val = args[0]
          if (!_.isNumber(val))
            return console.error('invalid [clip] value ' + val)
          if (val < this.obj.min) this.obj.o(0).message(utils.timeTag([this.obj.min], args))
          else if (val > this.obj.max) this.obj.o(0).message(utils.timeTag([this.obj.max], args))
          else this.obj.o(0).message(utils.timeTag([val], args))
        }
      }),

      portlets.Inlet.extend({
        message: function(args) {
          var val = args[0]
          this.obj.setMin(val)
        }
      }),

      portlets.Inlet.extend({
        message: function(args) {
          var val = args[0]
          this.obj.setMax(val)
        }
      })

    ],

    outletDefs: [portlets.Outlet],

    init: function(args) {
      this.setMin(args[0] || 0)
      this.setMax(args[1] || 0)
    },

    setMin: function(val) {
      if (!_.isNumber(val))
        return console.error('invalid [clip] min value ' + val)
      this.min = val
    },

    setMax: function(val) {
      if (!_.isNumber(val))
        return console.error('invalid [clip] max value ' + val)
      this.max = val
    }

  })

  library['swap'] = PdObject.extend({

    type: 'swap',

    inletDefs: [

      portlets.Inlet.extend({
        message: function(args) {
          var val = args[0]
          if (!_.isNumber(val))
            return console.error('invalid [swap] value ' + val)
          this.obj.o(1).message(utils.timeTag([val], args))
          this.obj.o(0).message(utils.timeTag([this.obj.val], args))
        }
      }),

      portlets.Inlet.extend({
        message: function(args) {
          var val = args[0]
          this.obj.setVal(val)
        }
      })

    ],

    outletDefs: [portlets.Outlet, portlets.Outlet],

    init: function(args) {
      var val = args[0]
      this.setVal(val || 0)
    },

    setVal: function(val) {
      if (!_.isNumber(val))
        return console.error('invalid [swap] value ' + val)
      this.val = val
    }

  })

  library['until'] = PdObject.extend({

    type: 'until',

    inletDefs: [

      portlets.Inlet.extend({
        message: function(args) {
          var val = args[0]
          if (val === 'bang') {
            this.obj._startLoop(args.timeTag)
          } else {
            if (!_.isNumber(val))
              return console.error('invalid [until] value ' + val)
            this.obj._startLoop(args.timeTag, val)
          }
        }
      }),

      portlets.Inlet.extend({
        message: function(args) {
          var val = args[0]
          if (val !== 'bang')
            return console.error('invalid command for [until] ' + val)
          this.obj._stopLoop()
        }
      })

    ],

    outletDefs: [portlets.Outlet],

    init: function() {
      this._looping = false
    },

    _startLoop: function(timeTag, max) {
      this._looping = true
      var self = this
        , counter = 0
        , sendBang =  function() { self.o(0).message(utils.timeTag(['bang'], timeTag)) }

      if (_.isNumber(max)) {
        while (this._looping && counter < max) {
          sendBang()
          counter++
        }
      } else while (this._looping) sendBang()
        
      this._looping = false
    },

    _stopLoop: function() {
      this._looping = false
    }

  })

  library['random'] = PdObject.extend({

    type: 'random',

    inletDefs: [

      portlets.Inlet.extend({
        message: function(args) {
          var msg = args[0]
          if (msg === 'bang')
            this.obj.o(0).message(utils.timeTag([Math.floor(Math.random() * this.obj.max)], args))
          else if (msg === 'seed') 1 // TODO: seeding, not available with `Math.rand`
        }
      }),

      portlets.Inlet.extend({
        message: function(args) {
          var msg = args[0]
          this.obj.setMax(msg)
        }
      })
    ],

    outletDefs: [portlets.Outlet],

    init: function(args) {
      var maxInt = args[0]
      this.setMax(maxInt || 1)
    },

    setMax: function(maxInt) {
      if (!_.isNumber(maxInt))
        return console.error('invalid [random] value ' + maxInt)
      this.max = maxInt
    }

  })


  library['metro'] = PdObject.extend({

    type: 'metro',

    inletDefs: [
    
      portlets.Inlet.extend({
        message: function(args) {
          var msg = args[0]
          if (msg === 'bang') this.obj._restartMetroTick(utils.getTimeTag(args))
          else if (msg === 'stop') this.obj._stopMetroTick() 
          else {
            if (!_.isNumber(msg))
              return console.error('invalid [metro] value ' + msg)
            if (msg === 0) this.obj._stopMetroTick()
            else this.obj._restartMetroTick(utils.getTimeTag(args))
          }
        }
      }),

      portlets.Inlet.extend({
        message: function(args) {
          var rate = args[0]
          this.obj.setRate(rate)
          this.obj._metroTick = this.obj._metroTickRateChange
        }
      })

    ],

    outletDefs: [portlets.Outlet],

    init: function(args) {
      var rate = args[0]
      this.setRate(rate || 0)
      this._metroHandle = null
      this._metroTick = this._metroTickNormal
    },

    // Metronome rate, in ms per tick
    setRate: function(rate) {
      if (!_.isNumber(rate))
        return console.error('invalid [metro] rate ' + rate)
      this.rate = Math.max(rate, 1)
    },

    destroy: function() {
      this._stopMetroTick()
    },

    _startMetroTick: function(timeTag) {
      var self = this
      if (this._metroHandle === null) {
        this._metroHandle = pdGlob.clock.schedule(function(event) {
          self._metroTick(event.timeTag)
        }, timeTag, this.rate)
      }
    },

    _stopMetroTick: function() {
      if (this._metroHandle !== null) {
        pdGlob.clock.unschedule(this._metroHandle)
        this._metroHandle = null
      }
    },

    _restartMetroTick: function(timeTag) {
      // If a rate change was made and `_restartMetroTick` is called before the next tick,
      // we should do this to avoid `_restartMetroTick` to be called twice recursively,
      // which would cause _metroHandle to not be unscheduled properly... 
      if (this._metroTick === this._metroTickRateChange)
        this._metroTick = this._metroTickNormal
      this._stopMetroTick()
      this._startMetroTick(timeTag)
    },

    _metroTickNormal: function(timeTag) { 
      this.outlets[0].message(utils.timeTag(['bang'], timeTag))
    },

    // On next tick, restarts the interval and switches to normal ticking.
    _metroTickRateChange: function(timeTag) {
      this._metroTick = this._metroTickNormal
      this._restartMetroTick(timeTag)
    }
  })

  library['delay'] = library['del'] = PdObject.extend({

    type: 'delay',

    inletDefs: [

      portlets.Inlet.extend({
        message: function(args) {
          var msg = args[0]
          if (msg === 'bang') {
            this.obj._stopDelay()
            this.obj._startDelay(utils.getTimeTag(args))
          } else if (msg === 'stop') {
            this.obj._stopDelay() 
          } else {
            this.obj.setDelay(msg)
            this.obj._stopDelay()
            this.obj._startDelay(utils.getTimeTag(args))
          }
        }
      }),
      
      portlets.Inlet.extend({
        message: function(args) {
          var delay = args[0]
          this.obj.setDelay(delay)
        }
      })

    ],

    outletDefs: [portlets.Outlet],

    init: function(args) {
      var delay = args[0]
      this.setDelay(delay || 0)
      this._delayHandle = null
    },

    // Delay time, in ms
    setDelay: function(delay) {
      if (!_.isNumber(delay))
        return console.error('invalid [delay] length ' + delay)
      this.delay = delay
    },

    destroy: function() {
      this._stopDelay()
    },

    _startDelay: function(timeTag) {
      var self = this
      if (this._delayHandle === null) {
        this._delayHandle = pdGlob.clock.schedule(function() {
          self.outlets[0].message(['bang'])
        }, timeTag + this.delay)
      }
    },

    _stopDelay: function() {
      if (this._delayHandle !== null) {
        pdGlob.clock.unschedule(this._delayHandle)
        this._delayHandle = null
      }
    }
  })

  // TODO: How does it work in pd ?
  library['timer'] = PdObject.extend({

    type: 'timer',

    inletDefs: [

      portlets.Inlet.extend({
        message: function(args) {
          var msg = args[0]
          if (msg !== 'bang')
            return console.error('invalid command for [timer] ' + msg)
          this.obj.refTime = utils.getTimeTag(args)
        }
      }),

      portlets.Inlet.extend({
        message: function(args) {
          var msg = args[0]
          if (msg !== 'bang')
            return console.error('invalid command for [timer] ' + msg)
          this.obj.outlets[0].message(utils.timeTag([utils.getTimeTag(args) - this.obj.refTime], args))
        }
      })

    ],
    
    outletDefs: [portlets.Outlet],

    init: function() {
      // Reference time, the timer count starts from this  
      this.refTime = 0
    }

  })

  library['change'] = PdObject.extend({

    type: 'change',

    inletDefs: [
      portlets.Inlet.extend({
        message: function(args) {
          var val = args[0]
          if (val !== this.obj.last) {
            this.obj.last = val
            this.obj.o(0).message(utils.timeTag([val], args))
          }
        }
      })
    ],
    
    outletDefs: [portlets.Outlet],

    init: function() {
      this.last = null
    }

  })

  library['array'] = library['table'] = PdObject.extend(mixins.NamedMixin, mixins.EventEmitterMixin, {

    type: 'array',

    nameIsUnique: true,

    init: function(args) {
      var name = args[0]
        , size = args[1] || 100
      if (name) this.setName(name)
      this.size = size
      this.data = new Float32Array(size)
    },

    destroy: function() {
      mixins.NamedMixin.destroy.apply(this, arguments)
      mixins.EventEmitterMixin.destroy.apply(this, arguments)
    },

    setData: function(audioData, resize) {
      if (resize) this.data = new Float32Array(audioData.length)
      this.data.set(audioData.subarray(0, Math.min(this.data.length, audioData.length)))
      this.size = this.data.length
      this.emit('changed:data')
    }

  })

  library['soundfiler'] = PdObject.extend({

    type: 'soundfiler',

    inletDefs: [
      portlets.Inlet.extend({
        message: function(args) {
          var self = this
            , command = args[0]
            , doResize = false
            , arg, url, arrayNames
          args = args.slice(1)
          if (command === 'read') {
            
            // Handle options
            while (args.length && args[0][0] === '-') {
              arg = args.shift()
              if (arg === '-resize') doResize = true
              
              else if (arg === '-wave' && arg === '-aiff'
                    && arg === '-nextstep' && arg === '-raw'
                    && arg === '-bytes' && arg === '-nframes')
                return console.error(arg + ' not supported')
              else return console.error(arg + ' not understood')
            }

            // Handle url to load and arrays to load the sound data to
            url = args.shift()
            arrayNames = args

            // GET the audio resource 
            pdGlob.storage.get(url, function(err, arrayBuffer) {
              if (err) return console.error('could not load file : ' + err)

              // Try to decode it
              pdGlob.audio.decode(arrayBuffer, function(err, audioData) {
                if (err) return console.error('Could not decode file : ' + err)

                var array, arrays, channelData

                arrays = arrayNames.map(function(arrayName) {
                  array = pdGlob.namedObjects.get('array', arrayName)[0]
                  if (!array) {
                    console.error('array "' + arrayName + '" not found')
                    return null
                  } else return array
                })

                if (_.contains(arrays, null)) return
                if (_.uniq(_.pluck(arrays, 'size')).length !== 1)
                  doResize = true


                // For each array, set the data
                arrays.forEach(function(array, i) {
                  channelData = audioData[i]
                  if (!channelData) return
                  array.setData(channelData, doResize)
                })

                // Send the amount of frames read to the outlet 
                self.obj.o(0).message([Math.min(arrays[0].size, audioData[0].length)])
              })
            })

          } else console.error('command "' + command + '" is not supported')
        }
      })
    ],
    
    outletDefs: [ portlets.Outlet ]

  })

  library['pd'] = library['graph'] = Patch

}

},{"./core/Patch":5,"./core/PdObject":6,"./core/mixins":9,"./core/utils":11,"./global":12,"./waa/portlets":17,"underscore":23}],14:[function(require,module,exports){
/*
 * Copyright (c) 2011-2015 Chris McCormick, Sébastien Piquemal <sebpiq@gmail.com>
 *
 *  This file is part of WebPd. See https://github.com/sebpiq/WebPd for documentation
 *
 *  WebPd is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WebPd is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with WebPd.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
var _ = require('underscore')

exports.declareObjects = function(library) {
  require('./glue').declareObjects(library)
  require('./controls').declareObjects(library)
  require('./waa/dsp').declareObjects(library)
  require('./waa/portlets').declareObjects(library)
}
},{"./controls":2,"./glue":13,"./waa/dsp":15,"./waa/portlets":17,"underscore":23}],15:[function(require,module,exports){
/*
 * Copyright (c) 2011-2015 Chris McCormick, Sébastien Piquemal <sebpiq@gmail.com>
 *
 *  This file is part of WebPd. See https://github.com/sebpiq/WebPd for documentation
 *
 *  WebPd is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WebPd is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with WebPd.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

var _ = require('underscore')
  , WAAOffset = require('waaoffsetnode')
  , WAAWhiteNoise = require('waawhitenoisenode')
  , WAATableNode = require('waatablenode')
  , utils = require('../core/utils')
  , mixins = require('../core/mixins')
  , PdObject = require('../core/PdObject')
  , portlets = require('./portlets')
  , pdGlob = require('../global')

exports.declareObjects = function(library) {

  var _OscBase = PdObject.extend({

    inletDefs: [

      portlets.DspInlet.extend({
        message: function(args) {
          var frequency = args[0]
          if (!this.hasDspSource()) {
            if (!_.isNumber(frequency))
              return console.error('invalid [' + this.obj.type + '] frequency ' + frequency)
            if (frequency === Infinity) frequency = 0
            this.obj.frequency = frequency
            this.obj._updateFrequency(utils.getTimeTag(args))
          }
        }
      }),

      portlets.Inlet.extend({
        message: function(args) {
          var phase = args[0]
          if (!_.isNumber(phase))
            return console.error('invalid [' + this.obj.type + '] phase ' + phase)
          this.obj._updatePhase(phase, utils.getTimeTag(args))
        }
      })

    ],

    outletDefs: [portlets.DspOutlet],

    init: function(args) {
      this.frequency = args[0] || 0
    },

    start: function() {
      this._createOscillator(0, 0)
    },

    stop: function() {
      this._destroyOscillator()
    },

    _updateFrequency: function(timeTag) {
      if (this._oscNode)
        this._oscNode.frequency.setValueAtTime(this.frequency, timeTag / 1000)
    },

    _updatePhase: function(phase, timeTag) {
      if (pdGlob.isStarted)
        this._createOscillator(phase, timeTag)
    }

  })


  // TODO : When phase is set, the current oscillator will be immediately disconnected,
  // while ideally, it should be disconnected only at `timeTag` 
  library['osc~'] = _OscBase.extend({

    type: 'osc~',

    _createOscillator: function(phase, timeTag) {
      phase = phase * 2 * Math.PI 
      this._oscNode = pdGlob.audio.context.createOscillator()
      this._oscNode.setPeriodicWave(pdGlob.audio.context.createPeriodicWave(
        new Float32Array([0, Math.cos(phase)]),
        new Float32Array([0, Math.sin(-phase)])
      ))
      this._oscNode.start(timeTag / 1000)
      this.o(0).setWaa(this._oscNode, 0)
      this.i(0).setWaa(this._oscNode.frequency, 0)
      this.i(0).message([this.frequency])
    },

    _destroyOscillator: function() {
      this._oscNode.stop(0)
      this._oscNode = null
    }

  })


  library['phasor~'] = _OscBase.extend({

    type: 'phasor~',

    _createOscillator: function(phase, timeTag) {
      this._gainNode = pdGlob.audio.context.createGain()
      this._gainNode.gain.value = 0.5

      this._oscNode = pdGlob.audio.context.createOscillator()
      this._oscNode.type = 'sawtooth'
      this._oscNode.start(timeTag / 1000)
      this._oscNode.connect(this._gainNode)
      
      this._offsetNode = new WAAOffset(pdGlob.audio.context)
      this._offsetNode.offset.value = 1
      this._offsetNode.connect(this._gainNode)

      this.o(0).setWaa(this._gainNode, 0)
      this.i(0).setWaa(this._oscNode.frequency, 0)
      this.i(0).message([this.frequency])
    },

    _destroyOscillator: function() {
      this._oscNode.stop(0)
      this._oscNode = null
      this._gainNode = null
      this._offsetNode = null
    }

  })


  library['triangle~'] = _OscBase.extend({

    type: 'triangle~',

    _createOscillator: function(phase, timeTag) {
      this._oscNode = pdGlob.audio.context.createOscillator()
      this._oscNode.type = 'triangle'
      this._oscNode.start(timeTag / 1000)
      this.o(0).setWaa(this._oscNode, 0)
      this.i(0).setWaa(this._oscNode.frequency, 0)
      this.i(0).message([this.frequency])
    },

    _destroyOscillator: function() {
      this._oscNode.stop(0)
      this._oscNode = null
    }

  })


  library['square~'] = _OscBase.extend({

    type: 'square~',

    _createOscillator: function(phase, timeTag) {
      this._oscNode = pdGlob.audio.context.createOscillator()
      this._oscNode.type = 'square'
      this._oscNode.start(timeTag / 1000)
      this.o(0).setWaa(this._oscNode, 0)
      this.i(0).setWaa(this._oscNode.frequency, 0)
      this.i(0).message([this.frequency])
    },

    _destroyOscillator: function() {
      this._oscNode.stop(0)
      this._oscNode = null
    }

  })


  // NB : This should work, but for now it doesn't seem to.
  // issues filed for chrome here : https://code.google.com/p/chromium/issues/detail?id=471675
  // and firefox here : https://bugzilla.mozilla.org/show_bug.cgi?id=1149053

  // Another possible technique would be to use 2 WaveShaperNodes one with the sign function, 
  // The other with acos.

  // TODO : When phase is set, the current oscillator will be immediately disconnected,
  // while ideally, it should be disconnected only at `futureTime`
  // TODO: phase
  /*library['phasor~'] = _OscBase.extend({

    type: 'phasor~',

    start: function() {
      this._createOscillator(0)
    },

    stop: function() {
      this._bufferSource.stop(0)
      this._bufferSource = null
    },

    _createOscillator: function(phase) {
      var sampleRate = pdGlob.audio.context.sampleRate
        , buffer = pdGlob.audio.context.createBuffer(1, sampleRate, sampleRate)
        , array = buffer.getChannelData(0)
        , acc = phase, step = 1 / sampleRate, i

      for (i = 0; i < sampleRate; i++) {
        array[i] = (acc % 1)
        acc += step
      }

      this._bufferSource = pdGlob.audio.context.createBufferSource()
      this._bufferSource.buffer = buffer
      this._bufferSource.loop = true
      this._bufferSource.start(pdGlob.futureTime / 1000 || 0)
      
      this.o(0).setWaa(this._bufferSource, 0)
      this.i(0).setWaa(this._bufferSource.playbackRate, 0)
      this.i(0).message([this.frequency])
    },

    _updateFrequency: function() {
      if (this._bufferSource)
        this._bufferSource.playbackRate.setValueAtTime(this.frequency, pdGlob.futureTime / 1000 || 0)
    },

    _updatePhase: function(phase) {
      if (pdGlob.isStarted)
        this._createOscillator(phase)
    }

  })*/


  library['noise~'] = PdObject.extend({

    type: 'noise~',

    outletDefs: [portlets.DspOutlet],

    start: function() {
      this._noiseNode = new WAAWhiteNoise(pdGlob.audio.context)
      this._noiseNode.start(0)
      this.o(0).setWaa(this._noiseNode, 0)
    },

    stop: function() {
      this._noiseNode.stop(0)
      this._noiseNode.disconnect()
      this._noiseNode = null
    }

  })

  // TODO : doesn't work when interrupting a line (probably)
  library['line~'] = PdObject.extend({

    type: 'line~',

    inletDefs: [

      portlets.Inlet.extend({

        init: function() {
          this._queue = []
          this._lastValue = 0
        },

        message: function(args) {
          var self = this
          if (this.obj._offsetNode) {
            var v2 = args[0]
              , t1 = utils.getTimeTag(args)
              , duration = args[1] || 0

            // Deal with arguments
            if (!_.isNumber(v2))
              return console.error('invalid [line~] value ' + v2)
            if (duration) {
              if (!_.isNumber(duration))
                return console.error('invalid [line~] duration ' + duration)
            }

            // Refresh the queue to current time and push the new line
            this._refreshQueue(pdGlob.audio.time)
            var newLines = this._pushToQueue(t1, v2, duration)

            // Cancel everything that was after the new lines, and schedule them
            this.obj._offsetNode.offset.cancelScheduledValues(newLines[0].t1 / 1000 + 0.000001)
            newLines.forEach(function(line) {
              if (line.t1 !== line.t2)
                self.obj._offsetNode.offset.linearRampToValueAtTime(line.v2, line.t2 / 1000)
              else
                self.obj._offsetNode.offset.setValueAtTime(line.v2, line.t2 / 1000)
            })
          }
        },

        _interpolate: function(line, time) {
          return (time - line.t1) * (line.v2 - line.v1) / (line.t2 - line.t1) + line.v1
        },

        // Refresh the queue to `time`, removing old lines and setting `_lastValue`
        // if appropriate.
        _refreshQueue: function(time) {
          if (this._queue.length === 0) return
          var i = 0, line, oldLines
          while ((line = this._queue[i++]) && time >= line.t2) 1
          oldLines = this._queue.slice(0, i - 1)
          this._queue = this._queue.slice(i - 1)
          if (this._queue.length === 0)
            this._lastValue = oldLines[oldLines.length - 1].v2
        },

        // push a line to the queue, overriding the lines that were after it,
        // and creating new lines if interrupting something in its middle.
        _pushToQueue: function(t1, v2, duration) {
          var i = 0, line, newLines = []
          
          // Find the point in the queue where we should insert the new line.
          while ((line = this._queue[i++]) && (t1 >= line.t2)) 1
          this._queue = this._queue.slice(0)

          if (this._queue.length) {
            var lastLine = this._queue[this._queue.length - 1]

            // If the new line interrupts the last in the queue, we have to interpolate
            // a new line
            if (t1 < lastLine.t2) {
              this._queue = this._queue.slice(0, -1)
              line = {
                t1: lastLine.t1, v1: lastLine.v1,
                t2: t1, v2: this._interpolate(lastLine, t1)
              }
              newLines.push(line)
              this._queue.push(line)

            // Otherwise, we have to fill-in the gap with a straight line
            } else if (t1 > lastLine.t2) {
              line = {
                t1: lastLine.t2, v1: lastLine.v2,
                t2: t1, v2: lastLine.v2
              }
              newLines.push(line)
              this._queue.push(line)
            }

          // If there isn't any value in the queue yet, we fill in the gap with
          // a straight line from `_lastValue` all the way to `t1` 
          } else {
            line = {
              t1: 0, v1: this._lastValue,
              t2: t1, v2: this._lastValue
            }
            newLines.push(line)
            this._queue.push(line)
          }

          // Finally create the line and add it to the queue
          line = {
            t1: t1, v1: this._queue[this._queue.length - 1].v2,
            t2: t1 + duration, v2: v2
          }
          newLines.push(line)
          this._queue.push(line)
          return newLines
        }

      })

    ],

    outletDefs: [portlets.DspOutlet],

    start: function() {
      this._offsetNode = new WAAOffset(pdGlob.audio.context)
      this._offsetNode.offset.setValueAtTime(0, 0)
      this.o(0).setWaa(this._offsetNode, 0)
    },

    stop: function() {
      this._offsetNode = null
    }

  })


  library['sig~'] = PdObject.extend({

    type: 'sig~',

    inletDefs: [

      portlets.Inlet.extend({
        message: function(args) {
          var value = args[0]
          if (!_.isNumber(value))
            return console.error('invalid [sig~] value ' + value)
          this.obj.value = value
          if (this.obj._offsetNode)
            this.obj._offsetNode.offset.setValueAtTime(value, utils.getTimeTag(args) / 1000)
        }
      })

    ],

    outletDefs: [portlets.DspOutlet],

    init: function(args) {
      this.value = args[0] || 0
    },

    start: function() {
      this._offsetNode = new WAAOffset(pdGlob.audio.context)
      this._offsetNode.offset.setValueAtTime(0, 0)
      this.o(0).setWaa(this._offsetNode, 0)
      this.i(0).message([this.value])
    },

    stop: function() {
      this._offsetNode = null
    }

  })


  var _FilterFrequencyInletMixin = {
    message: function(args) {
      var frequency = args[0]
      if (!_.isNumber(frequency))
        return console.error('invalid [' + this.obj.type + '] frequency ' + frequency)
      this.obj.frequency = frequency
      if (this.obj._filterNode)
        this.obj._filterNode.frequency.setValueAtTime(frequency, utils.getTimeTag(args) / 1000)
    }
  }

  var _FilterQInletMixin = {
    message: function(args) {
      var Q = args[0]
      if (!_.isNumber(Q))
        return console.error('invalid [' + this.obj.type + '] Q ' + Q)
      this.obj.Q = Q
      if (this.obj._filterNode)
        this.obj._filterNode.Q.setValueAtTime(Q, utils.getTimeTag(args) / 1000)
    }
  }

  var _BaseFilter = PdObject.extend({

    inletDefs: [portlets.DspInlet, portlets.Inlet.extend(_FilterFrequencyInletMixin)],
    outletDefs: [portlets.DspOutlet],

    init: function(args) {
      this.frequency = args[0] || 0
    },

    start: function() {
      this._filterNode = pdGlob.audio.context.createBiquadFilter()
      this._filterNode.frequency.setValueAtTime(this.frequency, 0)
      this._filterNode.type = this.waaFilterType
      this.i(0).setWaa(this._filterNode, 0)
      this.o(0).setWaa(this._filterNode, 0)
      this.i(1).message([this.frequency])
    },

    stop: function() {
      this._filterNode = null
    }

  })

  var _BaseBandFilter = _BaseFilter.extend({
    waaFilterType: 'bandpass',

    init: function(args) {
      _BaseFilter.prototype.init.call(this, args)
      this.Q = args[1] || 1
    },

    start: function(args) {
      _BaseFilter.prototype.start.call(this, args)
      this._filterNode.Q.setValueAtTime(this.Q, 0)
      this.i(2).message([this.Q])
    }

  })


  // TODO: tests for filters
  library['lop~'] = _BaseFilter.extend({
    type: 'lop~',
    waaFilterType: 'lowpass'
  })


  library['hip~'] = _BaseFilter.extend({
    type: 'hip~',
    waaFilterType: 'highpass'
  })


  library['bp~'] = _BaseBandFilter.extend({
    type: 'bp~',

    inletDefs: [
      portlets.DspInlet,
      portlets.Inlet.extend(_FilterFrequencyInletMixin),
      portlets.Inlet.extend(_FilterQInletMixin)
    ]
  })


  library['vcf~'] = _BaseBandFilter.extend({
    type: 'vcf~',

    inletDefs: [
      portlets.DspInlet,
      portlets.DspInlet.extend(_FilterFrequencyInletMixin),
      portlets.Inlet.extend(_FilterQInletMixin)
    ],

    start: function(args) {
      _BaseBandFilter.prototype.start.call(this, args)
      this.i(1).setWaa(this._filterNode.frequency, 0)
    }

  })


  var _DspArithmBase = PdObject.extend({

    outletDefs: [portlets.DspOutlet],

    init: function(args) {
      var val = args[0]
      this.setVal(val || 0)
    },

    setVal: function(val) {
      if (!_.isNumber(val))
        return console.error('invalid [' + this.obj.type + '] value ' + val)
      this.val = val
    }

  })

  // Mixin for inlet 1 of Dsp arithmetics objects *~, +~, ...
  var _DspArithmValInletMixin = {
    
    message: function(args) {
      var val = args[0]
      this.obj.setVal(val)
      if (!this.hasDspSource()) this._setValNoDsp(val, utils.getTimeTag(args))
    },
    
    disconnection: function(outlet) {
      portlets.DspInlet.prototype.disconnection.apply(this, arguments) 
      if (outlet instanceof portlets.DspOutlet && !this.hasDspSource())
        this._setValNoDsp(this.obj.val, 0)
    }
  }


  library['*~'] = _DspArithmBase.extend({
    type: '*~',

    inletDefs: [

      portlets.DspInlet,

      portlets.DspInlet.extend(_DspArithmValInletMixin, {
        _setValNoDsp: function(val, timeTag) {
          if (this.obj._gainNode)
            this.obj._gainNode.gain.setValueAtTime(val, timeTag / 1000)
        }
      })

    ],

    start: function() {
      this._gainNode = pdGlob.audio.context.createGain()
      this.i(0).setWaa(this._gainNode, 0)
      this.i(1).setWaa(this._gainNode.gain, 0)
      this.o(0).setWaa(this._gainNode, 0)
      if (!this.i(1).hasDspSource()) this.i(1)._setValNoDsp(this.val, 0)
    },

    stop: function() {
      this._gainNode = null
    }

  })


  library['+~'] = _DspArithmBase.extend({
    type: '+~',

    inletDefs: [

      portlets.DspInlet,

      portlets.DspInlet.extend(_DspArithmValInletMixin, {
        _setValNoDsp: function(val, timeTag) { 
          if (this.obj._offsetNode)
            this.obj._offsetNode.offset.setValueAtTime(val, timeTag / 1000)
        }
      })

    ],

    start: function() {
      this._offsetNode = new WAAOffset(pdGlob.audio.context)
      this._gainNode = pdGlob.audio.context.createGain()
      this._gainNode.gain.value = 1
      this._offsetNode.offset.value = 0
      this._offsetNode.connect(this._gainNode, 0, 0)
      this.i(0).setWaa(this._gainNode, 0)
      this.i(1).setWaa(this._offsetNode.offset, 0)
      this.o(0).setWaa(this._gainNode, 0)
      if (!this.i(1).hasDspSource()) this.i(1)._setValNoDsp(this.val, 0)
    },

    stop: function() {
      this._offsetNode.disconnect()
      this._gainNode = null
      this._offsetNode = null
    }

  })


  library['-~'] = _DspArithmBase.extend({
    type: '-~',

    inletDefs: [

      portlets.DspInlet,

      portlets.DspInlet.extend(_DspArithmValInletMixin, {
        _setValNoDsp: function(val, timeTag) { 
          if (this.obj._offsetNode)
            this.obj._offsetNode.offset.setValueAtTime(val, timeTag / 1000)
        }
      })

    ],

    start: function() {
      this._offsetNode = new WAAOffset(pdGlob.audio.context)
      this._gainNode = pdGlob.audio.context.createGain()
      this._negateGainNode = pdGlob.audio.context.createGain()
      this._gainNode.gain.value = 1
      this._negateGainNode.gain.value = -1
      this._offsetNode.offset.value = 0
      this._offsetNode.connect(this._negateGainNode, 0, 0)
      this._negateGainNode.connect(this._gainNode, 0, 0)
      this.i(0).setWaa(this._gainNode, 0)
      this.i(1).setWaa(this._offsetNode.offset, 0)
      this.o(0).setWaa(this._gainNode, 0)
      if (!this.i(1).hasDspSource()) this.i(1)._setValNoDsp(this.val, 0)
    },

    stop: function() {
      this._negateGainNode.disconnect()
      this._offsetNode.disconnect()
      this._gainNode = null
      this._negateGainNode = null
      this._offsetNode = null
    }

  })

  // Baseclass for tabwrite~, tabread~ and others ...
  var _TabBase = PdObject.extend({

    init: function(args) {
      var self = this
      this.array = new mixins.Reference('array')
      this._onDataChangedHandler = null
      this._eventReceiver = new mixins.EventReceiver()

      // When name of the referenced array is changing, we need to detach handlers
      this._eventReceiver.on(this.array, 'changed', function(newArray, oldArray) {
        if (oldArray) oldArray.removeListener('changed:data', self._onDataChangedHandler)
        if (newArray) {
          self._onDataChangedHandler = function() { self.dataChanged() }
          self._eventReceiver.on(newArray, 'changed:data', self._onDataChangedHandler)
        }
      })
    },

    dataChanged: function() {},

    destroy: function() {
      this._eventReceiver.destroy()
      this.array.destroy()
    }

  })

  // TODO: tabread4~
  // TODO: when array's data changes, this should update the node
  library['tabread~'] = library['tabread4~'] = _TabBase.extend({
    type: 'tabread~',

    inletDefs: [
      portlets.DspInlet.extend({
        
        message: function(args) {
          var method = args[0]
          if (method === 'set')
            this.obj.array.set(args[1])
          else
            console.error('unknown method ' + method)
        },

        connection: function() {
          portlets.DspInlet.prototype.connection.apply(this, arguments)
          this.obj._updateDsp()
        },

        disconnection: function() {
          portlets.DspInlet.prototype.disconnection.apply(this, arguments)
          this.obj._updateDsp()
        }

      })
    ],

    outletDefs: [portlets.DspOutlet],

    init: function(args) {
      var self = this
        , arrayName = args[0]
      _TabBase.prototype.init.apply(this, arguments)
      this._eventReceiver.on(this.array, 'changed', function() { self._updateDsp() })
      if (arrayName) this.array.set(arrayName)
    },

    start: function() {
      this._tableNode = new WAATableNode(pdGlob.audio.context)
      this._gainNode = pdGlob.audio.context.createGain()
      this.i(0).setWaa(this._tableNode.position, 0)
      this.o(0).setWaa(this._gainNode, 0)
      this._updateDsp()
    },

    stop: function() {
      this._tableNode = null
      this._gainNode = null
    },

    dataChanged: function() {
      if (this._tableNode) this._tableNode.table = this.array.resolved.data
    },

    _updateDsp: function() {
      if (this._tableNode && this.array.resolved && this.i(0).hasDspSource()) {
        this._tableNode.table = this.array.resolved.data
        this._tableNode.connect(this._gainNode)
      } else if (this._tableNode) {
        this._tableNode.disconnect()
      }
    }

  })

  library['delwrite~'] = PdObject.extend(mixins.NamedMixin, mixins.EventEmitterMixin, {

    type: 'delwrite~',

    inletDefs: [portlets.DspInlet],

    init: function(args) {
      var name = args[0]
        , maxDelayTime = args[1]
      this.maxDelayTime = maxDelayTime || 1000
      if (name) this.setName(name)
    },

    start: function() {
      this._pipeNode = pdGlob.audio.context.createGain()
      this.i(0).setWaa(this._pipeNode, 0)
      this.emit('started')
    },

    stop: function() {
      this._pipeNode.disconnect()
      this._pipeNode = null
    },

    destroy: function() {
      mixins.NamedMixin.destroy.apply(this, arguments)
      mixins.EventEmitterMixin.destroy.apply(this, arguments)
    }

  })

  library['delread~'] = library['vd~'] = PdObject.extend({

    type: 'delread~',

    inletDefs: [
      portlets.DspInlet.extend({
        message: function(args) {
          var delayTime = args[0]
          this.obj.setDelayTime(delayTime, utils.getTimeTag(args))
        }
      })
    ],
    outletDefs: [portlets.DspOutlet],

    init: function(args) {
      var self = this
        , delayName = args[0]
        , initialDelayTime = args[1]
      this._eventReceiver = new mixins.EventReceiver()
      this._delayTime = initialDelayTime || 0
      this._delWrite = new mixins.Reference('delwrite~')
      this._onDelWriteStarted = null
      if (delayName) this._delWrite.set(delayName)
    },

    start: function() {
      this._createDelay()
      this._onDelWriteChanged = function(newObj, oldObj) {
        if (pdGlob.isStarted && newObj) self._createDelay()
      }
      this._eventReceiver.on(this._delWrite, 'changed', this._onDelWriteChanged)
    },

    stop: function() {
      this._toSecondsGain = null
      this._delayNode.disconnect()
      this._delayNode = null
      this._delWrite.removeListener('changed', this._onDelWriteChanged)
      this._onDelWriteChanged = null
    },

    destroy: function() {
      this._delWrite.destroy()
      this._eventReceiver.destroy()
    },

    setDelayTime: function(delayTime, timeTag) {
      if (!_.isNumber(delayTime))
        return console.error('invalid [delread~] length ' + delayTime)
      this._delayTime = delayTime
      if (this._delayNode && !this.i(0).hasDspSource())
        this._delayNode.delayTime.setValueAtTime(this._delayTime / 1000, timeTag / 1000 || 0)
    },

    _createDelay: function() {
      if (this._delayNode) this._delayNode.disconnect()
      var maxDelayTime = this._delWrite.resolved ? this._delWrite.resolved.maxDelayTime / 1000 : 1
        , self = this
      this._delayNode = pdGlob.audio.context.createDelay(maxDelayTime)

      if (!this._toSecondsGain) {
        this._toSecondsGain = pdGlob.audio.context.createGain()
        this._toSecondsGain.gain.value = 0.001
        this.i(0).setWaa(this._toSecondsGain, 0)
      }

      this._toSecondsGain.connect(this._delayNode.delayTime)
      this.o(0).setWaa(this._delayNode, 0)
      this.setDelayTime(this._delayTime)
      if (this._delWrite.resolved) {
        var doConnection = function() { self._delWrite.resolved._pipeNode.connect(self._delayNode) }
        if (this._delWrite.resolved._pipeNode)
          doConnection()
        else {
          this._onDelWriteStarted = doConnection
          this._eventReceiver.once(this._delWrite.resolved, 'started', this._onDelWriteStarted)
        }
      }
        
    }

  })


  // TODO : should change curve in the future
  library['clip~'] = PdObject.extend({

    type: 'clip~',

    inletDefs: [

      portlets.DspInlet,

      portlets.Inlet.extend({
        message: function(args) {
          var minValue = args[0]
          if (!_.isNumber(minValue))
            return console.error('invalid [clip~] min ' + minValue)
          this.obj.minValue = minValue
          this.obj._updateGains()
        }
      }),

      portlets.Inlet.extend({
        message: function(args) {
          var maxValue = args[0]
          if (!_.isNumber(maxValue))
            return console.error('invalid [clip~] max ' + maxValue)
          this.obj.maxValue = maxValue
          this.obj._updateGains()
        }
      })

    ],

    outletDefs: [portlets.DspOutlet],

    init: function(args) {
      this.minValue = args[0] || 0
      this.maxValue = args[1] || 0
    },

    start: function() {
      this._gainInNode = pdGlob.audio.context.createGain()
      this._gainOutNode = pdGlob.audio.context.createGain()
      this._waveShaperNode = pdGlob.audio.context.createWaveShaper()

      this._gainInNode.connect(this._waveShaperNode)
      //this._waveShaperNode.connect(this._gainOutNode)
      
      this.i(0).setWaa(this._gainInNode, 0)
      //this.o(0).setWaa(this._gainOutNode, 0)
      this.o(0).setWaa(this._waveShaperNode, 0)

      this._updateGains()
    },

    stop: function() {
      this._gainInNode = null
      this._waveShaperNode = null
      this._gainOutNode.disconnect()
      this._gainOutNode = null
    },

    _updateGains: function() {
      if (this._waveShaperNode) {
        var bound = Math.max(Math.abs(this.minValue), Math.abs(this.maxValue))
          , sampleRate = pdGlob.audio.sampleRate
          , curve = new Float32Array(sampleRate)
          , i, acc = -bound, k = bound * 2 / sampleRate
        for (i = 0; i < sampleRate; i++) {
          if (acc >= this.minValue && acc <= this.maxValue) curve[i] = acc
          else if (acc > this.maxValue) curve[i] = this.maxValue
          else curve[i] = this.minValue
          acc += k
        }
        this._waveShaperNode.curve = curve
        this._gainInNode.gain.setValueAtTime(bound !== 0 ? 1 / bound : 0, 0)
        //this._gainOutNode.gain.setValueAtTime(bound, 0)
      }
    }

  })


  library['dac~'] = PdObject.extend({
    type: 'dac~',

    endPoint: true,

    inletDefs: [portlets.DspInlet, portlets.DspInlet],

    start: function() {
      this.i(0).setWaa(pdGlob.audio.channels[0], 0)
      this.i(1).setWaa(pdGlob.audio.channels[1], 0)
    }

  })


  library['adc~'] = PdObject.extend({
    type: 'adc~',

    outletDefs: [portlets.DspOutlet, portlets.DspOutlet],

    init: function() {
      this.stream = null
    },

    start: function() {
      var self = this
      if (this.stream) this._updateSource()
      else {
        this.o(0).setWaa(pdGlob.audio.context.createGain(), 0)
        this.o(1).setWaa(pdGlob.audio.context.createGain(), 0)
        pdGlob.audio.getUserMedia(function(err, stream) {
          if (err) return console.error('error obtaining mic input : ' + err)
          self.stream = stream
          if (pdGlob.isStarted) self._updateSource()
        })
      }
    },

    stop: function() {
      this._sourceNode.disconnect()
      this._sourceNode = null
      this._splitterNode = null
    },

    _updateSource: function() {
      if (this.stream) {
        this._sourceNode = pdGlob.audio.context.createMediaStreamSource(this.stream)
        this._splitterNode = pdGlob.audio.context.createChannelSplitter(2)
        this._sourceNode.connect(this._splitterNode)
        this.o(0).setWaa(this._splitterNode, 0)
        this.o(1).setWaa(this._splitterNode, 1)
      }
    }

  })

}

},{"../core/PdObject":6,"../core/mixins":9,"../core/utils":11,"../global":12,"./portlets":17,"underscore":23,"waaoffsetnode":29,"waatablenode":31,"waawhitenoisenode":33}],16:[function(require,module,exports){
/*
 * Copyright (c) 2011-2015 Chris McCormick, Sébastien Piquemal <sebpiq@gmail.com>
 *
 *  This file is part of WebPd. See https://github.com/sebpiq/WebPd for documentation
 *
 *  WebPd is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WebPd is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with WebPd.  If not, see <http://www.gnu.org/licenses/>.
 *
 */


var _ = require('underscore')
  , getUserMedia = require('getusermedia')
  , WAAClock = require('waaclock')
  , pdGlob = require('../global')


var Audio = exports.Audio = function(opts) {
  if (typeof AudioContext === 'undefined') 
    return console.error('this environment doesn\'t support Web Audio API')
  this.channelCount = opts.channelCount
  this.setContext(opts.audioContext || new AudioContext)
  this.sampleRate = this.context.sampleRate
  this.stream = null
  Object.defineProperty(this, 'time', {
    get: function() { return this.context.currentTime * 1000 },
  })
}

Audio.prototype.start = function() {}

Audio.prototype.stop = function() {}

Audio.prototype.decode = function(arrayBuffer, done) {
  this.context.decodeAudioData(arrayBuffer, 
    function(audioBuffer) {
      var chArrays = [], ch
      for (ch = 0; ch < audioBuffer.numberOfChannels; ch++)
        chArrays.push(audioBuffer.getChannelData(ch))
      done(null, chArrays)
    },
    function(err) {
      done(new Error('error decoding ' + err))
    }
  )
}

Audio.prototype.getUserMedia = function(done) {
  var self = this
  if (this.stream) done(null, this.stream)
  else {
    getUserMedia({
      audio: {
        mandatory: {
          googEchoCancellation: false,
          googAutoGainControl: false,
          googNoiseSuppression: false,
          googTypingNoiseDetection: false
        }
      }
    }, function (err, stream) {
      self.stream = stream
      done(err, stream)
    })
  }
}

// TODO: This is just a hack to be able to override the AudioContext automatically
// created. A cleaner public API for this would be good
Audio.prototype.setContext = function(context) {
  var ch
  this.context = context
  this._channelMerger = this.context.createChannelMerger(this.channelCount)
  this._channelMerger.connect(this.context.destination)
  this.channels = []
  for (ch = 0; ch < this.channelCount; ch++) {
    this.channels.push(this.context.createGain())
    this.channels[ch].connect(this._channelMerger, 0, ch)
  }
}


// A little wrapper to WAAClock, to implement the Clock interface.
var Clock = exports.Clock = function(opts) {
  var self = this
  this._audioContext = opts.audioContext
  this._waaClock = opts.waaClock || new WAAClock(opts.audioContext)
  this._waaClock.start()
  Object.defineProperty(this, 'time', {
    get: function() { return self._audioContext.currentTime * 1000 }
  })
}

Clock.prototype.schedule = function(func, time, repetition) {
  var _func = function(event) {
      // In case the event is executed immediately
      if (event.timeTag == undefined)
        event.timeTag = event.deadline * 1000 
      func(event)
    }
    , event = this._waaClock.callbackAtTime(_func, time / 1000)

  Object.defineProperty(event, 'timeTag', {
    get: function() { return this.deadline * 1000 }
  })

  if (_.isNumber(repetition)) event.repeat(repetition / 1000)
  return event
}

Clock.prototype.unschedule = function(event) {
  event.clear()
}


var WebStorage = exports.Storage = function() {}

// Gets an array buffer through an ajax request, then calls `done(err, arrayBuffer)`
WebStorage.prototype.get = function(url, done) {
  var req = new XMLHttpRequest()

  req.onload = function(e) {
    if (this.status === 200)
      done(null, this.response)
    else done(new Error('HTTP ' + this.status + ': ' + this.statusText))
  }

  req.onerror = function(e) {
    done(e)
  }

  req.open('GET', url, true)
  req.responseType = 'arraybuffer'
  req.send()
}
},{"../global":12,"getusermedia":19,"underscore":23,"waaclock":27}],17:[function(require,module,exports){
/*
 * Copyright (c) 2011-2015 Chris McCormick, Sébastien Piquemal <sebpiq@gmail.com>
 *
 *  This file is part of WebPd. See https://github.com/sebpiq/WebPd for documentation
 *
 *  WebPd is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  WebPd is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with WebPd.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

var _ = require('underscore')
  , WAAWire = require('waawire')
  , utils = require('../core/utils')
  , PdObject = require('../core/PdObject')
  , BaseInlet = require('../core/portlets').Inlet
  , BaseOutlet = require('../core/portlets').Outlet
  , pdGlob = require('../global')
  , AudioParam = typeof window !== 'undefined' ? window.AudioParam : function() {} // for testing purpose


// Mixin for common inlet functionalities
var InletMixin = {

  // Allows to deal with Web Audio API's way of scheduling things.
  // This sends a message, but flags it to be executed in the future.
  // That way DSP objects that can schedule stuff, have a bit of time
  // before the event must actually happen.
  future: function(time, args) {
    this.message(utils.timeTag(args, time))
  }

}

// message inlet.
var Inlet = exports.Inlet = BaseInlet.extend(InletMixin)

// message outlet. Dispatches messages to all the sinks
var Outlet = exports.Outlet = BaseOutlet.extend({

  message: function(args) {
    this.connections.forEach(function(sink) {
      sink.message(args)
    })
  }

})

// dsp inlet.
var DspInlet = exports.DspInlet = BaseInlet.extend(InletMixin, {

  hasDspSource: function() {
    return _.filter(this.connections, function(outlet) {
      return outlet instanceof DspOutlet
    }).length > 0
  },

  init: function() {
    this._started = false
  },

  start: function() {
    this._started = true
  },

  stop: function() {
    this._waa = null
    this._started = false
  },

  setWaa: function(node, input) {
    var self = this
    this._waa = { node: node, input: input }

    // remove offset for AudioParam
    if (node instanceof AudioParam) node.setValueAtTime(0, 0)

    if (this._started) {
      _.chain(this.connections)
        .filter(function(outlet) { return outlet instanceof DspOutlet })
        .forEach(function(outlet) { outlet._waaUpdate(self) }).value()
    }
  }

})

// dsp outlet.
var DspOutlet = exports.DspOutlet = BaseOutlet.extend({

  init: function() {
    this._waaConnections = {}
    this._started = false
  },

  start: function() {
    this._started = true
    // No need to filter dsp inlets as this should refuse connections to non-dsp inlets
    this.connections.forEach(this._waaConnect.bind(this))
  },

  stop: function() {
    this._started = false
    // No need to filter dsp inlets as this should refuse connections to non-dsp inlets
    this.connections.forEach(this._waaDisconnect.bind(this))
    this._waaConnections = {}
  },

  connection: function(inlet) {
    if (!(inlet instanceof DspInlet)) 
      throw new Error('can only connect to DSP inlet')
    if (this._started) this._waaConnect(inlet)
  },

  disconnection: function(inlet) {
    if (this._started) this._waaDisconnect(inlet)
  },

  message: function() {
    throw new Error ('dsp outlet received a message')
  },

  setWaa: function(node, output) {
    var self = this
    this._waa = { node: node, output: output }

    if (this._started) {
      _.values(this._waaConnections).forEach(function(connector) {
        connector.swapSource(node, output)
      })
    }
  },

  _waaConnect: function(inlet) {
    var connector = new WAAWire(pdGlob.audio.context)
    this._waaConnections[this._getConnectionId(inlet)] = connector
    connector.connect(this._waa.node, inlet._waa.node, this._waa.output, inlet._waa.input)
  },

  _waaDisconnect: function(inlet) {
    // Search for the right waaConnection
    var connector = this._waaConnections[this._getConnectionId(inlet)]
    delete this._waaConnections[this._getConnectionId(inlet)]
    connector.close()
  },
  
  _waaUpdate: function(inlet) {
    this._waaConnections[this._getConnectionId(inlet)]
      .swapDestination(inlet._waa.node, inlet._waa.input)
  },

  _getConnectionId: function(inlet) { return inlet.obj.id + ':' + inlet.id }

})

exports.declareObjects = function(library) {

  var InletInlet = Inlet.extend({
    message: function(args) {
      this.obj.outlets[0].message(args)
    }
  })

  var InletInletDsp = DspInlet.extend({
    message: function(args) {
      this.obj.outlets[0].message(args)
    }
  })

  var OutletOutletDsp = DspOutlet.extend({
    stop: function() {
      DspOutlet.prototype.stop.apply(this, arguments)
      if (this._outNodeConnector) this._outNodeConnector.close() 
      this._outNodeConnector = null
      if (this._outNode) this._outNode.disconnect()
      this._outNode = null
    },

    setWaa: function(node, output) {
      // Add a node `_outNode` which can be used to connect a WebPd patch
      // to an external Web Audio node
      if (this._outNodeConnector) this._outNodeConnector.close()
      if (!this._outNode) this._outNode = pdGlob.audio.context.createGain()
      DspOutlet.prototype.setWaa.apply(this, arguments)
      this._outNodeConnector = new WAAWire(pdGlob.audio.context)
      this._outNodeConnector.connect(this._waa.node, this._outNode, this._waa.output, 0)
    },

    getOutNode: function() { return this._outNode },

    message: function(args) {
      // Normal dsp outlets cannot receive messages,
      // but this one just transmits them unchanged.
      this.sinks.forEach(function(sink) {
        sink.message(args)
      })
    }
  })

  var PortletDspObjectMixin = {
    start: function() {
      this._gainNode = pdGlob.audio.context.createGain()
      this._gainNode.gain.value = 1
      this.i(0).setWaa(this._gainNode, 0)
      this.o(0).setWaa(this._gainNode, 0)
    },

    stop: function() {
      this._gainNode = null
    }
  }

  library['outlet'] = PdObject.extend({
    type: 'outlet',
    inletDefs: [ InletInlet ],
    outletDefs: [ Outlet.extend({ crossPatch: true }) ]
  })

  library['inlet'] = PdObject.extend({
    type: 'inlet',
    inletDefs: [ InletInlet.extend({ crossPatch: true }) ],
    outletDefs: [ Outlet ]
  })

  library['outlet~'] = PdObject.extend(PortletDspObjectMixin, {
    type: 'outlet~',
    inletDefs: [ InletInletDsp ],
    outletDefs: [ OutletOutletDsp.extend({ crossPatch: true }) ],
  })

  library['inlet~'] = PdObject.extend(PortletDspObjectMixin, {
    type: 'inlet~',
    inletDefs: [ InletInletDsp.extend({ crossPatch: true }) ],
    outletDefs: [ OutletOutletDsp ],
  })

}

},{"../core/PdObject":6,"../core/portlets":10,"../core/utils":11,"../global":12,"underscore":23,"waawire":35}],18:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],19:[function(require,module,exports){
// getUserMedia helper by @HenrikJoreteg used for navigator.getUserMedia shim
var adapter = require('webrtc-adapter');
module.exports = function (constraints, cb) {
};
},{"webrtc-adapter":37}],20:[function(require,module,exports){
/*
 * Copyright (c) 2012-2015 Sébastien Piquemal <sebpiq@gmail.com>
 *
 * BSD Simplified License.
 * For information on usage and redistribution, and for a DISCLAIMER OF ALL
 * WARRANTIES, see the file, "LICENSE.txt," in this distribution.
 *
 * See https://github.com/sebpiq/pd-fileutils for documentation
 *
 */
// See http://puredata.info/docs/developer/PdFileFormat for the Pd file format reference
var _ = require('underscore'), NODES = [
        'obj',
        'floatatom',
        'symbolatom',
        'msg',
        'text'
    ]    // Regular expression to split tokens in a message.
, tokensRe = / |\r\n?|\n/, afterCommaRe = /,(?!\\)/    // Regular expressions to detect escaped special chars.
, escapedDollarVarReGlob = /\\(\$\d+)/g, escapedCommaVarReGlob = /\\\,/g, escapedSemicolonVarReGlob = /\\\;/g    // Regular expression for finding valid lines of Pd in a file
, linesRe = /(#((.|\r|\n)*?)[^\\\\])\r{0,1}\n{0,1};\r{0,1}(\n|$)/i;
// Helper function to reverse a string
var _reverseString = function (s) {
    return s.split('').reverse().join('');
};
// Parses argument to a string or a number.
var parseArg = exports.parseArg = function (arg) {
    var parsed = pdParseFloat(arg);
    if (_.isNumber(parsed) && !isNaN(parsed))
        return parsed;
    else if (_.isString(arg)) {
        var matched, arg = arg.substr(0);
        // Unescape special characters
        arg = arg.replace(escapedCommaVarReGlob, ',');
        arg = arg.replace(escapedSemicolonVarReGlob, ';');
        while (matched = escapedDollarVarReGlob.exec(arg)) {
            arg = arg.replace(matched[0], matched[1]);
        }
        return arg;
    } else
        throw new Error('couldn\'t parse arg ' + arg);
};
// Parses a float from a .pd file. Returns the parsed float or NaN.
var pdParseFloat = exports.parseFloat = function (data) {
    if (_.isNumber(data) && !isNaN(data))
        return data;
    else if (_.isString(data))
        return parseFloat(data);
    else
        return NaN;
};
// Converts arguments to a javascript array
var parseArgs = exports.parseArgs = function (args) {
    // if it's an int, make a single valued array
    if (_.isNumber(args) && !isNaN(args))
        return [args]    // if it's a string, split the atom
;
    else {
        var parts = _.isString(args) ? args.split(tokensRe) : args, parsed = [], arg, i, length;
        for (i = 0, length = parts.length; i < length; i++) {
            if ((arg = parts[i]) === '')
                continue;
            else
                parsed.push(parseArg(arg));
        }
        return parsed;
    }
};
// Parses a Pd file, creates and returns a graph from it
exports.parse = function (txt) {
    return recursParse(txt)[0];
};
var recursParse = function (txt) {
    var currentTable = null    // last table name to add samples to
, idCounter = -1, nextId = function () {
            idCounter++;
            return idCounter;
        }, patch = {
            nodes: [],
            connections: [],
            layout: undefined,
            args: []
        }, line, firstLine = true, nextLine = function () {
            txt = txt.slice(line.index + line[0].length);
        };
    // use our regular expression to match instances of valid Pd lines
    linesRe.lastIndex = 0;
    // reset lastIndex, in case the previous call threw an error
    while (line = txt.match(linesRe)) {
        // In order to support object width, pd vanilla adds something like ", f 10" at the end
        // of the line. So we need to look for non-escaped comma, and get that part after it.
        // Doing that is annoying in JS since regexps have no look-behind assertions.
        // The hack is to reverse the string, and use a regexp look-forward assertion.
        var lineParts = _reverseString(line[1]).split(afterCommaRe).reverse().map(_reverseString), lineAfterComma = lineParts[1], tokens = lineParts[0].split(tokensRe), chunkType = tokens[0];
        //================ #N : frameset ================//
        if (chunkType === '#N') {
            var elementType = tokens[1];
            if (elementType === 'canvas') {
                // This is a subpatch
                if (!firstLine) {
                    var result = recursParse(txt), subpatch = result[0], attrs = result[2];
                    patch.nodes.push(_.extend({
                        id: nextId(),
                        subpatch: subpatch
                    }, attrs));
                    // The remaining text is what was returned 
                    txt = result[1]    // Else this is the first line of the patch file
;
                } else {
                    patch.layout = {
                        x: parseInt(tokens[2], 10),
                        y: parseInt(tokens[3], 10),
                        width: parseInt(tokens[4], 10),
                        height: parseInt(tokens[5], 10),
                        openOnLoad: tokens[7]
                    };
                    patch.args = [tokens[6]];
                    nextLine();
                }
            } else
                throw new Error('invalid element type for chunk #N : ' + elementType)    //================ #X : patch elements ================// 
;
        } else if (chunkType === '#X') {
            var elementType = tokens[1];
            // ---- restore : ends a canvas definition ---- //
            if (elementType === 'restore') {
                var layout = {
                        x: parseInt(tokens[2], 10),
                        y: parseInt(tokens[3], 10)
                    }, canvasType = tokens[4], args = [];
                // add subpatch name
                if (canvasType === 'pd')
                    args.push(tokens[5]);
                // end the current table, pad the data with zeros
                if (currentTable) {
                    var tableSize = currentTable.args[1];
                    while (currentTable.data.length < tableSize)
                        currentTable.data.push(0);
                    currentTable = null;
                }
                // Return `subpatch`, `remaining text`, `attrs`
                nextLine();
                return [
                    patch,
                    txt,
                    {
                        proto: canvasType,
                        args: args,
                        layout: layout
                    }
                ]    // ---- NODES : object/control instantiation ---- //
;
            } else if (_.contains(NODES, elementType)) {
                var proto, args, layout = {
                        x: parseInt(tokens[2], 10),
                        y: parseInt(tokens[3], 10)
                    }, result;
                // 2 categories here :
                //  - elems whose name is `elementType`
                //  - elems whose name is `token[4]`
                if (elementType === 'obj') {
                    proto = tokens[4];
                    args = tokens.slice(5);
                } else {
                    proto = elementType;
                    args = tokens.slice(4);
                }
                if (elementType === 'text')
                    args = [tokens.slice(4).join(' ')];
                // Handling controls' creation arguments
                result = parseControls(proto, args, layout);
                args = result[0];
                layout = result[1];
                // Handling stuff after the comma
                // I have no idea what's the specification for this, so this is really reverse
                // engineering on what appears in pd files.
                if (lineAfterComma) {
                    var afterCommaTokens = lineAfterComma.split(tokensRe);
                    while (afterCommaTokens.length) {
                        var command = afterCommaTokens.shift();
                        if (command === 'f')
                            layout.width = afterCommaTokens.shift();
                    }
                }
                // Add the object to the graph
                patch.nodes.push({
                    id: nextId(),
                    proto: proto,
                    layout: layout,
                    args: parseArgs(args)
                })    // ---- array : start of an array definition ---- //
;
            } else if (elementType === 'array') {
                var arrayName = tokens[2], arraySize = parseFloat(tokens[3]), table = {
                        id: nextId(),
                        proto: 'table',
                        args: [
                            arrayName,
                            arraySize
                        ],
                        data: []
                    };
                patch.nodes.push(table);
                // remind the last table for handling correctly 
                // the table related instructions which might follow.
                currentTable = table    // ---- connect : connection between 2 nodes ---- //
;
            } else if (elementType === 'connect') {
                var sourceId = parseInt(tokens[2], 10), sinkId = parseInt(tokens[4], 10), sourceOutlet = parseInt(tokens[3], 10), sinkInlet = parseInt(tokens[5], 10);
                patch.connections.push({
                    source: {
                        id: sourceId,
                        port: sourceOutlet
                    },
                    sink: {
                        id: sinkId,
                        port: sinkInlet
                    }
                })    // ---- coords : visual range of framsets ---- //
;
            } else if (elementType === 'coords') {
            } else
                throw new Error('invalid element type for chunk #X : ' + elementType);
            nextLine()    //================ #A : array data ================// 
;
        } else if (chunkType === '#A') {
            // reads in part of an array/table of data, starting at the index specified in this line
            // name of the array/table comes from the the '#X array' and '#X restore' matches above
            var idx = parseFloat(tokens[1]), t, length, val;
            if (currentTable) {
                for (t = 2, length = tokens.length; t < length; t++, idx++) {
                    val = parseFloat(tokens[t]);
                    if (_.isNumber(val) && !isNaN(val))
                        currentTable.data[idx] = val;
                }
            } else {
                console.error('got table data outside of a table.');
            }
            nextLine();
        } else
            throw new Error('invalid chunk : ' + chunkType);
        firstLine = false;
    }
    return [
        patch,
        ''
    ];
};
// This is put here just for readability of the main `parse` function
var parseControls = function (proto, args, layout) {
    if (proto === 'floatatom') {
        // <width> <lower_limit> <upper_limit> <label_pos> <label> <receive> <send>
        layout.width = args[0];
        layout.labelPos = args[3];
        layout.label = args[4];
        // <lower_limit> <upper_limit> <receive> <send>
        args = [
            args[1],
            args[2],
            args[5],
            args[6]
        ];
    } else if (proto === 'symbolatom') {
        // <width> <lower_limit> <upper_limit> <label_pos> <label> <receive> <send>
        layout.width = args[0];
        layout.labelPos = args[3];
        layout.label = args[4];
        // <lower_limit> <upper_limit> <receive> <send>
        args = [
            args[1],
            args[2],
            args[5],
            args[6]
        ];
    } else if (proto === 'bng') {
        // <size> <hold> <interrupt> <init> <send> <receive> <label> <x_off> <y_off> <font> <fontsize> <bg_color> <fg_color> <label_color>
        layout.size = args[0];
        layout.hold = args[1];
        layout.interrupt = args[2];
        layout.label = args[6];
        layout.labelX = args[7];
        layout.labelY = args[8];
        layout.labelFont = args[9];
        layout.labelFontSize = args[10];
        layout.bgColor = args[11];
        layout.fgColor = args[12];
        layout.labelColor = args[13];
        // <init> <send> <receive>
        args = [
            args[3],
            args[4],
            args[5]
        ];
    } else if (proto === 'tgl') {
        // <size> <init> <send> <receive> <label> <x_off> <y_off> <font> <fontsize> <bg_color> <fg_color> <label_color> <init_value> <default_value>
        layout.size = args[0];
        layout.label = args[4];
        layout.labelX = args[5];
        layout.labelY = args[6];
        layout.labelFont = args[7];
        layout.labelFontSize = args[8];
        layout.bgColor = args[9];
        layout.fgColor = args[10];
        layout.labelColor = args[11];
        // <init> <send> <receive> <init_value> <default_value>
        args = [
            args[1],
            args[2],
            args[3],
            args[12],
            args[13]
        ];
    } else if (proto === 'nbx') {
        // !!! doc is inexact here, logHeight is not at the specified position, and initial value of the nbx was missing.
        // <size> <height> <min> <max> <log> <init> <send> <receive> <label> <x_off> <y_off> <font> <fontsize> <bg_color> <fg_color> <label_color> <log_height>
        layout.size = args[0];
        layout.height = args[1];
        layout.log = args[4];
        layout.label = args[8];
        layout.labelX = args[9];
        layout.labelY = args[10];
        layout.labelFont = args[11];
        layout.labelFontSize = args[12];
        layout.bgColor = args[13];
        layout.fgColor = args[14];
        layout.labelColor = args[15];
        layout.logHeight = args[17];
        // <min> <max> <init> <send> <receive>
        args = [
            args[2],
            args[3],
            args[5],
            args[6],
            args[7],
            args[16]
        ];
    } else if (proto === 'vsl') {
        // <width> <height> <bottom> <top> <log> <init> <send> <receive> <label> <x_off> <y_off> <font> <fontsize> <bg_color> <fg_color> <label_color> <default_value> <steady_on_click>
        layout.width = args[0];
        layout.height = args[1];
        layout.log = args[4];
        layout.label = args[8];
        layout.labelX = args[9];
        layout.labelY = args[10];
        layout.labelFont = args[11];
        layout.labelFontSize = args[12];
        layout.bgColor = args[13];
        layout.fgColor = args[14];
        layout.labelColor = args[15];
        layout.steadyOnClick = args[17];
        // <bottom> <top> <init> <send> <receive> <default_value>
        args = [
            args[2],
            args[3],
            args[5],
            args[6],
            args[7],
            args[2] + (args[3] - args[2]) * args[16] / 12700
        ];
    } else if (proto === 'hsl') {
        // <width> <height> <bottom> <top> <log> <init> <send> <receive> <label> <x_off> <y_off> <font> <fontsize> <bg_color> <fg_color> <label_color> <default_value> <steady_on_click>
        layout.width = args[0];
        layout.height = args[1];
        layout.log = args[4];
        layout.label = args[8];
        layout.labelX = args[9];
        layout.labelY = args[10];
        layout.labelFont = args[11];
        layout.labelFontSize = args[12];
        layout.bgColor = args[13];
        layout.fgColor = args[14];
        layout.labelColor = args[15];
        layout.steadyOnClick = args[17];
        // <bottom> <top> <init> <send> <receive> <default_value>
        args = [
            args[2],
            args[3],
            args[5],
            args[6],
            args[7],
            args[2] + (args[3] - args[2]) * args[16] / 12700
        ];
    } else if (proto === 'vradio') {
        // <size> <new_old> <init> <number> <send> <receive> <label> <x_off> <y_off> <font> <fontsize> <bg_color> <fg_color> <label_color> <default_value>
        layout.size = args[0];
        layout.label = args[6];
        layout.labelX = args[7];
        layout.labelY = args[8];
        layout.labelFont = args[9];
        layout.labelFontSize = args[10];
        layout.bgColor = args[11];
        layout.fgColor = args[12];
        layout.labelColor = args[13];
        // <new_old> <init> <number> <send> <receive> <default_value>
        args = [
            args[1],
            args[2],
            args[3],
            args[4],
            args[5],
            args[14]
        ];
    } else if (proto === 'hradio') {
        // <size> <new_old> <init> <number> <send> <receive> <label> <x_off> <y_off> <font> <fontsize> <bg_color> <fg_color> <label_color> <default_value>
        layout.size = args[0];
        layout.label = args[6];
        layout.labelX = args[7];
        layout.labelY = args[8];
        layout.labelFont = args[9];
        layout.labelFontSize = args[10];
        layout.bgColor = args[11];
        layout.fgColor = args[12];
        layout.labelColor = args[13];
        // <new_old> <init> <number> <send> <receive> <default_value>
        args = [
            args[1],
            args[2],
            args[3],
            args[4],
            args[5],
            args[14]
        ];
    } else if (proto === 'vu') {
        // <width> <height> <receive> <label> <x_off> <y_off> <font> <fontsize> <bg_color> <label_color> <scale> <?>
        layout.width = args[0];
        layout.height = args[1];
        layout.label = args[3];
        layout.labelX = args[4];
        layout.labelY = args[5];
        layout.labelFont = args[6];
        layout.labelFontSize = args[7];
        layout.bgColor = args[8];
        layout.labelColor = args[9];
        layout.log = args[10];
        // <receive> <?>
        args = [
            args[2],
            args[11]
        ];
    } else if (proto === 'cnv') {
        // <size> <width> <height> <send> <receive> <label> <x_off> <y_off> <font> <font_size> <bg_color> <label_color> <?>
        layout.size = args[0];
        layout.width = args[1];
        layout.height = args[2];
        layout.label = args[5];
        layout.labelX = args[6];
        layout.labelY = args[7];
        layout.labelFont = args[8];
        layout.labelFontSize = args[9];
        layout.bgColor = args[10];
        layout.labelColor = args[11];
        // <send> <receive> <?>
        args = [
            args[3],
            args[4],
            args[12]
        ];
    }
    // Other objects (including msg) all args belong to the graph model
    return [
        args,
        layout
    ];
};
},{"underscore":21}],21:[function(require,module,exports){
//     Underscore.js 1.4.4
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore may be freely distributed under the MIT license.
(function () {
    // Baseline setup
    // --------------
    // Establish the root object, `window` in the browser, or `global` on the server.
    var root = this;
    // Save the previous value of the `_` variable.
    var previousUnderscore = root._;
    // Establish the object that gets returned to break out of a loop iteration.
    var breaker = {};
    // Save bytes in the minified (but not gzipped) version:
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
    // Create quick reference variables for speed access to core prototypes.
    var push = ArrayProto.push, slice = ArrayProto.slice, concat = ArrayProto.concat, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
    // All **ECMAScript 5** native function implementations that we hope to use
    // are declared here.
    var nativeForEach = ArrayProto.forEach, nativeMap = ArrayProto.map, nativeReduce = ArrayProto.reduce, nativeReduceRight = ArrayProto.reduceRight, nativeFilter = ArrayProto.filter, nativeEvery = ArrayProto.every, nativeSome = ArrayProto.some, nativeIndexOf = ArrayProto.indexOf, nativeLastIndexOf = ArrayProto.lastIndexOf, nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeBind = FuncProto.bind;
    // Create a safe reference to the Underscore object for use below.
    var _ = function (obj) {
    };
    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object via a string identifier,
    // for Closure Compiler "advanced" mode.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }
    // Current version.
    _.VERSION = '1.4.4';
    // Collection Functions
    // --------------------
    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles objects with the built-in `forEach`, arrays, and raw objects.
    // Delegates to **ECMAScript 5**'s native `forEach` if available.
    var each = _.each = _.forEach = function (obj, iterator, context) {
        if (obj == null)
            return;
        if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (iterator.call(context, obj[i], i, obj) === breaker)
                    return;
            }
        } else {
            for (var key in obj) {
                if (_.has(obj, key)) {
                    if (iterator.call(context, obj[key], key, obj) === breaker)
                        return;
                }
            }
        }
    };
    // Return the results of applying the iterator to each element.
    // Delegates to **ECMAScript 5**'s native `map` if available.
    _.map = _.collect = function (obj, iterator, context) {
    };
    var reduceError = 'Reduce of empty array with no initial value';
    // **Reduce** builds up a single result from a list of values, aka `inject`,
    // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
    _.reduce = _.foldl = _.inject = function (obj, iterator, memo, context) {
    };
    // The right-associative version of reduce, also known as `foldr`.
    // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
    _.reduceRight = _.foldr = function (obj, iterator, memo, context) {
    };
    // Return the first value which passes a truth test. Aliased as `detect`.
    _.find = _.detect = function (obj, iterator, context) {
    };
    // Return all the elements that pass a truth test.
    // Delegates to **ECMAScript 5**'s native `filter` if available.
    // Aliased as `select`.
    _.filter = _.select = function (obj, iterator, context) {
    };
    // Return all the elements for which a truth test fails.
    _.reject = function (obj, iterator, context) {
    };
    // Determine whether all of the elements match a truth test.
    // Delegates to **ECMAScript 5**'s native `every` if available.
    // Aliased as `all`.
    _.every = _.all = function (obj, iterator, context) {
    };
    // Determine if at least one element in the object matches a truth test.
    // Delegates to **ECMAScript 5**'s native `some` if available.
    // Aliased as `any`.
    var any = _.some = _.any = function (obj, iterator, context) {
    };
    // Determine if the array or object contains a given value (using `===`).
    // Aliased as `include`.
    _.contains = _.include = function (obj, target) {
        if (obj == null)
            return false;
        if (nativeIndexOf && obj.indexOf === nativeIndexOf)
            return obj.indexOf(target) != -1;
        return any(obj, function (value) {
        });
    };
    // Invoke a method (with arguments) on every item in a collection.
    _.invoke = function (obj, method) {
    };
    // Convenience version of a common use case of `map`: fetching a property.
    _.pluck = function (obj, key) {
    };
    // Convenience version of a common use case of `filter`: selecting only objects
    // containing specific `key:value` pairs.
    _.where = function (obj, attrs, first) {
    };
    // Convenience version of a common use case of `find`: getting the first object
    // containing specific `key:value` pairs.
    _.findWhere = function (obj, attrs) {
    };
    // Return the maximum element or (element-based computation).
    // Can't optimize arrays of integers longer than 65,535 elements.
    // See: https://bugs.webkit.org/show_bug.cgi?id=80797
    _.max = function (obj, iterator, context) {
    };
    // Return the minimum element (or element-based computation).
    _.min = function (obj, iterator, context) {
    };
    // Shuffle an array.
    _.shuffle = function (obj) {
    };
    // An internal function to generate lookup iterators.
    var lookupIterator = function (value) {
    };
    // Sort the object's values by a criterion produced by an iterator.
    _.sortBy = function (obj, value, context) {
    };
    // An internal function used for aggregate "group by" operations.
    var group = function (obj, value, context, behavior) {
    };
    // Groups the object's values by a criterion. Pass either a string attribute
    // to group by, or a function that returns the criterion.
    _.groupBy = function (obj, value, context) {
    };
    // Counts instances of an object that group by a certain criterion. Pass
    // either a string attribute to count by, or a function that returns the
    // criterion.
    _.countBy = function (obj, value, context) {
    };
    // Use a comparator function to figure out the smallest index at which
    // an object should be inserted so as to maintain order. Uses binary search.
    _.sortedIndex = function (array, obj, iterator, context) {
    };
    // Safely convert anything iterable into a real, live array.
    _.toArray = function (obj) {
    };
    // Return the number of elements in an object.
    _.size = function (obj) {
    };
    // Array Functions
    // ---------------
    // Get the first element of an array. Passing **n** will return the first N
    // values in the array. Aliased as `head` and `take`. The **guard** check
    // allows it to work with `_.map`.
    _.first = _.head = _.take = function (array, n, guard) {
    };
    // Returns everything but the last entry of the array. Especially useful on
    // the arguments object. Passing **n** will return all the values in
    // the array, excluding the last N. The **guard** check allows it to work with
    // `_.map`.
    _.initial = function (array, n, guard) {
    };
    // Get the last element of an array. Passing **n** will return the last N
    // values in the array. The **guard** check allows it to work with `_.map`.
    _.last = function (array, n, guard) {
    };
    // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
    // Especially useful on the arguments object. Passing an **n** will return
    // the rest N values in the array. The **guard**
    // check allows it to work with `_.map`.
    _.rest = _.tail = _.drop = function (array, n, guard) {
    };
    // Trim out all falsy values from an array.
    _.compact = function (array) {
    };
    // Internal implementation of a recursive `flatten` function.
    var flatten = function (input, shallow, output) {
    };
    // Return a completely flattened version of an array.
    _.flatten = function (array, shallow) {
    };
    // Return a version of the array that does not contain the specified value(s).
    _.without = function (array) {
    };
    // Produce a duplicate-free version of the array. If the array has already
    // been sorted, you have the option of using a faster algorithm.
    // Aliased as `unique`.
    _.uniq = _.unique = function (array, isSorted, iterator, context) {
    };
    // Produce an array that contains the union: each distinct element from all of
    // the passed-in arrays.
    _.union = function () {
    };
    // Produce an array that contains every item shared between all the
    // passed-in arrays.
    _.intersection = function (array) {
    };
    // Take the difference between one array and a number of other arrays.
    // Only the elements present in just the first array will remain.
    _.difference = function (array) {
    };
    // Zip together multiple lists into a single array -- elements that share
    // an index go together.
    _.zip = function () {
    };
    // Converts lists into objects. Pass either a single array of `[key, value]`
    // pairs, or two parallel arrays of the same length -- one of keys, and one of
    // the corresponding values.
    _.object = function (list, values) {
    };
    // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
    // we need this function. Return the position of the first occurrence of an
    // item in an array, or -1 if the item is not included in the array.
    // Delegates to **ECMAScript 5**'s native `indexOf` if available.
    // If the array is large and already in sort order, pass `true`
    // for **isSorted** to use binary search.
    _.indexOf = function (array, item, isSorted) {
    };
    // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
    _.lastIndexOf = function (array, item, from) {
    };
    // Generate an integer Array containing an arithmetic progression. A port of
    // the native Python `range()` function. See
    // [the Python documentation](http://docs.python.org/library/functions.html#range).
    _.range = function (start, stop, step) {
    };
    // Function (ahem) Functions
    // ------------------
    // Create a function bound to a given object (assigning `this`, and arguments,
    // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
    // available.
    _.bind = function (func, context) {
    };
    // Partially apply a function by creating a version that has had some of its
    // arguments pre-filled, without changing its dynamic `this` context.
    _.partial = function (func) {
    };
    // Bind all of an object's methods to that object. Useful for ensuring that
    // all callbacks defined on an object belong to it.
    _.bindAll = function (obj) {
    };
    // Memoize an expensive function by storing its results.
    _.memoize = function (func, hasher) {
    };
    // Delays a function for the given number of milliseconds, and then calls
    // it with the arguments supplied.
    _.delay = function (func, wait) {
    };
    // Defers a function, scheduling it to run after the current call stack has
    // cleared.
    _.defer = function (func) {
    };
    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time.
    _.throttle = function (func, wait) {
    };
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    _.debounce = function (func, wait, immediate) {
    };
    // Returns a function that will be executed at most one time, no matter how
    // often you call it. Useful for lazy initialization.
    _.once = function (func) {
    };
    // Returns the first function passed as an argument to the second,
    // allowing you to adjust arguments, run code before and after, and
    // conditionally execute the original function.
    _.wrap = function (func, wrapper) {
    };
    // Returns a function that is the composition of a list of functions, each
    // consuming the return value of the function that follows.
    _.compose = function () {
    };
    // Returns a function that will only be executed after being called N times.
    _.after = function (times, func) {
    };
    // Object Functions
    // ----------------
    // Retrieve the names of an object's properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`
    _.keys = nativeKeys || function (obj) {
    };
    // Retrieve the values of an object's properties.
    _.values = function (obj) {
    };
    // Convert an object into a list of `[key, value]` pairs.
    _.pairs = function (obj) {
    };
    // Invert the keys and values of an object. The values must be serializable.
    _.invert = function (obj) {
        var result = {};
        for (var key in obj)
            if (_.has(obj, key))
                result[obj[key]] = key;
        return result;
    };
    // Return a sorted list of the function names available on the object.
    // Aliased as `methods`
    _.functions = _.methods = function (obj) {
        var names = [];
        for (var key in obj) {
            if (_.isFunction(obj[key]))
                names.push(key);
        }
        return names.sort();
    };
    // Extend a given object with all the properties in passed-in object(s).
    _.extend = function (obj) {
        each(slice.call(arguments, 1), function (source) {
            if (source) {
                for (var prop in source) {
                    obj[prop] = source[prop];
                }
            }
        });
        return obj;
    };
    // Return a copy of the object only containing the whitelisted properties.
    _.pick = function (obj) {
    };
    // Return a copy of the object without the blacklisted properties.
    _.omit = function (obj) {
    };
    // Fill in a given object with default properties.
    _.defaults = function (obj) {
    };
    // Create a (shallow-cloned) duplicate of an object.
    _.clone = function (obj) {
    };
    // Invokes interceptor with the obj, and then returns obj.
    // The primary purpose of this method is to "tap into" a method chain, in
    // order to perform operations on intermediate results within the chain.
    _.tap = function (obj, interceptor) {
    };
    // Internal recursive comparison function for `isEqual`.
    var eq = function (a, b, aStack, bStack) {
    };
    // Perform a deep comparison to check if two objects are equal.
    _.isEqual = function (a, b) {
    };
    // Is a given array, string, or object empty?
    // An "empty" object has no enumerable own-properties.
    _.isEmpty = function (obj) {
    };
    // Is a given value a DOM element?
    _.isElement = function (obj) {
    };
    // Is a given value an array?
    // Delegates to ECMA5's native Array.isArray
    _.isArray = nativeIsArray || function (obj) {
    };
    // Is a given variable an object?
    _.isObject = function (obj) {
    };
    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
    each([
        'Arguments',
        'Function',
        'String',
        'Number',
        'Date',
        'RegExp'
    ], function (name) {
        _['is' + name] = function (obj) {
            return toString.call(obj) == '[object ' + name + ']';
        };
    });
    // Define a fallback version of the method in browsers (ahem, IE), where
    // there isn't any inspectable "Arguments" type.
    if (!_.isArguments(arguments)) {
        _.isArguments = function (obj) {
        };
    }
    // Optimize `isFunction` if appropriate.
    if (typeof /./ !== 'function') {
        _.isFunction = function (obj) {
            return typeof obj === 'function';
        };
    }
    // Is a given object a finite number?
    _.isFinite = function (obj) {
    };
    // Is the given value `NaN`? (NaN is the only number which does not equal itself).
    _.isNaN = function (obj) {
    };
    // Is a given value a boolean?
    _.isBoolean = function (obj) {
    };
    // Is a given value equal to null?
    _.isNull = function (obj) {
    };
    // Is a given variable undefined?
    _.isUndefined = function (obj) {
    };
    // Shortcut function for checking if an object has a given property directly
    // on itself (in other words, not on a prototype).
    _.has = function (obj, key) {
        return hasOwnProperty.call(obj, key);
    };
    // Utility Functions
    // -----------------
    // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
    // previous owner. Returns a reference to the Underscore object.
    _.noConflict = function () {
    };
    // Keep the identity function around for default iterators.
    _.identity = function (value) {
    };
    // Run a function **n** times.
    _.times = function (n, iterator, context) {
    };
    // Return a random integer between min and max (inclusive).
    _.random = function (min, max) {
    };
    // List of HTML entities for escaping.
    var entityMap = {
        escape: {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#x27;',
            '/': '&#x2F;'
        }
    };
    entityMap.unescape = _.invert(entityMap.escape);
    // Regexes containing the keys and values listed immediately above.
    var entityRegexes = {
        escape: new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
        unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
    };
    // Functions for escaping and unescaping strings to/from HTML interpolation.
    _.each([
        'escape',
        'unescape'
    ], function (method) {
        _[method] = function (string) {
        };
    });
    // If the value of the named property is a function then invoke it;
    // otherwise, return it.
    _.result = function (object, property) {
    };
    // Add your own custom functions to the Underscore object.
    _.mixin = function (obj) {
        each(_.functions(obj), function (name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function () {
            };
        });
    };
    // Generate a unique integer id (unique within the entire client session).
    // Useful for temporary DOM ids.
    var idCounter = 0;
    _.uniqueId = function (prefix) {
    };
    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;
    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
        '\'': '\'',
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\t': 't',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };
    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    _.template = function (text, data, settings) {
    };
    // Add a "chain" function, which will delegate to the wrapper.
    _.chain = function (obj) {
    };
    // OOP
    // ---------------
    // If Underscore is called as a function, it returns a wrapped object that
    // can be used OO-style. This wrapper holds altered versions of all the
    // underscore functions. Wrapped objects may be chained.
    // Helper function to continue chaining intermediate results.
    var result = function (obj) {
    };
    // Add all of the Underscore functions to the wrapper object.
    _.mixin(_);
    // Add all mutator Array functions to the wrapper.
    each([
        'pop',
        'push',
        'reverse',
        'shift',
        'sort',
        'splice',
        'unshift'
    ], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
        };
    });
    // Add all accessor Array functions to the wrapper.
    each([
        'concat',
        'join',
        'slice'
    ], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
        };
    });
    _.extend(_.prototype, {
        // Start chaining a wrapped Underscore object.
        chain: function () {
        },
        // Extracts the result from a wrapped and chained object.
        value: function () {
        }
    });
}.call(this));
},{}],22:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],23:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function () {
    // Baseline setup
    // --------------
    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;
    // Save the previous value of the `_` variable.
    var previousUnderscore = root._;
    // Save bytes in the minified (but not gzipped) version:
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
    // Create quick reference variables for speed access to core prototypes.
    var push = ArrayProto.push, slice = ArrayProto.slice, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
    // All **ECMAScript 5** native function implementations that we hope to use
    // are declared here.
    var nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeBind = FuncProto.bind, nativeCreate = Object.create;
    // Naked function reference for surrogate-prototype-swapping.
    var Ctor = function () {
    };
    // Create a safe reference to the Underscore object for use below.
    var _ = function (obj) {
        if (obj instanceof _)
            return obj;
        if (!(this instanceof _))
            return new _(obj);
        this._wrapped = obj;
    };
    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object.
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }
    // Current version.
    _.VERSION = '1.8.3';
    // Internal function that returns an efficient (for current engines) version
    // of the passed-in callback, to be repeatedly applied in other Underscore
    // functions.
    var optimizeCb = function (func, context, argCount) {
        if (context === void 0)
            return func;
        switch (argCount == null ? 3 : argCount) {
        case 1:
            return function (value) {
            };
        case 2:
            return function (value, other) {
            };
        case 3:
            return function (value, index, collection) {
            };
        case 4:
            return function (accumulator, value, index, collection) {
            };
        }
        return function () {
        };
    };
    // A mostly-internal function to generate callbacks that can be applied
    // to each element in a collection, returning the desired result — either
    // identity, an arbitrary callback, a property matcher, or a property accessor.
    var cb = function (value, context, argCount) {
        if (value == null)
            return _.identity;
        if (_.isFunction(value))
            return optimizeCb(value, context, argCount);
        if (_.isObject(value))
            return _.matcher(value);
        return _.property(value);
    };
    _.iteratee = function (value, context) {
    };
    // An internal function for creating assigner functions.
    var createAssigner = function (keysFunc, undefinedOnly) {
        return function (obj) {
            var length = arguments.length;
            if (length < 2 || obj == null)
                return obj;
            for (var index = 1; index < length; index++) {
                var source = arguments[index], keys = keysFunc(source), l = keys.length;
                for (var i = 0; i < l; i++) {
                    var key = keys[i];
                    if (!undefinedOnly || obj[key] === void 0)
                        obj[key] = source[key];
                }
            }
            return obj;
        };
    };
    // An internal function for creating a new object that inherits from another.
    var baseCreate = function (prototype) {
    };
    var property = function (key) {
        return function (obj) {
            return obj == null ? void 0 : obj[key];
        };
    };
    // Helper for collection methods to determine whether a collection
    // should be iterated as an array or as an object
    // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
    // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var getLength = property('length');
    var isArrayLike = function (collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };
    // Collection Functions
    // --------------------
    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles raw objects in addition to array-likes. Treats all
    // sparse array-likes as if they were dense.
    _.each = _.forEach = function (obj, iteratee, context) {
        iteratee = optimizeCb(iteratee, context);
        var i, length;
        if (isArrayLike(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
                iteratee(obj[i], i, obj);
            }
        } else {
            var keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                iteratee(obj[keys[i]], keys[i], obj);
            }
        }
        return obj;
    };
    // Return the results of applying the iteratee to each element.
    _.map = _.collect = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = !isArrayLike(obj) && _.keys(obj), length = (keys || obj).length, results = Array(length);
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            results[index] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };
    // Create a reducing function iterating left or right.
    function createReduce(dir) {
        // Optimized iterator function as using arguments.length
        // in the main function will deoptimize the, see #1991.
        function iterator(obj, iteratee, memo, keys, index, length) {
        }
        return function (obj, iteratee, memo, context) {
        };
    }
    // **Reduce** builds up a single result from a list of values, aka `inject`,
    // or `foldl`.
    _.reduce = _.foldl = _.inject = createReduce(1);
    // The right-associative version of reduce, also known as `foldr`.
    _.reduceRight = _.foldr = createReduce(-1);
    // Return the first value which passes a truth test. Aliased as `detect`.
    _.find = _.detect = function (obj, predicate, context) {
        var key;
        if (isArrayLike(obj)) {
            key = _.findIndex(obj, predicate, context);
        } else {
            key = _.findKey(obj, predicate, context);
        }
        if (key !== void 0 && key !== -1)
            return obj[key];
    };
    // Return all the elements that pass a truth test.
    // Aliased as `select`.
    _.filter = _.select = function (obj, predicate, context) {
        var results = [];
        predicate = cb(predicate, context);
        _.each(obj, function (value, index, list) {
            if (predicate(value, index, list))
                results.push(value);
        });
        return results;
    };
    // Return all the elements for which a truth test fails.
    _.reject = function (obj, predicate, context) {
        return _.filter(obj, _.negate(cb(predicate)), context);
    };
    // Determine whether all of the elements match a truth test.
    // Aliased as `all`.
    _.every = _.all = function (obj, predicate, context) {
    };
    // Determine if at least one element in the object matches a truth test.
    // Aliased as `any`.
    _.some = _.any = function (obj, predicate, context) {
    };
    // Determine if the array or object contains a given item (using `===`).
    // Aliased as `includes` and `include`.
    _.contains = _.includes = _.include = function (obj, item, fromIndex, guard) {
        if (!isArrayLike(obj))
            obj = _.values(obj);
        if (typeof fromIndex != 'number' || guard)
            fromIndex = 0;
        return _.indexOf(obj, item, fromIndex) >= 0;
    };
    // Invoke a method (with arguments) on every item in a collection.
    _.invoke = function (obj, method) {
    };
    // Convenience version of a common use case of `map`: fetching a property.
    _.pluck = function (obj, key) {
        return _.map(obj, _.property(key));
    };
    // Convenience version of a common use case of `filter`: selecting only objects
    // containing specific `key:value` pairs.
    _.where = function (obj, attrs) {
    };
    // Convenience version of a common use case of `find`: getting the first object
    // containing specific `key:value` pairs.
    _.findWhere = function (obj, attrs) {
    };
    // Return the maximum element (or element-based computation).
    _.max = function (obj, iteratee, context) {
    };
    // Return the minimum element (or element-based computation).
    _.min = function (obj, iteratee, context) {
    };
    // Shuffle a collection, using the modern version of the
    // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
    _.shuffle = function (obj) {
    };
    // Sample **n** random values from a collection.
    // If **n** is not specified, returns a single random element.
    // The internal `guard` argument allows it to work with `map`.
    _.sample = function (obj, n, guard) {
    };
    // Sort the object's values by a criterion produced by an iteratee.
    _.sortBy = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        return _.pluck(_.map(obj, function (value, index, list) {
            return {
                value: value,
                index: index,
                criteria: iteratee(value, index, list)
            };
        }).sort(function (left, right) {
            var a = left.criteria;
            var b = right.criteria;
            if (a !== b) {
                if (a > b || a === void 0)
                    return 1;
                if (a < b || b === void 0)
                    return -1;
            }
            return left.index - right.index;
        }), 'value');
    };
    // An internal function used for aggregate "group by" operations.
    var group = function (behavior) {
        return function (obj, iteratee, context) {
        };
    };
    // Groups the object's values by a criterion. Pass either a string attribute
    // to group by, or a function that returns the criterion.
    _.groupBy = group(function (result, value, key) {
    });
    // Indexes the object's values by a criterion, similar to `groupBy`, but for
    // when you know that your index values will be unique.
    _.indexBy = group(function (result, value, key) {
    });
    // Counts instances of an object that group by a certain criterion. Pass
    // either a string attribute to count by, or a function that returns the
    // criterion.
    _.countBy = group(function (result, value, key) {
    });
    // Safely create a real, live array from anything iterable.
    _.toArray = function (obj) {
        if (!obj)
            return [];
        if (_.isArray(obj))
            return slice.call(obj);
        if (isArrayLike(obj))
            return _.map(obj, _.identity);
        return _.values(obj);
    };
    // Return the number of elements in an object.
    _.size = function (obj) {
    };
    // Split a collection into two arrays: one whose elements all satisfy the given
    // predicate, and one whose elements all do not satisfy the predicate.
    _.partition = function (obj, predicate, context) {
    };
    // Array Functions
    // ---------------
    // Get the first element of an array. Passing **n** will return the first N
    // values in the array. Aliased as `head` and `take`. The **guard** check
    // allows it to work with `_.map`.
    _.first = _.head = _.take = function (array, n, guard) {
    };
    // Returns everything but the last entry of the array. Especially useful on
    // the arguments object. Passing **n** will return all the values in
    // the array, excluding the last N.
    _.initial = function (array, n, guard) {
    };
    // Get the last element of an array. Passing **n** will return the last N
    // values in the array.
    _.last = function (array, n, guard) {
    };
    // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
    // Especially useful on the arguments object. Passing an **n** will return
    // the rest N values in the array.
    _.rest = _.tail = _.drop = function (array, n, guard) {
    };
    // Trim out all falsy values from an array.
    _.compact = function (array) {
    };
    // Internal implementation of a recursive `flatten` function.
    var flatten = function (input, shallow, strict, startIndex) {
        var output = [], idx = 0;
        for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
            var value = input[i];
            if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
                //flatten current level of array or arguments object
                if (!shallow)
                    value = flatten(value, shallow, strict);
                var j = 0, len = value.length;
                output.length += len;
                while (j < len) {
                    output[idx++] = value[j++];
                }
            } else if (!strict) {
                output[idx++] = value;
            }
        }
        return output;
    };
    // Flatten out an array, either recursively (by default), or just one level.
    _.flatten = function (array, shallow) {
    };
    // Return a version of the array that does not contain the specified value(s).
    _.without = function (array) {
        return _.difference(array, slice.call(arguments, 1));
    };
    // Produce a duplicate-free version of the array. If the array has already
    // been sorted, you have the option of using a faster algorithm.
    // Aliased as `unique`.
    _.uniq = _.unique = function (array, isSorted, iteratee, context) {
        if (!_.isBoolean(isSorted)) {
            context = iteratee;
            iteratee = isSorted;
            isSorted = false;
        }
        if (iteratee != null)
            iteratee = cb(iteratee, context);
        var result = [];
        var seen = [];
        for (var i = 0, length = getLength(array); i < length; i++) {
            var value = array[i], computed = iteratee ? iteratee(value, i, array) : value;
            if (isSorted) {
                if (!i || seen !== computed)
                    result.push(value);
                seen = computed;
            } else if (iteratee) {
                if (!_.contains(seen, computed)) {
                    seen.push(computed);
                    result.push(value);
                }
            } else if (!_.contains(result, value)) {
                result.push(value);
            }
        }
        return result;
    };
    // Produce an array that contains the union: each distinct element from all of
    // the passed-in arrays.
    _.union = function () {
    };
    // Produce an array that contains every item shared between all the
    // passed-in arrays.
    _.intersection = function (array) {
    };
    // Take the difference between one array and a number of other arrays.
    // Only the elements present in just the first array will remain.
    _.difference = function (array) {
        var rest = flatten(arguments, true, true, 1);
        return _.filter(array, function (value) {
            return !_.contains(rest, value);
        });
    };
    // Zip together multiple lists into a single array -- elements that share
    // an index go together.
    _.zip = function () {
    };
    // Complement of _.zip. Unzip accepts an array of arrays and groups
    // each array's elements on shared indices
    _.unzip = function (array) {
    };
    // Converts lists into objects. Pass either a single array of `[key, value]`
    // pairs, or two parallel arrays of the same length -- one of keys, and one of
    // the corresponding values.
    _.object = function (list, values) {
    };
    // Generator function to create the findIndex and findLastIndex functions
    function createPredicateIndexFinder(dir) {
        return function (array, predicate, context) {
            predicate = cb(predicate, context);
            var length = getLength(array);
            var index = dir > 0 ? 0 : length - 1;
            for (; index >= 0 && index < length; index += dir) {
                if (predicate(array[index], index, array))
                    return index;
            }
            return -1;
        };
    }
    // Returns the first index on an array-like that passes a predicate test
    _.findIndex = createPredicateIndexFinder(1);
    _.findLastIndex = createPredicateIndexFinder(-1);
    // Use a comparator function to figure out the smallest index at which
    // an object should be inserted so as to maintain order. Uses binary search.
    _.sortedIndex = function (array, obj, iteratee, context) {
    };
    // Generator function to create the indexOf and lastIndexOf functions
    function createIndexFinder(dir, predicateFind, sortedIndex) {
        return function (array, item, idx) {
            var i = 0, length = getLength(array);
            if (typeof idx == 'number') {
                if (dir > 0) {
                    i = idx >= 0 ? idx : Math.max(idx + length, i);
                } else {
                    length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
                }
            } else if (sortedIndex && idx && length) {
                idx = sortedIndex(array, item);
                return array[idx] === item ? idx : -1;
            }
            if (item !== item) {
                idx = predicateFind(slice.call(array, i, length), _.isNaN);
                return idx >= 0 ? idx + i : -1;
            }
            for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
                if (array[idx] === item)
                    return idx;
            }
            return -1;
        };
    }
    // Return the position of the first occurrence of an item in an array,
    // or -1 if the item is not included in the array.
    // If the array is large and already in sort order, pass `true`
    // for **isSorted** to use binary search.
    _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
    _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
    // Generate an integer Array containing an arithmetic progression. A port of
    // the native Python `range()` function. See
    // [the Python documentation](http://docs.python.org/library/functions.html#range).
    _.range = function (start, stop, step) {
    };
    // Function (ahem) Functions
    // ------------------
    // Determines whether to execute a function as a constructor
    // or a normal function with the provided arguments
    var executeBound = function (sourceFunc, boundFunc, context, callingContext, args) {
    };
    // Create a function bound to a given object (assigning `this`, and arguments,
    // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
    // available.
    _.bind = function (func, context) {
    };
    // Partially apply a function by creating a version that has had some of its
    // arguments pre-filled, without changing its dynamic `this` context. _ acts
    // as a placeholder, allowing any combination of arguments to be pre-filled.
    _.partial = function (func) {
        var boundArgs = slice.call(arguments, 1);
        var bound = function () {
        };
        return bound;
    };
    // Bind a number of an object's methods to that object. Remaining arguments
    // are the method names to be bound. Useful for ensuring that all callbacks
    // defined on an object belong to it.
    _.bindAll = function (obj) {
    };
    // Memoize an expensive function by storing its results.
    _.memoize = function (func, hasher) {
    };
    // Delays a function for the given number of milliseconds, and then calls
    // it with the arguments supplied.
    _.delay = function (func, wait) {
    };
    // Defers a function, scheduling it to run after the current call stack has
    // cleared.
    _.defer = _.partial(_.delay, _, 1);
    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.
    _.throttle = function (func, wait, options) {
    };
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    _.debounce = function (func, wait, immediate) {
    };
    // Returns the first function passed as an argument to the second,
    // allowing you to adjust arguments, run code before and after, and
    // conditionally execute the original function.
    _.wrap = function (func, wrapper) {
    };
    // Returns a negated version of the passed-in predicate.
    _.negate = function (predicate) {
        return function () {
            return !predicate.apply(this, arguments);
        };
    };
    // Returns a function that is the composition of a list of functions, each
    // consuming the return value of the function that follows.
    _.compose = function () {
    };
    // Returns a function that will only be executed on and after the Nth call.
    _.after = function (times, func) {
    };
    // Returns a function that will only be executed up to (but not including) the Nth call.
    _.before = function (times, func) {
    };
    // Returns a function that will be executed at most one time, no matter how
    // often you call it. Useful for lazy initialization.
    _.once = _.partial(_.before, 2);
    // Object Functions
    // ----------------
    // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
    var hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString');
    var nonEnumerableProps = [
        'valueOf',
        'isPrototypeOf',
        'toString',
        'propertyIsEnumerable',
        'hasOwnProperty',
        'toLocaleString'
    ];
    function collectNonEnumProps(obj, keys) {
    }
    // Retrieve the names of an object's own properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`
    _.keys = function (obj) {
        if (!_.isObject(obj))
            return [];
        if (nativeKeys)
            return nativeKeys(obj);
        var keys = [];
        for (var key in obj)
            if (_.has(obj, key))
                keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug)
            collectNonEnumProps(obj, keys);
        return keys;
    };
    // Retrieve all the property names of an object.
    _.allKeys = function (obj) {
        if (!_.isObject(obj))
            return [];
        var keys = [];
        for (var key in obj)
            keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug)
            collectNonEnumProps(obj, keys);
        return keys;
    };
    // Retrieve the values of an object's properties.
    _.values = function (obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var values = Array(length);
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    };
    // Returns the results of applying the iteratee to each element of the object
    // In contrast to _.map it returns an object
    _.mapObject = function (obj, iteratee, context) {
    };
    // Convert an object into a list of `[key, value]` pairs.
    _.pairs = function (obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var pairs = Array(length);
        for (var i = 0; i < length; i++) {
            pairs[i] = [
                keys[i],
                obj[keys[i]]
            ];
        }
        return pairs;
    };
    // Invert the keys and values of an object. The values must be serializable.
    _.invert = function (obj) {
        var result = {};
        var keys = _.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
        }
        return result;
    };
    // Return a sorted list of the function names available on the object.
    // Aliased as `methods`
    _.functions = _.methods = function (obj) {
        var names = [];
        for (var key in obj) {
            if (_.isFunction(obj[key]))
                names.push(key);
        }
        return names.sort();
    };
    // Extend a given object with all the properties in passed-in object(s).
    _.extend = createAssigner(_.allKeys);
    // Assigns a given object with all the own properties in the passed-in object(s)
    // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
    _.extendOwn = _.assign = createAssigner(_.keys);
    // Returns the first key on an object that passes a predicate test
    _.findKey = function (obj, predicate, context) {
    };
    // Return a copy of the object only containing the whitelisted properties.
    _.pick = function (object, oiteratee, context) {
    };
    // Return a copy of the object without the blacklisted properties.
    _.omit = function (obj, iteratee, context) {
    };
    // Fill in a given object with default properties.
    _.defaults = createAssigner(_.allKeys, true);
    // Creates an object that inherits from the given prototype object.
    // If additional properties are provided then they will be added to the
    // created object.
    _.create = function (prototype, props) {
    };
    // Create a (shallow-cloned) duplicate of an object.
    _.clone = function (obj) {
    };
    // Invokes interceptor with the obj, and then returns obj.
    // The primary purpose of this method is to "tap into" a method chain, in
    // order to perform operations on intermediate results within the chain.
    _.tap = function (obj, interceptor) {
    };
    // Returns whether an object has a given set of `key:value` pairs.
    _.isMatch = function (object, attrs) {
    };
    // Internal recursive comparison function for `isEqual`.
    var eq = function (a, b, aStack, bStack) {
    };
    // Perform a deep comparison to check if two objects are equal.
    _.isEqual = function (a, b) {
    };
    // Is a given array, string, or object empty?
    // An "empty" object has no enumerable own-properties.
    _.isEmpty = function (obj) {
    };
    // Is a given value a DOM element?
    _.isElement = function (obj) {
    };
    // Is a given value an array?
    // Delegates to ECMA5's native Array.isArray
    _.isArray = nativeIsArray || function (obj) {
    };
    // Is a given variable an object?
    _.isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };
    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
    _.each([
        'Arguments',
        'Function',
        'String',
        'Number',
        'Date',
        'RegExp',
        'Error'
    ], function (name) {
        _['is' + name] = function (obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    });
    // Define a fallback version of the method in browsers (ahem, IE < 9), where
    // there isn't any inspectable "Arguments" type.
    if (!_.isArguments(arguments)) {
        _.isArguments = function (obj) {
        };
    }
    // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
    // IE 11 (#1621), and in Safari 8 (#1929).
    if (typeof /./ != 'function' && typeof Int8Array != 'object') {
        _.isFunction = function (obj) {
            return typeof obj == 'function' || false;
        };
    }
    // Is a given object a finite number?
    _.isFinite = function (obj) {
    };
    // Is the given value `NaN`? (NaN is the only number which does not equal itself).
    _.isNaN = function (obj) {
    };
    // Is a given value a boolean?
    _.isBoolean = function (obj) {
        return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    };
    // Is a given value equal to null?
    _.isNull = function (obj) {
    };
    // Is a given variable undefined?
    _.isUndefined = function (obj) {
    };
    // Shortcut function for checking if an object has a given property directly
    // on itself (in other words, not on a prototype).
    _.has = function (obj, key) {
    };
    // Utility Functions
    // -----------------
    // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
    // previous owner. Returns a reference to the Underscore object.
    _.noConflict = function () {
    };
    // Keep the identity function around for default iteratees.
    _.identity = function (value) {
        return value;
    };
    // Predicate-generating functions. Often useful outside of Underscore.
    _.constant = function (value) {
    };
    _.noop = function () {
    };
    _.property = property;
    // Generates a function for a given object that returns a given property.
    _.propertyOf = function (obj) {
    };
    // Returns a predicate for checking whether an object has a given set of
    // `key:value` pairs.
    _.matcher = _.matches = function (attrs) {
    };
    // Run a function **n** times.
    _.times = function (n, iteratee, context) {
    };
    // Return a random integer between min and max (inclusive).
    _.random = function (min, max) {
    };
    // A (possibly faster) way to get the current timestamp as an integer.
    _.now = Date.now || function () {
    };
    // List of HTML entities for escaping.
    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#x27;',
        '`': '&#x60;'
    };
    var unescapeMap = _.invert(escapeMap);
    // Functions for escaping and unescaping strings to/from HTML interpolation.
    var createEscaper = function (map) {
        var escaper = function (match) {
        };
        // Regexes for identifying a key that needs to be escaped
        var source = '(?:' + _.keys(map).join('|') + ')';
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, 'g');
        return function (string) {
        };
    };
    _.escape = createEscaper(escapeMap);
    _.unescape = createEscaper(unescapeMap);
    // If the value of the named `property` is a function then invoke it with the
    // `object` as context; otherwise, return it.
    _.result = function (object, property, fallback) {
    };
    // Generate a unique integer id (unique within the entire client session).
    // Useful for temporary DOM ids.
    var idCounter = 0;
    _.uniqueId = function (prefix) {
    };
    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;
    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
        '\'': '\'',
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };
    var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
    var escapeChar = function (match) {
    };
    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    // NB: `oldSettings` only exists for backwards compatibility.
    _.template = function (text, settings, oldSettings) {
    };
    // Add a "chain" function. Start chaining a wrapped Underscore object.
    _.chain = function (obj) {
        var instance = _(obj);
        instance._chain = true;
        return instance;
    };
    // OOP
    // ---------------
    // If Underscore is called as a function, it returns a wrapped object that
    // can be used OO-style. This wrapper holds altered versions of all the
    // underscore functions. Wrapped objects may be chained.
    // Helper function to continue chaining intermediate results.
    var result = function (instance, obj) {
        return instance._chain ? _(obj).chain() : obj;
    };
    // Add your own custom functions to the Underscore object.
    _.mixin = function (obj) {
        _.each(_.functions(obj), function (name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function () {
                var args = [this._wrapped];
                push.apply(args, arguments);
                return result(this, func.apply(_, args));
            };
        });
    };
    // Add all of the Underscore functions to the wrapper object.
    _.mixin(_);
    // Add all mutator Array functions to the wrapper.
    _.each([
        'pop',
        'push',
        'reverse',
        'shift',
        'sort',
        'splice',
        'unshift'
    ], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
        };
    });
    // Add all accessor Array functions to the wrapper.
    _.each([
        'concat',
        'join',
        'slice'
    ], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
        };
    });
    // Extracts the result from a wrapped and chained object.
    _.prototype.value = function () {
        return this._wrapped;
    };
    // Provide unwrapping proxy for some methods used in engine operations
    // such as arithmetic and JSON stringification.
    _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
    _.prototype.toString = function () {
    };
    // AMD registration happens at the end for compatibility with AMD loaders
    // that may not enforce next-turn semantics on modules. Even though general
    // practice for AMD registration is to be anonymous, underscore registers
    // as a named module because, like jQuery, it is a base library that is
    // popular enough to be bundled in a third party lib, but not be part of
    // an AMD load request. Those cases could generate an error when an
    // anonymous define() is called outside of a loader request.
    if (typeof define === 'function' && define.amd) {
        define('underscore', [], function () {
        });
    }
}.call(this));
},{}],24:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],25:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],26:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":25,"_process":22,"inherits":24}],27:[function(require,module,exports){
var WAAClock = require('./lib/WAAClock');
module.exports = WAAClock;
if (typeof window !== 'undefined')
    window.WAAClock = WAAClock;
},{"./lib/WAAClock":28}],28:[function(require,module,exports){
var isBrowser = typeof window !== 'undefined';
var CLOCK_DEFAULTS = {
    toleranceLate: 0.1,
    toleranceEarly: 0.001
};
// ==================== Event ==================== //
var Event = function (clock, deadline, func) {
};
// Unschedules the event
Event.prototype.clear = function () {
};
// Sets the event to repeat every `time` seconds.
Event.prototype.repeat = function (time) {
};
// Sets the time tolerance of the event.
// The event will be executed in the interval `[deadline - early, deadline + late]`
// If the clock fails to execute the event in time, the event will be dropped.
Event.prototype.tolerance = function (values) {
};
// Returns true if the event is repeated, false otherwise
Event.prototype.isRepeated = function () {
};
// Schedules the event to be ran before `deadline`.
// If the time is within the event tolerance, we handle the event immediately.
// If the event was already scheduled at a different time, it is rescheduled.
Event.prototype.schedule = function (deadline) {
};
Event.prototype.timeStretch = function (tRef, ratio) {
};
// Executes the event
Event.prototype._execute = function () {
};
// Updates cached times
Event.prototype._refreshEarlyLateDates = function () {
};
// ==================== WAAClock ==================== //
var WAAClock = module.exports = function (context, opts) {
    var self = this;
    opts = opts || {};
    this.tickMethod = opts.tickMethod || 'ScriptProcessorNode';
    this.toleranceEarly = opts.toleranceEarly || CLOCK_DEFAULTS.toleranceEarly;
    this.toleranceLate = opts.toleranceLate || CLOCK_DEFAULTS.toleranceLate;
    this.context = context;
    this._events = [];
    this._started = false;
};
// ---------- Public API ---------- //
// Schedules `func` to run after `delay` seconds.
WAAClock.prototype.setTimeout = function (func, delay) {
};
// Schedules `func` to run before `deadline`.
WAAClock.prototype.callbackAtTime = function (func, deadline) {
};
// Stretches `deadline` and `repeat` of all scheduled `events` by `ratio`, keeping
// their relative distance to `tRef`. In fact this is equivalent to changing the tempo.
WAAClock.prototype.timeStretch = function (tRef, events, ratio) {
};
// Removes all scheduled events and starts the clock 
WAAClock.prototype.start = function () {
    if (this._started === false) {
        var self = this;
        this._started = true;
        this._events = [];
        if (this.tickMethod === 'ScriptProcessorNode') {
            var bufferSize = 256;
            // We have to keep a reference to the node to avoid garbage collection
            this._clockNode = this.context.createScriptProcessor(bufferSize, 1, 1);
            this._clockNode.connect(this.context.destination);
            this._clockNode.onaudioprocess = function () {
            };
        } else if (this.tickMethod === 'manual')
            null    // _tick is called manually
;
        else
            throw new Error('invalid tickMethod ' + this.tickMethod);
    }
};
// Stops the clock
WAAClock.prototype.stop = function () {
};
// ---------- Private ---------- //
// This function is ran periodically, and at each tick it executes
// events for which `currentTime` is included in their tolerance interval.
WAAClock.prototype._tick = function () {
};
// Creates an event and insert it to the list
WAAClock.prototype._createEvent = function (func, deadline) {
};
// Inserts an event to the list
WAAClock.prototype._insertEvent = function (event) {
};
// Removes an event from the list
WAAClock.prototype._removeEvent = function (event) {
};
// Returns true if `event` is in queue, false otherwise
WAAClock.prototype._hasEvent = function (event) {
};
// Returns the index of the first event whose deadline is >= to `deadline`
WAAClock.prototype._indexByTime = function (deadline) {
};
// Converts from relative time to absolute time
WAAClock.prototype._absTime = function (relTime) {
};
// Converts from absolute time to relative time 
WAAClock.prototype._relTime = function (absTime) {
};
},{}],29:[function(require,module,exports){
var WAAOffsetNode = require('./lib/WAAOffsetNode');
module.exports = WAAOffsetNode;
if (typeof window !== 'undefined')
    window.WAAOffsetNode = WAAOffsetNode;
},{"./lib/WAAOffsetNode":30}],30:[function(require,module,exports){
var WAAOffsetNode = module.exports = function (context) {
};
WAAOffsetNode.prototype.connect = function () {
};
WAAOffsetNode.prototype.disconnect = function () {
};
WAAOffsetNode._ones = [];
},{}],31:[function(require,module,exports){
var WAATableNode = require('./lib/WAATableNode');
module.exports = WAATableNode;
if (typeof window !== 'undefined')
    window.WAATableNode = WAATableNode;
},{"./lib/WAATableNode":32}],32:[function(require,module,exports){
var WAAOffset = require('waaoffsetnode');
var WAATableNode = module.exports = function (context) {
};
WAATableNode.prototype.connect = function () {
};
WAATableNode.prototype.disconnect = function () {
};
WAATableNode.prototype._setTable = function (table) {
};
},{"waaoffsetnode":29}],33:[function(require,module,exports){
var WAAWhiteNoiseNode = require('./lib/WAAWhiteNoiseNode');
module.exports = WAAWhiteNoiseNode;
if (typeof window !== 'undefined')
    window.WAAWhiteNoiseNode = WAAWhiteNoiseNode;
},{"./lib/WAAWhiteNoiseNode":34}],34:[function(require,module,exports){
var WAAWhiteNoiseNode = module.exports = function (context) {
};
WAAWhiteNoiseNode.prototype.connect = function () {
};
WAAWhiteNoiseNode.prototype.disconnect = function () {
};
WAAWhiteNoiseNode.prototype.start = function () {
};
WAAWhiteNoiseNode.prototype.stop = function () {
};
WAAWhiteNoiseNode.prototype._prepareOutput = function () {
};
},{}],35:[function(require,module,exports){
var WAAWire = require('./lib/WAAWire');
module.exports = WAAWire;
if (typeof window !== 'undefined')
    window.WAAWire = WAAWire;
},{"./lib/WAAWire":36}],36:[function(require,module,exports){
var WAAWire = module.exports = function (context) {
    this.context = context;
    this._source = null;
    this._output = null;
    this._destination = null;
    this._input = null;
    this._gainNode = null;
    this._discardedGainNode = null;
    this._atTime = 0;
    this._closed = false;
};
var _withTimeArg = function (methName) {
    return function () {
        // Is that the best place to _clean ?
        this._clean();
        this[methName].apply(this, [this._atTime].concat([].slice.call(arguments, 0)));
        this._atTime = 0;
        return this;
    };
};
WAAWire.prototype.connect = _withTimeArg('_connect');
WAAWire.prototype.swapSource = _withTimeArg('_swapSource');
WAAWire.prototype.swapDestination = _withTimeArg('_swapDestination');
WAAWire.prototype.close = _withTimeArg('_close');
WAAWire.prototype.atTime = function (time) {
};
WAAWire.prototype._connect = function (time, source, destination, output, input) {
    if (this._gainNode)
        throw new Error('Wire already connected');
    this._source = source;
    this._destination = destination;
    this._output = output || 0;
    this._input = input || 0;
    this._doConnections(time);
};
WAAWire.prototype._swapSource = function (time, source, output) {
    this._discardedGainNode = this._gainNode;
    this._discardedGainNode.gain.setValueAtTime(0, time);
    this._source = source;
    this._output = output || 0;
    this._doConnections(time);
};
WAAWire.prototype._swapDestination = function (time, destination, input) {
    this._discardedGainNode = this._gainNode;
    this._discardedGainNode.gain.setValueAtTime(0, time);
    this._destination = destination;
    this._input = input || 0;
    this._doConnections(time);
};
WAAWire.prototype._close = function (time) {
    if (this._closed === true)
        throw new Error('Wire already closed');
    this._discardedGainNode = this._gainNode;
    this._gainNode.gain.setValueAtTime(0, time);
    this._gainNode = null;
    this._closed = true;
};
WAAWire.prototype._doConnections = function (time) {
    var gainNode = this.context.createGain();
    gainNode.gain.setValueAtTime(0, 0);
    gainNode.gain.setValueAtTime(1, time);
    this._gainNode = gainNode;
    this._source.connect(gainNode, this._output);
    if (this._destination instanceof AudioParam)
        gainNode.connect(this._destination, 0);
    else
        gainNode.connect(this._destination, 0, this._input);
};
// Cleans discardedGain, if there is
WAAWire.prototype._clean = function () {
    if (this._discardedGainNode && this._discardedGainNode.gain.value === 0) {
        this._discardedGainNode.disconnect();
        this._discardedGainNode = null;
    }
};
var _hasSelectiveDisconnect = function () {
        if (typeof window !== 'undefined' && window.OfflineAudioContext) {
            var context = new OfflineAudioContext(1, 1, 44100), bufferNode = context.createBufferSource(), gain = context.createGain(), buffer = context.createBuffer(1, 1, 44100);
            buffer.getChannelData(0)[0] = 1;
            bufferNode.buffer = buffer;
            bufferNode.connect(gain);
            bufferNode.connect(context.destination);
            bufferNode.start(0);
            gain.connect(context.destination);
            bufferNode.disconnect(gain);
            context.oncomplete = function (event) {
            };
            context.startRendering();
        }
    }, _hasSelectiveDisconnectResult = null;
_hasSelectiveDisconnect();
},{}],37:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
/* eslint-env node */
'use strict';
// Shimming starts here.
(function () {
}());
},{}]},{},[1]);
