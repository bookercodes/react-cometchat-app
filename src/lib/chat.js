import { CometChat } from "@cometchat-pro/chat";


export default class CCManager {
  static cometchat = null;
  static LISTENER_KEY_MESSAGE = "msglistener";

  static appId = '1395138329277';     //Enter your App ID
  static apiKey = '59802d7162a931126d875da1dbe02597e323efa1';    //Enter your API KEY
  static LISTENER_KEY_GROUP = "grouplistener";


  static init() {
    //initialize cometchat manager
    return CometChat.init(CCManager.appId);
  }

  static getTextMessage(uid, text, msgType) {
    if (msgType === "user") {
      return new CometChat.TextMessage(uid, text, CometChat.MESSAGE_TYPE.TEXT, CometChat.RECEIVER_TYPE.USER);
    } else {
      return new CometChat.TextMessage(uid, text, CometChat.MESSAGE_TYPE.TEXT, CometChat.RECEIVER_TYPE.GROUP);
    }
  }

  static getLoggedinUser() {
    return CometChat.getLoggedinUser()
  }

  static login(UID) {
    return CometChat.init(CCManager.appId).then(user => {
      return CometChat.login(UID, this.apiKey)
    })
  }


  static getGroupMessages(GUID, callback, limit = 30) {
    const messagesRequest = new CometChat.MessagesRequestBuilder()
      .setGUID(GUID)
      .setLimit(limit)
      .build();

    callback();

    return messagesRequest.fetchPrevious()
  }

  static sendGroupMessage(UID, message) {
    const textMessage = this.getTextMessage(UID, message, 'group')
    return CometChat.sendMessage(textMessage)
  }


  static joinGroup(GUID) {
    return CometChat.joinGroup(GUID, CometChat.GROUP_TYPE.PUBLIC, '')
  }

  static addMessageListener(callback){
    CometChat.addMessageListener(
      this.LISTENER_KEY_MESSAGE,
      new CometChat.MessageListener({
        onTextMessageReceived: textMessage => {
          callback(textMessage)
        },
        onMediaMessageReceived: mediaMessage => {
          console.log("Media message received successfully", mediaMessage);
          // Handle media message
        }
      })
    );
  }

}
