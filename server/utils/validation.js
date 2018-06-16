var isRealString = (str) => {
 return typeof str === 'string' && str.trim().length > 0; //this checks whether the param is string and it also trims the spaces '  hello '
 // '   ' is invalid
};

module.exports = {isRealString};
