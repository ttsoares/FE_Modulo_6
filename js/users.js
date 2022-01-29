// Those 'id' are identifyers at the table's HTML code.
// They allways will be the 'uid' values in the 'uid'
//  colummn at table Messages
let id;

// Only works with the Admin token
const token = sessionStorage.getItem("token");
if (token !== "5d1fa092a4f036e3935d38506ee8bf56" ) logout();

const clockAnim = (document.getElementById("div-clock"))

let userName = document.getElementById("userName");
let tagH3 = document.createElement("H1");
tagH3.innerText = "Admin";
userName.appendChild(tagH3);

show_users()

async function show_users () {

  clockAnim.classList.remove("invisible");
  clockAnim.classList.add("visible");

  await axios.get(`${url}/users`)
    .then(function (response) {
      html = response.data  // HTML made by backend EJS
    })
    .catch(function (error) {
      console.log("users not found")
    })

    clockAnim.classList.remove("visible");
    clockAnim.classList.add("invisible");

    document.getElementById('allusers').innerHTML = html

    // Assign click events to the HTML rows
    const delBtns = document.getElementsByClassName('remove');
    const editBtns = document.getElementsByClassName('edit');
    for (var i=0; i < delBtns.length; i++) {
     delBtns[i].addEventListener('click', remove);
     editBtns[i].addEventListener('click', edit);
    };
}

async function remove() {
  id = this.getAttribute('id');
  id = id.slice(0,35) //  remove the "D" from the end of 'uid'

  clockAnim.classList.remove("invisible");
  clockAnim.classList.add("visible");

  await axios.delete(`${url}/user/${id}`)
    .then(function (response) {
    })
    .catch(function (error) {
      console.log("Erro ao apagar usuário")
    })

    clockAnim.classList.remove("visible");
    clockAnim.classList.add("invisible");

  show_users()
}

// Start the edit process by getting user data
async function edit() {
  id = this.getAttribute('id');
  id = id.slice(0,36); //  remove the "E" from the end of 'uid'

  await axios.get(`${url}/user/${id}`)
    .then(function (response) {
      user = response.data
      let uName = user.name;
      let password = user.password;
      let edit_Nam = document.getElementById("edNam");
      let edit_Pas = document.getElementById("edPas");
      edit_Nam.value = uName;
      edit_Pas.value = "";
      let editModal = new bootstrap.Modal(document.getElementById('editModal'));
      editModal.show();
  })
  .catch(function (error) {
    console.log("Usuário NÃO encontrado")
  })
}

// Back from the editModal to store new content
async function saveEdit() {
  const userName = document.getElementById("edNam").value;
  const passWord = document.getElementById("edPas").value;

  // To test if there is no content or are just spaces
  let test_Name = userName.replace(/\s/g, '');
  let test_Pass = passWord.replace(/\s/g, '');

  if (test_Name =='' || test_Pass == '') {

    const emptyModal = new bootstrap.Modal(document.getElementById('empty_filed'));
    emptyModal.show();

  } else {

    clockAnim.classList.remove("invisible");
    clockAnim.classList.add("visible");

    const hash = md5(`${userName}${passWord}`)

    await axios.put(`${url}/user/${id}`, {
      name: userName,
      password: hash
    })
      .then(function (response) {
        backUser = response.data
        console.log(backUser)
      })
      .catch(function (error) {
        console.log("Erro ao editar usuário")
      })

      clockAnim.classList.remove("visible");
      clockAnim.classList.add("invisible");
  }
  // To clear the inputs for new contet
  userName.value = '';
  passWord.value = '';

  show_users();
}

function logout() {
  nameUser = "";
  sessionStorage.clear();
  id = null;
  location.href = "./index.html";
}
