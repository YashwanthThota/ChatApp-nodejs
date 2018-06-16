var moment =require('moment');//it is used to play with time refer playgrounf time.js
var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()//output:1528768997226(time in miiliseconds since jan1st 1970)
  };
};

var generateLocationMessage = (from, latitude, longitude) => {
return {
from,
url:`https://www.google.com/maps?q=${latitude},${longitude}`,
createdAt: moment().valueOf()//output:1528768997226(time in miiliseconds since jan1st 1970)
};
};
module.exports = {generateMessage,generateLocationMessage}
