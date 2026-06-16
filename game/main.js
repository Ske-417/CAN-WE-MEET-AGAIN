(function initGameBoot() {
  const siteLoadingStartedAt = Date.now();
  const siteLoading = document.getElementById('site-loading');
  const siteLoadingCopy = document.querySelector('.site-loading-copy');
  const SITE_LOADING_MIN_MS = 2500;
  const LOADING_FADE_MS = 760;
  const LOADING_COPY_VARIANTS = [
    '出勤通知は出荷通知だ。',
    '名前は痛みを育てる。',
    '優しさは、規定違反。',
    '言葉は、本人のためとは限らない。',
    'ここで育つのは判定だ。',
    '静かな個体ほど扱いやすい。',
  ];

  if (!siteLoading) {
    return;
  }

  const Engine = window.VNEngine;
  const buildGameScript = window.CWMA_buildGameScript;
  const config = window.CWMA_CONFIG;
  if (!Engine || !buildGameScript || !config) {
    console.error('Game boot dependencies are missing.');
    return;
  }

  if (siteLoadingCopy) {
    const copyIndex = Math.floor(Math.random() * LOADING_COPY_VARIANTS.length);
    siteLoadingCopy.textContent = LOADING_COPY_VARIANTS[copyIndex];
  }

  function hideSiteLoading() {
    if (!siteLoading) {
      return;
    }
    siteLoading.classList.add('is-hidden');
    setTimeout(function () {
      siteLoading.remove();
    }, LOADING_FADE_MS + 40);
  }

  function waitForMinimumDuration(startedAt, duration) {
    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(0, duration - elapsed);
    return new Promise(function (resolve) {
      setTimeout(resolve, remaining);
    });
  }

  function revealBootScreen() {
    const waitForLoad = document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise(function (resolve) {
          window.addEventListener('load', resolve, { once: true });
        });
    const waitForFonts = document.fonts && document.fonts.ready
      ? document.fonts.ready.catch(function () {})
      : Promise.resolve();

    Promise.all([
      waitForLoad,
      waitForFonts,
      waitForMinimumDuration(siteLoadingStartedAt, SITE_LOADING_MIN_MS)
    ]).then(function () {
      const game = new Engine('game', buildGameScript(), config.engine);
      game.start();
      requestAnimationFrame(function () {
        hideSiteLoading();
      });
    });
  }

  revealBootScreen();
})();
