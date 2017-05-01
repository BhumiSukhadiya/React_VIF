'use strict';
import _ from 'lodash';
import mongoose from 'mongoose';
import {getConnectionString} from '../api/rooftop/rooftop.helper';
import jsonpatch from 'fast-json-patch';

export function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

export function patchUpdates(patches) {
  return function (entity) {
    if (!entity) {
      return null;
    }
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch (err) {
      return Promise.reject(err);
    }
    return entity.save();
  };
}

export function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

export function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

export function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    console.log(err);
    res.status(statusCode).send(err);
  };
}

export function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function (err) {
    return res.status(statusCode).json(err);
  };
}

export function getCondition(schema, searchColumns, searchText) {
  let conditions = [];
  let searchParts = searchText.split(/ +/g);
  searchColumns.forEach(column => {
    let path = schema.tree[column];
    if (path) {
      if (path.constructor === Array) {
        path = path[0];
      }

      let isNested = false;
      if (typeof path === 'object') {
        _.forOwn(path, function (value, field) {
          if (field !== 'type' && ((typeof value === 'object' && (value.type === String || value.type === Number)) ||
            (typeof value !== 'object' && (value.name === 'String' || value.name === 'Number')))) {
            let isNumber = (value.type === Number || value.name === 'Number');
            isNested = true;
            field = column.concat('.').concat(field);
            conditions = _.union(conditions, getConditionArray(field, searchParts, isNumber));
          }
        });
      }

      if (!isNested) {
        let isNumber = (path.type === Number || path.name === 'Number');
        conditions = _.union(conditions, getConditionArray(column, searchParts, isNumber));
      }
    } else {
      conditions = _.union(conditions, getConditionArray(column, searchParts, false));
    }
  });

  function getConditionArray(column, values, isNumber) {
    return _.flatten(_.map(values, function (value) {
      if (isNumber) {
        return [
          {[column]: !isNaN(value) ? value : -1}
        ];
      } else {
        return [
          {[column]: new RegExp(value, 'i')}
        ];
      }
    }));
  }

  if (conditions.length > 0)
    return {$or: conditions};

  return {};
}

export function getLazyLoadQueryConditions(query, schema, defaultColumn) {
  let skip = Number(query.skip || '0');
  let limit = Number(query.limit || '1000');
  let sortColumn = query.sortColumn;
  let searchText = query.searchText;
  let status = query.status;
  let stockType = query.stockType;
  let rooftopId = query.rooftopid;
  let order = query.order === 'desc' ? -1 : 1;

  // Generating conditions based on passed search parameters
  let condition = {};
  if (searchText) {
    let searchColumns = (query.searchColumns || defaultColumn).split(' ');
    condition = getCondition(schema, searchColumns, searchText, status);
  }

  let conditions = [];
  // Passed search conditions
  conditions[0] = condition;

  // Active / Inactive records condition
  if (status === 'active') {
    conditions.push({['active']: true});
  } else if (status === 'inactive') {
    conditions.push({['active']: false});
  }

  // Condition for inventory records for stock type (New, Used, Demo, Wholesale)
  if (stockType) {
    conditions.push({['stockType']: new RegExp(stockType, 'i')});
  }

  // Current Rooftop records condition
  if (rooftopId) {
    let ObjectId = mongoose.Types.ObjectId;
    let path = schema.tree['rooftops'];
    if (path) {
      conditions.push({['rooftops']: ObjectId(rooftopId)});
    } else {
      conditions.push({['rooftop']: ObjectId(rooftopId)});
    }
  }

  // Adding all conditions together for and operation
  conditions = {$and: conditions};

  // Sort condition
  let sort = {};
  if (sortColumn) {
    sort[sortColumn] = order;
  }

  return {
    skip: skip,
    limit: limit,
    condition: conditions,
    sort: sort
  };
}

export function getDealerConnection(rooftopId) {
  if (!rooftopId) {
    return Promise.resolve(null);
  }

  return getConnectionString(rooftopId)
    .then(rooftop => {
      if (!rooftop.connectionString) {
        return Promise.resolve(null);
      }

      if (global.dealerConnections && global.dealerConnections[rooftopId]) {
        return Promise.resolve({rooftop: rooftop, connection: global.dealerConnections[rooftopId]});
      }

      return new Promise(function (resolve) {
        let connection = mongoose.createConnection(rooftop.connectionString);
        connection.on('connected', function () {
          global.dealerConnections = global.dealerConnections || {};
          global.dealerConnections[rooftopId] = connection;
          return resolve({rooftop: rooftop, connection: global.dealerConnections[rooftopId]});
        });

        // If the connection throws an error
        connection.on('error', function (err) {
          console.log('Mongoose default connection error: ' + err);
          return resolve(null);
        });
      });
    })
    .catch(error => Promise.resolve(null));
}
