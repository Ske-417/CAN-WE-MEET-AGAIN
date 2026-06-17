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

  function displayAkiName(vars) {
    return vars.namedAki ? (vars.akiName || 'アキ') : 'A-4';
  }

  global.CWMA_buildCultivation = function buildCultivation() {
    return {
      yukiFirstChapter: {
        subjectId: 'yuki',
        subjectCode: 'J-7',
        managerCode: function (vars) {
          return vars.playerName || 'S-91';
        },
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
          3: [
            { type: 'narration', text: '第3週。消灯前、J-7は何度も壁際を振り返っていた。ついてこいと言いたいらしいが、まだ言葉はない。細い指先だけが、壁の一箇所を控えめに叩いている。' },
            {
              type: 'narration',
              text: function (vars, cult) {
                if (isAttached(vars, cult)) {
                  return 'そこには本当に、ごく細い光の筋が落ちていた。換気口の継ぎ目から漏れるだけの白い線なのに、J-7は宝物を見つけた子供みたいな顔でそれを指差した。';
                }
                return 'そこにはごく細い光の筋が落ちていた。換気口の継ぎ目から漏れるだけの白い線だ。それでもJ-7にとっては、自分だけが知っている外側の証拠らしかった。';
              }
            },
            {
              type: 'choice',
              options: [
                {
                  text: '少しだけ一緒に眺める',
                  apply: function (vars, cult) {
                    vars.sharedLight = true;
                    cult.stats.trust = clamp(cult.stats.trust + 1, 0, cult.data.statMax);
                  }
                },
                {
                  text: '規定上よくないと離れさせる',
                  apply: function (vars, cult) {
                    vars.sharedLight = false;
                    cult.stats.obedience = clamp(cult.stats.obedience + 1, 0, cult.data.statMax);
                    cult.stats.trust = clamp(cult.stats.trust - 1, 0, cult.data.statMax);
                  }
                }
              ]
            },
            {
              type: 'narration',
              text: function (vars) {
                return vars.sharedLight
                  ? '数十秒しか見ていないのに、そのあとJ-7は妙に機嫌がよかった。何か特別なことをしたわけでもない。ただ、同じものを同じ向きで見たという事実だけが、思ったより深く残る。'
                  : 'J-7は素直に離れたが、そのあと何度か振り返った。悪いことを叱られた顔ではなく、きれいなものを急いでしまわせた相手を見る顔だった。';
              }
            },
            { type: 'log', text: '[第3週] 壁際の漏光点を確認。反応を記録。', highlight: true }
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
          5: [
            { type: 'narration', text: '第5週。点検用の紙片が一枚なくなっていた。探すより先に、J-7のベッド脇で不格好に折られた小さな形を見つける。鳥に見えなくもない。' },
            {
              type: 'dialogue',
              char: 'yuki',
              condition: function (vars) { return isSpeaking(vars); },
              text: function (vars, cult) {
                if (isFrayed(vars, cult)) return '飛ばないけど、飛んでる形には、できます。……それだけでも、少しましだから。';
                if (isAttached(vars, cult)) return '飛ばないけど、飛んでる形にはできます。担当さんに、あげたかったんです。';
                return '飛ばないけど、飛んでる形です。';
              }
            },
            {
              type: 'narration',
              condition: function (vars) { return !isSpeaking(vars); },
              text: function (vars, cult) {
                return canWriteSingleWord(vars, cult)
                  ? '紙の裏には、震えた字で「とり」と書かれていた。発音できなくても、意味の方を先に覚えてしまったらしい。'
                  : 'J-7はその紙の形を両手で持ち上げ、少しだけ揺らした。飛ぶ真似なのだと分かるまでに、一拍かかった。';
              }
            },
            {
              type: 'choice',
              options: [
                {
                  text: '受け取って机にしまう',
                  apply: function (vars, cult) {
                    vars.keptBird = true;
                    cult.stats.trust = clamp(cult.stats.trust + 1, 0, cult.data.statMax);
                  }
                },
                {
                  text: '記録物だから戻すよう促す',
                  apply: function (vars, cult) {
                    vars.keptBird = false;
                    cult.stats.obedience = clamp(cult.stats.obedience + 1, 0, cult.data.statMax);
                    cult.stats.stress = clamp(cult.stats.stress + 1, 0, cult.data.statMax);
                  }
                }
              ]
            },
            {
              type: 'narration',
              text: function (vars) {
                return vars.keptBird
                  ? '受け取った瞬間、J-7は笑った。大きな出来事でもないのに、その笑顔だけはひどく完成度が低く、だからこそ本物に見えた。次の週に何が起きるかを知っていれば知っているほど、その場面は後から効いてくる。'
                  : '戻すように言うと、J-7は頷いて丁寧に紙を開いた。元の長方形へ戻っていく紙を見るあいだ、こちらの方が少しだけ息苦しかった。';
              }
            },
            { type: 'log', text: '[第5週] 紙片加工物を確認。担当判断を記録。', highlight: true }
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
        managerCode: function (vars) {
          return vars.playerName || 'S-91';
        },
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
          6: [
            { type: 'narration', text: '第6週。あなたが入ると、R-6は珍しくすぐに紙を差し出した。描かれていたのは居室でも通路でもなく、湯気の立つ紙コップと、その横に置かれた手だった。あなたの休憩時間の風景だ。見せた覚えはない。' },
            {
              type: 'dialogue',
              char: 'ren',
              condition: function (vars) { return isRenSpeaking(vars); },
              text: 'つかれてる、ときの手です。'
            },
            {
              type: 'narration',
              condition: function (vars) { return !isRenSpeaking(vars); },
              text: function (vars, cult) {
                return languageScore(vars, cult) >= 6
                  ? '紙の隅に「つかれてる ときの て」と書かれていた。似顔絵より、そちらの方が少し怖かった。顔より先に疲れ方を覚えられている。'
                  : 'R-6は自分の手を軽く握ってから、紙の上の手を指差した。労わる真似なのだと分かったとき、急に距離感がおかしくなる。';
              }
            },
            {
              type: 'choice',
              options: [
                {
                  text: 'ありがとうと受け取る',
                  apply: function (vars, cult) {
                    vars.acceptedRenSketch = true;
                    cult.stats.trust = clamp(cult.stats.trust + 1, 0, cult.data.statMax);
                  }
                },
                {
                  text: '観察しすぎだと距離を取る',
                  apply: function (vars, cult) {
                    vars.acceptedRenSketch = false;
                    cult.stats.obedience = clamp(cult.stats.obedience + 1, 0, cult.data.statMax);
                    cult.stats.trust = clamp(cult.stats.trust - 1, 0, cult.data.statMax);
                  }
                }
              ]
            },
            {
              type: 'narration',
              text: function (vars) {
                return vars.acceptedRenSketch
                  ? 'R-6は表情をほとんど変えなかったが、次の紙を出すまでの間だけ鉛筆を置いていた。観察対象としてではなく、自分の差し出したものが相手に届いたと確認する沈黙だった。'
                  : '距離を取ると、R-6は頷いて紙を裏返した。拒絶されたことを騒がず処理する静けさは、むしろこれまで何度もそうされてきた証拠に見えた。';
              }
            },
            { type: 'log', text: '[第6週] 担当員状態の描画再現を確認。', highlight: true }
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
      },
      akiThirdChapter: {
        subjectId: 'aki',
        subjectCode: 'A-4',
        managerCode: function (vars) {
          return vars.playerName || 'S-91';
        },
        varPrefix: 'aki',
        namedVar: 'namedAki',
        nameVar: 'akiName',
        speechVar: 'akiCanSpeak',
        displayName: function (vars) {
          return displayAkiName(vars);
        },
        speechStatus: function () {
          return '発話: 安定 / 対人反応: 高';
        },
        weeks: 8,
        actionsPerWeek: 1,
        statMax: 12,
        initialStats: {
          language: 7,
          trust: 4,
          obedience: 6,
          vitality: 6,
          stress: 2
        },
        actions: [
          {
            id: 'idle',
            label: '待機観察',
            code: 'O-0',
            description: '今週は介入を抑え、対人行動だけを記録する。',
            effectText: '変化なし',
            apply: function () {}
          },
          {
            id: 'language',
            label: '面談記録',
            code: 'L-4',
            description: '長めの対話を行い、自己認識と応答精度を確認する。',
            effectText: '言語理解 +1 / 負荷 +1',
            apply: function (stats) {
              stats.language = clamp(stats.language + 1, 0, 12);
              stats.stress = clamp(stats.stress + 1, 0, 12);
            }
          },
          {
            id: 'bond',
            label: '共同ケア',
            code: 'D-8',
            description: '他個体の観察や簡易補助を任せ、対人志向を確認する。',
            effectText: '信頼 +2 / 服従 -1 / 負荷 +1',
            apply: function (stats) {
              stats.trust = clamp(stats.trust + 2, 0, 12);
              stats.obedience = clamp(stats.obedience - 1, 0, 12);
              stats.stress = clamp(stats.stress + 1, 0, 12);
            }
          },
          {
            id: 'conditioning',
            label: '隔離矯正',
            code: 'C-9',
            description: '他個体との接触を制限し、規則優先の応答へ矯正する。',
            effectText: '服従 +2 / 信頼 -1 / 負荷 +2',
            apply: function (stats) {
              stats.obedience = clamp(stats.obedience + 2, 0, 12);
              stats.trust = clamp(stats.trust - 1, 0, 12);
              stats.stress = clamp(stats.stress + 2, 0, 12);
            }
          },
          {
            id: 'care',
            label: '情動保全',
            code: 'E-7',
            description: '休息と会話を優先し、共感反応の過負荷を抑える。',
            effectText: '信頼 +1 / 負荷 -1',
            apply: function (stats) {
              stats.trust = clamp(stats.trust + 1, 0, 12);
              stats.stress = clamp(stats.stress - 1, 0, 12);
            }
          },
          {
            id: 'physical',
            label: '補助作業訓練',
            code: 'B-6',
            description: '運搬や介助の模擬課題で実用適性を計測する。',
            effectText: '体力 +1 / 服従 +1 / 負荷 +1',
            apply: function (stats) {
              stats.vitality = clamp(stats.vitality + 1, 0, 12);
              stats.obedience = clamp(stats.obedience + 1, 0, 12);
              stats.stress = clamp(stats.stress + 1, 0, 12);
            }
          }
        ],
        prediction: function (stats, vars) {
          if (stats.trust >= 8 && stats.stress <= 4 && vars.reportedFood === false) {
            return '愛護向け。家庭適応性が高いが、対人固着と越境行動に注意。';
          }
          if (stats.obedience >= 9 && stats.stress >= 6) {
            return '愛玩向け。感情反応は高いが矯正可能と評価。';
          }
          if (stats.stress >= 8 || vars.akiKnewFate) {
            return '医療向け。情動の過剰発現につき再資源化候補。';
          }
          return '分類競合中。複数部署による査定継続。';
        },
        weekEvents: {
          1: [
            { type: 'narration', text: '第3配属個体A-4は、あなたが入る前から壁を軽く叩いていた。一定の間隔で、短く三回。返事を待つみたいに耳を澄ませ、それからようやくこちらを見る。' },
            { type: 'dialogue', char: 'aki', text: 'あの子、最近元気ないんです。隣の子。返事、昨日から遅くて。' },
            { type: 'dialogue', char: 'player', text: '自分のことより、隣が気になるのか。' },
            { type: 'dialogue', char: 'aki', text: 'そうみたいです。変ですよね。わたしも、そう思います。' },
            {
              type: 'choice',
              options: [
                {
                  text: '番号のまま記録する',
                  apply: function (vars) {
                    vars.namedAki = false;
                    vars.akiName = '';
                  }
                },
                {
                  text: '「アキ」と記録する',
                  apply: function (vars) {
                    vars.namedAki = true;
                    vars.akiName = 'アキ';
                  }
                },
                {
                  text: '別の名前を与える',
                  gotoLabel: 'customAkiName'
                }
              ]
            },
            { type: 'goto_label', label: 'akiNameEnd' },
            { type: 'label', id: 'customAkiName' },
            {
              type: 'input',
              name: 'akiName',
              label: '対象の呼び名を入力してください。',
              placeholder: '呼び名を入力',
              defaultValue: 'アキ',
              maxLength: 8,
              apply: function (vars) {
                vars.namedAki = true;
              }
            },
            { type: 'label', id: 'akiNameEnd' },
            {
              type: 'narration',
              text: function (vars) {
                return vars.namedAki
                  ? '呼び名を伝えると、A-4は自分の胸を一度だけ押さえた。それが嬉しいしぐさなのか、責任を受け取る姿勢なのか、すぐには判別できなかった。'
                  : '番号を読み上げると、A-4は素直に頷いた。拒否はない。ただ、その反応が従順だからではなく、相手に合わせるよう設計されているからだと考えると妙に冷えた。';
              }
            },
            { type: 'log', text: '[初回接触] 他個体への注意集中を確認。呼称設定を記録。', highlight: true }
          ],
          2: [
            { type: 'dialogue', char: 'aki', text: '去年、ここにいた子のこと、覚えてます。いなくなった日の音も。……でも、聞かない方がいいことってありますよね。' },
            {
              type: 'choice',
              options: [
                {
                  text: '聞かない方が楽だと答える',
                  apply: function (vars, cult) {
                    vars.akiTruthStyle = 'avoid';
                    cult.stats.obedience = clamp(cult.stats.obedience + 1, 0, cult.data.statMax);
                  }
                },
                {
                  text: '覚えていていいと答える',
                  apply: function (vars, cult) {
                    vars.akiTruthStyle = 'keep';
                    cult.stats.trust = clamp(cult.stats.trust + 1, 0, cult.data.statMax);
                  }
                }
              ]
            },
            {
              type: 'narration',
              text: function (vars) {
                return vars.akiTruthStyle === 'keep'
                  ? 'A-4は安心したようにも、諦めたようにも見える笑い方をした。覚えていていいと言われたことより、覚えている自分を否定されなかったことの方が大きかったのかもしれない。'
                  : 'A-4は頷いたが、そのあと壁へ戻る指先のリズムだけは変わらなかった。忘れた方が楽だと言われても、覚えてしまう側の身体は止まらない。';
              }
            },
            { type: 'log', text: '[第2週] 消失個体への記憶保持を確認。', highlight: true }
          ],
          3: [
            { type: 'narration', text: '第3週。配膳口の点検で、A-4が自分の食事の一部を壁の隙間へ押し込もうとしているのを見つけた。隣区画の子が少なそうだったから、と本人は当然のように言う。' },
            {
              type: 'choice',
              options: [
                {
                  text: '規則違反として報告する',
                  apply: function (vars, cult) {
                    vars.reportedFood = true;
                    cult.stats.obedience = clamp(cult.stats.obedience + 1, 0, cult.data.statMax);
                    cult.stats.trust = clamp(cult.stats.trust - 1, 0, cult.data.statMax);
                    cult.stats.stress = clamp(cult.stats.stress + 1, 0, cult.data.statMax);
                  }
                },
                {
                  text: '見なかったことにする',
                  apply: function (vars, cult) {
                    vars.reportedFood = false;
                    cult.stats.trust = clamp(cult.stats.trust + 1, 0, cult.data.statMax);
                  }
                }
              ]
            },
            {
              type: 'narration',
              text: function (vars) {
                if (vars.reportedFood) {
                  return '記録票に書き込んだあとも、A-4は「でも、お腹すくと苦しいから」と静かに言った。罰則の説明より先に、苦しさの共有が優先されている。そういう順番で考える個体を、施設はたぶん長く許さない。';
                }
                return '黙認した翌週も、A-4は同じことをした。優しさではなく反射に近いのだと分かる。止めれば止めるほど、本人の中で「しない」の方が不自然になる種類の行動だった。';
              }
            },
            { type: 'log', text: '[第3週] 食事共有行為を確認。担当判断を記録。', highlight: true }
          ],
          4: [
            { type: 'dialogue', char: 'aki', text: 'もし誰かが泣いていたら、助けに行ってもいいですか。ルールで決まってますか。決まってないなら、行ってもいいですか。' },
            { type: 'narration', text: '確認しているのは反抗のためではない。許可をもらえれば、堂々と誰かを助けていいと思っている顔だった。まっすぐで、だから扱いづらい。' },
            {
              type: 'choice',
              options: [
                {
                  text: '許可が必要だと教える',
                  apply: function (vars, cult) {
                    vars.akiPermission = 'rule';
                    cult.stats.obedience = clamp(cult.stats.obedience + 1, 0, cult.data.statMax);
                  }
                },
                {
                  text: '気づけること自体は悪くないと伝える',
                  apply: function (vars, cult) {
                    vars.akiPermission = 'care';
                    cult.stats.trust = clamp(cult.stats.trust + 1, 0, cult.data.statMax);
                  }
                }
              ]
            },
            {
              type: 'narration',
              text: function (vars) {
                return vars.akiPermission === 'care'
                  ? 'A-4は安心したように息をついた。「よかった。変じゃないなら、まだ大丈夫ですね」と言った。何が大丈夫なのか訊けなかった。'
                  : 'A-4は真面目に頷き、しばらくしてから「じゃあ、許可を取るまで気づかないふりをするのが正しいですか」と聞いた。正解の形を教えようとすると、すぐにもっと嫌な問いへ化ける。';
              }
            },
            { type: 'log', text: '[第4週] 他個体救助に関する規則確認を記録。', highlight: true }
          ],
          5: [
            { type: 'dialogue', char: 'aki', text: 'わたし、誰かの世話をする仕事がしたいです。子供とか、病気の人とか。そういうの、向いてますか。' },
            { type: 'dialogue', char: 'player', text: 'どうして、そう思う。' },
            { type: 'dialogue', char: 'aki', text: '泣いてる人がいると、放っておく方が変な感じがするんです。……これ、設計ですか。それとも、わたしですか。' },
            {
              type: 'choice',
              options: [
                {
                  text: '設計でも気持ちは気持ちだと答える',
                  apply: function (vars, cult) {
                    vars.akiIdentity = 'self';
                    cult.stats.trust = clamp(cult.stats.trust + 1, 0, cult.data.statMax);
                  }
                },
                {
                  text: '答えを濁して記録に戻る',
                  apply: function (vars, cult) {
                    vars.akiIdentity = 'blur';
                    cult.stats.stress = clamp(cult.stats.stress + 1, 0, cult.data.statMax);
                  }
                }
              ]
            },
            {
              type: 'narration',
              text: function (vars) {
                return vars.akiIdentity === 'self'
                  ? 'A-4は少し黙ってから、「じゃあ、設計でも大事にしていいんですね」と言った。その返しは救いに見えて、同時にひどく危うかった。'
                  : 'A-4はそれ以上訊かなかった。訊かなかった代わりに、壁を叩くリズムがその日だけ少し乱れた。考え込む個体は、沈黙の中で勝手に答えを育てる。';
              }
            },
            { type: 'log', text: '[第5週] 自己認識と設計意識の揺らぎを確認。', highlight: true }
          ],
          6: [
            { type: 'narration', text: '第6週。区画内で体調を崩した個体が出た日、A-4は指示される前から濡らした布を持って待っていた。手伝わせると動きは正確で、声も落ち着いている。短いあいだだけ、この施設のどこかに本来あるべきケアの形が見えた。' },
            { type: 'dialogue', char: 'aki', text: 'わたし、何か役に立てましたか。ちゃんと落ち着いてくれたなら、よかった。' },
            {
              type: 'choice',
              options: [
                {
                  text: '役に立ったと伝える',
                  apply: function (vars, cult) {
                    vars.akiPraised = true;
                    cult.stats.trust = clamp(cult.stats.trust + 1, 0, cult.data.statMax);
                  }
                },
                {
                  text: '業務上の偶然だと流す',
                  apply: function (vars, cult) {
                    vars.akiPraised = false;
                    cult.stats.stress = clamp(cult.stats.stress + 1, 0, cult.data.statMax);
                  }
                }
              ]
            },
            {
              type: 'narration',
              text: function (vars) {
                return vars.akiPraised
                  ? 'A-4は本当に嬉しそうだった。評価されたからではなく、自分の中にあるものが誰かを楽にしたと確認できたからだ。その顔を見た直後に、この特性が査定材料として奪われる未来を思い出す。'
                  : 'A-4は「そうですか」とだけ言ったが、その日は壁を叩く音が少し長く続いた。役に立った実感を持たせないことは管理として正しくても、人としてはかなり卑怯だった。';
              }
            },
            { type: 'log', text: '[第6週] 他個体へのケア補助適性を確認。', highlight: true }
          ],
          7: [
            { type: 'narration', text: '第7週。隣区画で自傷行為が起きた。駆けつけた職員が扉を開けるまで、A-4は壁越しに一定のリズムで「大丈夫」を叩き続けていた。' },
            { type: 'narration', text: '引き離した直後、隣の個体は急激に取り乱した。施設はA-4の対人影響を「危険な連鎖反応」と記録したが、現場にいたあなたには、それが救命に近い作用だったことも分かっていた。' },
            {
              type: 'choice',
              options: [
                {
                  text: '効果があったと記録する',
                  apply: function (vars, cult) {
                    vars.akiHelped = true;
                    cult.stats.trust = clamp(cult.stats.trust + 1, 0, cult.data.statMax);
                    cult.stats.stress = clamp(cult.stats.stress + 1, 0, cult.data.statMax);
                  }
                },
                {
                  text: '危険因子という記録に従う',
                  apply: function (vars, cult) {
                    vars.akiHelped = false;
                    cult.stats.obedience = clamp(cult.stats.obedience + 1, 0, cult.data.statMax);
                  }
                }
              ]
            },
            {
              type: 'dialogue',
              char: 'aki',
              text: function (vars) {
                return vars.akiHelped
                  ? 'わたし、何か役に立てましたか。あの子、少しだけ呼吸、戻ってた気がして。'
                  : 'わたし、だめでしたか。落ち着くかなと思ったんですけど、余計なことでしたか。';
              }
            },
            { type: 'log', text: '[第7週] 他個体への鎮静作用を確認。査定上は危険因子として記録。', highlight: true }
          ],
          8: [
            { type: 'narration', text: '第8週。知らない職員の出入りが増え、A-4もそれに気づいていた。ただ本人が気にしているのは自分の行き先より、次にこの区画へ来る誰かのことらしかった。' },
            { type: 'dialogue', char: 'aki', text: 'わたしが行った後、担当さんが担当する子を、少し見ていてあげてください。泣いてても、すぐ規則だけで片づけないで。' },
            {
              type: 'narration',
              text: function (vars, cult) {
                if ((cult.stats.stress || 0) >= 7) {
                  return '自分の方が先に消えそうな顔をしているのに、A-4は最後まで他人の話をしていた。その優先順位の異常さが、もう美徳ではなく痛みに見えた。';
                }
                return '別れの場面でさえ、自分のことを後ろへ回す。その癖は設計なのか性格なのか、ここまで来るともう区別する意味が薄かった。';
              }
            },
            { type: 'log', text: '[第8週] 育成期間満了。最終面談へ移行。', highlight: true }
          ]
        }
      }
    };
  };
})(window);
