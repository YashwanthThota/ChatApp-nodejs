//io() initiates client request
var socket = io();
//////////////////////////////////////////////////
//'connect' built in event to connect to server
//.on is a built in function to regiter and listen for event

//Autoscrolling: Refer lecture 120
function scrollToBottom() {
  //Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child')
  //heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}



//socket.on('connect', () => {//if we use ES6 notation in javascript it works fine only in chrome, won't work in safari, mobile, firefox etc.,
socket.on('connect', function() {
var params = jQuery.deparam(window.location.search);

//socket.emit send only to a specific user
socket.emit('join', params, function (err) {
  if (err) {
    alert(err);
    window.location.href = '/';//if there is an error the page is redirected to the index page
  }else {
  console.log('No error');
  }
})
});
//'disconnect' built in event which fires when the server crash or drops
socket.on('disconnect', function() {
 console.log('Disconnected from server');
});

//////////////////////////////////////////////////
socket.on('updateUserList', function (users) {
var ol = jQuery('<ol></ol>');

users.forEach(function (user) {
 ol.append(jQuery('<li></li>').text(user));
});

jQuery('#users').html(ol);
});
//CUSTOM EVENT LISTENER
//socket.on('newMessage', function() {//if there is no message
socket.on('newMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a')
 //it access the atg with name message-template and .html() retreives the html present in the js file
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });//it renders the template to html varaiable and values

  jQuery('#messages').append(html);//appends the html variable to html page
  // var li = jQuery('<li></li>');//creating an element using jquery
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);
  // jQuery('#messages').append(li);
  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
var formattedTime = moment(message.createdAt).format('h:mm a')

var template = jQuery('#location-message-template').html();
var html = Mustache.render(template, {
  url: message.url,
  from: message.from,
  createdAt: formattedTime
});

  jQuery('#messages').append(html);
  scrollToBottom();
// var li = jQuery('<li></li>');
// var a = jQuery('<a target="_blank">My current location</a>');
//
// li.text(`${message.from} ${formattedTime}: `);
// a.attr('href', message.url);
// li.append(a);
// jQuery('#messages').append(li);
});


//accessing the DOM variables by using JQuery
//.on is an event listner
jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();//prevents the page from getting refreshed

  var messageTextbox = jQuery('[name=message]');
  socket.emit('createMessage', {
    text: messageTextbox.val()//it gets the value from message page
  }, function () {
//callback function for Acknowledgement
messageTextbox.val('')//clearing the field after sending the message in the text box
  });
});

//this is the jquery selector that targets the button, because we gonna use it multiple time
var locationButton = jQuery('#send-location');
//same as: jQuery('#send-location').on()
locationButton.on('click', function () {
  //if the browser won't support geolocation
if (!navigator.geolocation) {
  return alert('Geolocation not supported by browser.')
}

locationButton.attr('disabled', 'disabled').text('Sending location...');//disable the send location button

navigator.geolocation.getCurrentPosition(function (position) {
locationButton.removeAttr('disabled').text('Send location');
socket.emit('createLocationMessage', {
  latitude: position.coords.latitude,
  longitude: position.coords.longitude
});
}, function () {
  locationButton.removeAttr('disabled').text('Send location');
  alert('Unable to to fetch location.');
})
});
