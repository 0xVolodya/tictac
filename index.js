var app=require('express')();
var http=require('http').Server(app);
var io=require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendFile(__dirname +"/page.html");

});

io.on('connection', function (socket) {
  console.log('user logged');
  
  socket.on('chat message',function (msg) {
    
    io.emit('chat',msg);
  })
});

http.listen(3000,function () {
  console.log('listening on 3000');
})
