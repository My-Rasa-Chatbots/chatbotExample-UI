// const initial_action_name = "action_initial_greet";
// const rasa_server_url = "https://rasa-actions-server-keshabmanni.cloud.okteto.net";
const rasa_server_url = "http://localhost:5005/webhooks/rest/webhook";
const botAvatar_img_src = "./Static/img/botAvatar.jpg";
const userAvatar_img_src = "./static/img/userAvatar.jpg";

var welcome_text = `<div id="initial_welcome_info">
<span>Welcome to Marlabs Website.</span>
<span>I'm mChat</span>
<span>How can I help you today with your queries?</span>
</div>`

// const sender_id = uuidv4();
var sender_id = "";
function setChatClient() {
    sender_id = uuidv4();
    removeLocalStorage();
    startLocalStorage();
}

// start local storage with sender_id
function startLocalStorage() {
    var message = {
        "sender_id": sender_id,
        "conversation": [
        ]
    }
    localStorage.setItem("user_session", JSON.stringify(message));
}

// add conversation to local storage
function storeConversation(newMessage, type, sender_id) {
    if (type == "user") {
        if (newMessage.search("/") >= 0) {
            newMessage = ""
        }
        else {
            newMessage = JSON.parse(`{"text":"${newMessage}", "type":"userMessage"}`);
        }
    }
    else {
        // newMessage = { ...newMessage, type: "botMessage"};
    }
    if (newMessage) {
        // console.log("msg:"+JSON.stringify(newMessage));
        // console.log("typ:"+typeof(newMessage));
        var storage = localStorage.getItem("user_session")
        var parsedStorage = JSON.parse(storage);
        var oldConversations = parsedStorage.conversation;
        oldConversations.push(newMessage);
        var message = {
            "sender_id": sender_id,
            "conversation": oldConversations
        }
        localStorage.setItem("user_session", JSON.stringify(message));
    }
}

// remove local storage session
function removeLocalStorage() {
    localStorage.removeItem("user_session");
}

// clear conversations only
function clearConversations() {
    var message = {
        "sender_id": sender_id,
        "conversation": []
    }
    localStorage.setItem("user_session", JSON.stringify(message));
}

// Load Chats from loacl storage and render
function loadPreviousChats() {
    var storage = localStorage.getItem("user_session")
    var parsedStorage = JSON.parse(storage);
    var allConversations = parsedStorage.conversation;
    // console.log(allConversations)
    $("#initial_welcome_info").hide();
    if (allConversations.length == 0) {
        $("#initial_welcome_info").show();
    }
    else {
        $("#initial_welcome_info").hide();

        for (index in allConversations) {
            var conversation = allConversations[index]
            if (conversation.type != "userMessage") {
                // console.log(conversation)
                setBotResponse(conversation)
            }
            else {
                // console.log(conversation.text)
                setUserResponse(conversation.text)
            }
            scrollToBottomOfResults();
        }
    }
}