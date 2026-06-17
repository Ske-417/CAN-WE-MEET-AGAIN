(function (global) {
  function makeCharacter(name, nameColor, silhouetteColor, sprites) {
    return {
      name,
      nameColor,
      silhouetteColor,
      sprites: sprites || {}
    };
  }

  global.CWMA_buildCharacters = function buildCharacters() {
    return {
      player: makeCharacter(function (vars) {
        return vars.playerName || 'あなた';
      }, '#d7dee7', '#587087'),
      kido: makeCharacter('城戸先輩', '#c8a98a', '#71513e', {
        // default: './assets/characters/kido/default.png'
      }),
      walter: makeCharacter('ヴァルター管理官', '#d4be7e', '#826830', {
        // default: './assets/characters/walter/default.png'
      }),
      yuki: makeCharacter(function (vars) {
        if (!vars.namedYuki) return 'J-7';
        return vars.yukiName || 'ユキ';
      }, '#9dd8f6', '#4d7ba3', {
        // default: './assets/characters/yuki/default.png'
      }),
      ren: makeCharacter(function (vars) {
        if (!vars.namedRen) return 'R-6';
        return vars.renName || 'レン';
      }, '#d9d0ff', '#6a5f97', {
        // default: './assets/characters/ren/default.png'
      }),
      aki: makeCharacter(function (vars) {
        if (!vars.namedAki) return 'A-4';
        return vars.akiName || 'アキ';
      }, '#f1c7b8', '#8a675d', {
        // default: './assets/characters/aki/default.png'
      }),
      system: makeCharacter('[ SYSTEM ]', '#6cb6d4', '#4a6f89')
    };
  };
})(window);
