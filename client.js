const net = require('net');
const username = process.argv[2];
const port = process.argv[3];
const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const peer = {};


server.on('listening', () => {
    const address = server.address();
    const socket = net.createConnection({host: '159.89.152.225', port: 8080}, ()=>{
        sendData(socket, "setUser", username);
    });

    socket.on('data', d => {
        const data = JSON.parse(d.toString());
        switch(data.type){
            case('connectRequest'):
                    peer.host = data.payload.host;
                    peer.port = data.payload.port;
                    peer.username = data.payload.username;
                    holepunch(socket);
                break;
            case('ack'):
                    console.log(data);
                    ping();
                break;
            case('hpAck'):
                peer.host = data.payload.ip;
                peer.port = data.payload.port;
                pingPeer();

        }
    })

    process.stdin.on('data', data => {
        console.log(data);
        const userQuery = "QUERY USERNAME:";
        if(getData(data).includes(userQuery))
            sendData(socket, "getUser", data.toString().trim().split(userQuery)[1])
    })
})

server.on('message', (msg, rinfo) => {
    console.log('UDP MESSAGE FROM: ', rinfo.address, rinfo.port);
})

function getData(data) {
    return data.toString().toUpperCase();
}

function sendData(socket, type, payload) {
    socket.write(JSON.stringify({
        type: type,
        payload: payload
    }))
}

function sendUdpPacket(socket, data) {
  const buf = Buffer.from(data);
  socket.send(buf,41234, '159.89.152.225');
}

function ping() {
    const msg = 'PING:'+username;
    sendUdpPacket(server,msg);
    //reping every
    setInterval(()=>{
        sendUdpPacket(server,msg);
    },10000)
}

function holepunch(socket) {
    sendData(socket,'hpAck', {
        target:peer.username,
        initiator: username
    });
    const buf = Buffer.from("Hello Peer");
    server.send(buf,peer.port,peer.host);
}

function pingPeer() {
    setInterval(()=>{
        const buf = Buffer.from("Hello Peer");
        server.send(buf,peer.port,peer.host);
    },2000);
}

server.bind(port);

