// 0 :- This is equal to Jan 1st 1970 00:00:00 am
//1000:- 1 minute after the time stampan (1st 1970 00:00:01 am),-1000:- 1 minute before the timestamp

//refer momentjs.com
var moment = require('moment');

var date = moment();

// console.log(date.format('MMMM YYYY'));//June 2018
// console.log(date.format('MMM YY'));//Jun 18
// console.log(date.format('MM Y'));//06 2018
// console.log(date.format('M YYY'));//6 182018
// console.log(date.format('MMM Do,YYYY'));//Jun 11th,2018

// //ADDING DATE
// date.add(100,'year');
// console.log(date.format('MMM Do,YYYY'));//Jun 11th,2118

// //Subtracting months
// date.add(100,'year').subtract(9,'months');
// console.log(date.format('MMM Do,YYYY'))//Sep 11th,2117

//6(unpadded with 0): 01('padded with 0') am(6:01 am)
console.log(date.format('h:mm a'));
