// グループ参加時の処理を行うコード

// グループ参加時の通知
function joinGroup(events) {
  var message = 
    "始めまして,記録用botです.\n"+
    "このグループの会話内容をGoogleスプレッドシート上に保存することができます.\n\n"+
    "特定の単語で設定の確認，変更を行います．\n"+
    "reset：保存先URLの初期化\n"+
    "name：保存先URLの確認\n\n"+
    "外部から編集可能な保存用スプレッドシートのURLを教えてください."
  replyMessage(events, message)
}