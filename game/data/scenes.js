export function buildScenes(playerName) {
  return {
    opening: {
      steps: [
        { type: 'bg', target: 'black', transition: 'none' },
        { type: 'narration', text: '採用通知には「発達支援補助業務」とだけ書かれていた。安定した収入、寮付き、夜勤なし。条件は悪くなかった。' },
        { type: 'narration', text: '施設名は、最後までよく覚えられなかった。ただ、区画番号と個体番号だけはすぐに頭へ入ってきた。' },
        { type: 'bg', target: 'briefing' },
        { type: 'char_show', char: 'kido', position: 'right' },
        { type: 'dialogue', char: 'kido', text: '新任の' + playerName + 'さんですね。最初に言っておきます。ここでは、優しくするより、慣れる方が先です。' },
        { type: 'dialogue', char: 'player', text: '子供の支援が業務だと聞いています。慣れるというのは、どういう意味ですか。' },
        { type: 'dialogue', char: 'kido', text: 'そのうち分かります。分からないまま働く人もいます。そっちの方が長持ちします。' },
        { type: 'char_show', char: 'walter', position: 'left' },
        { type: 'dialogue', char: 'walter', text: '担当員S-91。初回配属個体はJ-7です。質問行動が多く、情動反応は高め。適性観察に向いた対象です。' },
        { type: 'dialogue', char: 'walter', text: '接触の目的は愛着形成ではありません。分類精度の向上です。そこを履き違えなければ、良い勤務になります。' },
        { type: 'choice', options: [
          { text: '「理解しました」と答える', goto: 'firstMeet', setVar: { name: 'resist', value: false } },
          { text: '返答を濁す', goto: 'firstMeet', setVar: { name: 'resist', value: true } }
        ] }
      ]
    },
    firstMeet: {
      steps: [
        { type: 'clear_chars' },
        { type: 'bg', target: 'cell' },
        { type: 'char_show', char: 'yuki', position: 'center' },
        { type: 'dialogue', char: 'yuki', text: '来てくれた。ほんとに来てくれた。今日の担当さんですか。' },
        { type: 'dialogue', char: 'yuki', text: 'わたし、J-7って呼ばれるんですけど、その呼び方、なんだか硬いです。担当さんはどう呼びたいですか。' },
        { type: 'choice', options: [
          { text: '番号のまま呼ぶ', goto: 'nameNumber', setVar: { name: 'namedYuki', value: false } },
          { text: 'ユキと呼ぶ', goto: 'nameYuki', setVar: { name: 'namedYuki', value: true } }
        ] }
      ]
    },
    nameNumber: {
      steps: [
        { type: 'dialogue', char: 'player', text: '記録上はJ-7だ。今日は、そのままでいこう。' },
        { type: 'dialogue', char: 'yuki', text: 'そっか。じゃあJ-7のまま、がんばります。……でも、ここだけの名前があると嬉しいです。' },
        { type: 'goto', target: 'skyTalk' }
      ]
    },
    nameYuki: {
      steps: [
        { type: 'dialogue', char: 'player', text: 'ユキ。そう呼ぶよ。' },
        { type: 'dialogue', char: 'yuki', text: 'ユキ。いい。音がやわらかい。担当さんが最初にくれたものですね。' },
        { type: 'goto', target: 'skyTalk' }
      ]
    },
    skyTalk: {
      steps: [
        { type: 'bg', target: 'light' },
        { type: 'dialogue', char: 'yuki', text: '外って、どんな色ですか。図鑑に空は青いって書いてありました。青って、ここにもありますか。' },
        { type: 'dialogue', char: 'player', text: 'ここには少ない。外には、もっとある。時間で色も変わる。' },
        { type: 'dialogue', char: 'yuki', text: '変わるんだ。なら、飽きないですね。担当さん、飽きないものって好きですか。' },
        { type: 'narration', text: 'ユキは質問するたび、指先で壁をなぞった。爪の跡が、そこだけ白く残っていた。' },
        { type: 'narration', text: '三週目。居室点検の報告書に、壁面への文字刻み込みが追加された。文字列は、担当員識別名。' },
        { type: 'choice', options: [
          { text: '規定通り報告する', goto: 'reportWall', setVar: { name: 'reportedWall', value: true } },
          { text: '記録せず、自分で消す', goto: 'hideWall', setVar: { name: 'reportedWall', value: false } }
        ] }
      ]
    },
    reportWall: {
      steps: [
        { type: 'dialogue', char: 'player', text: '壁には何も書かない方がいい。今回は報告する。' },
        { type: 'dialogue', char: 'yuki', text: 'だめだったんですね。見られたくなかったから、反対向きに書いたのに。' },
        { type: 'dialogue', char: 'yuki', text: '次は、消えるところに書きます。そういう工夫は、悪いことですか。' },
        { type: 'goto', target: 'neighborEvent' }
      ]
    },
    hideWall: {
      steps: [
        { type: 'dialogue', char: 'player', text: '今回は黙っておく。跡は消そう。次からは、見つからない方法を考える前にやめてくれ。' },
        { type: 'dialogue', char: 'yuki', text: '怒ってるのに、助けてくれるんですね。担当さんって、むずかしいです。' },
        { type: 'dialogue', char: 'yuki', text: 'でも、少しうれしい。秘密を知ってる人が増えたみたいだから。' },
        { type: 'goto', target: 'neighborEvent' }
      ]
    },
    neighborEvent: {
      steps: [
        { type: 'bg', target: 'corridor' },
        { type: 'narration', text: '七週目の夜。隣区画で、金属台車の音が長く続いた。翌朝、その居室は空だった。' },
        { type: 'char_show', char: 'yuki', position: 'center' },
        { type: 'dialogue', char: 'yuki', text: '昨日の子、どこに行ったんですか。泣いてた気がして、眠れませんでした。' },
        { type: 'choice', options: [
          { text: '新しい場所へ行ったと答える', goto: 'neighborLie', setVar: { name: 'toldTruth', value: false } },
          { text: '自分にも分からないと答える', goto: 'neighborUnknown', setVar: { name: 'toldTruth', value: false } },
          { text: 'ここからいなくなった、とだけ言う', goto: 'neighborHarsh', setVar: { name: 'toldTruth', value: true } }
        ] }
      ]
    },
    neighborLie: {
      steps: [
        { type: 'dialogue', char: 'player', text: '新しい場所だ。たぶん、ここより広い。' },
        { type: 'dialogue', char: 'yuki', text: '広いところ。じゃあ、怖くないならいいです。……ほんとなら。' },
        { type: 'goto', target: 'auditPrep' }
      ]
    },
    neighborUnknown: {
      steps: [
        { type: 'dialogue', char: 'player', text: '分からない。聞かされていない。' },
        { type: 'dialogue', char: 'yuki', text: '分からないこと、担当さんにもあるんですね。少しだけ安心しました。' },
        { type: 'goto', target: 'auditPrep' }
      ]
    },
    neighborHarsh: {
      steps: [
        { type: 'dialogue', char: 'player', text: 'ここからいなくなった。それ以上は、言えない。' },
        { type: 'dialogue', char: 'yuki', text: 'そういう言い方、さびしいです。人って、場所みたいに消えるんですね。' },
        { type: 'goto', target: 'auditPrep' }
      ]
    },
    auditPrep: {
      steps: [
        { type: 'char_show', char: 'kido', position: 'right' },
        { type: 'dialogue', char: 'kido', text: '査定員が来る。口を挟むな。質問が多い個体は、答えさせるだけで減点になる。' },
        { type: 'dialogue', char: 'player', text: '質問すること自体が悪いように聞こえます。' },
        { type: 'dialogue', char: 'kido', text: '悪いんじゃない。金になりにくいだけだ。ここでは、それが似た意味になる。' },
        { type: 'goto', target: 'auditScene' }
      ]
    },
    auditScene: {
      steps: [
        { type: 'bg', target: 'audit' },
        { type: 'char_show', char: 'walter', position: 'left' },
        { type: 'char_show', char: 'yuki', position: 'center' },
        { type: 'dialogue', char: 'walter', text: '個体J-7。質問行動を再現してください。観察対象の自主性も評価項目です。' },
        { type: 'dialogue', char: 'yuki', text: 'えっと。空はどうして青いんですか。植物は動けないのに、どうして太陽が好きなんですか。' },
        { type: 'dialogue', char: 'walter', text: '過剰。制御難。情動寄り。研究か教育か、再検討が必要です。' },
        { type: 'choice', options: [
          { text: '沈黙する', goto: 'auditSilent', setVar: { name: 'spokeUp', value: false } },
          { text: '質問の価値を口にする', goto: 'auditSpeak', setVar: { name: 'spokeUp', value: true } }
        ] }
      ]
    },
    auditSilent: {
      steps: [
        { type: 'dialogue', char: 'player', text: '……。' },
        { type: 'narration', text: '何も言わない方が、記録上の傷は少ない。それでも沈黙は、喉に薄い鉄片を残した。' },
        { type: 'goto', target: 'farewell' }
      ]
    },
    auditSpeak: {
      steps: [
        { type: 'dialogue', char: 'player', text: '質問できることは、欠陥ではありません。観察する側が面倒だから切り捨てているだけです。' },
        { type: 'dialogue', char: 'walter', text: '担当員S-91。発言を記録します。評価会議の対象はあなたではありません。' },
        { type: 'narration', text: '城戸先輩は何も言わなかった。ただ、目だけが一度こちらを見た。止めるためでも、褒めるためでもない視線だった。' },
        { type: 'goto', target: 'farewell' }
      ]
    },
    farewell: {
      steps: [
        { type: 'clear_chars' },
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
    promiseMemory: {
      steps: [
        { type: 'dialogue', char: 'player', text: '覚えている。たぶん、ずっと。' },
        { type: 'dialogue', char: 'yuki', text: 'それならいいです。会えなくても、消えない方法がひとつ増えるから。' },
        { type: 'goto', target: 'endingRouter' }
      ]
    },
    promiseSilence: {
      steps: [
        { type: 'dialogue', char: 'player', text: '……。' },
        { type: 'dialogue', char: 'yuki', text: '困らせましたよね。ごめんなさい。でも、聞いてみたかったんです。' },
        { type: 'goto', target: 'endingRouter' }
      ]
    },
    promiseLie: {
      steps: [
        { type: 'dialogue', char: 'player', text: 'また会える。だから、今は心配しなくていい。' },
        { type: 'dialogue', char: 'yuki', text: 'ほんとですか。じゃあ次に会ったら、外の色をもっと教えてください。' },
        { type: 'goto', target: 'endingRouter' }
      ]
    },
    endingRouter: {
      steps: [
        { type: 'goto', target: 'endingDefiance', condition: 'vars.namedYuki && !vars.reportedWall && vars.spokeUp && vars.promise === "memory"' },
        { type: 'goto', target: 'endingLie', condition: 'vars.promise === "lie"' },
        { type: 'goto', target: 'endingDetached', condition: '!vars.namedYuki && vars.reportedWall && !vars.spokeUp' },
        { type: 'goto', target: 'endingQuiet' }
      ]
    },
    endingDefiance: {
      steps: [
        { type: 'bg', target: 'ending' },
        { type: 'narration', text: '数ヶ月後。研究棟への仮配属通知に、J-7の識別番号を見つけた。正式名はない。あなたが与えた呼び名も、記録には残っていなかった。' },
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
}
