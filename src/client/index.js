// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#3-client-entrypoints
import { connect, play } from './networking';
import { initState } from './state';
import { setLeaderboardHidden } from './leaderboard';
import { setUserHidden } from './user';

// I'm using a tiny subset of Bootstrap here for convenience - there's some wasted CSS,
// but not much. In general, you should be careful using Bootstrap because it makes it
// easy to unnecessarily bloat your site.
import './css/bootstrap-reboot.css';
import './css/main.css';

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('login-button');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const teamInput = document.getElementById('team-input');

Promise.all([
  connect(onGameOver)
]).then(() => {
  if(playMenu.classList.contains('hidden')) playMenu.classList.remove('hidden');
  usernameInput.focus();
  playButton.onclick = () => {
    // Play!
    console.log("on playButtonClicked");
    // grab the inputs and store them in 'data', then send 'data' to the server
    var userInput = usernameInput.value;
    var passInput = passwordInput.value;
    var tInput = teamInput.value;
    var data = { userInput, passInput, tInput };
    // play is located in networking.js
    play(data);
    playMenu.classList.add('hidden');
    initState();
    setLeaderboardHidden(false);
    setUserHidden(false);
  };
}).catch(console.error);

function onGameOver() {
  console.log("on onGameOver");
  if(playMenu.classList.contains('hidden')) playMenu.classList.remove('hidden');
  setLeaderboardHidden(true);
  setUserHidden(true);
}
