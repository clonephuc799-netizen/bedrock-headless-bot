const Codec = require('./codec');

const packets = {
  sendLogin() {
    return Codec.encode(0x01, Buffer.from([0x00, 0x00, 0x00, 0x00]));
  }
};

module.exports = packets;
