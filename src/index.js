const dgram = require('dgram');

const HOST = "ben10407.progamer.me";
const PORT = 43884;

const client = dgram.createSocket('udp4');
let sequence = 0;

console.log('=== RAW BEDROCK BOT - TEST SERVER 1.26.3.1 ===');
console.log(`Connecting to ${HOST}:${PORT}`);

client.on('message', (msg) => {
  const hex = msg.toString('hex');
  console.log(`[RECV] ${hex.slice(0, 100)}${hex.length > 100 ? '...' : ''}`);

  const id = msg[0];
  if (id === 0x1c) {
    console.log('[PHASE 1] Pong received → Gửi handshake');
    sendOpenConnectionRequest1();
  } else if (id === 0x06) {
    console.log('[PHASE 2] Reply 1 → Gửi Request 2');
    sendOpenConnectionRequest2();
  } else if (id === 0x08) {
    console.log('[PHASE 2] RakNet connected → Gửi Login');
    setTimeout(sendLoginPacket, 300);
  } else if (id >= 0x80) {
    console.log('[ENCAPSULATED] Nhận packet từ server');
    if (!sequence) {
      console.log('[SUCCESS] Giả lập join world thành công!');
      startMovement();
    }
  }
});

function sendPacket(data) {
  client.send(data, PORT, HOST, (err) => {
    if (err) console.error('[SEND ERROR]', err);
  });
}

function sendOpenConnectionRequest1() {
  const padding = Buffer.alloc(1400 - 18, 0);
  const pkt = Buffer.concat([Buffer.from([0x05]), Buffer.from([0x00,0xff,0xff,0x00,0xfe,0xfe,0xfe,0xfe,0xfd,0xfd,0xfd,0xfd,0x12,0x34,0x56,0x78]), Buffer.from([11]), padding]);
  sendPacket(pkt);
}

function sendOpenConnectionRequest2() {
  const addr = Buffer.alloc(7);
  addr[0] = 4;
  HOST.split('.').map(Number).forEach((b, i) => addr[1 + i] = b);
  addr.writeUInt16BE(PORT, 5);
  const mtu = Buffer.alloc(2); mtu.writeUInt16BE(1400);
  const guid = Buffer.alloc(8); guid.writeBigUInt64BE(BigInt(Date.now()));
  const pkt = Buffer.concat([Buffer.from([0x07]), Buffer.from([0x00,0xff,0xff,0x00,0xfe,0xfe,0xfe,0xfe,0xfd,0xfd,0xfd,0xfd,0x12,0x34,0x56,0x78]), addr, mtu, guid]);
  sendPacket(pkt);
}

function sendLoginPacket() {
  // Login packet đơn giản cho offline + mod server
  const login = Buffer.from([0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
  const len = Buffer.alloc(2); len.writeUInt16BE(login.length);
  const seq = Buffer.alloc(3); seq.writeUIntBE(sequence++, 0, 3);
  const header = Buffer.concat([Buffer.from([0x80]), seq, Buffer.from([0x00, 0x00]), len]);
  sendPacket(Buffer.concat([header, login]));
  console.log('[PHASE 4] Login packet đã gửi');
}

function startMovement() {
  console.log('[PHASE 6] Bắt đầu di chuyển loop...');
  setInterval(() => {
    const move = Buffer.from([0x90, 0x00, 0x00, 0x00, 0x00]); // stub movement
    const len = Buffer.alloc(2); len.writeUInt16BE(move.length);
    const seq = Buffer.alloc(3); seq.writeUIntBE(sequence++, 0, 3);
    const header = Buffer.concat([Buffer.from([0x80]), seq, Buffer.from([0x00, 0x00]), len]);
    sendPacket(Buffer.concat([header, move]));
    console.log('[MOVEMENT] Gửi movement packet');
  }, 1000);
}

client.bind(() => {
  console.log('UDP socket bound - Gửi ping đầu tiên...');
  const ping = Buffer.concat([
    Buffer.from([0x01]),
    Buffer.alloc(8, 0), // timestamp
    Buffer.from([0x00,0xff,0xff,0x00,0xfe,0xfe,0xfe,0xfe,0xfd,0xfd,0xfd,0xfd,0x12,0x34,0x56,0x78]),
    Buffer.alloc(8)
  ]);
  sendPacket(ping);
});
