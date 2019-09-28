# 概要
Googleスプレッドシートからチーム募集情報を読み取り Slack に通知する bot

# Bot の作成

https://api.slack.com/apps

にアクセスしアプリを作成します。

アプリの設定では Add features and functionality で Bots を有効にします。

その後 Install your app to your workspace でアプリをワークスペースにインストールします。

次にアプリの設定画面に戻り、 Add features and functionality で Permissions を見て、Bot User OAuth Access Token をメモしておきます。

# Bot で通知する設定
Google スプレッドシートを開き、ツール > スクリプトエディタ でスクリプトエディタを開きます。

スクリプトエディタで ファイル > プロジェクトのプロパティ を選択し、スクリプトのプロパティタブに下記のプロパティを設定します。

| プロパティ名 | 内容 | 備考 |
| --- | --- | --- |
| CHANNEL_ID | bot で通知したいチャンネルのID | ブラウザで Slack のワークスペースにアクセスし、通知したいチャンネルを開くとURLの末尾がチャンネルID | 
| BOT_USER_OAUTH_ACCESS_TOKEN | Slack で Bot を作ったとき発行されるBot User OAuth Access Token | OAuth Access Token と間違わないように注意 |
| ALTERNATIVE_URL | URL が書いてあるべきセルに何も書いていなかった場合に代わりに設定するURL | たとえばスプレッドシートのURL |

設定が終わったらスクリプトエディタに `bot.gs` を貼り付け、スプレッドシートの内容に合わせて中身を調節します。

最後にスプレッドシートに戻り、挿入 > 図形描画 でボタンになる図形を作成します。

図形を右クリックして「スクリプトを割り当て」を選択し、postToSlack と入力してください。

これでボタンをクリックすると postToSlack の関数が実行され、Slack に通知できるようになります。