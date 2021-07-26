import escape from 'lodash/escape';

const user = document.getElementById('userInfo');
const factories = document.querySelectorAll('#userInfo table tr');
const userName = document.getElementById('usernameDisplay');
const userTotalScore = document.getElementById('totalScore');
const userCurrentScore = document.getElementById('currentScore');

export function updateUser(data) {
  userName.innerHTML = "Player: " + data.name;
  userTotalScore.innerHTML = "Total Score: " + Math.floor(data.totalScore);
  userCurrentScore.innerHTML = "Current Score: " + Math.floor(data.score);
}

export function setUserHidden(hidden) {
  if (hidden) {
    user.classList.add('hidden');
  } else {
    user.classList.remove('hidden');
  }
}
