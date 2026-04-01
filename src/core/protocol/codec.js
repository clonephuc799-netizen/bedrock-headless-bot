class Codec {
  static encode(packetId, data) {
    return Buffer.concat([Buffer.from([packetId]), data]);
  }
}

module.exports = Codec;
