(function (global) {
  function displayYukiName(vars) {
    return vars.namedYuki ? (vars.yukiName || 'ユキ') : 'J-7';
  }

  function displayRenName(vars) {
    return vars.namedRen ? (vars.renName || 'レン') : 'R-6';
  }

  function canYukiSpeak(vars) {
    return !!vars.yukiCanSpeak;
  }

  function canRenSpeak(vars) {
    return !!vars.renCanSpeak;
  }

  function getYukiRoute(vars) {
    if (!vars.yukiCanSpeak && (vars.yukiObedienceScore || 0) >= 10) return 'pet';
    if ((vars.yukiLanguageScore || 0) >= 5 && (vars.yukiStressScore || 0) >= 6) return 'research';
    if ((vars.yukiVitalityScore || 0) >= 9 && (vars.yukiObedienceScore || 0) >= 8) return 'labor';
    if ((vars.yukiTrustScore || 0) >= 7) return 'care';
    return 'medical';
  }

  function getRenRoute(vars) {
    if ((vars.renLanguageScore || 0) >= 7 && (vars.renStressScore || 0) >= 6) return 'research';
    if ((vars.renLanguageScore || 0) >= 7 && (vars.renObedienceScore || 0) >= 8) return 'education';
    if ((vars.renTrustScore || 0) >= 8 && vars.reportedMap === false) return 'care';
    return 'medical';
  }

  global.CWMA_buildScenes = function buildScenes() {
    return {
      opening: {
        steps: [
          { type: 'bg', target: 'black', transition: 'none' },
          { type: 'narration', text: 'ある日、わりのいい求人票を見つけ、応募してみた。' },
          { type: 'narration', text: '運よく書類選考は通っていたようで、今日この同意書が届いた。' },
          {
            type: 'modal',
            title: '雇用同意書',
            body: [
              '育成補助職員採用に関する同意書。以下の条件を確認し、署名を行ってください。',
              '第一条。採用後、職員は配属先施設において指定された育成補助業務、観察記録業務、生活指導補助業務、搬送補助業務、ならびに付随する一切の補助作業へ従事するものとします。',
              '第二条。職員は、業務上接触する被育成個体、評価対象個体、研究協力個体、保護管理個体その他名称の如何を問わず、施設内で管理される対象について、私的な情報記録、施設外への口外、所在確認、接触の試みを行ってはなりません。',
              '第三条。職員は、施設が安全管理・適性評価・業務品質向上の目的で実施する音声記録、映像記録、情動反応記録、記憶反応記録、作業中の生体情報計測、およびこれに準ずる観測に同意するものとします。',
              '第四条。職員は、業務中に知り得た配属先区分、分類基準、個体移送先、処遇判断、適性査定、研究データ、廃棄判断、調整処置に関する一切の情報について、在職中および離職後を問わず守秘義務を負います。',
              '第五条。職員は、業務中に発生し得る心理的負荷、睡眠障害、情動不安定、離人感、記憶混線、反復夢想その他の精神的反応について、施設指定の面談および調整措置を受けることに同意するものとします。',
              '第六条。職員は、業務対象との関係性について、家族的呼称、私的命名、私物の受け渡し、施設規程外の慰撫行為、無断の接触延長、記録未記載の対話を行わないよう努めるものとします。なお、施設は必要と認めた場合、当該接触記録を査定資料として利用できます。',
              '第七条。施設判断に基づく配置転換、記録修正要請、記憶保全措置、健康観察、待機命令、退職勧告その他の人事・保安上の措置について、職員はこれに従うものとし、異議申立ては施設所定の内部手続に限られます。',
              '第八条。本同意書への署名をもって、職員は上記各条項を読み、理解し、同意したものと見なされます。署名後は、指定時刻までに指定住所へ出頭してください。未出頭の場合、本採用は自動的に無効となります。'
            ],
            buttonLabel: '書類を閉じる'
          },
          { type: 'narration', text: 'これにサインをして、指定の住所まで行けば雇ってもらえるようだ…' },
          {
            type: 'input',
            name: 'playerName',
            label: '同意書の署名欄に名前を書いてください。',
            placeholder: '署名を入力',
            defaultValue: 'S-91',
            maxLength: 12,
            submitOnEnter: false,
            buttonLabel: '署名して向かう'
          },
          { type: 'narration', text: 'インクは少しだけ滲んだ。まだ読める。読めるうちに、もう後戻りはしない方がいい気がした。' },
          { type: 'narration', text: '住所の先にあったのは、保育施設にも病院にも見えない、窓の少ない灰色の建物だった。受付で回収されたのは履歴書より先に、さっき署名した同意書だった。' },
          { type: 'narration', text: 'ここでは子供を「個体」と呼ぶらしい。職員は識別記号で管理され、連れて行かれる子供たちにも、普通の意味での行き先は用意されていないようだった。' },
          { type: 'narration', text: '求人票にあった「育成補助」という言葉は嘘ではない。ただ、その育てる相手は、誰かに守られる子供というより、誰かに使われるための存在に近い気がした。' },
          { type: 'bg', target: 'briefing' },
          { type: 'char_show', char: 'kido', position: 'right' },
          { type: 'dialogue', char: 'kido', text: function (vars) { return '新任の' + (vars.playerName || 'S-91') + 'さんですね。最初に言っておきます。ここでは、優しくするより、慣れる方が先です。'; } },
          { type: 'dialogue', char: 'player', text: '子供の支援が業務だと聞いています。慣れるというのは、どういう意味ですか。' },
          { type: 'dialogue', char: 'kido', text: 'そのうち分かります。分からないまま働く人もいます。そっちの方が長持ちします。' },
          { type: 'char_show', char: 'walter', position: 'left' },
          { type: 'dialogue', char: 'walter', text: '担当員S-91。初回配属個体はJ-7です。標準ロットのため、発話機能は初期化されていません。必要であれば育成工程で言語を与えてください。不要であれば、そのまま出荷可能です。' },
          { type: 'dialogue', char: 'walter', text: '接触の目的は愛着形成ではありません。分類精度の向上です。そこを履き違えなければ、良い勤務になります。' },
          { type: 'dialogue', char: 'player', text: '喋れるようにするかどうかまで、こちらが決めるんですか。' },
          { type: 'dialogue', char: 'walter', text: 'ええ。語学はコストです。売却先が必要とするなら付与する。必要としないなら、沈黙のままの方が管理しやすい。単純な話です。' },
          { type: 'dialogue', char: 'kido', text: '要するに、あなたが今からやるのは世話だけじゃない。懐かせて、見て、記録して、手放すところまで含めて業務ってことです。' },
          { type: 'choice', options: [
            { text: '「理解しました」と答える', goto: 'cultivationYuki', setVar: { name: 'resist', value: false } },
            { text: '返答を濁す', goto: 'cultivationYuki', setVar: { name: 'resist', value: true } }
          ] }
        ]
      },
      cultivationYuki: {
        steps: [
          { type: 'clear_chars' },
          { type: 'cultivation', key: 'yukiFirstChapter', goto: 'farewell' }
        ]
      },
      farewell: {
        steps: [
          { type: 'goto', target: 'farewellSpoken', condition: 'vars.yukiCanSpeak === true' },
          { type: 'goto', target: 'farewellSilent' }
        ]
      },
      farewellSpoken: {
        steps: [
          { type: 'bg', target: 'departure' },
          { type: 'char_show', char: 'yuki', position: 'center' },
          {
            type: 'dialogue',
            char: 'yuki',
            text: function (vars) {
              if (vars.yukiConditioned) return 'もうすぐ、ここを出るって聞きました。……次の場所では、ちゃんとできますか。';
              if (vars.yukiAttached) return 'もうすぐ、ここを出るって聞きました。空が見えるところでも、担当さんのこと思い出せますか。';
              return 'もうすぐ、ここを出るって聞きました。空が見えるところですか。';
            }
          },
          { type: 'dialogue', char: 'player', text: '……。' },
          {
            type: 'dialogue',
            char: 'yuki',
            text: function (vars) {
              if (vars.yukiConditioned) return '最初に来てくれた日のこと、忘れない方がいいですか。それとも、忘れた方が次の場所で楽ですか。';
              if (vars.yukiAttached) return '最初に来てくれた日のこと、ずっと覚えていたいです。担当さんも覚えていてくれますか。';
              if (vars.yukiStressScore >= 6) return 'ここで覚えたこと、次の場所でも役に立ちますか。……役に立つなら、少しだけ安心します。';
              return '最初に来てくれた日のこと、ずっと覚えていたいです。担当さんも覚えていてくれますか。';
            }
          },
          { type: 'choice', options: [
            { text: '「覚えている」と答える', goto: 'promiseMemory', setVar: { name: 'promise', value: 'memory' } },
            { text: '答えられず黙る', goto: 'promiseSilence', setVar: { name: 'promise', value: 'silence' } },
            { text: 'また会えると嘘をつく', goto: 'promiseLie', setVar: { name: 'promise', value: 'lie' } }
          ] }
        ]
      },
      farewellSilent: {
        steps: [
          { type: 'bg', target: 'departure' },
          { type: 'char_show', char: 'yuki', position: 'center' },
          {
            type: 'narration',
            text: function (vars) {
              if (vars.yukiLiterate) {
                return '最後の面談で、J-7は膝の上のメモ用紙を何度も折り直していた。紙の端は湿って、もう少しで破れそうだった。';
              }
              if (vars.yukiSemiLiterate) {
                return '最後の面談で、J-7は紙片に何度か線を重ね、うまく書けなかった部分を指で擦って消していた。';
              }
              return '最後の面談で、J-7は何も持たずに座っていた。ただ、あなたが入ってきてからは一度も視線を外さなかった。';
            }
          },
          {
            type: 'narration',
            text: function (vars) {
              if (vars.yukiLiterate) {
                return '差し出された紙には、拙い字で「' + displayYukiName(vars) + ' おぼえて くれる」とあった。';
              }
              if (vars.yukiSemiLiterate) {
                return '差し出された紙には、崩れた文字で「' + displayYukiName(vars) + '」と、その下に途切れた線だけが残っていた。言い切れない問いの跡のようだった。';
              }
              return 'J-7は自分の胸とあなたの名札を順番に指したあと、両手を合わせて離した。会話未満のしぐさでも、何を確かめたいのかだけは分かった。';
            }
          },
          { type: 'choice', options: [
            { text: '頷いて「覚えている」と伝える', goto: 'promiseMemory', setVar: { name: 'promise', value: 'memory' } },
            { text: '何も返せず沈黙する', goto: 'promiseSilence', setVar: { name: 'promise', value: 'silence' } },
            { text: 'また会えると書き足す', goto: 'promiseLie', setVar: { name: 'promise', value: 'lie' } }
          ] }
        ]
      },
      promiseMemory: {
        steps: [
          { type: 'dialogue', char: 'player', text: '覚えている。たぶん、ずっと。' },
          { type: 'narration', text: '言った瞬間、自分で自分の逃げ道をひとつ潰した気がした。忘れないと約束することは、優しさというより、あとで効いてくる種類の責任だった。' },
          {
            type: 'dialogue',
            char: 'yuki',
            condition: function (vars) { return canYukiSpeak(vars); },
            text: function (vars) {
              if (vars.yukiConditioned) return 'それなら、次の場所でも少しは耐えられる気がします。覚えてる人が一人いるなら。';
              if (vars.yukiAttached) return 'それならいいです。会えなくても、消えない方法がひとつ増えるから。';
              return 'それなら、ここでいたことが全部なくなるわけじゃないんですね。';
            }
          },
          {
            type: 'narration',
            condition: function (vars) { return !canYukiSpeak(vars); },
            text: function (vars) {
              return vars.yukiLiterate || vars.yukiSemiLiterate
                ? 'J-7は紙を胸元で握りしめ、それから小さく頷いた。声がなくても、安堵の形だけは分かった。'
                : 'J-7は肩の力を抜き、胸元で組んでいた手をゆっくり下ろした。言葉はなくても、少しだけ呼吸が戻ったのが見えた。';
            }
          },
          { type: 'goto', target: 'chapterOneReportRouter' }
        ]
      },
      promiseSilence: {
        steps: [
          { type: 'dialogue', char: 'player', text: '……。' },
          { type: 'narration', text: '黙っているあいだにも、時間だけはきちんと進んでいた。返答しないことは保留ではない。ただ、相手ひとりにだけ答えを負わせるやり方だ。' },
          {
            type: 'dialogue',
            char: 'yuki',
            condition: function (vars) { return canYukiSpeak(vars); },
            text: function (vars) {
              if (vars.yukiConditioned) return 'すみません。困らせる質問でしたよね。もう聞きません。';
              if (vars.yukiAttached) return '困らせましたよね。ごめんなさい。でも、聞いてみたかったんです。';
              return 'そうですよね。そういうこと、言えない場所ですもんね。';
            }
          },
          {
            type: 'narration',
            condition: function (vars) { return !canYukiSpeak(vars); },
            text: function (vars) {
              return vars.yukiLiterate || vars.yukiSemiLiterate
                ? 'J-7は紙を裏返し、何も書かないまま膝に戻した。書けることより、書けないことの方が多い顔だった。'
                : 'J-7は一度だけ目を伏せ、それきり身じろぎもしなかった。伝える手段の少なさだけが、そのまま距離になって残った。';
            }
          },
          { type: 'goto', target: 'chapterOneReportRouter' }
        ]
      },
      promiseLie: {
        steps: [
          { type: 'dialogue', char: 'player', text: 'また会える。だから、今は心配しなくていい。' },
          { type: 'narration', text: '言い終える前から、それがこの施設でいちばん安い慰め方だと分かっていた。安いのに、受け取る側には高く残る。そういう言葉だった。' },
          {
            type: 'dialogue',
            char: 'yuki',
            condition: function (vars) { return canYukiSpeak(vars); },
            text: function (vars) {
              if (vars.yukiConditioned) return 'ほんとですか。じゃあ、次もちゃんとできていたら会えますか。';
              if (vars.yukiAttached) return 'ほんとですか。じゃあ次に会ったら、外の色をもっと教えてください。';
              return 'ほんとですか。……なら、今は信じることにします。';
            }
          },
          {
            type: 'narration',
            condition: function (vars) { return !canYukiSpeak(vars); },
            text: function (vars) {
              return vars.yukiLiterate || vars.yukiSemiLiterate
                ? 'J-7はあなたの筆跡をじっと見てから、その紙を二つ折りにした。持って行けるものが少ない個体は、嘘でも捨てずにしまう。'
                : 'J-7はあなたの顔をじっと見たあと、その言葉の意味は分からないままでも安心したふりを選んだように頷いた。';
            }
          },
          { type: 'goto', target: 'chapterOneReportRouter' }
        ]
      },
      chapterOneReportRouter: {
        steps: [
          { type: 'set_var', name: 'yukiRoute', value: function (vars) { return getYukiRoute(vars); } },
          { type: 'goto', target: 'yukiReportResearch', condition: 'vars.yukiRoute === "research"' },
          { type: 'goto', target: 'yukiReportLabor', condition: 'vars.yukiRoute === "labor"' },
          { type: 'goto', target: 'yukiReportCare', condition: 'vars.yukiRoute === "care"' },
          { type: 'goto', target: 'yukiReportPet', condition: 'vars.yukiRoute === "pet"' },
          { type: 'goto', target: 'yukiReportMedical' }
        ]
      },
      yukiReportResearch: {
        steps: [
          { type: 'bg', target: 'ending' },
          { type: 'narration', text: function (vars) { return '数週間後、研究棟への仮配属通知に' + displayYukiName(vars) + 'の識別番号を見つけた。正式名はない。あなたが与えた呼び名も、記録には残っていなかった。'; } },
          { type: 'narration', text: '書類の上では、最初から番号しか存在しなかったことになっている。だが実際には、確かに一度だけ、誰かの声で呼ばれていた。消されるのは事実そのものではなく、事実に触れた人間の側だ。' },
          { type: 'narration', text: '通路の向こうで笑い声がした気がして、足を止めた。確かめには行けない。確かめないまま覚えている方が、この施設ではまだ人間らしいのかもしれなかった。' },
          { type: 'goto', target: 'interludeOne' }
        ]
      },
      yukiReportLabor: {
        steps: [
          { type: 'bg', target: 'ending' },
          { type: 'narration', text: '夜間工区への配属報告書には、個体がしばしば空を見上げるため作業効率に影響が出る、とあった。空が見えるところですかと訊いた子への答えとしては、あまりに遅かった。' },
          { type: 'narration', text: 'その一文だけ、妙に人間の癖が混じっていた。効率低下と書きながら、本当は誰かが、何度も空を見てしまう様子を見ていたのだ。見て、それを止められず、最後に報告へ整えた。' },
          { type: 'narration', text: 'その報告を閉じたあとも、あなたはしばらく天井を見た。見えるはずのない空の色だけが、やけに具体的だった。' },
          { type: 'goto', target: 'interludeOne' }
        ]
      },
      yukiReportCare: {
        steps: [
          { type: 'bg', target: 'ending' },
          { type: 'narration', text: function (vars) { return '引き取り先家庭からの定型報告には、' + displayYukiName(vars) + 'は穏やかで、指示理解も早く、感情反応も愛玩的価値が高いと記されていた。褒め言葉の形をしていて、読むほど気分が悪くなった。'; } },
          { type: 'narration', text: '大事にされている、という言い回しが、必ずしも救済を意味しない世界だと知ってしまったあとでは、穏やかという単語ひとつにも棘があった。懐いたこと自体が査定項目になるなら、優しさはもう感情ではなく加工工程に近い。 ' },
          { type: 'narration', text: function (vars) { return vars.promise === 'lie' ? 'また会えると書いた日の筆圧だけが、やけに指に残っていた。' : '覚えていると答えた日の声だけが、勤務後もしばらく耳から離れなかった。'; } },
          { type: 'goto', target: 'interludeOne' }
        ]
      },
      yukiReportPet: {
        steps: [
          { type: 'bg', target: 'ending' },
          { type: 'narration', text: '適応良好。発話教育不要。従順性安定。短い報告書は整っていて、整っているぶんだけ、その中に本人がいなかった。' },
          { type: 'narration', text: '何も喋れないままの方が扱いやすいと、最初に聞かされた。今さらその通りだったと証明されても、正しさではなく空虚さしか残らない。うまく仕上がった、という評価は、ひとつの失敗を別名で呼んでいるだけかもしれなかった。' },
          { type: 'narration', text: '城戸先輩は、こういう書類は早く読めるようになった方が楽だと言った。楽になりたくないと思ったが、読み返す回数だけは減っていた。' },
          { type: 'goto', target: 'interludeOne' }
        ]
      },
      yukiReportMedical: {
        steps: [
          { type: 'bg', target: 'ending' },
          { type: 'narration', text: '返送記録も再配属通知も届かなかった。ただ、しばらくして届いた健康観察報告だけが、ひどく無機質な文面でJ-7の状態を説明していた。' },
          { type: 'narration', text: '消息がないことは、この施設では異常ではない。異常ではないからこそ、想像だけが勝手に増える。声を持ったままだったか、最後まで持てなかったか、どちらの方がましだったのかも分からない。' },
          { type: 'narration', text: '書類の隅に残った数字より、最後にこちらを見ていた視線の方が、ずっと鮮明に残っていた。' },
          { type: 'goto', target: 'interludeOne' }
        ]
      },
      interludeOne: {
        steps: [
          { type: 'bg', target: 'corridor' },
          { type: 'char_show', char: 'kido', position: 'right' },
          { type: 'narration', text: '一ヶ月後。J-7がいた居室には別の個体番号が表示されていた。何もなかったみたいに、次の勤務表が差し込まれている。' },
          { type: 'narration', text: '入れ替わった番号札だけが新しく、扉の開閉音や照明の白さは前と同じだった。場所が同じまま中身だけ差し替わることに、施設は驚くほど慣れている。慣れていないのは、まだこちらだけだった。' },
          { type: 'dialogue', char: 'kido', text: '消息が来ないのは普通だよ。来る方が面倒だから。……慣れてくる。慣れたくないって思ってても、慣れる。' },
          { type: 'narration', text: 'その日の搬入口で、頭を丸く整えられた返還個体がひとり、輸送布の隙間から天井の照明を見上げていた。光を見る角度が、少しだけ見覚えに似ていた。似ていただけかもしれない。' },
          { type: 'char_show', char: 'walter', position: 'left' },
          { type: 'dialogue', char: 'walter', text: '次の配属個体はR-6。標準ロットではありません。返還歴のある記録保持個体です。発話は限定的ですが、記号理解と描画再現性が高い。丁寧に扱えば、良いデータが取れるでしょう。' },
          { type: 'dialogue', char: 'player', text: '記録保持個体……。' },
          { type: 'dialogue', char: 'kido', text: '覚えてる子は、覚えさせられる側もきついよ。まあ、会えばわかる。' },
          { type: 'goto', target: 'chapterTwoIntro' }
        ]
      },
      chapterTwoIntro: {
        steps: [
          { type: 'bg', target: 'briefing' },
          { type: 'clear_chars' },
          { type: 'char_show', char: 'walter', position: 'left' },
          { type: 'char_show', char: 'kido', position: 'right' },
          { type: 'dialogue', char: 'walter', text: 'R-6は発話より先に筆記機能が残存した稀少例です。自発的記録癖があります。情報保持の形が特殊なため、観察価値は高い。' },
          { type: 'dialogue', char: 'kido', text: '要するに、見たものを残す子ってこと。消しても、また書く。うまくやれば従順に見えるけど、中身まで従順とは限らない。' },
          { type: 'dialogue', char: 'player', text: '消されたくないものがあるんでしょうか。' },
          { type: 'dialogue', char: 'kido', text: 'そういう聞き方をすると長持ちしない。けど、そういう聞き方をしなくなったら、たぶんもっとまずい。' },
          { type: 'choice', options: [
            { text: '記録を優先すると決める', goto: 'cultivationRen', setVar: { name: 'renStance', value: 'record' } },
            { text: 'なるべく本人を見ようとする', goto: 'cultivationRen', setVar: { name: 'renStance', value: 'person' } }
          ] }
        ]
      },
      cultivationRen: {
        steps: [
          { type: 'clear_chars' },
          { type: 'cultivation', key: 'renSecondChapter', goto: 'renFarewell' }
        ]
      },
      renFarewell: {
        steps: [
          { type: 'bg', target: 'departure' },
          { type: 'char_show', char: 'ren', position: 'center' },
          {
            type: 'narration',
            text: function (vars) {
              if (canRenSpeak(vars)) {
                return displayRenName(vars) + 'は束ねた紙を一枚ずつ机へ並べていった。居室、廊下、あなたの横顔、監視窓の反射。最後の一枚だけ、裏返したまま差し出してくる。';
              }
              return displayRenName(vars) + 'は束ねた紙を一枚ずつ机へ並べていった。居室、廊下、あなたの横顔、監視窓の反射。最後の一枚だけ、裏返したまま差し出してくる。声の代わりに、渡す順番へ意味を詰めているようだった。';
            }
          },
          {
            type: 'dialogue',
            char: 'ren',
            condition: function (vars) { return canRenSpeak(vars); },
            text: '……向こうに着いてから、見てください。'
          },
          {
            type: 'narration',
            condition: function (vars) { return !canRenSpeak(vars); },
            text: '裏面には、整った字で「むこうに ついてから みて」と書かれていた。'
          },
          { type: 'narration', text: 'ここで開かせないのは、秘密を作りたいからではなく、順番を守りたいからなのだと分かった。R-6にとって記録は、いつ書かれたかだけでなく、いつ読まれるかまで含めて完成するものらしかった。' },
          { type: 'choice', options: [
            { text: '約束どおり後で開くと伝える', goto: 'renGiftPromise', setVar: { name: 'renGiftResponse', value: 'promise' } },
            { text: '今ここで開こうとする', goto: 'renGiftEarly', setVar: { name: 'renGiftResponse', value: 'early' } },
            { text: '受け取るだけで黙る', goto: 'renGiftSilent', setVar: { name: 'renGiftResponse', value: 'silent' } }
          ] }
        ]
      },
      renGiftPromise: {
        steps: [
          { type: 'dialogue', char: 'player', text: '分かった。あとで見る。' },
          {
            type: 'dialogue',
            char: 'ren',
            condition: function (vars) { return canRenSpeak(vars); },
            text: function (vars) {
              return vars.renAttached ? '……その方が、たぶんちゃんと残ります。' : '……はい。';
            }
          },
          {
            type: 'narration',
            condition: function (vars) { return !canRenSpeak(vars); },
            text: 'R-6は小さく頷き、紙束の一番上だけを揃え直した。ほっとしたようにも、少しだけ悲しそうにも見えた。'
          },
          { type: 'goto', target: 'chapterTwoReportRouter' }
        ]
      },
      renGiftEarly: {
        steps: [
          { type: 'dialogue', char: 'player', text: '今、見てもいいか。' },
          {
            type: 'dialogue',
            char: 'ren',
            condition: function (vars) { return canRenSpeak(vars); },
            text: '……まだ、だめです。'
          },
          {
            type: 'narration',
            condition: function (vars) { return !canRenSpeak(vars); },
            text: 'R-6は珍しく強い手つきで紙の端を押さえ、それから「まだ」とだけ書き足した。'
          },
          { type: 'narration', text: 'ここで開くと、たぶん意味が違ってしまうのだろう。あなたは紙を受け取って、結局そのまましまった。' },
          { type: 'goto', target: 'chapterTwoReportRouter' }
        ]
      },
      renGiftSilent: {
        steps: [
          { type: 'dialogue', char: 'player', text: '……。' },
          {
            type: 'dialogue',
            char: 'ren',
            condition: function (vars) { return canRenSpeak(vars); },
            text: '返事、なくても大丈夫です。'
          },
          {
            type: 'narration',
            condition: function (vars) { return !canRenSpeak(vars); },
            text: 'R-6はそれ以上何も求めず、ただ紙束の角だけを丁寧に揃えた。返事がないことにも、もう慣れている手つきだった。'
          },
          { type: 'goto', target: 'chapterTwoReportRouter' }
        ]
      },
      chapterTwoReportRouter: {
        steps: [
          { type: 'set_var', name: 'renRoute', value: function (vars) { return getRenRoute(vars); } },
          { type: 'goto', target: 'renReportResearch', condition: 'vars.renRoute === "research"' },
          { type: 'goto', target: 'renReportEducation', condition: 'vars.renRoute === "education"' },
          { type: 'goto', target: 'renReportCare', condition: 'vars.renRoute === "care"' },
          { type: 'goto', target: 'renReportMedical' }
        ]
      },
      renReportResearch: {
        steps: [
          { type: 'bg', target: 'ending' },
          { type: 'narration', text: '研究棟の白板に、同じ単語が何度も書かれていた。研究員が消す。また書かれる。なぜ。たった二文字が、消される速度だけで施設の仕組みを説明していた。' },
          { type: 'narration', text: '問いの内容より、問いを消す手際の方が洗練されていた。長く続いてきたのは研究ではなく、その消し方の方なのだろうと思った。' },
          { type: 'narration', text: '数日後、差出人空欄の施設内便が届く。折り畳まれた紙を開くと、廊下の窓越しにこちらを見ている自分のシルエットが描かれていた。届け方を見つけたのだと、見るより先に分かった。' },
          { type: 'goto', target: 'interludeTwo' }
        ]
      },
      renReportEducation: {
        steps: [
          { type: 'bg', target: 'ending' },
          { type: 'narration', text: '教育区画の報告では、R-6は図形や配置認識の教材補助として優秀だと記されていた。ただ、子供に「どうして描くの」と聞かれたときだけ、「わかりません」と答えたらしい。' },
          { type: 'narration', text: '理解だけが残って理由が剥がれるなら、それは矯正というより静かな破壊に近かった。役に立つ形へ整えられていく過程で、本人にしか持てなかった中心だけが抜かれていく。' },
          { type: 'narration', text: '覚えるために描いていたはずなのに、覚える理由だけが先に剥がされていく。その報告を読みながら、消去は記憶より意味から始まるのかもしれないと思った。' },
          { type: 'goto', target: 'interludeTwo' }
        ]
      },
      renReportCare: {
        steps: [
          { type: 'bg', target: 'ending' },
          { type: 'narration', text: '家庭配属後の報告では、壁に描かれた家族の肖像が高く評価されていた。だが同じ壁の下層には、家の間取りに重なるように施設の搬送路が描かれていた。気味が悪い、と申し送りにある。' },
          { type: 'narration', text: '居場所を知ろうとする癖は、環境が変わっても消えなかった。安心したかったのか、逃げ道を測っていたのか、あるいはその両方だったのかもしれない。' },
          { type: 'narration', text: '形を知りたかっただけだと書いた子が、最後まで形を重ね続けている。捨てられなかったのは、執着ではなく現在地だったのかもしれない。' },
          { type: 'goto', target: 'interludeTwo' }
        ]
      },
      renReportMedical: {
        steps: [
          { type: 'bg', target: 'ending' },
          { type: 'narration', text: '転出翌日の清掃記録には、壁面落書き除去完了とだけあった。数字を消し、平面図を消し、メモを回収し、それで処理は終わるはずだった。' },
          { type: 'narration', text: '終わるはずだった、という書き方しかできない時点で、たぶん何ひとつ終わっていない。消し忘れではなく、最後まで消し切れなかったのだと考える方が自然だった。' },
          { type: 'narration', text: 'だが高い位置に、一箇所だけ消し残しがあった。小さく、「また会えますか」。声にならなかった問いの方が、最後まで長持ちした。' },
          { type: 'goto', target: 'interludeTwo' }
        ]
      },
      interludeTwo: {
        steps: [
          { type: 'bg', target: 'audit' },
          { type: 'narration', text: '半年が過ぎた。机の上には二通の定型報告が並んでいた。ひとつはJ-7の稼働報告。ひとつはR-6の再査定記録。どちらもよく似た言い回しで、本人の代わりに用途だけを説明している。' },
          { type: 'narration', text: '書類は増えるのに、覚えている顔の方は減らない。処理は進んでいるはずなのに、内部では何も片付かないまま沈殿していく。ここで働くというのは、たぶんそういう種類の蓄積だ。' },
          { type: 'narration', text: '報告を閉じた直後、回収区画のガラス越しに、誰かが曇りへ指で短い線を引くのが見えた。空の欠片にも、簡略化された地図にも見える線だった。近づいたときには、もう何も残っていなかった。' },
          { type: 'char_show', char: 'kido', position: 'right' },
          { type: 'dialogue', char: 'kido', text: '次はアキだよ。施設生まれの補助種。世話をする側に寄せて作られた子。ああいうのを見ると、さすがに少し気分が悪くなる。……少しだけ、だけど。' },
          { type: 'dialogue', char: 'player', text: '少しだけ、ですか。' },
          { type: 'dialogue', char: 'kido', text: 'そのうち分かる。少しだけって言えるうちは、まだ引き返せる気がするから。' },
          { type: 'narration', text: '続ける理由はもう生活だけではなかった。知ってしまったものを、知らなかったことにできないまま、次の扉が開く。' },
          { type: 'narration', text: 'FIRST PART END / CAN WE MEET AGAIN' },
          { type: 'end' }
        ]
      }
    };
  };
})(window);
