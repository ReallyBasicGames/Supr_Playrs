class Team {
  constructor(name) {
    this.totalScore = 0;
    this.players = [];
    this.playerPasswords = [];
    this.name = name;
    if(this.name == "red") this.totalScore = 3;
    if(this.name == "yellow") this.totalScore = 2;
    if(this.name == "green") this.totalScore = 1;
    if(this.name == "blue") this.totalScore = 0;

  }

  addScore(s) {
    this.totalScore += s;
  }

  getName() {
    return this.name;
  }

  addPlayer(player, password) {
    this.players.push(player);
    this.playerPasswords.push(password);
    console.log("added player:" + player.toString());
    console.log("added password: " + password);
  }

  checkPlayer(username, password) {
    console.log("checking player [" + username + "] with password [" + password + "]");
    // return -1 if username was found but password was wrong
    // return 0 if username was not found and player was added
    // return 1 if username was found and password matched
    for(var i = 0; i < this.players.length; i++){
      console.log(this.players[i].getName() + " w/ password " + this.playerPasswords[i]);
      if(this.players[i].getName() == username) {
        console.log("Found player with username [" + username + "]");
        if(this.playerPasswords[i] == password) {
          console.log(username + "'s password didn't match stored value of " + this.playerPasswords[i]);
          return -1;
        } else {
          console.log(username + "'s password matched.");
          return 1;
        }
      }
    }
    return 0;
  }

// TO-DO: return a player with the given username
  getPlayer(username) {
    console.log("Grabbed player with username [" + username + "].");
    return null;

  }

  serializeForUpdate() {
    return {
      name: this.name,
      score: this.totalScore
    };
  }
}

module.exports = Team;
