// Real-Time Socket.io event engine for OPD Queues, Bed occupancy, and Emergency alerts
const setupSockets = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 [SOCKET.IO CONNECTED] Client ID: ${socket.id}`);

    // Join room for specific role or department
    socket.on('join_room', (roomName) => {
      socket.join(roomName);
      console.log(`🚪 Client ${socket.id} joined room: ${roomName}`);
    });

    // Handle Emergency Code Broadcast (Code Blue, Trauma, Fire)
    socket.on('emergency:broadcast', (data) => {
      console.log(`🚨 [EMERGENCY CODE BLUE BROADCAST]`, data);
      io.emit('emergency:alert', {
        id: `EMG-${Date.now()}`,
        code: data.code || 'CODE_BLUE',
        location: data.location || 'ICU Block B, 2nd Floor',
        message: data.message || 'Immediate Resuscitation Team Required!',
        timestamp: new Date().toISOString()
      });
    });

    // Patient Token Ping
    socket.on('opd:ping_token', (data) => {
      io.emit('opd:token_called', data);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 [SOCKET.IO DISCONNECTED] Client ID: ${socket.id}`);
    });
  });
};

module.exports = { setupSockets };
