
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
include('./static/js/components/index.js');
include('./static/js/constants.js');
window.addEventListener('load', () => {
  // initialization
  
  $(document).ready(() => {
    $(".chats").html(welcome_text);

    // store sender_id in localStorage
   
    var user_session = localStorage.getItem("user_session")
    if(!user_session){ // no previous session existed
      console.log("New session created.")
      setChatClient();
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
    $(".widget").toggle();
    scrollToBottomOfResults();
  });

  // clear function to clear the chat contents of the widget.
  $("#clear").click(() => {
    // clearConversations();
    $(".chats").fadeOut("normal", () => {
      $(".chats").html(welcome_text);
      $(".chats").fadeIn();
    });
  });

  // close function to close the widget.
  $("#close").click(() => {
    // $(".profile_div").toggle();
    $(".widget").toggle();
    $(".chats").fadeIn();
  });

  // If nothing in chat show welcome message
});

$(document).mouseup(function (e) {
  var container = $(".show-prompt");
  // if the target of the click isn't the container nor a descendant of the container
  if (!container.is(e.target) && container.has(e.target).length === 0) {
    $(".show-prompt").removeClass("open")
  }
});

