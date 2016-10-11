var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('./public'));
var port = process.env.PORT || 3000;
var rooms = {};

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

io.configure(function () {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 20);
});

io.on('connection', function (socket) {
    console.log('user logged');

    socket.on('update state', function (data) {
        // console.log(data);
        socket.broadcast.to(data.room).emit('change state', data);
    });

    socket.on('room', function (room) {

            if (rooms[room] >= 2) {
                return;
            }

            socket.join(room);
            socket.room = room;
            rooms[room] == null ? rooms[room] = 1 : rooms[room] += 1;
            console.log(rooms);
            console.log(room);
            io.in(room).emit("joined the room", room);

            if (rooms[room] == 2) {
                io.in(room).emit("start game");
            }

        },
        socket.on('disconnect', function () {
            socket.leave(socket.room);
        })
    );


});


http.listen(port, function () {

    console.log('listening on 3000');
});
