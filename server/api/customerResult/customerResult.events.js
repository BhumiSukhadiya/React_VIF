/**
 * CustomerResults model events
 */

'use strict';

import {EventEmitter} from 'events';
import CustomerResult from './customerResult.model';
var CustomerResultEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CustomerResultEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  let event = events[e];
  CustomerResult.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    CustomerResultEvents.emit(event + ':' + doc._id, doc);
    CustomerResultEvents.emit(event, doc);
  };
}

export default CustomerResultEvents;
