function makeCharacter(name, nameColor, silhouetteColor, sprites = {}) {
  return {
    name,
    nameColor,
    silhouetteColor,
    sprites
  };
}

export function buildCharacters(playerName) {
  return {
    player: makeCharacter(playerName, '#d7dee7', '#587087'),
    kido: makeCharacter('城戸先輩', '#c8a98a', '#71513e', {
      // Future sprite paths:
      // default: './assets/characters/kido/default.png'
    }),
    walter: makeCharacter('ヴァルター管理官', '#d4be7e', '#826830', {
      // default: './assets/characters/walter/default.png'
    }),
    yuki: makeCharacter('ユキ', '#9dd8f6', '#4d7ba3', {
      // default: './assets/characters/yuki/default.png'
    }),
    system: makeCharacter('[ SYSTEM ]', '#6cb6d4', '#4a6f89')
  };
}
