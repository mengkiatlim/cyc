
// Client ID and API key from the Developer Console
var CLIENT_ID;

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS;

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES;

// Sample spreadsheet id
// https://docs.google.com/spreadsheets/d/1NmGXYzaDjLQZp4qMe_IryrdudahaxKww7LyQm9wTuSA/edit#gid=0
var SPREADSHEET_ID;

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad(client_id, discovery_docs, scopes, spreadsheet_id) {
    CLIENT_ID = client_id;
    DISCOVERY_DOCS = discovery_docs;
    SCOPES = scopes;
    SPREADSHEET_ID = spreadsheet_id;

    gapi.load('client:auth2', initClient);
    // Initialize entry_db_interface
    init_db(spreadsheet_id);
}

/**
  *  Initializes the API client library and sets up sign-in state
  *  listeners.
  */
function initClient() {
    gapi.client.init({
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        appendPre("User signed in");
        // Do something useful if signed in
        load_entry(2);
    } else {
        appendPre("User signed out");
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
   * Append a pre element to the body containing the given message
   * as its text node. Used to display the results of the API call.
   *
   * @param {string} message Text to be placed in pre element.
   */
function appendPre(message) {
    var pre = document.getElementById('entry_macro_debug_content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}