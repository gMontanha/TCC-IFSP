async function saveWorkSchedule() {
    /**
    const workDays = [
        { day: "Monday", start: "09:00", end: "18:00" },
        { day: "Tuesday", start: "10:00", end: "17:00" }
    ];
    */

    const response = await fetch('https://https://1n4l7hnfpg.execute-api.sa-east-1.amazonaws.com/saveSchedule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ email: userEmail, workDays })
    });

    const result = await response.json();
    console.log(result.message);
}

export default saveWorkSchedule;