(function (global) {
  global.CWMA_buildGameScript = function buildGameScript() {
    return {
      title: global.CWMA_CONFIG.title,
      subtitle: global.CWMA_CONFIG.subtitle,
      titleImage: global.CWMA_CONFIG.titleImage,
      startScene: global.CWMA_CONFIG.startScene,
      characters: global.CWMA_buildCharacters(),
      backgrounds: global.CWMA_BACKGROUNDS,
      scenes: global.CWMA_buildScenes(),
      cultivation: global.CWMA_buildCultivation()
    };
  };
})(window);
