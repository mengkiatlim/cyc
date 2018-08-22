
console.log("entry_db_interface.js is loaded");

const table_html = `
<style>
  table,
  th,
  td {
    border: 1px solid black;
    border-collapse: collapse;
  }


  th,
  td {
    padding: 5px;
    text-align: left;
  }
</style>

<table style="width:100%">
  <tr>
    <th>
      User<br>
      <button type="button" id="user_button" style="display: block;">
        Edit
      </button>
    </th>
    <td id="user_name">user_name</td>
  </tr>
  <tr>
    <th>
      Approver<br>
      <button type="button" id="approver_button" style="display: block;">
        Edit
      </button>
    </th>
    <td id="approver_name">approver_name</td>
  </tr>
  <tr>
    <th>Bounty</th>
    <td id="bounty_amount">bounty_amount</td>
  </tr>
</table>
`

const user_name_id = "user_name";
const approver_name_id = "approver_name";
const bounty_amount_id = "bounty_amount";
const user_button_id = "user_button";
const approver_button_id = "approver_button";

// ID of spreadsheet acting as database
var SPREADSHEET_ID;

// Key of entry
var KEY_ID;

function populate_table(data) {
    $("#" + user_name_id).html(data[1]);
    $("#" + approver_name_id).html(data[2]);
    $("#" + bounty_amount_id).html(data[4]);
}

var user_button_state = "save";
function handle_user_button(event) {
    console.log("user_button clicked");

    switch (user_button_state) {
        case "edit":
            console.log("Was in save state. Now letting user edit.");
            // Change display to a form for input
            var user_name = $("#user_name").html();
            $("#user_name").html('<input type="text" id="user_name_edit" value="' + user_name + '">');
            // Change button string
            $("#user_button").html("Save");
            // Set the next state
            user_button_state = "save";
            break;

        case "save":
            console.log("Was in edit state. Now saving data.");
            // Get input value of form
            var user_name = $("#user_name").find("input").val();
            // Display it back to user
            $("#user_name").html(user_name);
            // Save data to google sheet
            var data = [[1, user_name, 4444, user_name]];
            save_entry(data);
            // Change button string
            $("#user_button").html("Edit");
            user_button_state = "edit";
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

function init_db(new_spreadsheet_id, key_id) {
    //load_macro(div_id);

    SPREADSHEET_ID = new_spreadsheet_id;
    KEY_ID = key_id;

    $("#entry_table").html(table_html);

    $("#" + user_button_id).click(handle_user_button);
    $("#" + approver_button_id).click(handle_approver_button);
}

function load_entry(ID) {
    console.log("Attempting to get entry from ID: " + ID);

    get_entry();
}

function get_entry() {
    var data;
    var dataRange = 'A'+KEY_ID+':E'+KEY_ID;

    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
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

function save_entry(entry_data) {
    var dataRange = 'A'+KEY_ID+':E'+KEY_ID;

    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: dataRange,
        valueInputOption: "USER_ENTERED",
        values: entry_data
    }).then(function (response) {
        console.log(response.result);
    }, function (response) {
        console.log('Error: ' + response.result.error.message);
    });
}

function delete_entry(key) { }