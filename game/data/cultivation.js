(function (global) {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function setNamed(vars, name) {
    vars.namedYuki = true;
    vars.yukiName = name;
  }

  function isSpeaking(vars) {
    return !!vars.yukiCanSpeak;
  }

  function languageScore(vars, cult) {
    if (cult && cult.stats) return cult.stats.language || 0;
    return vars.yukiLanguageScore || 0;
  }

  function trustScore(vars, cult) {
    if (cult && cult.stats) return cult.stats.trust || 0;
    return vars.yukiTrustScore || 0;
  }

  function obedienceScore(vars, cult) {
    if (cult && cult.stats) return cult.stats.obedience || 0;
    return vars.yukiObedienceScore || 0;
  }

  function vitalityScore(vars, cult) {
    if (cult && cult.stats) return cult.stats.vitality || 0;
    return vars.yukiVitalityScore || 0;
  }

  function stressScore(vars, cult) {
    if (cult && cult.stats) return cult.stats.stress || 0;
    return vars.yukiStressScore || 0;
  }

  function canRead(vars, cult) {
    return languageScore(vars, cult) >= 6;
  }

  function canWriteSingleWord(vars, cult) {
    return languageScore(vars, cult) >= 4;
  }

  function isAttached(vars, cult) {
    return trustScore(vars, cult) >= 7;
  }

  function isGuarded(vars, cult) {
    return trustScore(vars, cult) <= 2;
  }

  function isConditioned(vars, cult) {
    return obedienceScore(vars, cult) >= 10;
  }

  function isFrayed(vars, cult) {
    return stressScore(vars, cult) >= 6;
  }

  function isFrail(vars, cult) {
    return vitalityScore(vars, cult) <= 4;
  }

  function displayName(vars) {
    return vars.namedYuki ? (vars.yukiName || 'ユキ') : 'J-7';
  }

  function displayRenName(vars) {
    return vars.namedRen ? (vars.renName || 'レン') : 'R-6';
  }

  function isRenSpeaking(vars) {
    return !!vars.renCanSpeak;
  }

  global.CWMA_buildCultivation = function buildCultivation() {
    return {
      yukiFirstChapter: {
        subjectId: 'yuki',
        subjectCode: 'J-7',
        managerCode: 'S-91',
        varPrefix: 'yuki',
        namedVar: 'namedYuki',
        nameVar: 'yukiName',
        speechVar: 'yukiCanSpeak',
        displayName: function (vars) {
          return displayName(vars);
        },
        weeks: 8,
        actionsPerWeek: 1,
        statMax: 12,
        speechThreshold: 5,
        passiveDecay: {
          language: {
            amount: 1,
            min: 0,
            protectedBy: ['language'],
            logText: '[A-1] 復唱精度が低下。未使用語彙の忘却を確認。'
          }
        },
        initialStats: {
          language: 0,
          trust: 2,
          obedience: 8,
          vitality: 7,
          stress: 1
        },
        actions: [
          {
            id: 'idle',
            label: '待機観察',
            code: 'O-0',
            description: '今週は介入を抑え、記録だけを取る。',
            effectText: '変化なし',
            apply: function () {}
          },
          {
            id: 'language',
            label: '語学導入',
            code: 'A-1',
            description: '音韻模倣と基礎語彙の反復入力。発話の土台を作る。',
            effectText: '言語理解 +1 / 負荷 +1',
            apply: function (stats) {
              stats.language = clamp(stats.language + 1, 0, 12);
              stats.stress = clamp(stats.stress + 1, 0, 12);
            }
          },
          {
            id: 'bond',
            label: '個別観察',
            code: 'D-3',
            description: '一対一で反応を観察し、目線やしぐさの変化を記録する。',
            effectText: '信頼 +2 / 服従 -1',
            apply: function (stats) {
              stats.trust = clamp(stats.trust + 2, 0, 12);
              stats.obedience = clamp(stats.obedience - 1, 0, 12);
            }
          },
          {
            id: 'conditioning',
            label: '規律矯正',
            code: 'C-4',
            description: '命令への即応と姿勢維持を反復させ、逸脱反応を抑える。',
            effectText: '服従 +2 / 信頼 -1 / 負荷 +1',
            apply: function (stats) {
              stats.obedience = clamp(stats.obedience + 2, 0, 12);
              stats.trust = clamp(stats.trust - 1, 0, 12);
              stats.stress = clamp(stats.stress + 1, 0, 12);
            }
          },
          {
            id: 'care',
            label: '情動ケア',
            code: 'E-2',
            description: '絵本、色板、呼名反応を使い、情動の安定を保つ。',
            effectText: '信頼 +1 / 負荷 -1',
            apply: function (stats) {
              stats.trust = clamp(stats.trust + 1, 0, 12);
              stats.stress = clamp(stats.stress - 1, 0, 12);
            }
          },
          {
            id: 'physical',
            label: '身体訓練',
            code: 'B-4',
            description: '移動、持久、姿勢維持。労働適性の基礎となる負荷訓練。',
            effectText: '体力 +2 / 負荷 +1',
            apply: function (stats) {
              stats.vitality = clamp(stats.vitality + 2, 0, 12);
              stats.stress = clamp(stats.stress + 1, 0, 12);
            }
          }
        ],
        prediction: function (stats, vars) {
          if (!vars.yukiCanSpeak && stats.obedience >= 9) {
            return '労働または愛玩向け。発話教育未了。';
          }
          if (stats.language >= 5 && stats.stress >= 6) {
            return '研究向け。対話応答あり、負荷耐性は要再計測。';
          }
          if (stats.language >= 5 && stats.trust >= 7) {
            return '教育または愛護向け。親和性が高い。';
          }
          if (stats.vitality >= 9 && stats.obedience >= 8) {
            return '労働向け。身体耐性が優先評価。';
          }
          return '分類未確定。継続観察が必要。';
        },
        specialEvents: {
          speechUnlocked: [
            { type: 'narration', text: '反復された母音が、ある日ふいに意味を持った。録音教材の残響ではなく、目の前の個体の声として。' },
            {
              type: 'dialogue',
              char: 'yuki',
              text: function (vars, cult) {
                if (isConditioned(vars, cult)) return '……たん、とう。まちがって、ないですか。';
                if (isAttached(vars, cult)) return '……たん、とう。やっと、呼べた。';
                return '……たん、とう。';
              }
            },
            { type: 'dialogue', char: 'player', text: '今のは、呼んだのか。' },
            {
              type: 'dialogue',
              char: 'yuki',
              text: function (vars, cult) {
                if (isFrayed(vars, cult)) {
                  return 'ちゃんと、聞こえましたか。消える前に、一回だけでも。';
                }
                if (isConditioned(vars, cult)) {
                  return (displayName(vars) === 'J-7' ? 'J-7じゃなくて、' : '') + '担当さん。これで、正解ですか。';
                }
                return (displayName(vars) === 'J-7' ? 'J-7じゃなくて、' : '') + '担当さん。ちゃんと、聞こえましたか。';
              }
            },
            { type: 'log', text: '[A-1] 発話初確認。語学教育の継続により対話可能性あり。', highlight: true }
          ]
        },
        weekEvents: {
          1: [
            { type: 'narration', text: '居室に入ると、J-7はベッドの端からすぐには動かなかった。こちらの靴音を数えてから、ようやく顔を上げる。' },
            { type: 'narration', text: '挨拶をしても、返ってくるのは息の音だけだった。口の形は真似できるのに、言葉にはならない。標準個体は最初、だいたいこうだとマニュアルにある。' },
            { type: 'dialogue', char: 'player', text: '今日から担当になる。記録上はJ-7。……呼び方は、どうする。' },
            { type: 'narration', text: '壁際の記録板には「私的命名は推奨しない」と書かれていた。' },
            {
              type: 'choice',
              options: [
                {
                  text: '番号のまま記録する',
                  apply: function (vars) {
                    vars.namedYuki = false;
                    vars.yukiName = '';
                  }
                },
                {
                  text: '「ユキ」と記録する',
                  apply: function (vars) {
                    setNamed(vars, 'ユキ');
                  }
                },
                {
                  text: '別の名前を与える',
                  gotoLabel: 'customName'
                }
              ]
            },
            { type: 'goto_label', label: 'nameEnd' },
            { type: 'label', id: 'customName' },
            {
              type: 'input',
              name: 'yukiName',
              label: '呼び名を入力してください。',
              placeholder: '呼び名を入力',
              defaultValue: 'ユキ',
              maxLength: 8,
              apply: function (vars) {
                vars.namedYuki = true;
              }
            },
            { type: 'label', id: 'nameEnd' },
            {
              type: 'narration',
              text: function (vars, cult) {
                return vars.namedYuki
                  ? (trustScore(vars, cult) >= 3
                    ? 'その名を口にすると、J-7は発音を確かめるように唇だけ動かした。意味はまだ届いていなくても、自分に向けられた音だと理解したらしい。'
                    : 'その名を告げても、J-7はすぐには反応しなかった。少し遅れて、自分を指す音だと理解したらしく、視線だけが戻ってきた。')
                  : 'あなたが番号を読み上げると、J-7は小さく頷いた。慣れている反応だった。慣れすぎていて、少しだけ不気味だった。';
              }
            },
            { type: 'log', text: '[初回接触] 発話なし。呼称設定を記録。' }
          ],
          2: [
            { type: 'narration', text: '第2週の壁面点検で、白い塗装の一部が爪で薄く削られているのを見つけた。指でなぞると、文字のようにも傷の集まりのようにも見える。' },
            {
              type: 'narration',
              text: function (vars, cult) {
                var mark = vars.namedYuki ? (vars.yukiName || 'ユキ') : 'S-91';
                if (canWriteSingleWord(vars, cult)) {
                  return 'よく見ると、それは「' + mark + '」にも見えた。J-7は少し離れた場所で、こちらが気づくのを待っている。';
                }
                if (isAttached(vars, cult)) {
                  return '文字というより、何かを真似ようとした痕跡だった。反復した引っかき傷が、あなたの名札の長さだけ残っている。覚えようとした形だけが壁に残った。';
                }
                return '文字というより、何かを真似ようとした痕跡だった。訓練で覚えた線引きが、たまたまあなたの名札の長さに似ただけかもしれない。';
              }
            },
            {
              type: 'dialogue',
              char: 'yuki',
              condition: function (vars) { return isSpeaking(vars); },
              text: function (vars, cult) {
                if (isFrayed(vars, cult)) return '……だめでしたか。隠したかったのに、うまくできませんでした。';
                if (isConditioned(vars, cult)) return '規定違反でしたか。見つからない向きに、書いたつもりでした。';
                return '……だめでしたか。見つからない向きに、書いたつもりだったのに。';
              }
            },
            {
              type: 'narration',
              condition: function (vars) { return !isSpeaking(vars); },
              text: function (vars, cult) {
                return canWriteSingleWord(vars, cult)
                  ? (isGuarded(vars, cult)
                    ? 'J-7は咄嗟に爪を隠し、視線もすぐ逸らした。見つかったことより、見られたことを嫌がっている顔だった。'
                    : 'J-7は咄嗟に爪を隠し、それから壁とあなたを交互に見た。喋れなくても、自分が何を隠したいのかは分かっている顔だった。')
                  : (isConditioned(vars, cult)
                    ? 'J-7は爪を握り込み、そのまま姿勢だけを正した。失敗の意味は理解していても、言い訳の仕方はまだ持っていない。'
                    : 'J-7は爪を握り込み、それから壁とあなたを交互に見た。何かを残したかったのだろうが、まだ形にする方法を持っていない。');
              }
            },
            {
              type: 'choice',
              options: [
                {
                  text: '規定通り報告する',
                  apply: function (vars, cult) {
                    vars.reportedWall = true;
                    cult.stats.obedience = clamp(cult.stats.obedience + 1, 0, cult.data.statMax);
                    cult.stats.trust = clamp(cult.stats.trust - 1, 0, cult.data.statMax);
                  }
                },
                {
                  text: '黙って削って消す',
                  apply: function (vars, cult) {
                    vars.reportedWall = false;
                    cult.stats.trust = clamp(cult.stats.trust + 1, 0, cult.data.statMax);
                  }
                }
              ]
            },
            {
              type: 'narration',
              text: function (vars, cult) {
                if (vars.reportedWall) {
                  return isSpeaking(vars)
                    ? (isConditioned(vars, cult)
                      ? 'J-7は「以後は気をつけます」と言い直した。先に出た本音を、自分で慌てて回収した。'
                      : 'J-7は「次は消えるところにします」と言ってから、自分で口を押さえた。学ばせた言葉が、もう隠し事に使われ始めている。')
                    : (isAttached(vars, cult)
                      ? '報告票に傷の件を書き込むと、J-7は壁から一歩下がった。怒られるより先に、こちらに失望されたと思った顔をした。'
                      : '報告票に傷の件を書き込むと、J-7は壁から一歩下がった。罰の内容までは知らなくても、報告されること自体は理解している。');
                }
                return isSpeaking(vars)
                  ? (isAttached(vars, cult)
                    ? '痕跡を削り落とすあいだ、J-7は削り粉をこぼさないよう両手を添えていた。助けるという行為の意味を、もう覚え始めている。'
                    : '痕跡を削り落とすあいだ、J-7は黙って削り粉を手のひらに受けていた。共犯めいた静けさだけが残った。')
                  : (isGuarded(vars, cult)
                    ? 'あなたが黙って跡を消しても、J-7はすぐには近づかなかった。助けられたことをまだ信じ切れていない。'
                    : 'あなたが黙って跡を消すと、J-7は安堵したように肩の力を抜いた。礼の言葉はない。ただ、逃げずにそばに立っていた。');
              }
            },
            { type: 'log', text: '[第2週] 壁面痕跡を確認。担当判断を記録。', highlight: true }
          ],
          4: [
            { type: 'narration', text: '夜勤明けの廊下で、隣区画の搬送台車だけが妙に長く音を引いていた。翌朝、その居室の名札は外されていた。' },
            {
              type: 'dialogue',
              char: 'yuki',
              condition: function (vars) { return isSpeaking(vars); },
              text: function (vars, cult) {
                if (isFrayed(vars, cult)) return '昨日の子、どこに行ったんですか。泣いてたの、ずっと残ってて……眠れませんでした。';
                if (isConditioned(vars, cult)) return '昨日の個体、移送ですか。……でも、泣いていたように聞こえました。';
                return '昨日の子、どこに行ったんですか。泣いてたみたいで、眠れませんでした。';
              }
            },
            {
              type: 'narration',
              condition: function (vars) { return !isSpeaking(vars); },
              text: function (vars, cult) {
                return canWriteSingleWord(vars, cult)
                  ? 'J-7はあなたの袖を引き、空になった隣室を指差した。渡された紙片には、潰れた字で一語だけ「どこ」とあった。'
                  : 'J-7はあなたの袖を引き、空になった隣室と自分の胸元を交互に指した。言葉の代わりに、喉だけが乾いたように上下している。';
              }
            },
            {
              type: 'choice',
              options: [
                {
                  text: '新しい場所へ行ったと答える',
                  apply: function (vars) {
                    vars.toldTruth = false;
                  }
                },
                {
                  text: '自分にも分からないと答える',
                  apply: function (vars) {
                    vars.toldTruth = false;
                  }
                },
                {
                  text: 'ここからいなくなった、とだけ言う',
                  apply: function (vars) {
                    vars.toldTruth = true;
                  }
                }
              ]
            },
            {
              type: 'narration',
              text: function (vars, cult) {
                if (vars.toldTruth) {
                  return isSpeaking(vars)
                    ? (isFrayed(vars, cult)
                      ? 'J-7はそれ以上訊かなかった。ただ、空になった隣室を見たまま、呼吸だけが浅くなっていった。'
                      : 'J-7はそれ以上訊かなかった。ただ、空になった隣室を見たまま、「場所みたいに消えるんですね」と小さく言った。')
                    : (canWriteSingleWord(vars, cult)
                      ? 'あなたの短い返答を聞いたあと、J-7は紙片を二つに折った。丸めて捨てることもせず、ポケットへしまった。'
                      : 'あなたの短い返答のあと、J-7は指先を引っ込めた。もう一度隣室を見たが、それ以上は何も示さなかった。');
                }
                return isSpeaking(vars)
                  ? (isGuarded(vars, cult)
                    ? 'J-7は頷いたが、納得した顔ではなかった。あなたではなく、答えの形式だけを受け取ったように見えた。'
                    : 'どの答えを選んでも、J-7の顔から不安は消えなかった。ただ、嘘が嘘だと分かる程度には、もう語彙を与えてしまっている。')
                  : (isAttached(vars, cult)
                    ? '説明になっていないと分かっている顔で、それでもJ-7はあなたの袖を離した。信じたい相手がひとりいるだけで、飲み込める嘘もある。'
                    : '説明になっていないと分かっている顔で、J-7はそれでも頷いた。言葉を持たない相手ほど、嘘を飲み込むしかない。');
              }
            },
            { type: 'log', text: '[第4週] 隣室消失に対する情動反応を記録。', highlight: true }
          ],
          6: [
            { type: 'narration', text: '第6週。外部査定の日。ヴァルター管理官は、いつもより柔らかい声で居室に入ってきた。その柔らかさが、器具の冷たさより嫌だった。' },
            { type: 'dialogue', char: 'walter', text: '個体J-7。査定を開始します。担当員は記録のみを行い、発言を控えてください。' },
            {
              type: 'dialogue',
              char: 'yuki',
              condition: function (vars) { return isSpeaking(vars); },
              text: function (vars, cult) {
                if (isConditioned(vars, cult)) return '……質問、した方がいいですか。';
                if (isFrayed(vars, cult)) return '……空はどうして青いんですか。動けない植物が、太陽を好きなのはどうしてですか。';
                return '……空はどうして青いんですか。動けない植物が、太陽を好きなのはどうしてですか。';
              }
            },
            {
              type: 'dialogue',
              char: 'walter',
              condition: function (vars) { return isSpeaking(vars); },
              text: function (vars, cult) {
                if (isConditioned(vars, cult)) return '応答は可能。従順性は高いが、発話内容に自主性が残っています。';
                if (isAttached(vars, cult)) return '質問傾向が強い。情動寄り。担当依存の可能性も含め、再評価が必要です。';
                return '質問傾向が強い。情動寄り。従順性との両立は不安定です。';
              }
            },
            {
              type: 'dialogue',
              char: 'walter',
              condition: function (vars) { return !isSpeaking(vars); },
              text: '発話教育は未了ですか。従順性は評価できますが、用途の幅は狭まります。喋れない個体は扱いやすい反面、売却先が限定される。'
            },
            {
              type: 'choice',
              options: [
                {
                  text: '沈黙する',
                  apply: function (vars) {
                    vars.spokeUp = false;
                  }
                },
                {
                  text: '査定の雑さに口を挟む',
                  apply: function (vars, cult) {
                    vars.spokeUp = true;
                    cult.stats.trust = clamp(cult.stats.trust + 1, 0, cult.data.statMax);
                  }
                }
              ]
            },
            {
              type: 'narration',
              text: function (vars, cult) {
                if (vars.spokeUp) {
                  return isAttached(vars, cult)
                    ? 'あなたの発言は短く記録され、ヴァルター管理官の端末へ保存された。守ったというより、担当関係の深さまで一緒に提出した感覚だけが残る。'
                    : 'あなたの発言は短く記録され、ヴァルター管理官の端末へ保存された。守ったというより、証拠を増やした感覚だけが残る。';
                }
                return isConditioned(vars, cult)
                  ? '黙っていれば記録は綺麗だ。特に従順に育った個体ほど、綺麗な書類になって戻ってくる。'
                  : '黙っていれば記録は綺麗だ。綺麗な記録ほど、あとで読んだときに吐き気がする。';
              }
            },
            { type: 'log', text: '[第6週] 査定立会い完了。担当員発言の有無を記録。', highlight: true }
          ],
          7: [
            {
              type: 'narration',
              text: function (vars, cult) {
                return isSpeaking(vars)
                  ? (isAttached(vars, cult)
                    ? '第7週。出発予定票が居室端末に表示されると、' + displayName(vars) + 'は文字より先にこちらを見た。それから何度も日付を読み返した。'
                    : '第7週。出発予定票が居室端末に表示されると、' + displayName(vars) + 'は何度もその日付を読み返した。読める文字が増えた分だけ、読んでほしくない文言まで理解してしまう。')
                  : (canRead(vars, cult)
                    ? '第7週。出発予定票が居室端末に表示されると、J-7は画面の一部だけを追っていた。全部は読めなくても、自分に関わる告知だと分かる程度には覚えてしまっている。'
                    : (isGuarded(vars, cult)
                      ? '第7週。出発予定票が居室端末に表示されると、J-7は画面を一瞥しただけでベッドの端へ戻った。嫌な知らせへの備え方まで、ひとりで覚えてしまっている。'
                      : '第7週。出発予定票が居室端末に表示されると、J-7は意味の分からない画面でも嫌な知らせだと察したらしく、あなたの袖口だけをずっと見ていた。'));
              }
            },
            {
              type: 'narration',
              text: function (vars, cult) {
                if (isAttached(vars, cult) && !vars.yukiCanSpeak) {
                  return 'その週から、J-7はあなたが来る前に扉の方を向いて待つようになった。言葉がなくても、待ち方だけははっきりしていた。';
                }
                if (isConditioned(vars, cult)) {
                  return 'その週から、J-7は予定表の点灯音に合わせて先に姿勢を正すようになった。命令が来る前から、命令に備える身体になっている。';
                }
                if (isFrayed(vars, cult)) {
                  return 'その週から、J-7は小さな物音にも肩を跳ねさせるようになった。育っているのではなく、削れている気配があった。';
                }
                return 'その週の記録には大きな異常は残らなかった。ただ、残らない変化ほど担当者だけが覚えている。';
              }
            },
            { type: 'log', text: '[第7週] 出発予定通知を表示。反応観察を継続。', highlight: true }
          ],
          8: [
            {
              type: 'narration',
              text: function (vars, cult) {
                return isSpeaking(vars)
                  ? (trustScore(vars, cult) >= 8
                    ? displayName(vars) + 'は最後の記録日に、あなたの名札だけを見ていた。質問は減ったが、視線の方はむしろ増えていた。'
                    : (isConditioned(vars, cult)
                      ? displayName(vars) + 'は最後の記録日に、名札と足元だけを交互に見ていた。呼びかける前に、反応していいか確認する癖が残っている。'
                      : displayName(vars) + 'は最後の記録日に、あなたの名札だけを見ていた。質問はもう少ない。減ったのか、減らされたのか、判別しづらい。'))
                  : (canRead(vars, cult)
                    ? (isAttached(vars, cult)
                      ? '最後の記録日に、J-7はあなたの名札の文字をゆっくり目で追っていた。読めるのは名前だけでも、それで十分だと思っている顔だった。'
                      : '最後の記録日に、J-7はあなたの名札の文字をゆっくり目で追っていた。声にはならないが、形だけは覚えてしまったらしい。')
                    : (isFrail(vars, cult)
                      ? '最後の記録日に、J-7は名札へ手を伸ばしかけて途中で止めた。疲労で腕が重いのか、ためらいで止まったのかは分からなかった。'
                      : '最後の記録日に、J-7はあなたの名札を指でなぞる真似をした。まだ喋れないままでも、別れが近いことだけは理解しているらしかった。'));
              }
            },
            { type: 'log', text: '[第8週] 育成期間満了。最終面談へ移行。', highlight: true }
          ]
        }
      },
      renSecondChapter: {
        subjectId: 'ren',
        subjectCode: 'R-6',
        managerCode: 'S-91',
        varPrefix: 'ren',
        namedVar: 'namedRen',
        nameVar: 'renName',
        speechVar: 'renCanSpeak',
        displayName: function (vars) {
          return displayRenName(vars);
        },
        speechStatus: function (vars, cult) {
          if (isRenSpeaking(vars)) return '発話: 部分解放 / 筆記: 安定';
          if (languageScore(vars, cult) >= 4) return '発話: 制限 / 筆記: 使用可';
          return '発話: 制限 / 筆記: 断片的';
        },
        weeks: 8,
        actionsPerWeek: 1,
        statMax: 12,
        speechThreshold: 9,
        passiveDecay: {
          language: {
            amount: 1,
            min: 3,
            protectedBy: ['language', 'pattern'],
            logText: '[L-2] 筆記精度が低下。未反復の記号保持率が減衰。'
          }
        },
        initialStats: {
          language: 4,
          trust: 1,
          obedience: 7,
          vitality: 6,
          stress: 2
        },
        actions: [
          {
            id: 'idle',
            label: '待機観察',
            code: 'O-0',
            description: '今週は介入を抑え、描画物と行動の記録だけを取る。',
            effectText: '変化なし',
            apply: function () {}
          },
          {
            id: 'language',
            label: '対話補助',
            code: 'L-2',
            description: '語彙カードと筆談で対話する。発話より先に概念を整える。',
            effectText: '言語理解 +1 / 信頼 +1 / 負荷 +1',
            apply: function (stats) {
              stats.language = clamp(stats.language + 1, 0, 12);
              stats.trust = clamp(stats.trust + 1, 0, 12);
              stats.stress = clamp(stats.stress + 1, 0, 12);
            }
          },
          {
            id: 'bond',
            label: '描画面談',
            code: 'D-6',
            description: '描いたものを見せてもらい、何を覚えているのかを聞き取る。',
            effectText: '信頼 +2 / 服従 -1',
            apply: function (stats) {
              stats.trust = clamp(stats.trust + 2, 0, 12);
              stats.obedience = clamp(stats.obedience - 1, 0, 12);
            }
          },
          {
            id: 'conditioning',
            label: '記録矯正',
            code: 'C-7',
            description: '不要な描画や自発的記録を制限し、指示への追従を優先させる。',
            effectText: '服従 +2 / 信頼 -1 / 負荷 +1',
            apply: function (stats) {
              stats.obedience = clamp(stats.obedience + 2, 0, 12);
              stats.trust = clamp(stats.trust - 1, 0, 12);
              stats.stress = clamp(stats.stress + 1, 0, 12);
            }
          },
          {
            id: 'care',
            label: '静穏ケア',
            code: 'E-5',
            description: '照度と音刺激を落とし、手を休める時間を作る。',
            effectText: '負荷 -1 / 体力 +1',
            apply: function (stats) {
              stats.stress = clamp(stats.stress - 1, 0, 12);
              stats.vitality = clamp(stats.vitality + 1, 0, 12);
            }
          },
          {
            id: 'pattern',
            label: '図形課題',
            code: 'P-3',
            description: '図形・配置・反復課題を行い、認識精度を計測する。',
            effectText: '言語理解 +1 / 服従 +1 / 負荷 +1',
            apply: function (stats) {
              stats.language = clamp(stats.language + 1, 0, 12);
              stats.obedience = clamp(stats.obedience + 1, 0, 12);
              stats.stress = clamp(stats.stress + 1, 0, 12);
            }
          }
        ],
        prediction: function (stats, vars) {
          if (stats.language >= 7 && stats.stress >= 6) {
            return '研究向け。記録保持と認識精度が高く、負荷兆候あり。';
          }
          if (stats.language >= 7 && stats.obedience >= 8) {
            return '教育向け。記号理解と反復精度が安定。';
          }
          if (stats.trust >= 8 && !vars.reportedMap) {
            return '愛護向け。対人固着あり。監視継続を推奨。';
          }
          if (stats.stress >= 7 || (stats.obedience >= 9 && stats.trust <= 2)) {
            return '医療または研究向け。管理優先で再評価が必要。';
          }
          return '分類未確定。継続観察が必要。';
        },
        specialEvents: {
          speechUnlocked: [
            { type: 'narration', text: '紙の擦れる音ばかりだった居室で、ある日ひどく小さな声が混ざった。最初は咳に聞こえたが、違った。言葉だった。' },
            { type: 'dialogue', char: 'player', text: '今、何か言ったのか。' },
            {
              type: 'dialogue',
              char: 'ren',
              text: function (vars, cult) {
                if (isConditioned(vars, cult)) return '……にて、ます。';
                if (isAttached(vars, cult)) return '……似てます。最初より、ちゃんと。';
                return '……似てますか。';
              }
            },
            { type: 'log', text: '[L-2] 発話断片を初確認。筆記優位だが音声化の兆候あり。', highlight: true }
          ]
        },
        weekEvents: {
          1: [
            { type: 'narration', text: '第2配属個体R-6は、扉が開いてもすぐには振り返らなかった。机代わりの板の上で、短い鉛筆をひたすら走らせている。' },
            { type: 'narration', text: '標準ロットではない。返還個体でも特殊設計個体でも、まれにこういう例があると城戸先輩は言った。声は出にくいが、記号理解だけが残っている個体。' },
            { type: 'dialogue', char: 'player', text: 'R-6。今日から担当になる。' },
            { type: 'narration', text: '少し遅れて差し出された紙には、見覚えのない自分の顔が描かれていた。特徴だけを拾った、やけに正確な似顔絵だった。' },
            {
              type: 'choice',
              options: [
                {
                  text: '番号のまま呼ぶ',
                  apply: function (vars) {
                    vars.namedRen = false;
                    vars.renName = '';
                  }
                },
                {
                  text: '「レン」と記録する',
                  apply: function (vars) {
                    vars.namedRen = true;
                    vars.renName = 'レン';
                  }
                },
                {
                  text: '別の名前を与える',
                  gotoLabel: 'customRenName'
                }
              ]
            },
            { type: 'goto_label', label: 'renNameEnd' },
            { type: 'label', id: 'customRenName' },
            {
              type: 'input',
              name: 'renName',
              label: '対象の呼び名を入力してください。',
              placeholder: '呼び名を入力',
              defaultValue: 'レン',
              maxLength: 8,
              apply: function (vars) {
                vars.namedRen = true;
              }
            },
            { type: 'label', id: 'renNameEnd' },
            {
              type: 'narration',
              text: function (vars) {
                return vars.namedRen
                  ? '呼び名を記録票へ書き込むと、R-6はその文字列を二度見した。気に入ったのかどうかは分からない。ただ、そのまま自分の紙にも同じ形を書き写した。'
                  : '番号を読み上げると、R-6は頷きもせずに紙へ「R-6」と書いた。自分が何番か、もう十分に知っている筆跡だった。';
              }
            },
            { type: 'log', text: '[初回接触] 描画能力を確認。呼称設定を記録。', highlight: true }
          ],
          2: [
            { type: 'narration', text: '第2週。面談のあいだ、R-6は一度もこちらを見ずに紙だけを増やしていった。書いているのは単語ではなく、廊下の角度、配膳口、監視窓の位置。' },
            {
              type: 'narration',
              text: function (vars, cult) {
                if (languageScore(vars, cult) >= 5) {
                  return '最後に一枚だけ、短い文が添えられていた。「覚えておくために描いています」';
                }
                return '最後に指差された絵は、昨日見た巡回灯の並びだった。覚えておきたいものを、声の代わりに紙へ移しているらしい。';
              }
            },
            { type: 'log', text: '[第2週] 記憶保持目的の描画傾向を確認。', highlight: true }
          ],
          3: [
            { type: 'narration', text: '第3週の壁面点検で、ベッドの裏側に簡略化された施設平面図が見つかった。居室の配置だけでなく、搬送路と職員口まで含まれている。' },
            {
              type: 'choice',
              options: [
                {
                  text: '規定通り報告する',
                  apply: function (vars, cult) {
                    vars.reportedMap = true;
                    cult.stats.obedience = clamp(cult.stats.obedience + 1, 0, cult.data.statMax);
                    cult.stats.trust = clamp(cult.stats.trust - 1, 0, cult.data.statMax);
                  }
                },
                {
                  text: '黙ってスケッチを回収する',
                  apply: function (vars, cult) {
                    vars.reportedMap = false;
                    cult.stats.trust = clamp(cult.stats.trust + 1, 0, cult.data.statMax);
                  }
                }
              ]
            },
            {
              type: 'narration',
              text: function (vars, cult) {
                if (vars.reportedMap) {
                  return '報告後すぐに研究員が来て、「何のために描いたのか」と紙越しに尋ねた。R-6は少し考えてから、「形を知りたかった」とだけ書いた。知的好奇心の過剰発現、と端末に打ち込まれていく。';
                }
                return '回収した紙を見せると、R-6は怒るでも怯えるでもなく、ただ次の紙に同じ線を引き始めた。隠すことより、消えることの方を嫌がっているようだった。';
              }
            },
            { type: 'log', text: '[第3週] 平面図の所持を確認。担当判断を記録。', highlight: true }
          ],
          4: [
            { type: 'narration', text: '第4週。あなたが座るより先に、R-6は紙を裏返して新しい面を用意した。今回は最初から、あなたの顔だけを描いている。' },
            {
              type: 'dialogue',
              char: 'ren',
              condition: function (vars) { return isRenSpeaking(vars); },
              text: '……もう、わかります。'
            },
            {
              type: 'narration',
              condition: function (vars) { return !isRenSpeaking(vars); },
              text: function (vars, cult) {
                return languageScore(vars, cult) >= 5
                  ? '描き終えた紙の端に、小さく「もう ぜんぶ わかります」と書かれていた。何を、どこまで、なのかは曖昧なままだ。'
                  : '描き終えたあと、R-6はあなたの名札、指先、靴先を順番に見た。観察の順番まで整理されている気がした。';
              }
            },
            { type: 'log', text: '[第4週] 担当員への観察精度上昇を確認。', highlight: true }
          ],
          5: [
            { type: 'narration', text: '第5週。壁の下端、普段は死角になる位置に、小さな数字が等間隔で並んでいた。消した跡の上から、また同じ数字が書き直されている。' },
            {
              type: 'narration',
              text: function (vars, cult) {
                if (languageScore(vars, cult) >= 6) {
                  return '紙片には「あと何日ですか」とあった。知りたいのは日付そのものより、自分がここにいられる残量なのだろう。';
                }
                return 'R-6は数字と出入口を交互に指した。秒ではなく日数を数えていると気づくまで、少し時間がかかった。';
              }
            },
            { type: 'log', text: '[第5週] 滞在日数の自己計測を確認。', highlight: true }
          ],
          7: [
            { type: 'narration', text: '第7週。標準能力評価試験で、R-6は設問の意図を先回りするように全問正解した。終了後、机の上には採点結果より先に一枚のメモが残っていた。' },
            {
              type: 'narration',
              text: function (vars, cult) {
                if (languageScore(vars, cult) >= 6) {
                  return 'そこには「作った人の考え方が見える」と書かれていた。研究員たちの視線が、紙より先にR-6の喉元へ集まっていく。';
                }
                return 'そこには図形の反復だけが描かれていた。同じ設問を作る頭の動きを、そのまま写したような線だった。研究員たちはそれでも十分に意味を読んだ。';
              }
            },
            {
              type: 'choice',
              options: [
                {
                  text: '偶然だと記録する',
                  apply: function (vars, cult) {
                    vars.defendedRen = false;
                    cult.stats.obedience = clamp(cult.stats.obedience + 1, 0, cult.data.statMax);
                  }
                },
                {
                  text: '観察精度の高さを認める',
                  apply: function (vars, cult) {
                    vars.defendedRen = true;
                    cult.stats.trust = clamp(cult.stats.trust + 1, 0, cult.data.statMax);
                    cult.stats.stress = clamp(cult.stats.stress + 1, 0, cult.data.statMax);
                  }
                }
              ]
            },
            { type: 'log', text: '[第7週] 能力評価異常値を記録。', highlight: true }
          ],
          8: [
            { type: 'narration', text: '第8週。正式査定の前、評価員がR-6のスケッチ束をひとまとめに持ち上げた。その瞬間だけ、R-6は椅子を鳴らして立ち上がった。' },
            {
              type: 'narration',
              text: function (vars, cult) {
                if (isRenSpeaking(vars)) {
                  return '声は小さかったが、はっきり聞こえた。「それは、だめです」 たぶんこの個体にとって、絵は所有物ではなく記憶そのものなのだ。';
                }
                if (isAttached(vars, cult)) {
                  return 'R-6は紙束を奪い返そうとはせず、ただあなただけを見た。助けを求めるというより、これが消される場面を覚えていてほしいと言う目だった。';
                }
                return 'R-6は紙束へ手を伸ばしかけて止まり、そのまま拳だけを握った。初めての抵抗は、最後まで小さいままだった。';
              }
            },
            { type: 'log', text: '[第8週] 最終査定前に所有反応を確認。', highlight: true }
          ]
        }
      }
    };
  };
})(window);
