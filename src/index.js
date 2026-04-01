const Client = require('./core/client');

const HOST = "bedrock.opblocks.com";   // Server public đang online
const PORT = 19132;

const client = new Client(HOST, PORT);
client.start();

console.log('=== MINECRAFT BEDROCK HEADLESS CLIENT - AUTONOMOUS MODE ===');
console.log('Đang connect server:', HOST + ':' + PORT);
