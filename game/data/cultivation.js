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

  function displayName(vars) {
    return vars.namedYuki ? (vars.yukiName || 'ユキ') : 'J-7';
  }

  function sayOrDescribe(spokenText, silentText) {
    return function (vars) {
      return isSpeaking(vars) ? spokenText : silentText;
    };
  }

  global.CWMA_buildCultivation = function buildCultivation() {
    return {
      yukiFirstChapter: {
        subjectId: 'yuki',
        subjectCode: 'J-7',
        managerCode: 'S-91',
        weeks: 16,
        actionsPerWeek: 2,
        statMax: 12,
        speechThreshold: 6,
        initialStats: {
          language: 0,
          trust: 2,
          obedience: 8,
          vitality: 7,
          stress: 1
        },
        actions: [
          {
            id: 'language',
            label: '語学導入',
            code: 'A-1',
            description: '音韻模倣と基礎語彙の反復入力。発話の土台を作る。',
            effectText: '言語理解 +2 / 負荷 +1',
            apply: function (stats) {
              stats.language = clamp(stats.language + 2, 0, 12);
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
            effectText: '信頼 +1 / 負荷 -1 / 言語 +1',
            apply: function (stats) {
              stats.trust = clamp(stats.trust + 1, 0, 12);
              stats.stress = clamp(stats.stress - 1, 0, 12);
              stats.language = clamp(stats.language + 1, 0, 12);
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
          if (stats.language >= 8 && stats.stress >= 6) {
            return '研究向け。対話応答あり、負荷耐性は要再計測。';
          }
          if (stats.language >= 7 && stats.trust >= 7) {
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
            { type: 'dialogue', char: 'yuki', text: '……たん、とう。' },
            { type: 'dialogue', char: 'player', text: '今のは、呼んだのか。' },
            {
              type: 'dialogue',
              char: 'yuki',
              text: function (vars) {
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
            { type: 'narration', text: '壁際の記録板には「私的命名は推奨しない」と書かれていた。赤線まで引かれているのに、その注意書きだけ妙に弱々しく見えた。' },
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
              text: function (vars) {
                return vars.namedYuki
                  ? 'その名を口にすると、J-7は発音を確かめるように唇だけ動かした。意味はまだ届いていなくても、自分に向けられた音だと理解したらしい。'
                  : 'あなたが番号を読み上げると、J-7は小さく頷いた。慣れている反応だった。慣れすぎていて、少しだけ不気味だった。';
              }
            },
            { type: 'log', text: '[初回接触] 発話なし。呼称設定を記録。' }
          ],
          3: [
            { type: 'narration', text: '第3週の壁面点検で、白い塗装の一部が爪で薄く削られているのを見つけた。指でなぞると、文字のようにも傷の集まりのようにも見える。' },
            {
              type: 'narration',
              text: function (vars) {
                var mark = vars.namedYuki ? (vars.yukiName || 'ユキ') : 'S-91';
                return 'よく見ると、それは「' + mark + '」にも見えた。J-7は少し離れた場所で、こちらが気づくのを待っている。';
              }
            },
            {
              type: 'dialogue',
              char: 'yuki',
              condition: function (vars) { return isSpeaking(vars); },
              text: '……だめでしたか。見つからない向きに、書いたつもりだったのに。'
            },
            {
              type: 'narration',
              condition: function (vars) { return !isSpeaking(vars); },
              text: 'J-7は咄嗟に爪を隠し、それから壁とあなたを交互に見た。叱られる前の顔だけは、もう普通の子供と変わらない。'
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
              text: function (vars) {
                if (vars.reportedWall) {
                  return isSpeaking(vars)
                    ? 'J-7は「次は消えるところにします」と言ってから、自分で口を押さえた。学ばせた言葉が、もう隠し事に使われ始めている。'
                    : '報告票に傷の件を書き込むと、J-7は壁から一歩下がった。罰の内容までは知らなくても、報告されること自体は理解している。';
                }
                return isSpeaking(vars)
                  ? '痕跡を削り落とすあいだ、J-7は黙って削り粉を手のひらに受けていた。共犯めいた静けさだけが残った。'
                  : 'あなたが黙って跡を消すと、J-7は安堵したように肩の力を抜いた。礼の言葉はない。ただ、逃げずにそばに立っていた。';
              }
            },
            { type: 'log', text: '[第3週] 壁面痕跡を確認。担当判断を記録。', highlight: true }
          ],
          7: [
            { type: 'narration', text: '夜勤明けの廊下で、隣区画の搬送台車だけが妙に長く音を引いていた。翌朝、その居室の名札は外されていた。' },
            {
              type: 'dialogue',
              char: 'yuki',
              condition: function (vars) { return isSpeaking(vars); },
              text: '昨日の子、どこに行ったんですか。泣いてたみたいで、眠れませんでした。'
            },
            {
              type: 'narration',
              condition: function (vars) { return !isSpeaking(vars); },
              text: 'J-7はあなたの袖を引き、空になった隣室を指差した。メモ用紙に書かれていたのは、たった一語だけだった。「どこ」'
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
              text: function (vars) {
                if (vars.toldTruth) {
                  return isSpeaking(vars)
                    ? 'J-7はそれ以上訊かなかった。ただ、空になった隣室を見たまま、「場所みたいに消えるんですね」と小さく言った。'
                    : 'あなたの短い返答を聞いたあと、J-7はメモを二つに折った。丸めて捨てることもせず、ポケットへしまった。';
                }
                return isSpeaking(vars)
                  ? 'どの答えを選んでも、J-7の顔から不安は消えなかった。ただ、嘘が嘘だと分かる程度には、もう語彙を与えてしまっている。'
                  : '説明になっていないと分かっている顔で、J-7はそれでも頷いた。言葉を持たない相手ほど、嘘を飲み込むしかない。';
              }
            },
            { type: 'log', text: '[第7週] 隣室消失に対する情動反応を記録。', highlight: true }
          ],
          11: [
            { type: 'narration', text: '外部査定の日。ヴァルター管理官は、いつもより柔らかい声で居室に入ってきた。その柔らかさが、器具の冷たさより嫌だった。' },
            { type: 'dialogue', char: 'walter', text: '個体J-7。査定を開始します。担当員は記録のみを行い、発言を控えてください。' },
            {
              type: 'dialogue',
              char: 'yuki',
              condition: function (vars) { return isSpeaking(vars); },
              text: '……空はどうして青いんですか。動けない植物が、太陽を好きなのはどうしてですか。'
            },
            {
              type: 'dialogue',
              char: 'walter',
              condition: function (vars) { return isSpeaking(vars); },
              text: '質問傾向が強い。情動寄り。従順性との両立は不安定です。'
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
              text: function (vars) {
                if (vars.spokeUp) {
                  return 'あなたの発言は短く記録され、ヴァルター管理官の端末へ保存された。守ったというより、証拠を増やした感覚だけが残る。';
                }
                return '黙っていれば記録は綺麗だ。綺麗な記録ほど、あとで読んだときに吐き気がする。';
              }
            },
            { type: 'log', text: '[第11週] 査定立会い完了。担当員発言の有無を記録。', highlight: true }
          ],
          14: [
            {
              type: 'narration',
              text: function (vars) {
                return isSpeaking(vars)
                  ? '第14週。出発予定票が居室端末に表示されると、' + displayName(vars) + 'は何度もその日付を読み返した。読める文字が増えた分だけ、読んでほしくない文言まで理解してしまう。'
                  : '第14週。出発予定票が居室端末に表示されると、J-7は意味の分からない画面でも嫌な知らせだと察したらしく、あなたの袖口だけをずっと見ていた。';
              }
            },
            { type: 'log', text: '[第14週] 出発予定通知を表示。反応観察を継続。', highlight: true }
          ],
          16: [
            {
              type: 'narration',
              text: function (vars) {
                return isSpeaking(vars)
                  ? displayName(vars) + 'は最後の記録日に、あなたの名札だけを見ていた。質問はもう少ない。減ったのか、減らされたのか、判別しづらい。'
                  : '最後の記録日に、J-7はあなたの名札を指でなぞる真似をした。まだ喋れないままでも、別れが近いことだけは理解しているらしかった。';
              }
            },
            { type: 'log', text: '[第16週] 育成期間満了。最終面談へ移行。', highlight: true }
          ]
        }
      }
    };
  };
})(window);
