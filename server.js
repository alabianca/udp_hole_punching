const net = require('net');
const Socket = require('./socket').socket;
const dgram  = require('dgram');
//Dictionary of connected users and their IP address and ports.
const users = {};

const server = net.createServer(s => {
    const socket = new Socket(s, users);
   
})

const udp = dgram.createSocket('udp4');

server.on('listening', ()=>{
    console.log('UDP started up...');
});

server.on('message', (msg,rinfo)=>{
    console.log("Message from: ", rinfo.port);
    console.log("Message from: ", rinfo.address);

    console.log("Message: ", msg.toString());
})


server.listen(8080);