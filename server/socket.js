const message = require('./model/message')

module.exports = {
    connect: function(io, PORT){
        io.on('connection', (socket) => {
            //output to console on server when connection request comes in
            console.log('user connection on port ' + PORT + ' : ' + socket.id);

            //when a message comes in emit it back to all sokets with the message
            socket.on('message', (message) => {
                io.emit('message', message);
            })
        });
    }
}