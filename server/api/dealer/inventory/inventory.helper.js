'use strict';

import InventorySchema from "./inventory.model";
import {getDealerConnection} from '../../../components/helper';

export function getInventory(rooftopId, customerDesireVehiclesData, index, inventoryObjectsList = []) {
  return getDealerConnection(rooftopId)
    .then(rooftopConnection => {
      if (customerDesireVehiclesData.length === 0) {
        return Promise.resolve(null)
      }
      if (!rooftopConnection) {
        return Promise.reject({message: constants.ERRORS.SELECT_VALID_ROOFTOP});
      }
      let Inventory = new InventorySchema(rooftopConnection.connection);
      return Inventory.findOne({$or: [{vin: customerDesireVehiclesData[index].vin}]}).exec();
    })
    .then(inventory => {
      if (!inventory) {
        return Promise.resolve(inventoryObjectsList)
      }
      inventoryObjectsList.push(inventory);
      if (customerDesireVehiclesData.length - 1 > index) {
        index++;
        return getInventory(rooftopId, customerDesireVehiclesData, index, inventoryObjectsList);
      } else {
        return Promise.resolve(inventoryObjectsList)
      }
    })
    .catch(error => Promise.reject(error));
}
