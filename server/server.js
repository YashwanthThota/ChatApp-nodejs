const path = require('path');
const express = require('express');

//express uses http inbuilt to satrat a server but we are extratcting the http out to incorporate the sockect.io with the express.js
const http = require('http');
const socketIO = require('socket.io');
var unique = require('array-unique');

//generate message will print the message reduces the redudency
const {generateMessage,generateLocationMessage} = require('./utils/message')
const {isRealString} = require('./utils/validation')//used to validate the room and name params
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public')

//config for heroku
const port = process.env.PORT || 3000;


var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

//middlewatre to incorporate the html server
app.use(express.static(publicPath));

app.get('/rooms', function (req, res) {
  //users.getRoom();
//console.log(unique(arr))
//console.log(users.getRoom());
var rooms = users.getRoom();
rooms.unshift("pick a room");

res.send(rooms);
})


io.on('connection', (socket) => {
console.log('New User Connected');
//////////////////////////////////////////////////

//////////////////////////////////////////////////
//socket listens and triggered when the cleint disconnected eg: close the client tab in browser
socket.on('disconnect', () => {
console.log('User was disconnected');
var user = users.removeUser(socket.id);

if (user) {
 io.to(user.room).emit('updateUserList', users.getUserList(user.room));//it updates the user list



  io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));//it send everyone that user left
}
});

//////////////////////////////////////////////////
socket.on('join', (params, callback) => {
//to check if the name already taken
var userlist = users.checkExists(params.room);
if(userlist.length < 1)
{
  //to check if the name and room name is not empty and valid
  if (!isRealString(params.name) || !isRealString(params.room)) {
   return callback('Name and room name are required.')
  }
}else{
//to check if the name already taken
if(isInArray(userlist, params.name)){
  //to check if the name and room name is not empty and valid
 if (!isRealString(params.name) || !isRealString(params.room)) {
  return callback('Name and room name are required.')
}else{
    return callback('Name already taken, Please try with other names.')
}
}
}
params.room = params.room.toLowerCase();
socket.join(params.room);//this allows the users to connect to the same room
//socket.leave('the office fans')//kicks you out of the room u wont get the messages from that group
users.removeUser(socket.id);//remove users from potential existing room
users.addUser(socket.id, params.name, params.room);// add them to new room list
io.to(params.room).emit('updateUserList', users.getUserList(params.room));
//*******io.to(params.room).emit('updateUserList', users.getRoom());//it updates the user list
socket.emit('newMessage', generateMessage('Admin','welcome to the chat app'));
socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} has joined`));

callback();
});


socket.on('createMessage', (message,callback) => {
var user = users.getUser(socket.id);

if (user && isRealString(message.text)) {
  io.to(user.room).emit('newMessage', generateMessage(user.name,message.text));
}

callback();
});

socket.on('createLocationMessage', (coords) => {
  var user = users.getUser(socket.id);

if (user) {
io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
}
});

});

//to check if the name already taken
function isInArray(nameslist, findname) {
    return nameslist.indexOf(findname.toLowerCase()) > -1;
}

server.listen(port, ()=> {
console.log(`Server is up at ${port}`)
});
