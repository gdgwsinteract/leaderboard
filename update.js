// Check if the user is logged in
document.addEventListener("DOMContentLoaded", function() {
    // Check if user is authenticated
    if (sessionStorage.getItem("authenticated") !== "true") {
        window.location.href = "login.html";
    } else {
        // Retrieve username from sessionStorage
        const username = sessionStorage.getItem("username");

        if (username) {
            // Check if the username is for the teacher
            if (username === "Anshul") {
                document.getElementById("welcomeMessage").textContent = `Hello, ${username} ma'am 👋`;
            } else {
                document.getElementById("welcomeMessage").textContent = `Hi, ${username}`;
            }
        } else {
            // Redirect to login page if username is not available
            window.location.href = "login.html";
        }
    }
});

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCS-hmjPhmWqzEtAZga9jnM5MK3YsOAoS0",
    authDomain: "boom-ff045.firebaseapp.com",
    databaseURL: "https://boom-ff045.firebaseio.com",
    projectId: "boom-ff045",
    storageBucket: "boom-ff045.appspot.com",
    messagingSenderId: "741169276496",
    appId: "1:741169276496:web:42e57a066f208f686e1355"
};

// Initialize Firebase app
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Load leaderboard (including hidden entries)
async function loadUnfilteredLeaderboard() {
    const leaderboardTable = document.getElementById('leaderboard-body'); // Ensure this ID is in your HTML
    leaderboardTable.innerHTML = ''; // Clear the table first

    // Fetch data from Firestore, ordered by points
    const q = db.collection('leaderboard').orderBy('points', 'desc');
    const querySnapshot = await q.get();
    let rank = 1;

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const row = leaderboardTable.insertRow();

        const cellRank = row.insertCell(0);
        const cellName = row.insertCell(1);
        const cellPoints = row.insertCell(2);
        const cellAction = row.insertCell(3); // For hide/unhide button

        // Add content to the cells
        cellRank.textContent = rank;
        cellName.textContent = data.name;
        cellPoints.textContent = data.points;

        // Add hide/unhide button
        const hideButton = document.createElement('button');
        hideButton.textContent = data.hidden ? 'Unhide' : 'Hide';
        hideButton.onclick = async () => {
            await db.collection('leaderboard').doc(doc.id).update({
                hidden: !data.hidden
            });
            loadUnfilteredLeaderboard(); // Refresh the table after hiding/unhiding
        };
        cellAction.appendChild(hideButton);

        rank++;
    });
}

// Call loadUnfilteredLeaderboard when the page loads
document.addEventListener('DOMContentLoaded', loadUnfilteredLeaderboard);

// Add the event listener for the update form submission
document.getElementById('update-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const pointsToAdd = parseInt(document.getElementById('points').value);

    // Update the leaderboard in Firebase by adding points
    const docRef = db.collection('leaderboard').doc(name);
    docRef.get().then((doc) => {
        if (doc.exists) {
            const currentPoints = doc.data().points || 0; // Default to 0 if not set
            docRef.update({
                points: currentPoints + pointsToAdd
            }).then(() => {
                alert("Points successfully added!"); 
                document.getElementById('name').value = '';
                document.getElementById('points').value = '';
                loadUnfilteredLeaderboard();  // Reload the leaderboard after update
            }).catch((error) => {
                console.error("Error updating points: ", error);
            });
        } else {
            // If the document doesn't exist, create it
            docRef.set({
                name: name,
                points: pointsToAdd,
                isVisible: true,
            }).then(() => {
                alert("Person succesfully added to leaderboard!"); 
                document.getElementById('name').value = '';
                document.getElementById('points').value = '';
                loadUnfilteredLeaderboard();  // Reload the leaderboard after update
            }).catch((error) => {
                console.error("Error writing document: ", error);
            });
        }
    }).catch((error) => {
        console.error("Error getting document: ", error);
    });
});

// Add the event listener for the deduct form submission
document.getElementById('deduct-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('deduct-name').value;
    const pointsToDeduct = parseInt(document.getElementById('deduct-points').value);

    // Update the leaderboard in Firebase by deducting points
    const docRef = db.collection('leaderboard').doc(name);
    docRef.get().then((doc) => {
        if (doc.exists) {
            const currentPoints = doc.data().points || 0; // Default to 0 if not set
            const newPoints = Math.max(currentPoints - pointsToDeduct, 0); // Prevent negative points
            
            docRef.update({
                points: newPoints
            }).then(() => {
                alert("Points successfully deducted!"); 
                document.getElementById('name').value = '';
                document.getElementById('points').value = '';
                loadUnfilteredLeaderboard();  // Reload the leaderboard after deduction
            }).catch((error) => {
                console.error("Error deducting points: ", error);
            });
        } else {
            console.log("Document does not exist!");
        }
    }).catch((error) => {
        console.error("Error getting document: ", error);
    });
});
