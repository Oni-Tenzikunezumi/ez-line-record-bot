// スプレッドシートを扱うコード．

// 指定されたURLからスプレッドシートを取得し，利用可能な場合は登録する．
function registerSheetId(lineEvents, url){
  // 利用可能かの確認
  if(!isAvailableSpreadSheet(lineEvents, url)){
    return;
  }

  // エラーがなければURLを設定
  PropertiesService.getUserProperties().setProperty(getSheetKey(lineEvents), url);

  var name = SpreadsheetApp.openByUrl(url).getName()
  var message = 
    "ファイル名「" + name + "」\n"+
    "を保存先として設定しました．"
  replyMessage(lineEvents, message)
}

// 指定したURLが利用できるスプレッドシートのものかを確認する．
// 利用できない場合はそのエラー内容を返信する．
function isAvailableSpreadSheet(lineEvents, url){
  // スプレッドシートの取得
  try{
    var spreadsheet = SpreadsheetApp.openByUrl(url);

  }catch(e){
    replyErrorMessage(lineEvents, e)
    return false;
  }

  return true;
}

// spreadsheet操作時のエラーをメッセージとして送信する．
function replyErrorMessage(lineEvents, e){
  switch(e.message){
    case 'リクエストされたドキュメントにアクセスする権限がありません。':
      var message = 
        "スプレッドシートが共有されていません.\n"+
        "スプレッドシートの共有設定を「リンクを知っている全員」,\n"+
        "役割を「編集者」に変更してください."
      replyMessage(lineEvents, message)
      break

    default:
      var message = 
        "指定されたURLを読み込むことができませんでした."+
        "スプレッドシートの設定,URLを確認してください."
      replyMessage(lineEvents, message)
      break
  }
}

// eventの発生したグループ用のシートを読み込む.
// シートがなければ作成する.
function openSheet(lineEvents, spreadsheet){
  var groupName = lineEvents.groupName
  var groupId = lineEvents.source.groupId
  var sheetName = groupName + "_" + groupId
  var sheet = spreadsheet.getSheetByName(sheetName);

  // シートの存在確認
  if(sheet == null){
    try{
      // なければ追加と名前の設定
      sheet = spreadsheet.insertSheet();
      sheet.setName(sheetName);

      // 最初の行を追加
      sheet.appendRow(["Group Name:", groupName, "Group ID:", String(groupId)])
      sheet.appendRow(["Date", "Display name", "Message"])

    }catch(e){
      replyErrorMessage(e)
      return;
    }
    
  }

  return sheet;
}

// urlがスプレッドシートのものかを判定する.
function isSpreadSheetURL(url){
  const spreadsheetsUrl = 'https://docs.google.com/spreadsheets'

  return !url.indexOf(spreadsheetsUrl)
}
