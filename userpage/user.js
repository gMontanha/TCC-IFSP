async function loadUserPage() {
    const token = localStorage.getItem('authToken');
    console.log('Retrieved token:', token);

    if (!token) {
        alert('Não autorizado! Por favor entre por via de login.');
        window.location.href = '/'; // Redireciona pro Login
        return;
    }

    try {
        const responseCheck = await fetch('/auth-check', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!responseCheck.ok) {
            throw new Error('Unauthorized');
        }
        else {
            const responseLogin = await fetch('/login', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!responseLogin.ok){
                throw new Error('Login Problems');
            }

            window.location.href = '/user'
        } 

    }catch (error) {
        console.error('Error loading user page:', error);
        alert('Não autorizado! Por favor entre pro via de login.');
        window.location.href = '/'; // Redireciona pro Login
    }
}

export default loadUserPage;