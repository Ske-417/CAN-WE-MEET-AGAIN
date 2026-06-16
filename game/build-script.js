import { GAME_CONFIG } from './config.js';
import { buildCharacters } from './data/characters.js';
import { backgrounds } from './data/backgrounds.js';
import { buildScenes } from './data/scenes.js';

export function buildGameScript(playerName) {
  return {
    title: GAME_CONFIG.title,
    subtitle: GAME_CONFIG.subtitle,
    startScene: GAME_CONFIG.startScene,
    characters: buildCharacters(playerName),
    backgrounds,
    scenes: buildScenes(playerName)
  };
}
