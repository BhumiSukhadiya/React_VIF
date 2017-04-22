/**
 * CustomerVehicle model events
 */

'use strict';

import {EventEmitter} from 'events';
import CustomerVehicle from './customerVehicle.model';
var CustomerVehicleEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CustomerVehicleEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  let event = events[e];
  CustomerVehicle.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    CustomerVehicleEvents.emit(event + ':' + doc._id, doc);
    CustomerVehicleEvents.emit(event, doc);
  };
}

export default CustomerVehicleEvents;
