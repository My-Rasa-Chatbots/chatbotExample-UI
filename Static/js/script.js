
/* module for importing other js files */
function include(file) {
  const script = document.createElement('script');
  script.src = file;
  script.type = 'text/javascript';
  script.defer = true;

  document.getElementsByTagName('head').item(0).appendChild(script);
}


// Bot pop-up intro
document.addEventListener("DOMContentLoaded", () => {
  // eslint-disable-next-line no-undef
  $(".show-prompt").addClass("open")
  setTimeout(() => {
    $(".show-prompt").removeClass("open")
  }, 4000);
});

/* import components */
include('./static/js/constants.js');
include('./static/js/components/index.js');

window.addEventListener('load', () => {
  // initialization
  
  $(document).ready(() => {
    // $(".chats").html(welcome_text);
    
    // store sender_id in localStorage
   
    var user_session = localStorage.getItem("user_session")
    if(!user_session){ // no previous session existed
      restartConversation();
    }else{ //session already there
      sender_id = JSON.parse(user_session).sender_id
      loadPreviousChats()
    }
    
    // drop down menu for close, restart conversation & clear the chats.
    $(".dropdown-trigger").dropdown();

    // initiate the modal for displaying the charts,
    // if you dont have charts, then you comment the below line
    // $(".modal").modal();

    // enable this if u have configured the bot to start the conversation.
    // showBotTyping();
    // $("#userInput").prop('disabled', true);

    // if you want the bot to start the conversation
    // customActionTrigger();
  });
  // Toggle the chatbot screen
  $("#profile_div").click(() => {
    $(".show-prompt").removeClass("open");
    $(".widget").toggle(function(){$(this).animate({}, 100);});
    scrollToBottomOfResults();
  });

  // clear function to clear the chat contents of the widget.
  $("#clear").click(() => {
    // clearConversations();
    $(".chats").fadeOut("normal", () => {
      $(".chats").html("");
      loadWelcomeMessage();
      $(".chats").fadeIn();
    });
  });

  // close function to close the widget.
  $("#close").click(() => {
    // $(".profile_div").toggle();
    $(".widget").toggle(function(){$(this).animate({}, 100);});
    $(".chats").fadeIn();
  });

  // If nothing in chat show welcome message
});

$(document).mouseup(function (e) {
  var container = $(".show-prompt");
  var body = $("document.body")
  // if the target of the click isn't the container nor a descendant of the container
  // if (!container.is(e.target) && container.has(e.target).length === 0) {
  if(e.target.tagName == "BODY" && $('.widget').is(':visible')){
    $(".widget").toggle(function(){$(this).animate({}, 100);});
  }
});



// Suggestion based on user input
$(".usrInput").on("keyup", ()=>{
  const user_text = $(".usrInput").val();
  var regex = new RegExp()
  var filtered_topics = suggestion_topics.filter((topic)=>{
    return topic.toLowerCase().includes(user_text.toLowerCase())
  })
  addTypingSuggestion(filtered_topics)
  // console.log(filtered_topics)
})

$(document).on("click", ".suggestionChips", function (e) {
  var text = this.innerText;
  $(".usrInput").text(text)
})
