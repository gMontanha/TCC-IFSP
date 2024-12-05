import loadUserPage from '/user.js';

const registerLink = document.getElementById("registerLink");
const loginLink = document.getElementById("loginLink");
const box = document.querySelector(".tableBox");
const registerButton = document.getElementById("btnRegister");
const loginButton = document.getElementById("btnLogin");
const spinner = document.getElementById("loadingSpinner");
const overlay = document.getElementById("loadingOverlay");

//Transição de Login para Cadastro
registerLink.addEventListener('click', ()=> {
  box.classList.add('active');
})

loginLink.addEventListener('click', ()=> {
  box.classList.remove('active');
})
//----------------------------------------

//Toggle do carregamento
function showSpinner() {
  overlay.style.display = "flex";
  spinner.style.display = "block";
}

function hideSpinner() {
  overlay.style.display = "none";
  spinner.style.display = "none";
}
//------------------------------------------

//Login
loginButton.addEventListener('click', async () => {
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;

  if (!email || !password) {
    alert('Por favor coloque o email e a senha.');
    return;
  }

  try {
    showSpinner();
    const response = await fetch('https://csqcehp0h0.execute-api.sa-east-1.amazonaws.com/loginWithVerified', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('authToken', data.token); //Salva o token JWT
      loadUserPage();
    } else {
      console.error('Error:', data.message);
      alert(data.message || 'Falha no Login');
    }
  } catch (error) {
    console.error('Erro ao fazer request de login:', error);
    alert('Um erro ocorreu. Por favor tente novamente');
  } finally {
    hideSpinner();
  }
});


//Cadastro
registerButton.addEventListener('click', async ()=> {
  var nameValue = document.getElementById("registerName").value;
  var emailValue = document.getElementById("registerEmail").value;
  var passValue = document.getElementById("registerPass").value;
  var confValue = document.getElementById("registerCPass").value;
  let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;

  //Filtros
  if (!nameValue || !emailValue || !passValue || !confValue) {
    alert("Por favor preencha todas as lacunas.");
    return;
  }

  if (!passValue.match (regex)) {
    alert("Senha inválida! Sua senha deve ter:\n- 8 caracteres\n- Pelo menos uma letra minúscula\n- Pelo menos uma letra maiúscula\n- Um número");
    return;
  }

  if (passValue !== confValue) {
    alert("Suas senhas não estão iguais! Por favor preencha elas novamente.");
    return;
  }
  //---------------------------------

  try {
    showSpinner();
    const response = await fetch('https://nbwkd21sjb.execute-api.sa-east-1.amazonaws.com/sendConfirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: emailValue, name: nameValue, password: passValue }),
    });

    const data = await response.json();

    if (data.message === 'Email sent') {
      console.log('Confirmation email sent');
      alert("Um email foi enviado para você. Por favor confirme seu cadastro nele.");
    } else {
      console.log('Error sending email:', data.error);
      alert("Acontenceu um erro ao enviar o email. Por favor tente mais tarde.");
    }
  } catch (error) {
    console.error('Error:', error);
    alert("Um erro ocorreu. Por favor tente novamente.");
  } finally {
    hideSpinner(); // Hide spinner after request completes
  }
});