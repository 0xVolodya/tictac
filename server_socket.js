/* @flow */

var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 3000));

var server = app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

var io = require('socket.io')(server);
app.use(express.static('./public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// var port = ;
var rooms = {};

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
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

//
// http.listen(port, function () {
//
//     console.log('listening on ]' + port);
// });
