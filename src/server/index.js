var app = require('http').createServer() 
var io = module.exports.io = require('socket.io')(app)

const PORT = process.env.PORT || 3231 //set the environment variable PORT to tell your web server what port to listen on

const SocketManager = require('./SocketManager')

io.on('connection', SocketManager) // what happened when we connect to server

app.listen(PORT, () => {
	console.log("Connected to port:" + PORT);
})