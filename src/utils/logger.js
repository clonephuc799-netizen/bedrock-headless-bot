const logger = {
  logPacket(direction, packet) {
    const time = new Date().toISOString();
    console.log(`[${time}] [${direction}] ${packet.toString('hex')}`);
  },
  info(msg) { console.log(`[INFO] ${msg}`); },
  success(msg) { console.log(`[SUCCESS] ✅ ${msg}`); },
  error(msg, err = null) {
    console.error(`[ERROR] ❌ ${msg}`);
    if (err) console.error(err);
  },
  kpi(data) {
    console.log(`[KPI] ${JSON.stringify(data, null, 2)}`);
  }
};

module.exports = logger;
