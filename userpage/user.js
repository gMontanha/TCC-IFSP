async function loadUserPage() {
    const token = localStorage.getItem('authToken');
    console.log('Retrieved token:', token);

    if (!token) {
        alert('Não autorizado! Por favor entre pro via de login.');
        window.location.href = '/'; // Redireciona pro Login
        return;
    }

    try {
        const response = await fetch('/user', {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error('Unauthorized');
        }
        else {
            window.location.href = '/user';
        }
    } catch (error) {
        alert('Não autorizado! Por favor entre pro via de login.');
        console.error('Error loading user page:', error);
        window.location.href = '/'; // Redireciona pro Login
    }
}

export default loadUserPage;