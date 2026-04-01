import { createClient } from 'bedrock-protocol';

const HOST = "ben10407.progamer.me";
const PORT = 43884;

console.log('=== BEDROCK HEADLESS BOT - ANTI KICK FIXED ===');
console.log(`Target: ${HOST}:${PORT}`);

const client = createClient({
  host: HOST,
  port: PORT,
  username: "HeadlessBot",
  offline: true,
  version: "1.26.0",
  skipValidation: true,
  connectTimeout: 20000
});

client.on('join', () => {
  console.log('[SUCCESS] Join world thành công!');
});

client.on('spawn', () => {
  console.log('[SUCCESS] Bot spawn - Bắt đầu di chuyển ổn định (anti-kick)');
  startAntiKickMovement();
});

client.on('disconnect', (packet) => {
  console.log('[KICK/DISCONNECT]', packet.reason || packet);
});

client.on('error', (err) => {
  console.error('[ERROR]', err.message || err);
});

// Movement packet đầy đủ + gửi thường xuyên để tránh bị kick
function startAntiKickMovement() {
  let tick = 0;
  let angle = 0;

  setInterval(() => {
    angle += 0.06;

    const x = 100 + Math.sin(angle) * 5;
    const z = 100 + Math.cos(angle) * 5;

    client.write('player_auth_input', {
      pitch: 0,
      yaw: 90,
      head_yaw: 90,
      position: { x: x, y: 70, z: z },
      move_vector: { x: 0, z: 0 },
      input_flags: BigInt(0x0000000000000001) | BigInt(0x0000000000000200), // moving + jumping
      input_mode: 1,
      play_mode: 0,
      interaction_model: 0,
      tick: BigInt(tick++),
      delta: { x: 0.0, y: 0.0, z: 0.0 },
      vehicle_rotation: { x: 0, y: 0, z: 0 },
      analog_move_vector: { x: 0, z: 0 }
    });

    if (tick % 15 === 0) {
      console.log(`[MOVEMENT] Tick ${tick} | Pos ~ (${x.toFixed(1)}, ${z.toFixed(1)})`);
    }
  }, 600);   // gửi mỗi 0.6 giây
}

console.log('Bot đang chạy... Nếu vẫn kick thì paste log cho tao fix tiếp.');
