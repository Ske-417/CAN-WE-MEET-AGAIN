# Character Sprites

立ち絵を入れるときはこのフォルダ配下にキャラクターごとのディレクトリを切って置く想定です。

例:

- `assets/characters/yuki/default.png`
- `assets/characters/yuki/smile.png`
- `assets/characters/kido/default.png`

`game/data/characters.js` の `sprites` にパスを追加すると、`VN-Engine.js` はシルエットではなく画像を表示します。

全体の画像管理は [assets/IMAGE_TODO.md](../IMAGE_TODO.md) を参照。
