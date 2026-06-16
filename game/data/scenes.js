(function (global) {
  function displayName(vars) {
    return vars.namedYuki ? (vars.yukiName || 'ユキ') : 'J-7';
  }

  function canSpeak(vars) {
    return !!vars.yukiCanSpeak;
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
          { type: 'dialogue', char: 'yuki', text: 'もうすぐ、ここを出るって聞きました。空が見えるところですか。' },
          { type: 'dialogue', char: 'player', text: '……。' },
          { type: 'dialogue', char: 'yuki', text: '最初に来てくれた日のこと、ずっと覚えていたいです。担当さんも覚えていてくれますか。' },
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
          { type: 'narration', text: '最後の面談で、J-7は膝の上のメモ用紙を何度も折り直していた。紙の端は湿って、もう少しで破れそうだった。' },
          { type: 'narration', text: function (vars) { return '差し出された紙には、拙い字で「' + displayName(vars) + ' おぼえて くれる」とあった。'; } },
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
          {
            type: 'dialogue',
            char: 'yuki',
            condition: function (vars) { return canSpeak(vars); },
            text: 'それならいいです。会えなくても、消えない方法がひとつ増えるから。'
          },
          {
            type: 'narration',
            condition: function (vars) { return !canSpeak(vars); },
            text: 'J-7は紙を胸元で握りしめ、それから小さく頷いた。声がなくても、安堵の形だけは分かった。'
          },
          { type: 'goto', target: 'endingRouter' }
        ]
      },
      promiseSilence: {
        steps: [
          { type: 'dialogue', char: 'player', text: '……。' },
          {
            type: 'dialogue',
            char: 'yuki',
            condition: function (vars) { return canSpeak(vars); },
            text: '困らせましたよね。ごめんなさい。でも、聞いてみたかったんです。'
          },
          {
            type: 'narration',
            condition: function (vars) { return !canSpeak(vars); },
            text: 'J-7は紙を裏返し、何も書かないまま膝に戻した。書けることより、書けないことの方が多い顔だった。'
          },
          { type: 'goto', target: 'endingRouter' }
        ]
      },
      promiseLie: {
        steps: [
          { type: 'dialogue', char: 'player', text: 'また会える。だから、今は心配しなくていい。' },
          {
            type: 'dialogue',
            char: 'yuki',
            condition: function (vars) { return canSpeak(vars); },
            text: 'ほんとですか。じゃあ次に会ったら、外の色をもっと教えてください。'
          },
          {
            type: 'narration',
            condition: function (vars) { return !canSpeak(vars); },
            text: 'J-7はあなたの筆跡をじっと見てから、その紙を二つ折りにした。持って行けるものが少ない個体は、嘘でも捨てずにしまう。'
          },
          { type: 'goto', target: 'endingRouter' }
        ]
      },
      endingRouter: {
        steps: [
          { type: 'goto', target: 'endingDefiance', condition: 'vars.namedYuki && vars.reportedWall === false && vars.spokeUp === true && vars.promise === "memory"' },
          { type: 'goto', target: 'endingLie', condition: 'vars.promise === "lie"' },
          { type: 'goto', target: 'endingDetached', condition: '!vars.namedYuki && vars.reportedWall === true && vars.spokeUp === false' },
          { type: 'goto', target: 'endingQuiet' }
        ]
      },
      endingDefiance: {
        steps: [
          { type: 'bg', target: 'ending' },
          { type: 'narration', text: function (vars) { return '数ヶ月後。研究棟への仮配属通知に、' + displayName(vars) + 'の識別番号を見つけた。正式名はない。あなたが与えた呼び名も、記録には残っていなかった。'; } },
          { type: 'narration', text: 'それでも、壁の向こうから微かな笑い声が聞こえた瞬間、あなたは立ち止まった。覚えていると答えた責任だけが、まだ剥がれない。' },
          { type: 'narration', text: 'END 01 / REMEMBER HER NAME' },
          { type: 'end' }
        ]
      },
      endingLie: {
        steps: [
          { type: 'bg', target: 'ending' },
          { type: 'narration', text: '配属先報告書は三ヶ月後に届いた。適応良好。質問傾向は抑制済み。文面は整っていて、読めば読むほど、人が減っていく形式だった。' },
          { type: 'narration', text: 'また会えると言った日から、あなたは廊下で足音を聞くたびに顔を上げる癖がついた。一度も、その約束は回収されない。' },
          { type: 'narration', text: 'END 02 / PROMISE YOU KNEW WAS FALSE' },
          { type: 'end' }
        ]
      },
      endingDetached: {
        steps: [
          { type: 'bg', target: 'ending' },
          { type: 'narration', text: 'J-7の記録は、標準範囲に収束した。違反報告は適切、査定時の態度も問題なし。あなたの勤務成績は良好と評価された。' },
          { type: 'narration', text: '帰路で城戸先輩が言う。慣れると楽ですよ。あなたは否定できなかった。楽になったのか、削れただけなのか、判別できないまま。' },
          { type: 'narration', text: 'END 03 / NORMALIZED' },
          { type: 'end' }
        ]
      },
      endingQuiet: {
        steps: [
          { type: 'bg', target: 'ending' },
          { type: 'narration', text: '報告書にも記憶にも、決定打は残らなかった。ただ一つ、最後の問いだけが処理できないデータとして残る。' },
          { type: 'narration', text: 'また会えますか。答えられなかった言葉は、勤務終了後もしばらく、あなたの中でだけ再生を続けた。' },
          { type: 'narration', text: 'END 04 / UNANSWERED' },
          { type: 'end' }
        ]
      }
    };
  };
})(window);
