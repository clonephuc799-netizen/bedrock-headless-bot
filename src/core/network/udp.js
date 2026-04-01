const dgram = require('dgram');
const logger = require('../../utils/logger');

class UDP {
  constructor(host, port) {
    this.host = host;
    this.port = port;
    this.socket = dgram.createSocket('udp4');
  }

  start(callback) {
    this.socket.on('message', (msg) => {
      logger.logPacket('RECV', msg);
      callback(msg);
    });

    this.socket.on('error', (err) => logger.error('UDP error', err));

    this.socket.bind(() => {
      logger.info(`UDP socket bound → ${this.host}:${this.port}`);
    });
  }

  send(packet) {
    this.socket.send(packet, this.port, this.host, (err) => {
      if (err) logger.error('Send failed', err);
      else logger.logPacket('SEND', packet);
    });
  }

  close() {
    this.socket.close();
  }
}

module.exports = UDP;
