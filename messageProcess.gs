// メッセージの取得と記録を行うコード

// メッセージの記録
function recordMessage(lineEvents, sheet, arr){
  // 表示名の挿入
  arr.unshift(lineEvents.displayName);
  // タイムスタンプから時刻を作成
  arr.unshift(new Date(lineEvents.timestamp));

  // シートの最下部に配列を転記
  try{
    sheet.appendRow(arr);
  }catch(e){
    replyErrorMessage(lineEvents, e)
  }
}

// 保存先のリセットと確認
function setProperty(lineEvents, command){
  switch (command){
    case 'reset':
      PropertiesService.getUserProperties().setProperty(getSheetKey(lineEvents), '0');

      var message = 
      '保存先URLをリセットします\n'+
      '変更後の保存先URLを教えてください.'
      replyMessage(lineEvents, message)
      break
    
    case 'name':
      var sheetURL = getSheetUrl(lineEvents)
      var name = SpreadsheetApp.openByUrl(sheetURL).getName()

      var message = "保存先 : " + String(name) + '\n' + sheetURL
      replyMessage(lineEvents, message)
      break
  }
}


// メッセージの整形
function formatMessage(message){
  // 空白・タブ・改行で区切り配列に変換
  // 先頭の空白を削除
  message = message.trim();

  // 改行，空白で文字列を分割
  return message.split(/\s/)
}










