/**
 * VNEngine - HTML5 ビジュアルノベルエンジン
 * Version 1.0.0
 *
 * ════════════════════════════════════════
 *  基本的な使い方
 * ════════════════════════════════════════
 *
 *   <div id="game" style="width:800px;height:500px;"></div>
 *   <script src="vn-engine.js"></script>
 *   <script>
 *     const game = new VNEngine('game', gameScript);
 *     game.start();
 *   </script>
 *
 * ════════════════════════════════════════
 *  スクリプト定義形式
 * ════════════════════════════════════════
 *
 *   const gameScript = {
 *     title: 'ゲームタイトル',      // タイトル画面に表示
 *     startScene: 'scene01',         // 開始シーンID
 *
 *     characters: {
 *       'char_id': {
 *         name: '表示名',
 *         nameColor: '#88aacc',       // 名前ボックスの文字色
 *         silhouetteColor: '#336699', // スプライトがない場合のシルエット色
 *         sprites: {
 *           'default': 'path/to/normal.png',
 *           'happy':   'path/to/happy.png',
 *         }
 *       }
 *     },
 *
 *     backgrounds: {
 *       'bg_id': { type: 'color',    value: '#001122' },
 *       'bg_id': { type: 'gradient', value: 'linear-gradient(...)' },
 *       'bg_id': { type: 'image',    value: 'path/to/bg.jpg' },
 *     },
 *
 *     scenes: {
 *       'scene_id': {
 *         steps: [  Step objects (下記参照)  ]
 *       }
 *     }
 *   };
 *
 * ════════════════════════════════════════
 *  Step の種類
 * ════════════════════════════════════════
 *
 *  ナレーション（キャラなし）
 *    { type: 'narration', text: '...' }
 *
 *  台詞（キャラあり）
 *    { type: 'dialogue', char: 'char_id', text: '...' }
 *
 *  選択肢（分岐）
 *    { type: 'choice', options: [
 *      { text: '選択肢1', goto: 'scene_id' },
 *      { text: '選択肢2', goto: 'scene_id', setVar: { name: 'flag', value: true } },
 *      { text: '条件付き', goto: 'scene_id', condition: 'vars.flag === true' },
 *    ]}
 *
 *  背景変更
 *    { type: 'bg', target: 'bg_id', transition: 'fade' } // transition: 'fade'|'none'
 *
 *  キャラ表示
 *    { type: 'char_show', char: 'char_id', position: 'left', sprite: 'default' }
 *    // position: 'left'|'center'|'right'
 *
 *  キャラ非表示
 *    { type: 'char_hide', char: 'char_id' }
 *
 *  全キャラ消去
 *    { type: 'clear_chars' }
 *
 *  変数セット
 *    { type: 'set_var', name: 'varName', value: 'anything' }
 *
 *  シーンジャンプ
 *    { type: 'goto', target: 'scene_id' }
 *
 *  BGM再生
 *    { type: 'bgm', src: 'path/to/music.mp3', loop: true }
 *
 *  BGM停止
 *    { type: 'bgm_stop' }
 *
 *  効果音
 *    { type: 'sfx', src: 'path/to/se.mp3' }
 *
 *  エンド
 *    { type: 'end' }
 *
 * ════════════════════════════════════════
 *  キーボードショートカット
 * ════════════════════════════════════════
 *   Space / Enter : テキスト送り
 *   A             : AUTOモード切替
 *   S             : SKIPモード切替
 *   L             : ログ（履歴）表示
 *   Escape        : パネルを閉じる
 */

(function (global) {
  'use strict';

  class VNEngine {
    /**
     * @param {string} containerId  - マウント先 div の id
     * @param {object} script       - ゲームスクリプトオブジェクト
     * @param {object} [config={}]  - オプション設定
     */
    constructor(containerId, script, config = {}) {
      this.el = document.getElementById(containerId);
      if (!this.el) throw new Error(`VNEngine: #${containerId} が見つかりません`);

      this.script = script;
      this.cfg = Object.assign({
        typeSpeed:    30,           // タイプライター: 1文字あたりのms
        autoDelay:    2800,         // AUTOモード: 文章完了後の待機ms
        skipDelay:    45,           // SKIPモード: ステップ間のms
        fadeDuration: 550,          // 背景フェードのms
        saveSlots:    6,            // セーブスロット数
        saveKey:      '__vn_save__' // localStorage保存キー
      }, config);

      this.state = {
        scene:   null,
        step:    0,
        vars:    {},
        history: [],
        typing:  false,
        waiting: false,
        auto:    false,
        skip:    false,
      };

      this._currentText = '';
      this._typeTimer   = null;
      this._autoTimer   = null;
      this._bgmNode     = null;
      this._saveMode    = 'save';
      this.saves        = {};

      try {
        this.saves = JSON.parse(localStorage.getItem(this.cfg.saveKey) || '{}');
      } catch (_) {}

      this._injectStyles();
      this._buildDOM();
      this._bindEvents();
    }

    // ────────────────────────────────────────────────
    //  Public API
    // ────────────────────────────────────────────────

    /** ゲームを開始する（タイトル画面を表示してからシーンへ） */
    start(sceneId) {
      const id = sceneId || this.script.startScene || Object.keys(this.script.scenes)[0];
      this._showTitleScreen(() => this.gotoScene(id));
    }

    /** 指定シーンへ直接ジャンプ */
    gotoScene(id) {
      const scene = this.script.scenes[id];
      if (!scene) { console.error(`VNEngine: Scene "${id}" not found`); return; }
      this.state.scene = id;
      this.state.step  = 0;
      this._execute();
    }

    /** テキスト送り（クリック・キー操作） */
    advance() {
      if (this.state.typing)  { this._finishTyping(); return; }
      if (this.state.waiting) {
        clearTimeout(this._autoTimer);
        this.state.waiting = false;
        this._next();
      }
    }

    // ────────────────────────────────────────────────
    //  Step 実行
    // ────────────────────────────────────────────────

    _next() { this.state.step++; this._execute(); }

    _execute() {
      const scene = this.script.scenes[this.state.scene];
      if (!scene) return;
      const step = scene.steps[this.state.step];
      if (!step) return; // シーン自然終了

      if (step.condition && !this._evalCond(step.condition)) { this._next(); return; }

      switch (step.type) {
        case 'narration':   this._showText(null, step.text);                                   break;
        case 'dialogue':    this._showText(step.char, step.text);                              break;
        case 'choice':      this._showChoice(step.options);                                    break;
        case 'input':       this._showInput(step);                                             break;
        case 'modal':       this._showModal(step);                                             break;
        case 'bg':          this._setBg(step.target, step.transition);   this._next();         break;
        case 'char_show':   this._charShow(step.char, step.position, step.sprite); this._next(); break;
        case 'char_hide':   this._charHide(step.char);                   this._next();         break;
        case 'clear_chars': this._clearChars();                          this._next();         break;
        case 'set_var':     this.state.vars[step.name] = step.value;     this._next();         break;
        case 'goto':        this.gotoScene(step.target);                                       break;
        case 'bgm':         this._playBgm(step.src, step.loop);          this._next();         break;
        case 'bgm_stop':    this._stopBgm();                             this._next();         break;
        case 'sfx':         this._playSfx(step.src);                     this._next();         break;
        case 'end':         this._showEnd();                                                   break;
        default:
          console.warn(`VNEngine: 未知のステップタイプ "${step.type}"`);
          this._next();
      }
    }

    _resolveValue(value) {
      return typeof value === 'function' ? value(this.state.vars, this.state) : value;
    }

    // ────────────────────────────────────────────────
    //  テキスト表示・タイプライター
    // ────────────────────────────────────────────────

    _showText(charId, text) {
      const chars = this.script.characters || {};
      const char  = charId ? chars[charId] : null;
      const resolvedName = char ? this._resolveValue(char.name) : '';
      const resolvedText = this._resolveValue(text);

      if (char && resolvedName) {
        this.els.name.textContent = resolvedName;
        this.els.name.style.color   = char.nameColor || '#88aacc';
        this.els.name.style.visibility = 'visible';
      } else {
        this.els.name.textContent   = '';
        this.els.name.style.visibility = 'hidden';
      }

      this.state.history.push({ name: resolvedName || '', text: resolvedText });

      this.els.text.textContent   = '';
      this.els.arrow.style.opacity = '0';
      this.state.typing   = true;
      this.state.waiting  = false;
      this._currentText   = resolvedText;

      let i = 0;
      const tick = () => {
        if (i < resolvedText.length) {
          this.els.text.textContent = resolvedText.slice(0, ++i);
          const speed = this.state.skip ? 0 : this.cfg.typeSpeed;
          this._typeTimer = setTimeout(tick, speed);
        } else {
          this._onTypeDone();
        }
      };
      tick();
    }

    _finishTyping() {
      clearTimeout(this._typeTimer);
      this.els.text.textContent  = this._currentText;
      this.state.typing          = false;
      this.state.waiting         = true;
      this.els.arrow.style.opacity = '1';
      if (this.state.auto) {
        this._autoTimer = setTimeout(() => this.advance(), this.cfg.autoDelay);
      }
    }

    _onTypeDone() {
      this.state.typing  = false;
      this.state.waiting = true;
      this.els.arrow.style.opacity = '1';
      if (this.state.auto || this.state.skip) {
        const delay = this.state.skip ? this.cfg.skipDelay : this.cfg.autoDelay;
        this._autoTimer = setTimeout(() => this.advance(), delay);
      }
    }

    // ────────────────────────────────────────────────
    //  選択肢
    // ────────────────────────────────────────────────

    _showChoice(options) {
      const box = this.els.choiceBox;
      box.innerHTML = '';
      box.style.display = 'flex';
      this.els.arrow.style.opacity = '0';
      this.els.dialogBox.style.opacity = '0.3';

      options.forEach((opt, i) => {
        if (opt.condition && !this._evalCond(opt.condition)) return;
        const btn = document.createElement('button');
        btn.className = 'vn-choice';
        btn.textContent = this._resolveValue(opt.text);
        btn.style.animationDelay = `${i * 85}ms`;
        btn.addEventListener('click', () => {
          box.style.display = 'none';
          this.els.dialogBox.style.opacity = '';
          if (opt.setVar) this.state.vars[opt.setVar.name] = opt.setVar.value;
          opt.goto ? this.gotoScene(opt.goto) : this._next();
        });
        box.appendChild(btn);
      });
    }

    _showInput(step) {
      this.els.arrow.style.opacity = '0';
      this.els.dialogBox.style.opacity = '0.2';
      this.els.inputLabel.textContent = this._resolveValue(step.label || '');
      this.els.inputField.value = this._resolveValue(step.defaultValue || '');
      this.els.inputField.placeholder = this._resolveValue(step.placeholder || '');
      this.els.inputField.maxLength = step.maxLength || 24;
      this.els.inputOk.textContent = this._resolveValue(step.buttonLabel || '決定');
      this.els.inputOverlay.style.display = 'flex';

      const submit = () => {
        const value = this.els.inputField.value.trim() || this._resolveValue(step.defaultValue || '');
        this.state.vars[step.name] = value;
        this.els.inputOverlay.style.display = 'none';
        this.els.dialogBox.style.opacity = '';
        this.els.inputOk.removeEventListener('click', submit);
        this.els.inputField.removeEventListener('keydown', onKeydown);
        step.goto ? this.gotoScene(step.goto) : this._next();
      };

      const onKeydown = e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          submit();
        }
      };

      this.els.inputOk.addEventListener('click', submit);
      this.els.inputField.addEventListener('keydown', onKeydown);
      requestAnimationFrame(() => this.els.inputField.focus());
    }

    _showModal(step) {
      this.els.arrow.style.opacity = '0';
      this.els.dialogBox.style.opacity = '0.2';
      this.els.modalTitle.textContent = this._resolveValue(step.title || '');
      this.els.modalBody.innerHTML = '';

      (step.body || []).forEach(block => {
        const p = document.createElement('p');
        p.textContent = this._resolveValue(block);
        this.els.modalBody.appendChild(p);
      });

      this.els.modalButton.textContent = this._resolveValue(step.buttonLabel || '閉じる');
      this.els.modalOverlay.style.display = 'flex';

      const close = () => {
        this.els.modalOverlay.style.display = 'none';
        this.els.dialogBox.style.opacity = '';
        this.els.modalButton.removeEventListener('click', close);
        this._next();
      };

      this.els.modalButton.addEventListener('click', close);
    }

    // ────────────────────────────────────────────────
    //  背景
    // ────────────────────────────────────────────────

    _setBg(target, transition = 'fade') {
      const bg = (this.script.backgrounds || {})[target];
      if (!bg) return;
      const el = this.els.bg;
      if (transition === 'none') {
        this._applyBg(el, bg);
      } else {
        el.style.transition = `opacity ${this.cfg.fadeDuration}ms ease`;
        el.style.opacity = '0';
        setTimeout(() => {
          this._applyBg(el, bg);
          el.style.opacity = '1';
        }, this.cfg.fadeDuration * 0.5);
      }
    }

    _applyBg(el, bg) {
      el.style.background = bg.type === 'image'
        ? `url(${bg.value}) center/cover no-repeat`
        : bg.value;
    }

    // ────────────────────────────────────────────────
    //  キャラクタースプライト
    // ────────────────────────────────────────────────

    _charShow(charId, position = 'center', spriteId = 'default') {
      const char = (this.script.characters || {})[charId];
      if (!char) return;

      // 同ポジションの既存キャラを退場
      const old = this.els.charLayer.querySelector(`[data-pos="${position}"]`);
      if (old) old.remove();

      const el = document.createElement('div');
      el.className    = 'vn-char';
      el.dataset.char = charId;
      el.dataset.pos  = position;

      const spriteUrl = char.sprites?.[spriteId];
      if (spriteUrl) {
        el.style.backgroundImage    = `url(${spriteUrl})`;
        el.style.backgroundSize     = 'contain';
        el.style.backgroundPosition = 'bottom center';
        el.style.backgroundRepeat   = 'no-repeat';
      } else {
        el.innerHTML = this._makeSilhouette(char);
      }

      const posMap = { left: '14%', center: '50%', right: '75%' };
      el.style.left    = posMap[position] || position;
      el.style.opacity = '0';
      this.els.charLayer.appendChild(el);
      requestAnimationFrame(() => { el.style.opacity = '1'; });
    }

    _charHide(charId) {
      this.els.charLayer
        .querySelectorAll(`[data-char="${charId}"]`)
        .forEach(el => {
          el.style.opacity = '0';
          setTimeout(() => el.remove(), 440);
        });
    }

    _clearChars() {
      this.els.charLayer
        .querySelectorAll('.vn-char')
        .forEach(el => {
          el.style.opacity = '0';
          setTimeout(() => el.remove(), 440);
        });
    }

    /** SVGシルエット（スプライト画像がない場合のプレースホルダー） */
    _makeSilhouette(char) {
      const c  = char.silhouetteColor || char.nameColor || '#4a6880';
      const id = 'vng' + Math.random().toString(36).slice(2, 8);
      return `<svg viewBox="0 0 180 400" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <defs>
          <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="${c}" stop-opacity="0.94"/>
            <stop offset="100%" stop-color="${c}" stop-opacity="0.18"/>
          </linearGradient>
        </defs>
        <ellipse cx="90" cy="54" rx="33" ry="40" fill="url(#${id})"/>
        <rect x="76" y="88" width="28" height="20" fill="url(#${id})"/>
        <path d="M32 108 Q56 101 90 103 Q124 101 148 108 L158 290 Q120 302 90 300 Q60 302 22 290 Z" fill="url(#${id})"/>
        <path d="M34 114 Q10 172 8 258 Q24 263 38 258 Q48 184 64 130 Z" fill="url(#${id})"/>
        <path d="M146 114 Q170 172 172 258 Q156 263 142 258 Q132 184 116 130 Z" fill="url(#${id})"/>
        <path d="M44 285 Q40 348 38 400 L78 400 Q81 348 78 285 Z" fill="url(#${id})"/>
        <path d="M102 285 Q99 348 101 400 L142 400 Q140 348 136 285 Z" fill="url(#${id})"/>
      </svg>`;
    }

    // ────────────────────────────────────────────────
    //  オーディオ
    // ────────────────────────────────────────────────

    _playBgm(src, loop = true) {
      if (!src) return;
      if (this._bgmNode) { this._bgmNode.pause(); this._bgmNode = null; }
      this._bgmNode = new Audio(src);
      this._bgmNode.loop   = loop;
      this._bgmNode.volume = 0.55;
      this._bgmNode.play().catch(() => {});
    }

    _stopBgm() {
      if (this._bgmNode) { this._bgmNode.pause(); this._bgmNode = null; }
    }

    _playSfx(src) {
      if (!src) return;
      const a = new Audio(src);
      a.volume = 0.75;
      a.play().catch(() => {});
    }

    // ────────────────────────────────────────────────
    //  変数・条件評価
    // ────────────────────────────────────────────────

    _evalCond(cond) {
      try {
        return new Function('vars', `with(vars){ return (${cond}); }`)(this.state.vars);
      } catch (_) { return false; }
    }

    // ────────────────────────────────────────────────
    //  エンド
    // ────────────────────────────────────────────────

    _showEnd() {
      this._clearChars();
      this.els.choiceBox.style.display = 'none';
      this.els.name.style.visibility   = 'hidden';
      this.els.text.innerHTML = '<span class="vn-end-label">— END —</span>';
      this.els.arrow.style.opacity     = '0';
    }

    // ────────────────────────────────────────────────
    //  Save / Load
    // ────────────────────────────────────────────────

    save(slot) {
      this.saves[slot] = {
        scene:  this.state.scene,
        step:   this.state.step,
        vars:   { ...this.state.vars },
        time:   new Date().toLocaleString('ja-JP'),
      };
      try { localStorage.setItem(this.cfg.saveKey, JSON.stringify(this.saves)); } catch (_) {}
      this._renderSaveSlots(this._saveMode);
    }

    load(slot) {
      const s = this.saves[slot];
      if (!s) return;
      this.state.vars    = { ...s.vars };
      this.state.scene   = s.scene;
      this.state.step    = s.step;
      this.state.waiting = false;
      this.state.typing  = false;
      clearTimeout(this._typeTimer);
      clearTimeout(this._autoTimer);
      this._hideSavePanel();
      this._execute();
    }

    // ────────────────────────────────────────────────
    //  Auto / Skip
    // ────────────────────────────────────────────────

    _toggleAuto() {
      this.state.auto = !this.state.auto;
      if (this.state.auto) this.state.skip = false;
      this.els.btnAuto.classList.toggle('active', this.state.auto);
      this.els.btnSkip.classList.remove('active');
      if (this.state.auto && this.state.waiting) {
        this._autoTimer = setTimeout(() => this.advance(), this.cfg.autoDelay);
      } else {
        clearTimeout(this._autoTimer);
      }
    }

    _toggleSkip() {
      this.state.skip = !this.state.skip;
      if (this.state.skip) this.state.auto = false;
      this.els.btnSkip.classList.toggle('active', this.state.skip);
      this.els.btnAuto.classList.remove('active');
      if (this.state.skip) {
        if (this.state.typing)       this._finishTyping();
        else if (this.state.waiting) this.advance();
      }
    }

    // ────────────────────────────────────────────────
    //  履歴パネル
    // ────────────────────────────────────────────────

    _showHistory() {
      const c = this.els.histContent;
      c.innerHTML = '';
      this.state.history.forEach(h => {
        const d = document.createElement('div');
        d.className = 'vn-hist-entry';
        if (h.name) {
          const n = document.createElement('span');
          n.className   = 'vn-hist-name';
          n.textContent = h.name;
          d.appendChild(n);
        }
        const p = document.createElement('p');
        p.textContent = h.text;
        d.appendChild(p);
        c.appendChild(d);
      });
      c.scrollTop = c.scrollHeight;
      this.els.histPanel.style.display = 'flex';
    }

    _hideHistory() { this.els.histPanel.style.display = 'none'; }

    // ────────────────────────────────────────────────
    //  セーブパネル
    // ────────────────────────────────────────────────

    _showSavePanel(mode) {
      this._saveMode = mode;
      this.els.savePanelTitle.textContent = mode === 'save' ? 'セーブ' : 'ロード';
      this._renderSaveSlots(mode);
      this.els.savePanel.style.display = 'flex';
    }

    _renderSaveSlots(mode) {
      const c = this.els.saveSlots;
      c.innerHTML = '';
      for (let i = 0; i < this.cfg.saveSlots; i++) {
        const s   = this.saves[i];
        const div = document.createElement('div');
        div.className = 'vn-save-slot' + (s ? ' filled' : '');
        div.innerHTML = `<span class="vn-slot-num">SLOT ${i + 1}</span>
          <span class="vn-slot-info">${s ? s.time : '── 空き ──'}</span>`;
        div.addEventListener('click', () => {
          if (mode === 'save')     this.save(i);
          else if (s) this.load(i);
        });
        c.appendChild(div);
      }
    }

    _hideSavePanel() { this.els.savePanel.style.display = 'none'; }

    // ────────────────────────────────────────────────
    //  タイトル画面
    // ────────────────────────────────────────────────

    _showTitleScreen(callback) {
      const title   = this.script.title   || 'VISUAL NOVEL';
      const subtitle = this.script.subtitle || '';
      const overlay  = document.createElement('div');
      overlay.className = 'vn-title-screen';
      overlay.innerHTML = `
        <div class="vn-title-inner">
          <div class="vn-title-eyebrow">VISUAL NOVEL</div>
          <h1 class="vn-title-main">${title}</h1>
          ${subtitle ? `<p class="vn-title-sub">${subtitle}</p>` : ''}
          <button class="vn-title-start">— START —</button>
        </div>`;
      overlay.querySelector('.vn-title-start').addEventListener('click', () => {
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.remove(); callback(); }, 620);
      });
      this.el.appendChild(overlay);
    }

    // ────────────────────────────────────────────────
    //  DOM 構築
    // ────────────────────────────────────────────────

    _buildDOM() {
      this.el.classList.add('vn-root');
      this.el.innerHTML = `
        <div class="vn-bg"         id="_vnbg"></div>
        <div class="vn-scanlines"></div>
        <div class="vn-char-layer" id="_vnchars"></div>
        <div class="vn-ui">
          <div class="vn-dialog-box" id="_vndialog">
            <div class="vn-name"  id="_vnname"></div>
            <div class="vn-text"  id="_vntext"></div>
            <div class="vn-arrow" id="_vnarrow">▼</div>
          </div>
          <div class="vn-choice-box" id="_vnchoices" style="display:none"></div>
          <div class="vn-ctrl-bar">
            <button class="vn-btn" id="_vnauto">AUTO</button>
            <button class="vn-btn" id="_vnskip">SKIP</button>
            <button class="vn-btn" id="_vnlog">LOG</button>
            <button class="vn-btn" id="_vnsavebtn">SAVE</button>
            <button class="vn-btn" id="_vnloadbtn">LOAD</button>
          </div>
        </div>
        <div class="vn-input-overlay" id="_vninput" style="display:none">
          <div class="vn-input-card">
            <div class="vn-input-label" id="_vninputlabel"></div>
            <input class="vn-input-field" id="_vninputfield" type="text" maxlength="24" autocomplete="off">
            <button class="vn-input-ok" id="_vninputok" type="button">決定</button>
          </div>
        </div>
        <div class="vn-modal-overlay" id="_vnmodal" style="display:none">
          <div class="vn-modal-card">
            <div class="vn-modal-title" id="_vnmodaltitle"></div>
            <div class="vn-modal-body" id="_vnmodalbody"></div>
            <button class="vn-modal-ok" id="_vnmodalok" type="button">閉じる</button>
          </div>
        </div>
        <div class="vn-panel" id="_vnhist" style="display:none">
          <div class="vn-panel-head">
            <span>テキスト履歴</span>
            <button class="vn-panel-close" id="_vnhistx">✕</button>
          </div>
          <div class="vn-hist-body" id="_vnhistc"></div>
        </div>
        <div class="vn-panel" id="_vnsavepanel" style="display:none">
          <div class="vn-panel-head">
            <span id="_vnsavetitle">セーブ</span>
            <button class="vn-panel-close" id="_vnsavex">✕</button>
          </div>
          <div class="vn-save-slots" id="_vnslots"></div>
        </div>`;

      this.els = {
        bg:             this.el.querySelector('#_vnbg'),
        charLayer:      this.el.querySelector('#_vnchars'),
        dialogBox:      this.el.querySelector('#_vndialog'),
        name:           this.el.querySelector('#_vnname'),
        text:           this.el.querySelector('#_vntext'),
        arrow:          this.el.querySelector('#_vnarrow'),
        choiceBox:      this.el.querySelector('#_vnchoices'),
        inputOverlay:   this.el.querySelector('#_vninput'),
        inputLabel:     this.el.querySelector('#_vninputlabel'),
        inputField:     this.el.querySelector('#_vninputfield'),
        inputOk:        this.el.querySelector('#_vninputok'),
        modalOverlay:   this.el.querySelector('#_vnmodal'),
        modalTitle:     this.el.querySelector('#_vnmodaltitle'),
        modalBody:      this.el.querySelector('#_vnmodalbody'),
        modalButton:    this.el.querySelector('#_vnmodalok'),
        btnAuto:        this.el.querySelector('#_vnauto'),
        btnSkip:        this.el.querySelector('#_vnskip'),
        histPanel:      this.el.querySelector('#_vnhist'),
        histContent:    this.el.querySelector('#_vnhistc'),
        savePanel:      this.el.querySelector('#_vnsavepanel'),
        savePanelTitle: this.el.querySelector('#_vnsavetitle'),
        saveSlots:      this.el.querySelector('#_vnslots'),
      };
    }

    // ────────────────────────────────────────────────
    //  イベントバインド
    // ────────────────────────────────────────────────

    _bindEvents() {
      // クリックで進む（選択肢・ボタン類を除く）
      this.el.querySelector('.vn-ui').addEventListener('click', e => {
        if (e.target.closest('.vn-ctrl-bar,.vn-choice-box,.vn-choice,.vn-btn')) return;
        this.advance();
      });

      // キーボードショートカット
      document.addEventListener('keydown', e => {
        if (!this.el.isConnected) return;
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); this.advance(); }
        if (e.key === 'a' || e.key === 'A') this._toggleAuto();
        if (e.key === 's' || e.key === 'S') this._toggleSkip();
        if (e.key === 'l' || e.key === 'L') this._showHistory();
        if (e.key === 'Escape') { this._hideHistory(); this._hideSavePanel(); }
      });

      this.els.btnAuto.addEventListener('click',  () => this._toggleAuto());
      this.els.btnSkip.addEventListener('click',  () => this._toggleSkip());
      this.el.querySelector('#_vnlog').addEventListener('click',     () => this._showHistory());
      this.el.querySelector('#_vnsavebtn').addEventListener('click', () => this._showSavePanel('save'));
      this.el.querySelector('#_vnloadbtn').addEventListener('click', () => this._showSavePanel('load'));
      this.el.querySelector('#_vnhistx').addEventListener('click',   () => this._hideHistory());
      this.el.querySelector('#_vnsavex').addEventListener('click',   () => this._hideSavePanel());
    }

    // ────────────────────────────────────────────────
    //  デフォルトCSS注入
    // ────────────────────────────────────────────────

    _injectStyles() {
      if (document.getElementById('__vnengine_css__')) return;
      const style   = document.createElement('style');
      style.id      = '__vnengine_css__';
      style.textContent = VNEngine.DEFAULT_CSS;
      document.head.appendChild(style);
    }
  }

  // ──────────────────────────────────────────────────────────────
  //  デフォルトスタイルシート
  // ──────────────────────────────────────────────────────────────
  VNEngine.DEFAULT_CSS = `
    .vn-root {
      position:relative; width:100%; height:100%; overflow:hidden;
      background:#06090f;
      font-family:var(--font-story,'Shippori Mincho B1','Hiragino Mincho ProN','Yu Mincho',serif);
      line-break:strict;
      word-break:auto-phrase;
      user-select:none; cursor:default; color:#d4e6f2;
    }
    .vn-bg {
      position:absolute; inset:0;
      background:#06090f;
      transition:opacity .55s ease;
    }
    .vn-scanlines {
      position:absolute; inset:0; pointer-events:none; z-index:1;
      background:repeating-linear-gradient(
        0deg,transparent,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px
      );
    }
    .vn-char-layer {
      position:absolute; inset:0; pointer-events:none; z-index:2;
    }
    .vn-char {
      position:absolute; bottom:0; width:220px; height:430px;
      transform:translateX(-50%);
      transition:opacity .44s ease;
    }
    .vn-ui {
      position:absolute; inset:0; z-index:10;
      display:flex; flex-direction:column; justify-content:flex-end;
      padding-bottom:14px;
    }
    .vn-dialog-box {
      margin:0 30px 10px;
      background:rgba(4,9,22,.89);
      border:1px solid rgba(74,143,181,.17);
      border-radius:2px;
      padding:16px 20px 20px;
      height:156px; position:relative;
      backdrop-filter:blur(7px);
      box-shadow:0 0 44px rgba(0,40,90,.28),inset 0 0 22px rgba(0,15,55,.12);
      transition:opacity .22s;
    }
    .vn-dialog-box::before {
      content:''; position:absolute; top:-1px; left:18px; right:18px; height:1px;
      background:linear-gradient(90deg,transparent,rgba(74,143,181,.38),transparent);
    }
    .vn-name {
      font-family:var(--font-story,'Shippori Mincho B1','Hiragino Mincho ProN','Yu Mincho',serif);
      font-size:13.5px; font-weight:700; letter-spacing:.12em;
      min-height:20px; margin-bottom:7px;
      text-shadow:0 0 14px currentColor;
      text-wrap:balance;
    }
    .vn-text {
      font-family:var(--font-story,'Shippori Mincho B1','Hiragino Mincho ProN','Yu Mincho',serif);
      font-size:15.5px; line-height:1.9;
      color:#cfe3f0; letter-spacing:.04em;
      height:86px; overflow-y:auto;
      word-break:auto-phrase;
      text-wrap:pretty;
    }
    .vn-text::-webkit-scrollbar { width:3px; }
    .vn-text::-webkit-scrollbar-thumb { background:rgba(74,120,160,.3); border-radius:2px; }
    .vn-arrow {
      position:absolute; right:16px; bottom:9px;
      color:rgba(120,180,220,.58); font-size:10px;
      opacity:0; transition:opacity .3s;
      animation:vn-bounce 1.1s ease-in-out infinite;
    }
    @keyframes vn-bounce {
      0%,100%{transform:translateY(0)} 50%{transform:translateY(3px)}
    }
    .vn-choice-box {
      position:absolute; inset:0;
      display:none; flex-direction:column; align-items:center; justify-content:center;
      gap:10px; padding:30px;
      background:rgba(2,6,12,.36);
      backdrop-filter:blur(3px);
    }
    .vn-choice {
      width:100%; max-width:520px;
      padding:12px 20px;
      background:rgba(5,12,28,.91);
      border:1px solid rgba(74,143,181,.27);
      border-radius:2px;
      color:#a4cce0; font-family:var(--font-ui,'Zen Kaku Gothic New','Hiragino Sans','Yu Gothic',sans-serif); font-size:14px;
      letter-spacing:.04em; cursor:pointer;
      line-height:1.7;
      word-break:auto-phrase;
      text-wrap:pretty;
      animation:vn-fadein .36s both ease-out;
      transition:background .18s,border-color .18s,color .18s,transform .18s,box-shadow .18s;
    }
    .vn-choice:hover {
      background:rgba(16,40,90,.9);
      border-color:rgba(74,160,225,.54);
      color:#d6eeff; transform:translateY(-2px);
      box-shadow:0 4px 20px rgba(38,100,200,.18);
    }
    .vn-input-overlay {
      position:absolute; inset:0; z-index:40;
      align-items:center; justify-content:center;
      background:rgba(2,6,12,.72);
      backdrop-filter:blur(5px);
    }
    .vn-input-card {
      width:min(520px, calc(100% - 40px));
      padding:22px;
      border:1px solid rgba(74,143,181,.22);
      background:rgba(6,12,22,.94);
      box-shadow:0 0 40px rgba(0,30,80,.28);
    }
    .vn-input-label {
      color:#d4e6f2;
      font-size:15px; line-height:1.9;
      margin-bottom:14px;
      text-wrap:pretty;
    }
    .vn-input-field {
      width:100%;
      padding:12px 14px;
      background:rgba(2,6,12,.82);
      border:1px solid rgba(74,143,181,.22);
      color:#edf4fa;
      font-family:var(--font-ui,'Zen Kaku Gothic New','Hiragino Sans','Yu Gothic',sans-serif);
      font-size:14px;
      outline:none;
    }
    .vn-input-ok {
      margin-top:12px;
      padding:10px 18px;
      border:1px solid rgba(180,159,102,.34);
      background:linear-gradient(135deg, rgba(79,96,111,.18), rgba(141,114,61,.22));
      color:#f5f0e4;
      font-family:var(--font-ui,'Zen Kaku Gothic New','Hiragino Sans','Yu Gothic',sans-serif);
      font-size:13px;
      cursor:pointer;
    }
    .vn-modal-overlay {
      position:absolute; inset:0; z-index:45;
      align-items:center; justify-content:center;
      background:rgba(2,6,12,.72);
      backdrop-filter:blur(6px);
    }
    .vn-modal-card {
      width:min(720px, calc(100% - 48px));
      max-height:min(78vh, 720px);
      padding:28px 28px 22px;
      border:1px solid rgba(137, 142, 110, .28);
      background:linear-gradient(180deg, rgba(228,222,202,.96), rgba(198,190,168,.93));
      box-shadow:0 14px 60px rgba(0,0,0,.36);
      color:#171a18;
      overflow:auto;
    }
    .vn-modal-title {
      font-family:var(--font-ui,'Zen Kaku Gothic New','Hiragino Sans','Yu Gothic',sans-serif);
      font-size:14px; letter-spacing:.16em;
      margin-bottom:16px;
      color:#3b4339;
    }
    .vn-modal-body p {
      margin:0 0 14px;
      font-size:15px; line-height:2;
      color:#1e2320;
    }
    .vn-modal-ok {
      margin-top:10px;
      padding:10px 18px;
      border:1px solid rgba(70,84,70,.28);
      background:rgba(246,244,236,.78);
      color:#222824;
      font-family:var(--font-ui,'Zen Kaku Gothic New','Hiragino Sans','Yu Gothic',sans-serif);
      font-size:13px;
      cursor:pointer;
    }
    @keyframes vn-fadein {
      from{opacity:0;transform:translateY(9px)}
      to  {opacity:1;transform:translateY(0)}
    }
    .vn-ctrl-bar {
      display:flex; justify-content:flex-end;
      gap:5px; padding:0 32px;
    }
    .vn-btn {
      padding:4px 10px;
      background:rgba(5,11,26,.62);
      border:1px solid rgba(74,120,160,.18);
      border-radius:2px;
      color:rgba(110,155,188,.52);
      font-size:9.5px; font-family:var(--font-ui,'Zen Kaku Gothic New','Hiragino Sans','Yu Gothic',sans-serif);
      letter-spacing:.13em; cursor:pointer;
      transition:color .18s,border-color .18s,background .18s;
    }
    .vn-btn:hover  { color:#88c0de; border-color:rgba(74,143,181,.44); background:rgba(14,34,72,.7); }
    .vn-btn.active { color:#54b0ea; border-color:rgba(74,160,232,.54); background:rgba(18,58,118,.5); }
    /* パネル共通 */
    .vn-panel {
      position:absolute; inset:0;
      background:rgba(3,7,18,.96);
      flex-direction:column; z-index:50;
      backdrop-filter:blur(8px);
    }
    .vn-panel-head {
      display:flex; justify-content:space-between; align-items:center;
      padding:13px 20px;
      border-bottom:1px solid rgba(74,120,160,.16);
      color:rgba(135,178,208,.8);
      font-family:var(--font-ui,'Zen Kaku Gothic New','Hiragino Sans','Yu Gothic',sans-serif);
      font-size:12.5px; letter-spacing:.12em;
      text-wrap:balance;
    }
    .vn-panel-close {
      background:none; border:none;
      color:rgba(95,128,158,.6); font-size:15px;
      cursor:pointer; padding:2px 5px;
      transition:color .15s;
    }
    .vn-panel-close:hover { color:#9cc8e5; }
    /* 履歴 */
    .vn-hist-body {
      flex:1; overflow-y:auto;
      padding:13px 20px;
      display:flex; flex-direction:column; gap:9px;
    }
    .vn-hist-entry {
      color:rgba(188,210,228,.82);
      font-size:13.5px; line-height:1.75;
      border-bottom:1px solid rgba(38,62,98,.2);
      padding-bottom:8px;
      word-break:auto-phrase;
      text-wrap:pretty;
    }
    .vn-hist-name {
      font-family:var(--font-ui,'Zen Kaku Gothic New','Hiragino Sans','Yu Gothic',sans-serif);
      display:block; font-size:11px;
      letter-spacing:.1em; opacity:.62; margin-bottom:2px;
    }
    .vn-hist-body::-webkit-scrollbar { width:3px; }
    .vn-hist-body::-webkit-scrollbar-thumb { background:rgba(74,120,160,.3); border-radius:2px; }
    /* セーブスロット */
    .vn-save-slots { padding:13px 20px; display:flex; flex-direction:column; gap:6px; }
    .vn-save-slot {
      padding:11px 15px;
      background:rgba(7,15,36,.8);
      border:1px solid rgba(46,76,115,.2);
      border-radius:2px; cursor:pointer;
      display:flex; gap:13px; align-items:center;
      transition:background .18s,border-color .18s;
    }
    .vn-save-slot:hover   { background:rgba(16,38,84,.8); border-color:rgba(74,130,192,.37); }
    .vn-save-slot.filled  { border-color:rgba(74,120,180,.27); }
    .vn-slot-num  { color:rgba(88,128,168,.55); font-size:9.5px; letter-spacing:.12em; min-width:54px; font-family:var(--font-ui,'Zen Kaku Gothic New','Hiragino Sans','Yu Gothic',sans-serif); }
    .vn-slot-info { color:rgba(158,188,214,.8); font-size:12.5px; }
    /* タイトル画面 */
    .vn-title-screen {
      position:absolute; inset:0; z-index:100;
      background:radial-gradient(ellipse at 50% 38%,#0d1e3c 0%,#060b1c 55%,#030609 100%);
      display:flex; align-items:center; justify-content:center;
      transition:opacity .62s;
    }
    .vn-title-inner { text-align:center; }
    .vn-title-eyebrow {
      color:rgba(74,143,181,.48); font-size:10px;
      letter-spacing:.4em; margin-bottom:16px;
      text-wrap:balance;
    }
    .vn-title-main {
      color:#c4dded; font-size:clamp(22px,3.8vw,38px);
      font-weight:700; letter-spacing:.08em;
      text-shadow:0 0 44px rgba(74,143,181,.35);
      margin:0 0 10px; line-height:1.45;
      text-wrap:balance;
    }
    .vn-title-sub {
      color:rgba(160,195,220,.45); font-size:12px;
      letter-spacing:.16em; margin:0 0 36px;
      text-wrap:pretty;
    }
    .vn-title-start {
      padding:11px 42px; background:transparent;
      border:1px solid rgba(74,143,181,.38); border-radius:2px;
      color:rgba(155,198,228,.68);
      font-family:inherit; font-size:12px;
      letter-spacing:.28em; cursor:pointer;
      transition:all .25s;
    }
    .vn-title-start:hover {
      background:rgba(74,143,181,.11);
      border-color:rgba(74,180,232,.58);
      color:#cce8ff;
      box-shadow:0 0 26px rgba(74,143,181,.18);
    }
    .vn-end-label {
      color:rgba(112,155,185,.38); font-size:17px; letter-spacing:.32em;
    }
  `;

  global.VNEngine = VNEngine;

})(typeof window !== 'undefined' ? window : this);
