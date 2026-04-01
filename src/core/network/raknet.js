const UDP = require('./udp');
const logger = require('../../utils/logger');

const MAGIC = Buffer.from([0x00,0xff,0xff,0x00,0xfe,0xfe,0xfe,0xfe,0xfd,0xfd,0xfd,0xfd,0x12,0x34,0x56,0x78]);
const PROTOCOL = 0x0B;
const MTU = 1400;

class RakNet {
  constructor(host, port) {
    this.udp = new UDP(host, port);
    this.clientGUID = BigInt(Date.now());
    this.serverGUID = 0n;
    this.mtu = MTU;
    this.connected = false;
    this.sequence = 0;
    this.kpi = { ping_success: 0, connection_success: 0, login_success: 0, world_join_success: 0 };
  }

  start() {
    this.udp.start((msg) => this.handlePacket(msg));
    this.sendUnconnectedPing();
  }

  sendUnconnectedPing() {
    const ts = Buffer.alloc(8); ts.writeBigUInt64BE(BigInt(Date.now()));
    const guidBuf = Buffer.alloc(8); guidBuf.writeBigUInt64BE(this.clientGUID);
    const pkt = Buffer.concat([Buffer.from([0x01]), ts, MAGIC, guidBuf]);
    this.udp.send(pkt);
  }

  sendOpenConnectionRequest1() {
    const padding = Buffer.alloc(MTU - 18, 0x00);
    const pkt = Buffer.concat([Buffer.from([0x05]), MAGIC, Buffer.from([PROTOCOL]), padding]);
    this.udp.send(pkt);
  }

  sendOpenConnectionRequest2() {
    const addr = Buffer.alloc(7);
    addr[0] = 4;
    this.udp.host.split('.').map(Number).forEach((b, i) => addr[1 + i] = b);
    addr.writeUInt16BE(this.udp.port, 5);
    const mtuBuf = Buffer.alloc(2); mtuBuf.writeUInt16BE(this.mtu);
    const guidBuf = Buffer.alloc(8); guidBuf.writeBigUInt64BE(this.clientGUID);
    const pkt = Buffer.concat([Buffer.from([0x07]), MAGIC, addr, mtuBuf, guidBuf]);
    this.udp.send(pkt);
  }

  handlePacket(msg) {
    const id = msg[0];
    if (id === 0x1c) {
      this.kpi.ping_success = 1;
      logger.success('PHASE 1 OK - Pong received');
      this.sendOpenConnectionRequest1();
    } else if (id === 0x06) {
      this.parseReply1(msg);
    } else if (id === 0x08) {
      this.connected = true;
      this.kpi.connection_success = 1;
      logger.success('PHASE 2 OK - RakNet connected');
      this.startSession();
    } else if (id >= 0x80 && id <= 0x8f) {
      this.handleEncapsulated(msg);
    }
  }

  parseReply1(msg) {
    let off = 17;
    this.serverGUID = msg.readBigUInt64BE(off);
    off += 9;
    this.mtu = msg.readUInt16BE(off);
    this.sendOpenConnectionRequest2();
  }

  startSession() {
    logger.info('PHASE 3 - Session started');
    setTimeout(() => require('../client').sendLogin(this), 200);
  }

  sendEncapsulated(payload) {
    const lenBuf = Buffer.alloc(2); lenBuf.writeUInt16BE(payload.length);
    const seqBuf = Buffer.alloc(3); seqBuf.writeUIntBE(this.sequence++, 0, 3);
    const header = Buffer.concat([Buffer.from([0x80]), seqBuf, Buffer.from([0x00, 0x00]), lenBuf]);
    const pkt = Buffer.concat([header, payload]);
    this.udp.send(pkt);
  }

  handleEncapsulated(msg) {
    logger.info('Encapsulated packet received - session alive');
    this.kpi.world_join_success = 1;
  }

  close() { this.udp.close(); }
}

module.exports = RakNet;
