const Constants = require('../shared/constants');
const Player = require('./player');
const Team = require('./team');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.teamNames = ["red", "yellow", "green", "blue"];
    this.teams = [];
    this.teamIndex = 0;
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);

    // create the teams
    for(var i = 0; i < 4; i ++) {
      this.teams.push(new Team(this.teamNames[i]));
    }
  }

  addPlayer(socket, username, password, team) {
    console.log("adding player with socket id [" + socket.id.toString() + "] with username [" + username + "] and password [" + password + "] for team [" + team + "]");
    this.sockets[socket.id] = socket;

    if (team != null && team != "") Object.keys(this.teams).forEach(teamObj => {
      // if the team name matches
      if(this.teams[teamObj].getName() == team) {
        // login instead
        console.log("found matching team, attempting login");
        var returnedVal = this.login(socket, username, password, this.teams[teamObj]);
        if (returnedVal == -1) {
          return -1;
        } else if (returnedVal == 1) {
          return 1;
        }
        // don't do anything if the player account needs to be created; it does that later
      }
    });
    // create a new account
    var player = new Player(socket.id, username, this.teams[this.teamIndex]);
    this.players[socket.id] = player;
    this.teams[this.teamIndex].addPlayer(player, password);
    // incriment the team index to make an even distribution of teams
    this.teamIndex ++;
    if(this.teamIndex >= this.teams.length) this.teamIndex = 0;


    return 1; // a player was created
  }

  login(socket, username, password, team) {
    // return -1 if username was found but password was wrong
    // return 0 if username was not found and player was added
    // return 1 if username was found and password matched
    var returnedVal = team.checkPlayer(username, password);
    if(returnedVal == -1) {
      // return -1 so the user knows they failed to login
      console.log("wrong password");
      return -1;
    } else if (returnedVal == 0) {
      // return 0 so a new player will be created
      console.log("no username found, creating new player");
      return 0;
    } else { // must be 1
      // get the team player and assign it to this socket
      this.players[socket.id] = team.getPlayer(username);
      console.log("logged in succesfully");
      return 1;
    }
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }


  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];

        // update the player's score based on how much time has passed
        player.update(dt);

        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return Object.values(this.teams)
      .sort((p1, p2) => p2.totalScore - p1.totalScore)
      .slice(0, 4)
      .map(t => ({ team: t.name, score: Math.round(t.totalScore) }));
  }


  createUpdate(player, leaderboard) {
    const teamsToReturn = Object.values(this.teams);
    const user = player.serializeForUpdate();
    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      teams: teamsToReturn.map(p => p.serializeForUpdate()),
      leaderboard,
      user
    };
  }
}

module.exports = Game;
