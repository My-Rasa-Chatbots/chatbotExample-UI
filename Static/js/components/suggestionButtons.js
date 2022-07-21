/**
 *  adds vertically stacked buttons as a bot response
 * @param {Array} suggestions buttons json array
 */
function addSuggestion(suggestions) {
    const suggLength = suggestions.length;
    var suggestions_html = '<div class="singleCard"> <div class="suggestions"><div class="menu">'
    // Loop through suggestions

    for (let i = 0; i < suggLength; i += 1) {
        suggestion = suggestions[i][0]
        // console.log(suggestion)
        if (!suggestion) {
            suggestions_html += `<div class="menuChips" data-payload='${suggestions[i].payload}'>${suggestions[i].title}</div>`
        }
        else {
            suggestions_html += `<div class="menuChips" data-payload='${suggestion.payload}'>${suggestion.title}</div>`
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
