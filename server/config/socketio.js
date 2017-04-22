/**
 * Socket.io configuration
 */
'use strict';

// import config from './environment';

// When the user disconnects.. perform this
function onDisconnect(/*socket*/) {
}

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
  socket.on('info', data => {
    socket.log(JSON.stringify(data, null, 2));
  });

  // Insert sockets below
  require('../api/deskLog/deskLog.socket').register(socket);
  require('../api/roadToSale/roadToSale.socket.js').register(socket);
  require('../api/logResult/logResult.socket').register(socket);
  require('../api/dealer/inventory/inventory.socket').register(socket);
  require('../api/customerResult/customerResult.socket').register(socket);
  require('../api/customerStage/customerStage.socket').register(socket);
  require('../api/customerRelationship/customerRelationship.socket').register(socket);
  require('../api/customerVehicle/customerVehicle.socket').register(socket);
  require('../api/customer/customer.socket').register(socket);
  require('../api/statePrefix/statePrefix.socket').register(socket);
  require('../api/applicationSetting/applicationSetting.socket').register(socket);
  require('../api/position/position.socket').register(socket);
  require('../api/role/role.socket').register(socket);
  require('../api/advertisingSource/advertisingSource.socket').register(socket);
  require('../api/vifModule/vifModule.socket').register(socket);
  require('../api/rooftop/rooftop.socket').register(socket);
  require('../api/parentCompany/parentCompany.socket').register(socket);
}

export default function (socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  socketio.on('connection', function (socket) {
    socket.address = `${socket.request.connection.remoteAddress}:${socket.request.connection.remotePort}`;

    socket.connectedAt = new Date();

    socket.log = function (...data) {
      console.log(`SocketIO ${socket.nsp.name} [${socket.address}]`, ...data);
    };

    // Call onDisconnect.
    socket.on('disconnect', () => {
      onDisconnect(socket);
      socket.log('DISCONNECTED');
    });

    // Call onConnect.
    onConnect(socket);
    socket.log('CONNECTED');
  });
}
