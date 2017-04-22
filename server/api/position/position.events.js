/**
 * Position model events
 */

'use strict';

import {EventEmitter} from 'events';
import Position from './position.model';
var PositionEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PositionEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Position.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    PositionEvents.emit(event + ':' + doc._id, doc);
    PositionEvents.emit(event, doc);
  };
}

export default PositionEvents;
