/**
 *  adds vertically stacked buttons as a bot response
 * @param {Array} typingSuggestions buttons json array
 */
function addTypingSuggestion(typingSuggestions) {
    const suggLength = typingSuggestions.length;
    typingSuggestions_html=''
    for (let i = 0; i < suggLength && i<5; i += 1) {
        typingSuggestions_html += `<div class="suggestionChips">${typingSuggestions[i]}</div>`
    }
    $(".typing_suggestion_section").html(typingSuggestions_html)
    scrollToBottomOfResults();
}

$(document).on("click", ".suggestionChips", function (e) {
    var text = this.innerText;
    // console.log(text)
    $(".usrInput").val(text);
    
})
