/**
 * StatePrefix model events
 */

'use strict';

import {EventEmitter} from 'events';
import StatePrefix from './statePrefix.model';
var StatePrefixEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
StatePrefixEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  StatePrefix.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    StatePrefixEvents.emit(event + ':' + doc._id, doc);
    StatePrefixEvents.emit(event, doc);
  };
}

export default StatePrefixEvents;
