var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('./public'));
var rooms = [];

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");

});

io.on('connection', function (socket) {
    console.log('user logged');

    socket.on('update state', function (data) {
        console.log(data);
        io.emit('change state', data);
    });

    socket.on('room', function (room) {
        socket.join(room);
        rooms.push(room);
        console.log(rooms.length);
        if (rooms.length == 2) {
            io.in(room).emit("start game");
        }
    });


});


http.listen(3000, function () {
    console.log('listening on 3000');
});
