(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.stentDevTools = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var message = function message(data) {
  if (window && window.postMessage) {
    window.postMessage(_extends({ source: 'stent' }, data), '*');
  } else {
    console.error('There is no window.postMessage available');
  }
};
var formatYielded = function formatYielded(yielded) {
  var y = yielded;

  if (yielded && yielded.__type === 'call') {
    var funcName = yielded.func.name;
    if (funcName === '') {
      funcName = '<anonymous>';
    };
    try {
      y = JSON.parse(JSON.stringify(yielded));
    } catch (error) {
      y = { __type: 'call' };
    }
    y.func = funcName;
  }

  return y;
};
var sanitize = function sanitize(something) {
  var result;
  try {
    result = JSON.parse(JSON.stringify(something, function (key, value) {
      if (typeof value === 'function') {
        return { __func: value.name === '' ? '<anonymous>' : value.name };
      }
      return value;
    }));
  } catch (error) {
    result = null;
  }
  return result;
};
var getMetaInfo = function getMetaInfo(meta) {
  if (!window[DEVTOOLS_KEY]) {
    return {};
  }
  var machines = window[DEVTOOLS_KEY].machines || {};
  return Object.assign({}, meta, {
    machines: Object.keys(machines).length,
    middlewares: window[DEVTOOLS_KEY].middlewares.length
  });
};

var DevTools = exports.DevTools = {
  onActionDispatched: function onActionDispatched(actionName) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    message({
      type: 'onActionDispatched',
      actionName: actionName,
      args: sanitize(args),
      machine: sanitize(this),
      meta: getMetaInfo()
    });
  },
  onActionProcessed: function onActionProcessed(actionName) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    message({
      type: 'onActionProcessed',
      actionName: actionName,
      args: sanitize(args),
      machine: sanitize(this),
      meta: getMetaInfo()
    });
  },
  onStateWillChange: function onStateWillChange() {
    message({
      type: 'onStateWillChange',
      machine: sanitize(this),
      meta: getMetaInfo()
    });
  },
  onStateChanged: function onStateChanged() {
    message({
      type: 'onStateChanged',
      machine: sanitize(this),
      meta: getMetaInfo()
    });
  },
  onGeneratorStep: function onGeneratorStep(yielded) {
    message({
      type: 'onGeneratorStep',
      yielded: formatYielded(yielded),
      meta: getMetaInfo()
    });
  },
  onMachineCreated: function onMachineCreated(machine) {
    message({
      type: 'onMachineCreated',
      machine: sanitize(machine),
      meta: getMetaInfo()
    });
  },
  onMachineConnected: function onMachineConnected(machines, meta) {
    message({
      type: 'onMachineConnected',
      machines: sanitize(machines),
      meta: getMetaInfo(meta)
    });
  },
  onMachineDisconnected: function onMachineDisconnected(machines, meta) {
    message({
      type: 'onMachineDisconnected',
      machines: sanitize(machines),
      meta: getMetaInfo(meta)
    });
  }
};
},{}]},{},[1])(1)
});