/**
 * Slackに通知するボタン押下時の動作
 * 指定されたNo のテーマ内容を Slack に通知する
 */
function postToSlack() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const no = sheet.getRange('I3').getValue();
  const row_no = findRow(sheet, no, 1, 4);
  if (row_no == -1) {
    SpreadsheetApp.getUi().alert("指定されたテーマNoは見つかりませんでした。");
    return;
  }
  
  // 通知する情報を取得
  const title = getTitle(row_no);
  if (title == "") {
    SpreadsheetApp.getUi().alert("概要を入力してください。");
    return;
  }
  const url = getUrl(row_no);
  const representative = getRepresentative(row_no);
  const application_period = getApplicationPeriod(row_no)
  const period = getPeriod(row_no);
  // 通知の中身を作成
  const payload = {
    "channel": PropertiesService.getScriptProperties().getProperty('CHANNEL_ID'),
    "blocks" : [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "チームメンバー募集しています！\n*<" + url + "|" + title + ">*"
        }
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "*代表者:*\n" + representative
          },
          {
            "type": "mrkdwn",
            "text": "*チーム募集期間:*\n" + application_period
          },
          {
            "type": "mrkdwn",
            "text": "*期限・開催日:*\n" + period
          }
        ]
      }
    ]
  };
  // 送信する
  const result = send(payload);
  if (result.ok) {
    SpreadsheetApp.getUi().alert("Slackに通知を送信しました。");
  } else {
    SpreadsheetApp.getUi().alert("エラーが発生しました。: " + content.error);
  }
  
}

/**
 * 検索対象の値がある行を返す
 * @param {Spreadsheet} sheet 検索対象のシート
 * @param {integer} val 検索対象の値
 * @param {integer} col 検索対象の列
 * @param {integer} row 検索開始行
 * @return {integer} 検索対象の値がある行。見つからなければ -1。
 */
function findRow(sheet,val,col,row){
  const dat = sheet.getDataRange().getValues();
  const min_row = row - 1;
  for(var i=min_row;i<dat.length;i++){
    if(dat[i][col-1] === val){
      return i+1;
    }
  }
  return -1;
}

/**
 * 概要を取得する
 * @param {integer} row_no 取得する行番号
 * @return {Object} 概要セルの内容。取得できなければ空文字。
 */
function getTitle(row_no) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    return sheet.getRange('B' + row_no).getValue();
  } catch (e) {
    return "";
  }
}

/**
 * URLを取得する
 * @param {integer} row_no 取得する行番号
 * @return {string} URL。取得できなければスクリプトのプロパティに設定してあるURL。
 */
function getUrl(row_no) {
  try {
     const sheet = SpreadsheetApp.getActiveSheet();
     var url = sheet.getRange('C' + row_no).getValue();
     if (url == "") {
       url = PropertiesService.getScriptProperties().getProperty('ALTERNATIVE_URL');
     }
     return url;
  } catch (e) {
    // ハイパーリンクが取得できなかった場合は代替URLを返す
    return PropertiesService.getScriptProperties().getProperty('ALTERNATIVE_URL');
  }
}

/**
 * 代表者を取得する
 * @param {integer} row_no 取得する行番号
 * @return {Object} 代表者セルの内容。取得できなければ空文字。
 */
function getRepresentative(row_no) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    return sheet.getRange('D' + row_no).getValue();
  } catch (e) {
    return "";
  }
  
}

/**
 * チーム募集期間を取得する
 * @param {integer} row_no 取得する行番号
 * @return {Object} チーム募集期間セルの内容。取得できなければ空文字。
 */
function getApplicationPeriod(row_no) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const application_period =sheet.getRange('E' + row_no).getValue();
    return Utilities.formatDate(application_period, 'Asia/Tokyo', 'yyyy/MM/dd EE');
  } catch (e) {
    return "";
  }
}

/**
 * 期限・開催日を取得する
 * @param {integer} row_no 取得する行番号
 * @return {Object} 期限・開催日セルの内容。取得できなければ空文字。
 */
function getPeriod(row_no) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const period = sheet.getRange('F' + row_no).getValue();
    return Utilities.formatDate(period, 'Asia/Tokyo', 'yyyy/MM/dd EE');
  } catch (e) {
    return "";
  }
}

/**
 * Slack に送信する
 * @param {JSON} payload 送信内容
 * @return {JSON} 送信結果
 */
function send(payload) {
  const headers = {
    'Authorization': 'Bearer '+ PropertiesService.getScriptProperties().getProperty('BOT_USER_OAUTH_ACCESS_TOKEN')
  };
  const options = {
    "method" : "POST",
    'contentType': 'application/json; charset=UTF-8',
    "headers": headers,
    "payload" : JSON.stringify(payload)
  }
  // 送信する
  const response = UrlFetchApp.fetch("https://slack.com/api/chat.postMessage", options);
  return JSON.parse(response.getContentText("UTF-8"));
}