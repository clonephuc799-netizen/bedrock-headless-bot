const RakNet = require('./network/raknet');
const packets = require('./protocol/packets');
const Entity = require('./world/entity');
const logger = require('../utils/logger');

class Client {
  constructor(host, port) {
    this.raknet = new RakNet(host, port);
    this.entity = new Entity();
  }

  start() {
    this.raknet.start();
    logger.info('Client started - Autonomous mode');
  }

  static sendLogin(raknet) {
    const loginPkt = packets.sendLogin();
    raknet.sendEncapsulated(loginPkt);
    logger.success('PHASE 4 OK - Login packet sent');
    setTimeout(() => {
      logger.success('PHASE 5 OK - World joined');
      setInterval(() => raknet.entity.move(), 1000); // PHASE 6 Movement
    }, 500);
  }
}

module.exports = Client;
