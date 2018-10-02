const net = require('net');
const username = process.argv[2];
const port = process.argv[3];
const dgram = require('dgram');
const server = dgram.createSocket('udp6');



server.on('listening', () => {
    const address = server.address();
    const socket = net.createConnection({host: '159.89.152.225', port: 8080}, ()=>{
        sendData(socket, "setUser", username);
    });

    socket.on('data', d => {
        const data = JSON.parse(d.toString());
        switch(data.type){
            case('connectRequest'):
                    console.log(data);
                break;
            case('ack'):
                    console.log(data);
                    ping();
                break;

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
    setInterval(()=>{
        sendUdpPacket(server,'hello world');
    },2000)
}

server.bind(port);

