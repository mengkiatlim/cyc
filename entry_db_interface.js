
console.log("This script is loaded");

const user_name_id = "user_name";
const approver_name_id = "approver_name";
const bounty_amount_id = "bounty_amount";
const user_button_id = "user_button";
const approver_button_id = "approver_button";


var spreadsheet_id;

function populate_table(data) {
    $("#"+user_name_id).html(data[1]);
    $("#"+approver_name_id).html(data[2]);
    $("#"+bounty_amount_id).html(data[4]);
}

var user_button_state = "save";
function handle_user_button(event) {
    console.log("user_button clicked");

    switch (user_button_state) {
        case "edit":
            console.log("Was in edit state. Now saving data.");
            // Change button string
            $("#user_button").html("Edit");
            // Get input value of form
            var user_name = $("#user_name").find("input").val();
            // Display it back to user
            $("#user_name").html(user_name);
            // Save data to google sheet over here
            user_button_state = "save";
            break;

        case "save":
            console.log("Was in save state. Now letting user edit.");
            var data = [[1, 2]];
            save_entry(2, data);
            /*
            $("#user_button").html("Save");
            var user_name = $("#user_name").html();
            $("#user_name").html('<input type="text" id="user_name_edit" value="' + user_name + '">');
            user_button_state = "edit";
            */
            break;

        default:
            console.log("Invalid state.");
            break;
    }
}

var approver_button_state = "edit";
function handle_approver_button(event) {
    console.log("approver_button clicked");

    switch (approver_button_state) {
        case "edit":
            console.log("Was in edit state. Now saving data.");
            $("#approver_button").html("Edit");
            approver_button_state = "save";
            break;

        case "save":
            console.log("Was in save state. Now letting user edit.");
            $("#approver_button").html("Save");
            approver_button_state = "edit";
            break;

        default:
            console.log("Invalid state.");
            break;
    }
}

function init_db(new_spreadsheet_id) {
    //load_macro(div_id);

    spreadsheet_id = new_spreadsheet_id;

    $("#"+user_button_id).click(handle_user_button);
    $("#"+approver_button_id).click(handle_approver_button);
}

function load_entry(ID) {
    console.log("Attempting to get entry from ID: " + ID);

    get_entry(ID);
}

// Spreadsheet containing entry data:
// https://docs.google.com/spreadsheets/d/1tLGBRWbQISXjvDnVn7f4ff2WnnghrgjuJFBG3KEiOcc/edit?usp=sharing
function get_entry(ID) {
    var data;
    var dataRange = 'A2:E';

    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheet_id,
        range: dataRange,
    }).then(function (response) {
        var range = response.result;

        if (range.values.length > 0) {
            data = range.values[0];
            console.log(data[0]);
            populate_table(data);
        } else {
            console.log('No data found.');
        }
    }, function (response) {
        console.log('Error: ' + response.result.error.message);
    });
}

function save_entry(ID, entry_data) {
    var dataRange = "A2:E2";

    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheet_id,
        range: dataRange,
        valueInputOption: "USER_ENTERED",
        values: entry_data
    }).then(function (response) {
        console.log(response.result);
    }, function (response) {
        console.log('Error: ' + response.result.error.message);
    });
}

function delete_entry(key) {}