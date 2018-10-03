const net = require('net');
const Socket = require('./socket').socket;
const dgram  = require('dgram');
//Dictionary of connected users and their IP address and ports.
const users = {};

const server = net.createServer(s => {
    const socket = new Socket(s, users);
   
})

const udp = dgram.createSocket('udp4');

udp.on('listening', ()=>{
    console.log('UDP started up...');
});

udp.on('message', (msg,rinfo)=>{
    console.log("Message from: ", rinfo.port);
    console.log("Message from: ", rinfo.address);

    const message = msg.toString();
    const username = message.split(':')[1];

    if(users[username]) {
        users[username].udpPort = rinfo.port;
        users[username].host    = rinfo.address;
    }
})


server.listen(8080);
udp.bind(41234);