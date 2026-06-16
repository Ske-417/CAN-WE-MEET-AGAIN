import { GAME_CONFIG } from './config.js';
import { buildGameScript } from './build-script.js';

const bootForm = document.getElementById('boot-form');
const bootOverlay = document.getElementById('boot-overlay');
const nameInput = document.getElementById('player-name');

bootForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const rawName = nameInput.value.trim();
  const playerName = rawName || 'S-91';
  const game = new VNEngine('game', buildGameScript(playerName), GAME_CONFIG.engine);

  bootOverlay.style.opacity = '0';
  bootOverlay.style.pointerEvents = 'none';
  setTimeout(function () {
    bootOverlay.remove();
    game.start();
  }, 220);
});
