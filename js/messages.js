const queryString = location.search.substring(1);
const parms = queryString.split("|");

let usrIndice = parms[0]
let nameUser = parms[1]

const token = sessionStorage.getItem("token");
const verify_token = md5(`${nameUser}${usrIndice}`);

if (token !== verify_token) logout();

let messages = []
// Those 'id' are identifyers at the table's HTML code.
// They allways will be the 'uid' values in the 'uid'
//  colummn at table Messages
let id;

const uPname = nameUser[0].toUpperCase() + nameUser.slice(1);
let idUsername = document.getElementById("userName");
let tagH3 = document.createElement("H1");
tagH3.innerText = uPname;
idUsername.appendChild(tagH3);

show_msgs()

// Show all messages form an user
// Render the HTML code to create the table with messages
async function show_msgs () {
  await axios.get(`${url}/messages/${usrIndice}`)
    .then(function (response) {
      html = response.data  // HTML made by backend EJS
    })
    .catch(function (error) {
      console.log("Messages not found")
    })

    document.getElementById('messages').innerHTML = html

    // Assign click events to the HTML rows
    const delBtns = document.getElementsByClassName('remove');
    const editBtns = document.getElementsByClassName('edit');
    for (var i=0; i < delBtns.length; i++) {
     delBtns[i].addEventListener('click', remove);
     editBtns[i].addEventListener('click', edit);
    };
}

async function remove() {
  // get the content (number) to fill variable 'id' using 'id' at the HTML
  // this will be the same 'id' in the SQL table 'uid' colummn
  id = this.getAttribute('id');
  id = +id.slice(0,-1) //  remove the "D" from id

  await axios.delete(`${url}/user/${usrIndice}/message/${id}`)
    .then(function (response) {
    })
    .catch(function (error) {
      console.log("Delete message error")
    })

  show_msgs()
}

// start edition process
// get the content (number) to fill variable 'id' using 'id' at the HTML
// this will be the same 'id' in the SQL table 'uid' colummn
async function edit() {
  id = this.getAttribute('id');
  id = +id.slice(0,-1); //  remove the "E" from id

  await axios.get(`${url}/user/${usrIndice}/message/${id}`)
    .then(function (response) {
      message = response.data

      let description = message.description;
      let details = message.details;

      const idEdit_Des = document.getElementById("edDes");
      const idEdit_Det = document.getElementById("edDet");

      idEdit_Des.value = description;
      idEdit_Det.value = details;

      const modEditModal = new bootstrap.Modal(document.getElementById('editModal'));
      modEditModal.show();
  })
  .catch(function (error) {
    console.log("Messages not found")
  })
}

// Back from the editModal to store new content
async function saveEdit() {
  const idDescri = document.getElementById("edDes").value;
  const idDetail = document.getElementById("edDet").value;

  // To test if there is no content or are just spaces
  let test_Descri = idDescri.replace(/\s+/g, '');
  let test_Detail = idDetail.replace(/\s+/g, '');

  if (test_Detail =='' || test_Descri == '') {
    const modEmpty = new bootstrap.Modal(document.getElementById('empty_filed'));
    modEmpty.show();
    return
  }

  await axios.put(`${url}/user/${usrIndice}/message/${id}`, {
    description: idDescri,
    details: idDetail
  })
  .then(function (response) {
      messages = response.data
  })
  .catch(function (error) {
      console.log("edit message error")
  })

  show_msgs();
}

// Store new messages
async function saveData() {
  const idDescri = document.getElementById("desCrip");
  const idDetail = document.getElementById("detAil");
  //Separation to be able to clean the fields for new content at the end
  let descriNew = idDescri.value.slice(0,44);
  let detailNew = idDetail.value.slice(0,149);
  // Remove spaces
  const test_Descri = descriNew.replace(/\s+/g, '');
  const test_Detail = detailNew.replace(/\s+/g, '');

  if (test_Detail =='' || test_Descri == '') {
    const modEmpty = new bootstrap.Modal(document.getElementById('empty_filed'));
    modEmpty.show();
    return
  }

  await axios.post(`${url}/message/${usrIndice}`, {
    description: descriNew,
    details: detailNew
  })
  .then(function (response) {
    messages = response.data
  })
  .catch(function (error) {
    console.log("message or user not found")
  })

  // To clear the inputs for new contet
  idDescri.value = '';
  idDetail.value = '';
  show_msgs();
}

function logout() {
  nameUser = "";
  sessionStorage.clear();
  //id = null;
  location.href = "./index.html";
}
