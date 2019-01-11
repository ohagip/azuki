Frontend Starter Kit
====================

- node.js >= 10.15.0
- npm >= 6.4.1

## Setup
```
npm install
npm run dev
npm start
```

## Scripts
- `start` 開発開始（監視）
- `dev` ビルド（開発）
- `stag` ビルド（ステージング）
- `prod` ビルド（本番）
- `doc` ドキュメント（Style Guide, JSDoc、開発）
- `doc-stag` ドキュメント（ステージング用にディレクトリを変えるだけ）
- `doc-prod` ドキュメント（本番用にディレクトリを変えるだけ）
- `doc-watch` ドキュメント（ローカルサーバがたつ）
- `lint` ソースチェック（※Style Guide用のコメントブロックがエラーになります><）
- `iconFont` フォント作成
- `svgSprite` SVGスプライト作成
- `sharePage` シェア用ダミーページ作成
- `data` ページ作成用のjsonデータをGoogleスプレッドシートから作成

## Style design
[FLOCSS](https://github.com/hiloki/flocss)をベースに設計しています。  
Block、Element、Modifierはそれぞれ`_`、`-`で接続します。
```
Block_Element
Block_Element-Modifier
```
独自ルールとして各ページでのみ使用するstyleについては  
プレフィックスをつけず各ページclassのセレクタを用います。
```
.page-id {
  .title {}
}
```

### Style Guide
[aigis](https://github.com/aigis-styleguide/aigis)を使用しています。   
ローカルサーバ起動時は`${contentPath}/doc/styleguide/`で確認できます。
※Sass Lintでエラーが発生するため、コンポーネントの設定ブロック  
（`---`）の最後に半角スペースを入れてください。

    /*
    --- <- (ココと)
    name: sample
    category:
      - component
      - component/sample
    tag:
      - sample
    fullWidth: true <- (オリジナル、プレビューを画面幅に広げる) 
    --- <- (ココ)
    
    ```html
    <div class="c-sample"></div>
    ```
    */

## JavaScript design
ES2016をベースとします。  
ライブラリはWebpackに含めず`libs.js`にまとめます。  
まとめるライブラリは`config.js`の`paths.script.libs`で設定します。  
ビルド時、Prettierによりコードを整形します。

## JavaScript document
[JSDoc 3](https://github.com/jsdoc3/jsdoc)を使用しています。  
ローカルサーバ起動時は`${contentPath}/doc/jsdoc/`で確認できます。

## Mock
APIや画像のダミーは`/src/mock/`以下を利用します。  
（ビルドファイルに不要なファイルを含めないようにするためです。）  
`/dummy/`以下をリクエストした場合`/src/mock/assets/`以下がレスポンスされます。  
`/api/`以下をリクエストした場合`/src/mock/apiServer.js`で設定した内容がレスポンスされます。

## Static file
`.htaccess`など静的ファイルは`/src/static/`以下へ保存します。  
`/src/static/`以下はディレクトリごと`/dist/`へコピーされます。

## iconFont
SVGファイルを`/src/iconFont/`へ格納しコマンドを実行すると、Staticフォルダにフォントファイルが出力されます。

## SVG sprite image
SVGファイルは`/src/svgSprite/`へ格納しコマンドを実行すると、srcフォルダにsvgとscssファイルが出力されます。

## Share page
シェアに利用するリダイレクトするだけのページを作成します。
テンプレートファイルは`/src/views/parts/_shareTemplate.ejs`です。
設定ファイルは`/src/views/_share_page_list.js`です。

### data script
以下の手順で事前にGoogle Sheets APIを利用可能にしてください。（初回のみ）

1. [Google Developers Console](https://console.developers.google.com/flows/enableapi?apiid=sheets.googleapis.com&hl=ja)へアクセスしプロジェクトを作成を選択し 「続行」とクリックします。  
2. 「プロジェクトへの認証情報の追加」ページで、使用するAPI（Google Sheets API）、APIを呼び出す場所（その他のUI CLIツールなど）、アクセスするデータの種類（ユーザーデータ）を選択し、「必要な認証情報」をクリックします。
3. 「OAuth2.0クライアントIDを作成する」で、任意の名前を入力し、「OAuthクライアントIDを作成」をクリックします。
4. 「OAuth 2.0 同意画面を設定する」で、「メールアドレス」を自身のGoogleアカウント、「ユーザーに表示するサービス名」を任意（**ページ作成用など）に入力し「次へ」をクリックします。
5. 「認証情報をダウンロードする」で、ダウンロードをクリックしJSONファイルをダウンロードし、「完了」をクリックします。。
6. ダウンロードしたJSONファイルを`./src/data/client_id.json`へ保存します。
7. コマンド`npm run data`を実行します。
8. CLIに「Authorize this app by visiting this url:: ...」と表示されるのでアクセスし、アカウントを選択後、「許可」をクリックします。  
   表示されるコードをCLIへ入力してください。入力後`./src/data/credentials.json`ファイルが作成されます。

[Node.js Quickstart | Sheets API](https://developers.google.com/sheets/api/quickstart/nodejs?hl=ja)
