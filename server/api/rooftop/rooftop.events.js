/**
 * Rooftop model events
 */

'use strict';

import {EventEmitter} from 'events';
import Rooftop from './rooftop.model';
var RooftopEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
RooftopEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Rooftop.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    RooftopEvents.emit(event + ':' + doc._id, doc);
    RooftopEvents.emit(event, doc);
  };
}

export default RooftopEvents;
