var unique = require('array-unique');
class Users {
  constructor () {
    this.users = [];
  }
  addUser (id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }
  removeUser (id) {
    var user = this.getUser(id);

    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
    }
  getUser (id) {
   return this.users.filter((user) => user.id === id)[0]//refer lecture 125
  }
  getUserList (room) {
   var users = this.users.filter((user) => user.room === room);
   var namesArray = users.map((user) => user.name);

   return namesArray;
   }

   checkExists (room) {
     var users = this.users.filter((user) => user.room === room);
     var namesArray = users.map((user) => user.name);

     return namesArray;
   }

   getRoom () {
     return unique(this.users.map((user) => user.room));
   }
}

module.exports = {Users};
