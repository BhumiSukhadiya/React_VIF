/**
 * RoadToSale model events
 */

'use strict';

import {EventEmitter} from 'events';
import RoadToSale from './roadToSale.model';
var RoadToSaleEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
RoadToSaleEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  let event = events[e];
  RoadToSale.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    RoadToSaleEvents.emit(event + ':' + doc._id, doc);
    RoadToSaleEvents.emit(event, doc);
  };
}

export default RoadToSaleEvents;
