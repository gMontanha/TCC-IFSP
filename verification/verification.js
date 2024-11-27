const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (!token) {
  document.getElementById('message').textContent = 'Link de verificação inválido.';
} else {
    //Chama API
  fetch('https://2gm2dsgsm0.execute-api.sa-east-1.amazonaws.com/verifyAgendagoraEmail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: token }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Falha na Verificação');
      }
    })
    .then((data) => {
      document.getElementById('message').textContent = 'Conta verificada com sucesso!';
    })
    .catch((error) => {
      console.error('Error:', error);
      document.getElementById('message').textContent = 'Falha na verificação. Tente novamente mais tarde';
    });
}