// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#4-client-networking
import io from 'socket.io-client';
import { processGameUpdate } from './state';

// let networking handle making stuff visible
// import { setLeaderboardHidden } from './leaderboard';
// import { setUserHidden } from './user';
// import { initState } from './state';

const Constants = require('../shared/constants');

//grab the play menu
const playMenu = document.getElementById('play-menu');

const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false });
const connectedPromise = new Promise(resolve => {
  socket.on('connect', () => {
    console.log('Connected to server!');
    resolve();
  });
});


export const connect = onGameOver => (
  connectedPromise.then(() => {
    // Register callbacks
    socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);
    socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
    socket.on('disconnect', () => {
      console.log('Disconnected from server.');
      document.getElementById('disconnect-modal').classList.remove('hidden');
      document.getElementById('reconnect-button').onclick = () => {
        window.location.reload();
      };
    });
    // socket.on('playerSignIn', (value) => {
    //   console.log("on playerSignIn");
    //   if(value == 1) {
    //     console.log('Signed in or created account succesfully.');
    //     initState();
    //     playMenu.classList.add('hidden');
    //     setLeaderboardHidden(false);
    //     setUserHidden(false);
    //   } else {
    //     console.log("Failed to sign in: password didn't match.");
    //     playMenu.classList.remove('hidden');
    //     setLeaderboardHidden(true);
    //     setUserHidden(true);
    //   }
    //   console.log("done playerSignIn");
    // });
  })
);

export const play = data => {
  socket.emit(Constants.MSG_TYPES.JOIN_GAME, data.userInput, data.passInput, data.tInput);
};
