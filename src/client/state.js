// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#7-client-state
import { updateLeaderboard } from './leaderboard';
import { updateUser } from './user';

// The "current" state will always be RENDER_DELAY ms behind server time.
// This makes gameplay smoother and lag less noticeable.
const RENDER_DELAY = 100;

const gameUpdates = [];
let gameStart = 0;
let firstServerTimestamp = 0;

export function initState() {
  gameStart = 0;
  firstServerTimestamp = 0;
}

export function processGameUpdate(update) {
  console.log("on processGameUpdate");
  if (!firstServerTimestamp) {
    firstServerTimestamp = update.t;
    gameStart = Date.now();
  }
  gameUpdates.push(update);

  updateLeaderboard(update.leaderboard);
  updateUser(update.user);

  // Keep only one game update before the current server time
  const base = getBaseUpdate();
  if (base > 0) {
    gameUpdates.splice(0, base);
  }
  console.log("done processGameUpdate");
}

function currentServerTime() {
  console.log("on currentServerTime");
  return firstServerTimestamp + (Date.now() - gameStart) - RENDER_DELAY;
}

// Returns the index of the base update, the first game update before
// current server time, or -1 if N/A.
function getBaseUpdate() {
  console.log("on getBaseUpdate");
  const serverTime = currentServerTime();
  for (let i = gameUpdates.length - 1; i >= 0; i--) {
    if (gameUpdates[i].t <= serverTime) {
      return i;
    }
  }
  return -1;
}

// Returns { me, others, bullets }
export function getCurrentState() {
  console.log("on getCurrentState");
  if (!firstServerTimestamp) {
    return {};
  }

  const base = getBaseUpdate();
  const serverTime = currentServerTime();

  // If base is the most recent update we have, use its state.
  // Otherwise, interpolate between its state and the state of (base + 1).
  if (base < 0 || base === gameUpdates.length - 1) {
    return gameUpdates[gameUpdates.length - 1];
  } else {
    const baseUpdate = gameUpdates[base];
    const next = gameUpdates[base + 1];
    const ratio = (serverTime - baseUpdate.t) / (next.t - baseUpdate.t);
    return {
      me: interpolateObject(baseUpdate.me, next.me, ratio),
      teams: interpolateObjectArray(baseUpdate.teams, next.teams, ratio),
    };
  }
}

function interpolateObject(object1, object2, ratio) {
  if (!object2) {
    return object1;
  }
  return object2;
}

function interpolateObjectArray(objects1, objects2, ratio) {

  return objects1.map(o => interpolateObject(o, objects2.find(o2 => o.id === o2.id), ratio));
}
