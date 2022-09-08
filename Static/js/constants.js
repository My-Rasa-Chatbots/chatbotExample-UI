// const initial_action_name = "action_initial_greet";
// const rasa_server_url = "https://rasa-actions-server-keshabmanni.cloud.okteto.net";
const rasa_server_API = "http://localhost:5005/webhooks/rest/webhook";
const botAvatar_img_src = "./Static/img/botAvatar.jpg";
const userAvatar_img_src = "./static/img/userAvatar.jpg";
const rasa_conversation_API = "http://localhost:5005/conversations/"

var suggestion_topics;
const mongo_topics_API = "https://data.mongodb-api.com/app/data-wfzfo/endpoint/data/beta"
const mongo_topics_API_Key = "6310e05a25a41ce3dc217934"
// var welcome_text = `<div id="initial_welcome_info">
// <span>Welcome to Marlabs Website.</span>
// <span>I'm mChat</span>
// <span>How can I help you today with your queries?</span>
// </div>`

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

// Load Chats from loacl storage and render
function loadWelcomeMessage() {
    var storage = localStorage.getItem("user_session")
    var parsedStorage = JSON.parse(storage);
    var allConversations = parsedStorage.conversation;
    // console.log(allConversations)
    var conversation = allConversations[0]
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


// Get topics
function storeTopics(topics_list){
    // console.log(topics_list)
    suggestion_topics = topics_list
}
// $.ajax({
//     url: mongo_topics_API+"/action/findOne",
//     type: "POST",
//     crossDomain: true,
//     contentType: "application/json",
//     headers: {
//         "api-key": mongo_topics_API_Key    
//     },
//     // Data
//     data: JSON.stringify({
//         "collection":"topics",
//         "database":"mChat",
//         "dataSource":"Cluster0"
//     }),
//     success(dbResponse, status) {
//         console.log("Response from Mongo: ", dbResponse, "\nStatus: ", status);
//     },
//     error(xhr, textStatus) {}
// });

// curl --location --request POST 'https://data.mongodb-api.com/app/data-wfzfo/endpoint/data/beta/action/findOne' \
// --header 'Content-Type: application/json' \
// --header 'Access-Control-Request-Headers: *' \
// --header 'api-key: <API_KEY>' \
// --header 'Accept: application/ejson' \
// --data-raw '{
//     "collection":"topics",
//     "database":"mChat",
//     "dataSource":"Cluster0",
//     "projection": {"_id": 1}
// }'
