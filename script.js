document.addEventListener('DOMContentLoaded', function() {
    // Admin login functionality
    const loginForm = document.getElementById('login-form');
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');

    const validAdmins = {
        'admin1': 'password1',
        'admin2': 'password2',
        'admin3': 'password3',
        'admin4': 'password4',
        'admin5': 'password5',
        'admin6': 'password6'
    };

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const username = usernameField.value;
            const password = passwordField.value;

            if (validAdmins[username] && validAdmins[username] === password) {
                window.location.href = 'update.html';
            } else {
                alert('Invalid username or password');
            }
        });
    }

    // Leaderboard update functionality
    const updateForm = document.getElementById('update-form');
    const leaderboard = document.getElementById('leaderboard').getElementsByTagName('tbody')[0];

    if (updateForm) {
        updateForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const rank = parseInt(document.getElementById('rank').value);
            const name = document.getElementById('name').value;
            const score = parseInt(document.getElementById('score').value);

            // Check if the rank already exists
            let existingRow = leaderboard.querySelector(`tr[data-rank="${rank}"]`);

            if (existingRow) {
                // Update existing row
                existingRow.cells[1].innerText = name;
                existingRow.cells[2].innerText = score;
            } else {
                // Create a new row if it doesn't exist
                let newRow = leaderboard.insertRow();
                newRow.setAttribute('data-rank', rank);

                let rankCell = newRow.insertCell(0);
                let nameCell = newRow.insertCell(1);
                let scoreCell = newRow.insertCell(2);

                rankCell.innerText = rank;
                nameCell.innerText = name;
                scoreCell.innerText = score;
            }

            // Optional: Clear the form after submission
            updateForm.reset();
        });
    }
});
