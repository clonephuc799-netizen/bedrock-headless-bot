import { createClient } from 'bedrock-protocol';

const HOST = "ben10407.progamer.me";
const PORT = 43884;
const USERNAME = "HeadlessBot";

let reconnectCount = 0;
let movementInterval = null;

console.log('=== BEDROCK HEADLESS BOT - TEST LOOP VÔ HẠN ===');
console.log(`Server: ${HOST}:${PORT} | Version: 1.26.0 (compat)`);

function startBot() {
  reconnectCount++;
  console.log(`\n[RECONNECT #${reconnectCount}] Đang kết nối...`);

  const client = createClient({
    host: HOST,
    port: PORT,
    username: USERNAME + (reconnectCount > 1 ? reconnectCount : ''),
    offline: true,
    version: "1.26.0",
    skipValidation: true,
    connectTimeout: 20000
  });

  client.on('join', () => {
    console.log(`[SUCCESS #${reconnectCount}] Join world thành công!`);
  });

  client.on('spawn', () => {
    console.log(`[SUCCESS #${reconnectCount}] Bot spawn - Bắt đầu di chuyển ổn định`);
    startStableMovement(client);
  });

  client.on('disconnect', (packet) => {
    console.log(`[DISCONNECT #${reconnectCount}] Lý do: ${packet.reason || 'Unknown'}`);
    if (movementInterval) clearInterval(movementInterval);
    client.close();
    setTimeout(startBot, 4000);   // reconnect sau 4 giây
  });

  client.on('error', (err) => {
    console.error(`[ERROR #${reconnectCount}]`, err.message || err);
    if (movementInterval) clearInterval(movementInterval);
    client.close();
    setTimeout(startBot, 4000);
  });
}

function startStableMovement(client) {
  if (movementInterval) clearInterval(movementInterval);

  let tick = 0;
  let angle = 0;

  movementInterval = setInterval(() => {
    angle += 0.07;
    const posX = 100 + Math.sin(angle) * 6;
    const posZ = 100 + Math.cos(angle) * 6;

    try {
      client.write('player_auth_input', {
        pitch: 0,
        yaw: 0,
        head_yaw: 0,
        position: { x: posX, y: 70, z: posZ },
        move_vector: { x: 0, z: 0 },
        input_flags: BigInt(0x0000000000000001) | BigInt(0x0000000000000200),
        input_mode: 1,
        play_mode: 0,
        interaction_model: 0,
        tick: BigInt(tick++),
        delta: { x: 0, y: 0, z: 0 },
        vehicle_rotation: { x: 0, y: 0, z: 0 },
        analog_move_vector: { x: 0, z: 0 }
      });

      // Log ít hơn để dễ nhìn
      if (tick % 20 === 0) {
        console.log(`[MOVEMENT #${reconnectCount}] Tick ${tick} | Vị trí: ${posX.toFixed(1)}, ${posZ.toFixed(1)}`);
      }
    } catch (e) {
      console.error(`[MOVEMENT ERROR]`, e.message);
      clearInterval(movementInterval);
    }
  }, 650);
}

// Bắt đầu test loop
startBot();

console.log('Bot đang test loop liên tục... (sẽ tự reconnect nếu disconnect)');
