
/**
 * removes the bot typing indicator from the chat screen
 */
function hideBotTyping() {
    $("#botAvatar").remove();
    $(".botTyping").remove();
    $("#userInput").prop("disabled", false);
    $(".menuChips").removeClass("disabled");
    $(".menuChipsUrl").removeClass("disabled");
    scrollToBottomOfResults();
}

/**
 * adds the bot typing indicator from the chat screen
 */
function showBotTyping() {
    const botTyping = `<img class="botAvatar" id="botAvatar" src="${botAvatar_img_src}"/><div class="botTyping"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>`;
    $(botTyping).appendTo(".chats");
    $(".botTyping").show();
    $("#userInput").prop("disabled", true);
    $(".menuChips").addClass("disabled");
    $(".menuChipsUrl").addClass("disabled");
    scrollToBottomOfResults();
}
