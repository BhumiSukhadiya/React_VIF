/**
 * VifModule model events
 */

'use strict';

import {EventEmitter} from 'events';
import VifModule from './vifModule.model';
var VifModuleEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
VifModuleEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  VifModule.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    VifModuleEvents.emit(event + ':' + doc._id, doc);
    VifModuleEvents.emit(event, doc);
  };
}

export default VifModuleEvents;
