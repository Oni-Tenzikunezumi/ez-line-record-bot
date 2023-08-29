// line側に対して処理を行う

// チャネルアクセストークンの取得
function getToken(){
  // スクリプトプロパティにトークンを設定する．
  return PropertiesService.getScriptProperties().getProperty("token");
}

// グループ名，表示名を取得し，オブジェクトにまとめる．
function lineEvent(e) {
  // LINEから取得したイベントをjsonとして取得
  const events = JSON.parse(e.postData.contents).events[0]

  // チャネルアクセストークン
  const token = getToken();

  var groupId = events.source.groupId;
  var endPoint = "https://api.line.me/v2/bot/group/" + groupId;
  //var endPoint = "https://api.line.me/v2/bot/profile/" + userId // 個人チャット用
  var param = {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + token,
    },
    method: "GET",
  };

    // グループ名取得
  var json = UrlFetchApp.fetch(endPoint + "/summary", param);
  events.groupName = JSON.parse(json).groupName;

    // 表示名取得，挿入
  var userId = events.source.userId;
  var json = UrlFetchApp.fetch(endPoint + "/member/" + userId, param);
  events.displayName = JSON.parse(json).displayName;

  return events
}

// メッセージの送信
function replyMessage(lineEvents, messages){

  // チャネルアクセストークン
  const token = getToken()

  var endPoint = 'https://api.line.me/v2/bot/message/reply'
  var replyToken = lineEvents.replyToken

  var payload = JSON.stringify({
    'replyToken': replyToken,
    'messages': [
      {
        'type': "text",
        'text': messages
      }
    ]
  })
  var param = {
    method: "post",
    'payload': payload,
    'headers': {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + token,
    }
  }

  var json = UrlFetchApp.fetch(endPoint, param);
}

// URL取得用のkeyの作成
function getSheetKey(lineEvents){
  return 'url_' + lineEvents.source.groupId  // 保存先シートIDの取得
}

// 保存用URLの取得
function getSheetUrl(lineEvents){
  // ユーザープロパティ
  return PropertiesService.getUserProperties().getProperty(getSheetKey(lineEvents))
}