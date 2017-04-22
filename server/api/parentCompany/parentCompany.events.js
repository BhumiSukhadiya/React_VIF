/**
 * ParentCompany model events
 */

'use strict';

import {EventEmitter} from 'events';
import ParentCompany from './parentCompany.model';
var ParentCompanyEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ParentCompanyEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  let event = events[e];
  ParentCompany.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    ParentCompanyEvents.emit(event + ':' + doc._id, doc);
    ParentCompanyEvents.emit(event, doc);
  };
}

export default ParentCompanyEvents;
