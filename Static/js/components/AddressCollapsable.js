/**
 *  creates collapsible
 * for more info refer:https://materializecss.com/collapsible.html
 * @param {Array} collapsible_data json array
 */
function createAddressCollapsible(collapsible_data) {
    // sample data format:
    // var collapsible_data=[{"title":"abc","description":"xyz"},{"title":"pqr","description":"jkl"}]
    let collapsible_list = "";
    for (let i = 0; i < collapsible_data.length; i += 1) {
        office_location = collapsible_data[i].location;
        office_address = collapsible_data[i].address;
        if (typeof (office_address) == 'object') {
            let india_collapsible_item = "";
            office_address.map((india_address) => {
                // console.log(india_address.address.length);
                
                const india_collapsible_header = `<li><div class="collapsible-header">${india_address.location} (${office_location})</div>`
                var india_collapsible_body=''
                for (let j=0; j<india_address.address.length; j+=1){
                    india_collapsible_body += `<div class="collapsible-body"><span>${india_address.address[j]}</span></div>`;
                }
                india_collapsible_item = india_collapsible_header+india_collapsible_body+`</li>`
                collapsible_list += india_collapsible_item;
            })
        }
        else {
            const collapsible_item = `<li><div class="collapsible-header">${office_location}</div><div class="collapsible-body">
                                    <span>${office_address}</span></div></li>`;

            collapsible_list += collapsible_item;
        }
    }
    const collapsible_contents = `<ul class="collapsible">${collapsible_list}</ul>`+`<div class="clearfix"></div>`;
    $(collapsible_contents).appendTo(".chats");

    // initialize the collapsible
    $(".collapsible").collapsible();
    scrollToBottomOfResults();
}
