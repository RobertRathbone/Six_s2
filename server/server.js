const http = require('http');
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', (room) => {
    console.log(`User joined room ${room}`);
    socket.join(room);
  });

  socket.on('data', (data) => {
    console.log(`Received data from user: ${data}`);
    socket.to(Object.keys(socket.rooms)[1]).emit('data', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

http.listen(3000, () => {
  console.log('Server started on port 3000');
});
