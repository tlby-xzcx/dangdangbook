var {
    dateFormat
} = require('../utils/fun')
const ws = require('ws');
const webSocketServer = ws.Server;
const port = 3900;

const wss = new webSocketServer({ port });
console.log('webSocket is running at ws://0.0.0.0:3900');

let count = 0;
let info = 'huahua';
let clientMap = {};

wss.on('connection', (socket) => {
    console.log('客户端上线了');
    count++;
    socket.name = info + count;
    clientMap[socket.name] = socket;

    socket.on('message', msg => {
        console.log(msg);
        boradcast(socket, msg);
    })

    socket.on('close', () => {
        boradcast(socket, '离线啦...');
        delete clientMap[socket.name];
    })
})

function boradcast(socket, msg) {
    for (var i in clientMap) {
        clientMap[i].send(`${socket.name}说：(${new Date().toLocaleString()})${msg}`);
    }
}