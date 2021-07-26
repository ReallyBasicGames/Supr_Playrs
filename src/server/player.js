const Constants = require('../shared/constants');

class Player {
  constructor(id, username, team) {
    this.id = id;
    this.username = username;
    if(this.username == null) this.username = "Player" + Math.floor(Math.random() * 1000000);
    this.team = team;
    this.score = 0;
    this.allScore = 0;
  }

  setNewId(id) {
    this.id = id;
  }

  update(dt) {
    var scoreIncrease = 0;
    scoreIncrease += 2 * dt;


    this.score += scoreIncrease;
    this.allScore += scoreIncrease;
    this.team.addScore(scoreIncrease);
  }

  getAllScore() {
    return this.allScore;
  }

  serializeForUpdate() {
    return {
      id: this.id,
      name: this.username,
      team: this.team,
      score: this.score,
      totalScore: this.allScore
    };
  }
}

module.exports = Player;
