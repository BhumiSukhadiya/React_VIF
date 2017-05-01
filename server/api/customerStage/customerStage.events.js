/**
 * CustomerStage model events
 */

'use strict';

import {EventEmitter} from 'events';
import CustomerStage from './customerStage.model';
var CustomerStageEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CustomerStageEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  let event = events[e];
  CustomerStage.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    CustomerStageEvents.emit(event + ':' + doc._id, doc);
    CustomerStageEvents.emit(event, doc);
  };
}

export default CustomerStageEvents;
