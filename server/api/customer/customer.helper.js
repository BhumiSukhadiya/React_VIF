'use strict';

import CustomerVehicle from '../customerVehicle/customerVehicle.model';

export function saveCustomerVehicle(inventoryList, index, rooftopId, customerInterestType, customerVehicleList = []) {
  let customerVehicle = new CustomerVehicle();
  customerVehicle = mapInventoryWithCustomerVehicle(customerVehicle, inventoryList[index], customerInterestType);
  customerVehicle.rooftop = rooftopId;
  return customerVehicle.save()
    .then(customerVehicle => {
      if (customerVehicle != null) {
        customerVehicleList.push(customerVehicle._id);
      }
      if (inventoryList.length - 1 > index) {
        index++;
        return saveCustomerVehicle(inventoryList, index, rooftopId, customerInterestType, customerVehicleList);
      } else {
        return Promise.resolve(customerVehicleList);
      }
    })
    .catch(error => Promise.reject(error));
}

function mapInventoryWithCustomerVehicle(customerVehicle, inventory, customerInterestType) {
  customerVehicle.vin = inventory.vin;
  customerVehicle.year = inventory.year;
  customerVehicle.make = inventory.make;
  customerVehicle.model = inventory.model;
  customerVehicle.stockNo = inventory.stockNumber;
  customerVehicle.miles = inventory.miles;
  customerVehicle.status = inventory.status;
  customerVehicle.vehicleType = inventory.vehicleType;
  customerVehicle.stockType = inventory.stockType;
  customerVehicle.statusDate = inventory.statusDate;
  customerVehicle.payoffAmount = inventory.payoffAmount;
  customerVehicle.vin = inventory.vin;
  customerVehicle.roAmount = inventory.roAmount;
  customerVehicle.interestType = customerInterestType;
  return customerVehicle;
}
