// メインコード
// LINEのイベントを取得
function doPost(e){
  const events = JSON.parse(e.postData.contents).events[0]

  // ポスト内容による分岐
  switch (events.type){
    case "join":
      // グループに参加した場合
      joinGroup(events);  
      break;

    case "message":
      // メッセージの投稿の場合
      const lineEvents = lineEvent(e) // イベントを取得
      const messageArr = formatMessage(lineEvents.message.text);  // メッセージの取得
      const sheetURL = getSheetUrl(lineEvents)

      // sheetURLの有無
      if(sheetURL == null | sheetURL == "0"){
        // 指定がない場合
        if(isSpreadSheetURL(messageArr[0])){
          // URLが入力されている場合
          registerSheetId(lineEvents, messageArr[0])// URL登録
        }else{
          message = 
            "保存先スプレッドシートが指定されていません.\n"+
            "保存先のURLを教えてください."
          replyMessage(lineEvents, message)
        }
        break
        
      }else{
        // 指定されている場合
        if(isAvailableSpreadSheet(lineEvents, sheetURL)){
          // スプレッドシートが利用できる場合
          var spreadsheet = SpreadsheetApp.openByUrl(sheetURL);
          // 対象シートの存在確認，なければ作成
          var sheet = openSheet(lineEvents, spreadsheet);

        }else{
          // 利用できない場合
          break
        }
      }

      setProperty(lineEvents, messageArr[0])// メッセージ内容分岐
      recordMessage(lineEvents, sheet, messageArr);// メッセージの場合記録
      break;
  }
}