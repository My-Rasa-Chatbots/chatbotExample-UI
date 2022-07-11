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
    const user_response = `<img class="userAvatar" src='${userAvatar_img_src}'><p class="userMsg">${message} </p><div class="clearfix"></div>`;
    $(user_response).appendTo(".chats").show("slow");

    $(".usrInput").val("");
    scrollToBottomOfResults();
    showBotTyping();
    $(".suggestions").remove();
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

            $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
            scrollToBottomOfResults();
        } else {
            // if we get response from Rasa
            for (let i = 0; i < response.length; i += 1) {
                // check if the response contains "text"
                if (Object.hasOwnProperty.call(response[i], "text")) {
                    if (response[i].text != null) {
                        // convert the text to markdown format using showdown.js(https://github.com/showdownjs/showdown);
                        let botResponse;
                        let html = converter.makeHtml(response[i].text);
                        html = html.replaceAll("<p>", "").replaceAll("</p>", "").replaceAll("<strong>", "<b>").replaceAll("</strong>", "</b>");
                        html = html.replace(/(?:\r\n|\r|\n)/g, '<br>')
                        console.log(html);
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
                        $(botResponse).appendTo(".chats").hide().fadeIn(1000);
                    }
                }

                // check if the response contains "images"
                if (Object.hasOwnProperty.call(response[i], "image")) {
                    if (response[i].image !== null) {
                        const BotResponse = `<div class="singleCard"><img class="imgcard" src="${response[i].image}"></div><div class="clearfix">`;

                        $(BotResponse).appendTo(".chats").hide().fadeIn(1000);
                    }
                }

                // check if the response contains "buttons"
                if (Object.hasOwnProperty.call(response[i], "buttons")) {
                    if (response[i].buttons.length > 0) {
                        addSuggestion(response[i].buttons);
                    }
                }
            }
            scrollToBottomOfResults();
        }
        $(".usrInput").focus();
    }, 500);

}

/**
 * sends the user message to the rasa server,
 * @param {String} message user message
 */
function send(message) {
    $.ajax({
        url: rasa_server_url,
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
 * clears the conversation from the chat screen
 * & sends the `/resart` event to the Rasa server
 */
function restartConversation() {
    $("#userInput").prop("disabled", true);
    // destroy the existing chart
    // $(".collapsible").remove();

    // if (typeof chatChart !== "undefined") {
    //     chatChart.destroy();
    // }

    // $(".chart-container").remove();
    // if (typeof modalChart !== "undefined") {
    //     modalChart.destroy();
    // }
    $(".chats").html("");
    $(".usrInput").val("");
    send("/restart");
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
        // $(".dropDownMsg").remove();
        $("#initial_welcome_info").remove();
        // if (typeof chatChart !== "undefined") {
        //     chatChart.destroy();
        // }

        // $(".chart-container").remove();
        // if (typeof modalChart !== "undefined") {
        //     modalChart.destroy();
        // }

        // $("#paginated_cards").remove();
        $(".suggestions").remove();
        // $(".quickReplies").remove();
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
    // destroy the existing chart
    // if (typeof chatChart !== "undefined") {
    //     chatChart.destroy();
    // }

    // $(".chart-container").remove();
    // if (typeof modalChart !== "undefined") {
    //     modalChart.destroy();
    // }

    $(".suggestions").remove();
    $("#paginated_cards").remove();
    $(".quickReplies").remove();
    $(".usrInput").blur();
    $(".dropDownMsg").remove();
    $("#initial_welcome_info").remove();
    setUserResponse(text);
    send(text);
    e.preventDefault();
    return false;
});
