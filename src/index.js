import { createClient } from 'bedrock-protocol';

const HOST = "ben10407.progamer.me";
const PORT = 43884;

console.log('=== BEDROCK HEADLESS BOT - 1.26.3.1 + MOD SUPPORT ===');
console.log(`Target: ${HOST}:${PORT} | Offline Mode: ON`);

const client = createClient({
  host: HOST,
  port: PORT,
  username: "HeadlessBot",
  offline: true,
  version: "1.26.3",
  skipValidation: true
});

client.on('join', () => console.log('[SUCCESS] Đã join world!'));
client.on('spawn', () => {
  console.log('[SUCCESS] Bot spawn thành công - Bắt đầu di chuyển');
  startMovement();
});
client.on('disconnect', (p) => console.error('[DISCONNECT]', p.reason));
client.on('error', (err) => console.error('[ERROR]', err));

function startMovement() {
  let x = 0;
  setInterval(() => {
    client.write('player_auth_input', {
      pitch: 0,
      yaw: 0,
      position: { x: 100 + Math.sin(x) * 5, y: 70, z: 100 + Math.cos(x) * 5 },
      moveVector: { x: 0, z: 0 },
      inputFlags: 0x0000000000000001 | 0x0000000000000200,
      inputMode: 1,
      playMode: 0,
      tick: Date.now() % 0xFFFFFFFF,
      delta: { x: 0, y: 0, z: 0 }
    });
    x += 0.1;
    console.log(`[MOVEMENT] Bot di chuyển...`);
  }, 800);
}

console.log('Bot đang khởi chạy...');
