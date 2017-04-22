/**
 * ApplicationSetting model events
 */

'use strict';

import {EventEmitter} from 'events';
import ApplicationSetting from './applicationSetting.model';
var ApplicationSettingEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ApplicationSettingEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  ApplicationSetting.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ApplicationSettingEvents.emit(event + ':' + doc._id, doc);
    ApplicationSettingEvents.emit(event, doc);
  };
}

export default ApplicationSettingEvents;
