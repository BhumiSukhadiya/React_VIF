/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function (app) {
  // Insert routes below
  app.use('/api/deskLogs', require('./api/deskLog'));
  app.use('/api/roadToSales', require('./api/roadToSale'));
  app.use('/api/logResults', require('./api/logResult'));
  app.use('/api/inventories', require('./api/dealer/inventory'));
  app.use('/api/customerResults', require('./api/customerResult'));
  app.use('/api/customerStages', require('./api/customerStage'));
  app.use('/api/customerRelationships', require('./api/customerRelationship'));
  app.use('/api/customerVehicles', require('./api/customerVehicle'));
  app.use('/api/customers', require('./api/customer'));
  app.use('/api/statePrefixes', require('./api/statePrefix'));
  app.use('/api/applicationSettings', require('./api/applicationSetting'));
  app.use('/api/positions', require('./api/position'));
  app.use('/api/roles', require('./api/role'));
  app.use('/api/advertisingSources', require('./api/advertisingSource'));
  app.use('/api/vifModules', require('./api/vifModule'));
  app.use('/api/rooftops', require('./api/rooftop'));
  app.use('/api/parentCompanies', require('./api/parentCompany'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/utilities/700credit', require('./api/utility/700Credit'));
  app.use('/api/utilities/nada', require('./api/utility/NADA'));
  app.use('/api/utilities/nhtsa', require('./api/utility/NHTSA'));
  app.use('/api/utilities/misc', require('./api/utility/misc'));

  app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
    });
}
