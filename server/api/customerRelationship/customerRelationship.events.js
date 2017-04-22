/**
 * CustomerRelationship model events
 */

'use strict';

import {EventEmitter} from 'events';
import CustomerRelationship from './customerRelationship.model';
var CustomerRelationshipEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CustomerRelationshipEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  let event = events[e];
  CustomerRelationship.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    CustomerRelationshipEvents.emit(event + ':' + doc._id, doc);
    CustomerRelationshipEvents.emit(event, doc);
  };
}

export default CustomerRelationshipEvents;
