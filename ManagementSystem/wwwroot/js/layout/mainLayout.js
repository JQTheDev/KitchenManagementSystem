document.getElementById("homeButton").addEventListener("click", function () {
    window.location.href = '/Home';
});

document.getElementById("logoutButton").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the form from submitting traditionally
    fetch('/Login/Logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }).then(response => {
        if (response.ok) {
            window.location.href = '/Login/Index';
        }
    });
});
