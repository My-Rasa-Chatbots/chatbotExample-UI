/**
 *  adds vertically stacked buttons as a bot response
 * @param {Array} suggestions buttons json array
 */
function addSuggestion(suggestions) {
    const suggLength = suggestions.length;
    var suggestions_html = '<div class="singleCard"> <div class="suggestions"><div class="menu">'
    // Loop through suggestions

    for (let i = 0; i < suggLength; i += 1) {
        var suggestion = suggestions[i][0]
        if (suggestions[i].payload !== undefined) {
            suggestions_html += `<div class="menuChips" data-payload='${suggestions[i].payload}'>${suggestions[i].title}</div>`
        }
        else {
            var isUrl = suggestion.hasOwnProperty('url')

            if (!suggestion) { //custom buttons
                suggestions_html += `<div class="menuChips" data-payload='${suggestions[i].payload}'>${suggestions[i].title}</div>`
            }
            else if (isUrl) {
                // console.log(suggestions[i][0])
                suggestions_html += `<a class="menuChipsUrl" href='${suggestion.url}' target="_blank" rel="noopener noreferrer">${suggestion.title}</a>`
            }
            else { // regular buttons
                suggestions_html += `<div class="menuChips" data-payload='${suggestion.payload}'>${suggestion.title}</div>`
            }
        }
    }
    suggestions_html += '</div></div></div> <div class="clearfix"></div>'
    $(
        suggestions_html,
    )
        .appendTo(".chats")
        .hide()
        .fadeIn(100);
    scrollToBottomOfResults();
}


// on click of suggestion's button, get the title value and send it to rasa
$(document).on("click", ".menu .menuChips", function () {
    const text = this.innerText;
    const payload = this.getAttribute("data-payload");
    // console.log("payload: ", this.getAttribute("data-payload"));
    setUserResponse(text);
    storeConversation(text, "user", sender_id)
    send(payload);

    // delete the suggestions once user click on it.
    // $(".suggestions").remove();
});

$(document).on("click", ".menu .menuChipsUrl", function (e) {
    var text = this.innerText;
    setUserResponse(text);
    // console.log("here")
    storeConversation(text, "user", sender_id)

    var botMessage = text + " webpage is opened in another tab."
    setBotResponse(botMessage)
    storeConversation(botMessage, "bot", sender_id)

    var msg_anything_else = "Can i help you with anything more?"
    setBotResponse(msg_anything_else)
    storeConversation(msg_anything_else, "bot", sender_id)
    // storeConversation(text, "user", sender_id)
});
