import { createClient } from 'bedrock-protocol';

const HOST = "ben10407.progamer.me";
const PORT = 43884;

console.log('=== BEDROCK HEADLESS BOT - FIX VERSION 1.26.3 ===');
console.log(`Target: ${HOST}:${PORT}`);

const client = createClient({
  host: HOST,
  port: PORT,
  username: "HeadlessBot",
  offline: true,
  version: "1.26.0",           // ← DÙNG PHIÊN BẢN GẦN NHẤT ĐƯỢC HỖ TRỢ
  skipValidation: true,
  realms: false,
  connectTimeout: 10000
});

client.on('join', () => {
  console.log('[SUCCESS] Đã join world thành công!');
});

client.on('spawn', () => {
  console.log('[SUCCESS] Bot spawn - Bắt đầu di chuyển');
  startMovement();
});

client.on('disconnect', (packet) => {
  console.error('[DISCONNECT]', packet.reason);
});

client.on('error', (err) => {
  console.error('[ERROR]', err.message || err);
});

function startMovement() {
  let tick = 0;
  setInterval(() => {
    client.write('player_auth_input', {
      pitch: 0,
      yaw: 0,
      position: { x: 100 + Math.sin(tick) * 3, y: 70, z: 100 + Math.cos(tick) * 3 },
      moveVector: { x: 0, z: 0 },
      inputFlags: 0x0000000000000001 | 0x0000000000000200,
      inputMode: 1,
      playMode: 0,
      tick: tick++,
      delta: { x: 0, y: 0, z: 0 }
    });
    console.log(`[MOVEMENT] Bot di chuyển tick ${tick}`);
  }, 800);
}

console.log('Bot đang connect lại với version 1.26.0...');
