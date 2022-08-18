/**
 * Convert JS Markdown to HTML
 */
const converter = new showdown.Converter();

/**
 * scroll to the bottom of the chats after new message has been added to chat
 */
function scrollToBottomOfResults() {
    const terminalResultsDiv = document.getElementById("chats");
    terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
}


/**
 * Set user response on the chat screen
 * @param {String} message user message
 */
function setUserResponse(message) {
    setTimeout(() => {
    const user_response = `<img class="userAvatar" src='${userAvatar_img_src}'><p class="userMsg">${message} </p><div class="clearfix"></div>`;
    $(user_response).appendTo(".chats").hide().fadeIn(100);

    $(".usrInput").val("");
    scrollToBottomOfResults();
    showBotTyping();
    // $(".suggestions").remove();
    },1);
    scrollToBottomOfResults();
}


/**
 * returns formatted bot response 
 * @param {String} text bot message response's text
 *
 */
function getBotResponse(text) {
    botResponse = `<img class="botAvatar" src="${botAvatar_img_src}"/><span class="botMsg">${text}</span><div class="clearfix"></div>`;
    return botResponse;
}

/**
 * renders bot response on to the chat screen
 * @param {Array} response json array containing different types of bot response
 *
 * for more info: `https://rasa.com/docs/rasa/connectors/your-own-website#request-and-response-format`
 */
function setBotResponse(response) {
    
    // renders bot response after 500 milliseconds
    setTimeout(() => {
        hideBotTyping();

        if (response.length < 1) {
            // if there is no response from Rasa, send  fallback message to the user
            const fallbackMsg = "I am facing some issues, please try again later!!!";

            // const BotResponse = `<img class="botAvatar" src="./static/img/sara_avatar.png"/><p class="botMsg">${fallbackMsg}</p><div class="clearfix"></div>`;

            const BotResponse = getBotResponse(fallbackMsg);

            $(BotResponse).appendTo(".chats").hide().fadeIn(100);
            scrollToBottomOfResults();
        } else {
            // showForm()
            // if we get response from Rasa
            // console.log("Responsess:: "+response[1].text)
            // console.log(response)
            if(typeof(response)=="string"){
                // console.log("resppp:",response)
                const BotResponse = getBotResponse(response);
                $(BotResponse).appendTo(".chats").hide().fadeIn(100);
                scrollToBottomOfResults();
            }
            for (let i = 0; i < response.length; i += 1) {
                // check if the response contains "text"
                
                if (Object.hasOwnProperty.call(response[i], "text")) {
                    
                    if (response[i].text != null) {
                        // convert the text to markdown format using showdown.js(https://github.com/showdownjs/showdown);
                        let botResponse;
                        let html = converter.makeHtml(response[i].text);
                        html = html.replaceAll("<p>", "").replaceAll("</p>", "").replaceAll("<strong>", "<b>").replaceAll("</strong>", "</b>");
                        html = html.replace(/(?:\\r\\n|\\r|\\n)/g, '<br>')
                        // console.log("html: "+html);
                        // check for blockquotes
                        if (html.includes("<blockquote>")) {
                            html = html.replaceAll("<br>", "");
                            botResponse = getBotResponse(html);
                        }
                        // check for image
                        if (html.includes("<img")) {
                            html = html.replaceAll("<img", '<img class="imgcard_mrkdwn" ');
                            botResponse = getBotResponse(html);
                        }
                        // check for preformatted text
                        if (html.includes("<pre") || html.includes("<code>")) {

                            botResponse = getBotResponse(html);
                        }
                        // check for list text
                        if (html.includes("<ul") || html.includes("<ol") || html.includes("<li") || html.includes('<h3')) {
                            html = html.replaceAll("<br>", "");
                            // botResponse = `<img class="botAvatar" src="./static/img/sara_avatar.png"/><span class="botMsg">${html}</span><div class="clearfix"></div>`;
                            botResponse = getBotResponse(html);
                        }
                        else {
                            // if no markdown formatting found, render the text as it is.
                            if (!botResponse) {
                                botResponse = `<img class="botAvatar" src="${botAvatar_img_src}"/><p class="botMsg">${response[i].text}</p><div class="clearfix"></div>`;
                            }
                        }
                        // append the bot response on to the chat screen
                        $(botResponse).appendTo(".chats").hide().fadeIn(100);
                    }
                }

                // check if the response contains "images"
                if (Object.hasOwnProperty.call(response[i], "image")) {
                    if (response[i].image !== null) {
                        const BotResponse = `<div class="singleCard"><img class="imgcard" src="${response[i].image}"></div><div class="clearfix">`;
                        $(BotResponse).appendTo(".chats").hide().fadeIn(100);
                    }
                }

                // check if the response contains "buttons"
                if (Object.hasOwnProperty.call(response[i], "buttons")) {
                    // console.log("bs:"+response[i].buttons)
                    if (response[i].buttons.length > 0) {
                        // console.log("tp:"+response[i].buttons)
                        addSuggestion(response[i].buttons);
                    }
                }

                // check if the response contains "attachment"
                if (Object.hasOwnProperty.call(response[i], "attachment")) {
                    if (response[i].attachment != null) {
                        if (response[i].attachment.type === "video") {
                            // check if the attachment type is "video"
                            const video_url = response[i].attachment.payload.src;

                            const BotResponse = `<div class="video-container"> <iframe src="${video_url}" frameborder="0" allowfullscreen></iframe> </div>`;
                            $(BotResponse).appendTo(".chats").hide().fadeIn(100);
                        }
                    }
                }
                // check if the response contains "custom" message
                if (Object.hasOwnProperty.call(response[i], "custom")) {

                    custom_message = response[i].custom;
                    for (key in custom_message) {
                        const payload_type = custom_message[key].type;
                        const payload_data = custom_message[key].data;
                        
                        // console.log("type:"+payload_type)
                        // text payload_type
                        if (payload_type === "text") {
                            if (payload_data != null) {
                                // convert the text to markdown format using showdown.js(https://github.com/showdownjs/showdown);
                                let botResponse;
                                let html = converter.makeHtml(payload_data);
                                
                                html = html.replaceAll("<p>", "").replaceAll("</p>", "").replaceAll("<strong>", "<b>").replaceAll("</strong>", "</b>");
                                html = html.replaceAll(/(?:\\r\n|\\r|\\n)/g, "<br>");
                                
                                // console.log("html: "+html);
                                // check for blockquotes
                                const textClass = custom_message[key].class;

                                if (html.includes("<blockquote>")) {
                                    html = html.replaceAll("<br>", "");
                                    botResponse = getBotResponse(html);
                                }
                                // check for image
                                if (html.includes("<img")) {
                                    html = html.replaceAll("<img", '<img class="imgcard_mrkdwn" ');
                                    botResponse = getBotResponse(html);
                                }
                                // check for preformatted text
                                if (html.includes("<pre") || html.includes("<code>")) {

                                    botResponse = getBotResponse(html);
                                }
                                // check for list text
                                if (html.includes("<ul") || html.includes("<ol") || html.includes("<li") || html.includes('<h3')) {
                                    html = html.replaceAll("<br>", "");
                                    // botResponse = `<img class="botAvatar" src="./static/img/sara_avatar.png"/><span class="botMsg">${html}</span><div class="clearfix"></div>`;
                                    botResponse = getBotResponse(html);
                                }
                                else {
                                    // if no markdown formatting found, render the text as it is.
                                    if (!botResponse) {
                                        botResponse = `<img class="botAvatar" src="${botAvatar_img_src}"/><p class="botMsg ${textClass}">${html}</p><div class="clearfix"></div>`;
                                    }
                                }
                                // append the bot response on to the chat screen
                                // console.log("Done")
                                $(botResponse).appendTo(".chats").hide().fadeIn(100);
                            }
                        }
                        // buttons payload type
                        if (payload_type === "buttons") {
                            var obj = payload_data
                            var result = Object.keys(obj).map((key) => [obj[key]]);
                            // console.log("res:"+result)
                            if (result.length > 0) {
                                addSuggestion(result);
                            }
                        }

                        // check if the custom payload type is "image"
                        if (payload_type === "image") {
                            if (payload_data !== null) {
                                const BotResponse = `<div class="singleCard"><img class="imgcard" src="${payload_data}"></div><div class="clearfix">`;
                                $(BotResponse).appendTo(".chats").hide().fadeIn(100);
                            }
                        }
                        
                        // check if the custom payload type is "video"
                        if (payload_type === "video") {
                            if (payload_data !== null) {
                                const video_url = payload_data;

                                const BotResponse = `<div class="video-container"> <iframe src="${video_url}" frameborder="0" allowfullscreen></iframe> </div>`;
                                $(BotResponse).appendTo(".chats").hide().fadeIn(100);
                            }
                        }
                       
                        // check if the custom payload type is "cardsCarousel"
                        if (payload_type === "cardsCarousel") {
                            const restaurantsData = response[i].custom.data;
                            showCardsCarousel(restaurantsData);
                            // return;
                        }

                        // check of the custom payload type is "collapsible"
                        if (payload_type === "collapsible") {
                            const { data } = response[i].custom;
                            // pass the data variable to createCollapsible function
                            createCollapsible(data);
                        }

                        // check of the custom payload type is "form"
                        if (payload_type === "form") {
                            const form_data = custom_message[1].data
                            showForm(form_data);
                        }
                        scrollToBottomOfResults();
                    }
                }
                
            }
            scrollToBottomOfResults();
        }
        $(".usrInput").focus();
    },1);
    scrollToBottomOfResults();
    // showForm()
}


/**
 * sends the user message to the rasa server,
 * @param {String} message user message
 */
function send(message) {
    $.ajax({
        url: rasa_server_API,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ message, sender: sender_id }),
        success(botResponse, status) {
            console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);

            // if user wants to restart the chat and clear the existing chat contents
            if (message.toLowerCase() === "/restart") {
                $("#userInput").prop("disabled", false);

                // if you want the bot to start the conversation after restart
                // customActionTrigger();
                return;
            }
            setBotResponse(botResponse);

            // store conersations to local storage
            storeConversation(message,"user", sender_id)
            // if Form response, store submitted data only
            // code
            
            // else, store as normal 
            storeConversation(botResponse,"bot", sender_id)
        
            
        },
        error(xhr, textStatus) {
            if (message.toLowerCase() === "/restart") {
                $("#userInput").prop("disabled", false);
                // if you want the bot to start the conversation after the restart action.
                // actionTrigger();
                // return;
            }

            // if there is no response from rasa server, set error bot response
            setBotResponse("");
            console.log("Error from bot end: ", textStatus);
        },
    });
}

/**
 * sends an event to the custom action server,
 *  so that bot can start the conversation by greeting the user
 *
 * Make sure you run action server using the command
 * `rasa run actions --cors "*"`
 *
 * `Note: this method will only work in Rasa 2.x`
 */
// eslint-disable-next-line no-unused-vars
function customActionTrigger() {
    showBotTyping();
    send("/greet");
}



/**
 * clears the conversation from the chat screen
 * & sends the `/resart` event to the Rasa server
 */
function restartConversation() {
    $("#userInput").prop("disabled", true);
    // destroy the existing chart
    $(".collapsible").remove();

    $(".chats").html("");
    $(".usrInput").val("");
    send("/restart");
    // remove and set new sender_id in localStorage
    localStorage.removeItem('sender_id');
    setChatClient()

    // $(".chats").html(welcome_text);
    customActionTrigger();
    $(".chats").fadeIn();
}
// triggers restartConversation function.
$("#restart").click(() => {
    restartConversation();
});

/**
 * if user hits enter or send button
 * */
$(".usrInput").on("keyup keypress", (e) => {
    const keyCode = e.keyCode || e.which;

    const text = $(".usrInput").val();
    if (keyCode === 13) {
        if (text === "" || $.trim(text) === "") {
            e.preventDefault();
            return false;
        }
        // destroy the existing chart, if yu are not using charts, then comment the below lines
        // $(".collapsible").remove();
        // $("#initial_welcome_info").hide();
        $("#paginated_cards").remove();
        // $(".suggestions").remove();
        $(".usrInput").blur();
        setUserResponse(text);
        send(text);
        e.preventDefault();
        return false;
    }
    return true;
});

$("#sendButton").on("click", (e) => {
    const text = $(".usrInput").val();
    if (text === "" || $.trim(text) === "") {
        e.preventDefault();
        return false;
    }

    // $(".collapsible").remove();
    // $(".suggestions").remove();
    $("#paginated_cards").remove();
    $(".usrInput").blur();
    // $("#initial_welcome_info").hide();
    setUserResponse(text);
    send(text);
    e.preventDefault();
    return false;
});

