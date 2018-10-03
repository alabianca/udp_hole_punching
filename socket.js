class Socket {
    constructor(socket, users) {
        this.socket = socket;
        this.users = users;
        this.onData();
        this.onClose();
        this.intervalId = null;
        //this.printUsers();

    }

    onData() {
        this.socket.on('data', data => {
            const query = JSON.parse(data.toString());
            switch (query.type) {
                case ('getUser'):
                    const user = this.users[query.payload];
        
                    if (user) {
                        //console.log(user);
                        this.sendData(user.socket, 'connectRequest', {
                            host: this.users[this.username].host,
                            port: this.users[this.username].udpPort,
                            username: this.username
                        })
                    }
                    break;
                case ('setUser'):
                    this.username = query.payload;
                    this.users[this.username] = {
                        ip: this.socket.remoteAddress,
                        port: this.socket.remotePort,
                        socket: this.socket
                    }
                    this.sendData(this.socket, 'ack', 'Hello World');
                    break;
                case ('hpAck'):
                    const user = this.users[query.payload.target];
                    const initiator = this.users[query.payload.initiator];
                    console.log('hpAck');
                    console.log("TARGET: ", user.host, user.udpPort);
                    console.log("INITIATOR: ", initiator.host, initiator.udpPort);
                    if(user && initiator) {
                        //console.log('hpAck: ', user.host, user.port);
                        this.sendData(user.socket, 'hpAck', {
                            ip: initiator.host,
                            port: initiator.udpPort
                        });
                    }
            }
        })
    }

    onClose() {
        this.socket.on('end', close => {
            delete this.users[this.username];
            clearInterval(this.intervalId);
        })
    }

    printUsers() {
        this.intervalId = setInterval(() => {
            console.log({
                username: this.username,
                ip: this.socket.remoteAddress,
                port: this.socket.remotePort
            });

        }, 5000);
    }

    sendData(socket, type, payload) {
        socket.write(JSON.stringify({
            type: type,
            payload: payload
        }))
    }
}



module.exports.socket = Socket;