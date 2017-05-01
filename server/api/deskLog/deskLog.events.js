/**
 * DeskLog model events
 */

'use strict';

import {EventEmitter} from 'events';
import DeskLog from './deskLog.model';
var DeskLogEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DeskLogEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  let event = events[e];
  DeskLog.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    DeskLogEvents.emit(event + ':' + doc._id, doc);
    DeskLogEvents.emit(event, doc);
  };
}

export default DeskLogEvents;
