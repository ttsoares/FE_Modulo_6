function NewUser() {
  let userName = (document.getElementById("userName").value.toLowerCase());
  let password1 = (document.getElementById("passWord_1").value);
  let password2 = (document.getElementById("passWord_2").value);

  let test_Username = userName.replace(/\s/g, ''); // remove spaces

  if (test_Username=='') {
    // empty user fields are not allowed
    const empty = new bootstrap.Modal(document.getElementById('empty_field'));
    empty.show();
    return false;
  };

  if ( password1 !== password2) {
    // Passwords do not match
    let passModal = new bootstrap.Modal(document.getElementById('passModal'));
    passModal.show()
    return false;
  };

  // Test if all username letters are between 'a' and 'z'
  let charNumber;
  [...userName].forEach((char) => {
    charNumner = char.charCodeAt(0);

    if (charNumber < 97 || charNumber > 122) {
      const failure = new bootstrap.Modal(document.getElementById('failure'));
      failure.show();
      return
    }

  });

  const hash = md5(`${userName}${password1}`)


  criaUser(userName, hash)
}

async function criaUser(userName, password) {
  const clockAmin = (document.getElementById("div-clock"))

  try {
    clockAmin.classList.remove("invisible");
    clockAmin.classList.add("visible");

    console.log(userName, password)

    await axios.post(`${url}/user/store`, {name: userName, password: password});

    clockAmin.classList.remove("visible");
    clockAmin.classList.add("invisible");

    const success = new bootstrap.Modal(document.getElementById('success'));
    success.show();
    return
  } catch (error) {
    clockAmin.classList.remove("visible");
    clockAmin.classList.add("invisible");

    const failure = new bootstrap.Modal(document.getElementById('user_exists'));
    failure.show();
    return
  }
}


function logout() {
  nameUser = "";
  sessionStorage.clear();
  id = null;
  location.href = "./index.html";
}

// Function to allow the submission form with ENTER key
(function getEnter() {

  var inPut = document.getElementById("passWord_2");
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
// With this solution one can not press ENTER at the
// user userName or passWord_1 because
// this somehow reset all inputs !
// Even thoug the event listener is attached only to
// the passWord_2 ID !!
// I was unable to fix this...
