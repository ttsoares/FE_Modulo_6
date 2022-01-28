// Get username and password
function getInputValues() {

  let userName = (document.getElementById("userName").value.toLowerCase());
  let passWord = (document.getElementById("passWord").value);

  let test_Username = userName.replace(/\s/g, ''); // remove espaces

  if (test_Username=='' ) {
    const emptyModal = new bootstrap.Modal(document.getElementById('empty_filed'));
    emptyModal.show();
    return
  }

  const hash = md5(`${userName}${passWord}`)

  testCredentials(userName, hash)
}

// Test correct paring of username / password
async function testCredentials(uName, password) {

  const clockAnim = (document.getElementById("div-clock"))

  clockAnim.classList.remove("invisible");
  clockAnim.classList.add("visible");

  // Go to 'Admin'mode to access the users RUD
  if (uName == 'admin') {
    const testAdmin = md5(`${uName}${password}`);
    if (testAdmin !== "5d1fa092a4f036e3935d38506ee8bf56") logout();

    const token = "5d1fa092a4f036e3935d38506ee8bf56";
    sessionStorage.setItem("token", token);
    location.href = `./users.html`
  }

  //If user/pass are OK BE returns userID
  await axios.post(`${url}/login`, {
    name: uName,
    password: password
  })
  .then(function (response) {

    clockAnim.classList.remove("visible");
    clockAnim.classList.add("invisible");

    // Token to prevem the direct access of messagens without login
    const token = md5(`${uName}${response.data}`);
    sessionStorage.setItem("token", token);

    // Call Messagens page with user 'uid' and 'name'
    location.href = `./messages.html?${response.data}|${uName}`;

  })
  .catch(function (error) {
    clockAnim.classList.remove("visible");
    clockAnim.classList.add("invisible");

    const credentials = new bootstrap.Modal(document.getElementById('credentials'));
    credentials.show();
  })
}

function logout() {
  nameUser = "";
  sessionStorage.clear();
  id = null;
  location.href = "./index.html";
}

// Function to allow the submission form with ENTER key
(function getEnter() {
  var inPut = document.getElementById("passWord");

  inPut.addEventListener("keydown", function(event) {
    const keyName = event.key;

  if (keyName === 'Enter') {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("myBtn").click();
    }
  });
})();
