const express = require('express');
const moment = require('moment');
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server:server });

wss.on('connection', function connection(ws) {
    setInterval(() => {
        // console.log(`heartbeat ${moment().toISOString()}`); 
        ws.send(JSON.stringify({type:`HeartBeat ${moment().format("HH:mm:ss")}`}))   
    },1000)
    // ws.send(JSON.stringify({type:"hello person"}))

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    let recievedData = JSON.parse(message)

    wss.clients.forEach(function each(client) {
      //if you want to test the react part which has a button just do client !== ws in the condition below
      if (client === ws && client.readyState === WebSocket.OPEN) {
        const getFunction = (parameter) => {
          let sendData = JSON.stringify(parameter)
          setTimeout(() => {
            client.send(sendData)
          },4000)
        }
        if(recievedData.type === "Subscribe"){
          getFunction({type:"Subscribed"})
        }else if(recievedData.type === "Unsubscribe"){
          getFunction({type:"Unsubscribed"})
        }else{
          getFunction({type:'Error'})
        }
      }
    });
    
  });
});



server.listen(5000, () => console.log(`Lisening on port :5000`))