/**
 * creates vertically placed form fields
 * @param {Array} slotValues
 * */
function setSlot(slotValues, formTitle) {
    // add event:"slot" to each objects
    slotValues.map(function (e) {
        e.event = "slot";
    });
    $("#inputForm :input").prop("disabled", true);
    $.ajax({
        url: `http://localhost:5005/conversations/${sender_id}/tracker/events`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(slotValues),
        success(botResponse, status) {
            console.log("Response from Rasa: ", botResponse, "\nStatus: ", status);
            $.ajax({
                url: `http://localhost:5005/conversations/${sender_id}/execute`,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({ name: "submit_contact_form" }),
                success(botResponse, status) {
                    console.log("Response from Rasa: ", botResponse.messages, "\nStatus: ", status);
                    closeForm(formTitle,"submit", "Contact Us Form submitted successfully.")
                    setBotResponse(botResponse.messages);
                    storeConversation(botResponse.messages, "bot", sender_id)
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
            })

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
    })
}

/**
 * creates vertically placed form fields
 * @param {Array} actionName
 * */
function executeAction(actionName) {

}

function closeForm(form_title, type, message) {
    var storage = localStorage.getItem("user_session")
    var parsedStorage = JSON.parse(storage);
    var allConversations = parsedStorage.conversation;
    var openFormCount = 0;
    var prevForm;
    for (conv in allConversations) {
        if (typeof (allConversations[conv][0]) == "object" && allConversations[conv][0].custom != undefined) {
            if (allConversations[conv][0].custom[0].type == "form" && allConversations[conv][0].custom[1].data[0].form_title == form_title) {
                openFormCount += 1;
                
                if (openFormCount > 1 || type=="submit") {
                    // console.log((allConversations))
                    if(type=="submit") prevForm = conv
                    allConversations[prevForm] = message;
                    hideBotTyping();
                    // console.log($(".form"))
                    $(".form").replaceWith(`<span class="botMsg">${message}</span>`).hide().fadeIn(100);
                    scrollToBottomOfResults();
                }
                prevForm = conv;
            }
        }

    }
    var message = {
        "sender_id": sender_id,
        "conversation": allConversations
    }
    localStorage.setItem("user_session", JSON.stringify(message));
    scrollToBottomOfResults();
    return true;
}
/**
 * creates vertically placed form fields
 * @param {Array} formFieldsData json array
 */
function createFormFields(formFieldsData) {
    let inputFields = "";
    formFieldsData.map((field_item) => {
        const inputItem = `<label style="font-weight:600; color:black;" for="${field_item.slotName}">${field_item.inputName}<span style="color:red;">*</span></label><input type="${field_item.inputType}" id="${field_item.slotName}" autocomplete="off">`;
        inputFields += inputItem;
    });
    const submitButton = `<button type="submit" id="formSubmitButton">Submit</button>`;
    const cancelButton = `<button id="formCancelButton">Cancel</button>`;
    const formContents = `<img class="botAvatar" src="${botAvatar_img_src}"/><div class="form"><span class="formTitle"></span><p class="formSubtitle"></p><span class="message"></span><form id="inputForm">` + inputFields + `<div>` + submitButton + `</div>` + '</form></div><div class="clearfix"></div>'
    return formContents;
}
// get values
function getName() {
    return $("#user_name").val();
}
function getPhone() {
    return $("#user_phone").val();
}
function getEmail() {
    return $("#user_email").val();
}
function getQuery() {
    return $("#user_query").val();
}
// validation
function validateName(name_value) {
    if (name_value != '') {
        return /^[\w]+[\w ]{2,30}$/.test(name_value)
    }
    return false
}
function validatePhone(phone_value) {
    if (phone_value != '') {
        return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone_value)
    }
    return false
}
function validateEmail(email_value) {
    if (email_value != '') {
        return /^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$/.test(email_value)
    }
    return false
}
function validateQuery(query_value) {
    if (query_value != '') {
        return /^[\d\w ]+$/.test(query_value)
    }
    return false
}
/**
 * appends form on to the chat screen
 * @param {Array} formData json array
 */
//  function showForm(formFieldsToAdd) {
function showForm(formData) {

    var formTitle = formData[0].form_title;
    closeForm(formTitle,"close", "Form is closed.")
    var formSubtitle = formData[1].form_subtitle;
    var formFields = formData[2].fields;

    const form = createFormFields(formFields);
    $(form).appendTo(".chats").show();
    $("#inputForm input").first().focus();

    if (formTitle != "nan") {
        $(".formTitle").text(formTitle);
    }
    if (formSubtitle != "nan") {
        $(".formSubtitle").text(formSubtitle);
    }
    if (formFields == "nan") {
        formFields = undefined;
    }


    $("#user_name").keyup((e) => {
        var name = getName();
        if (validateName(name)) {
            $("#user_name").removeClass("invalid")
            $("#user_name").addClass("valid")
        }
        else {
            $("#user_name").removeClass("valid")
            $("#user_name").addClass("invalid")
        }
    })
    $("#user_phone").keyup((e) => {
        var phone = getPhone();
        if (validatePhone(phone)) {
            $("#user_phone").removeClass("invalid")
            $("#user_phone").addClass("valid")
        }
        else {
            $("#user_phone").removeClass("valid")
            $("#user_phone").addClass("invalid")
        }
    })
    $("#user_email").keyup((e) => {
        var email = getEmail();
        if (validateEmail(email)) {
            $("#user_email").removeClass("invalid")
            $("#user_email").addClass("valid")
        }
        else {
            $("#user_email").removeClass("valid")
            $("#user_email").addClass("invalid")
        }
    })
    $("#user_query").keyup((e) => {
        var query = getQuery();
        if (validateQuery(query)) {
            $("#user_query").removeClass("invalid")
            $("#user_query").addClass("valid")
        }
        else {
            $("#user_query").removeClass("valid")
            $("#user_query").addClass("invalid")
        }
    })


    $("#formSubmitButton").on("click", (e) => {
        var name = getName();
        var phone = getPhone();
        var email = getEmail();
        var query = getQuery();

        if (validateName(name) && validatePhone(phone) && validateEmail(email) && validateQuery(query)) {
            var formData = [
                { name: "user_name", value: name },
                { name: "user_phone", value: phone },
                { name: "user_email", value: email },
                { name: "user_query", value: query }
            ]

            // send to API function
            showBotTyping()
            setSlot(formData, formTitle)
            e.preventDefault();
            console.log(formData)
            return false;
        }
        $(".message").text("Please enter valid inputs only.")
        e.preventDefault();
        return false;
    });
    scrollToBottomOfResults();
}

