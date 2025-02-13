// Firebase imports
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth, db } from "./firebaseconfig.js";
import { collection, getDocs, where, orderBy, query } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Selectors
const loginBtn = document.querySelector('#login-btn');
const loginUser = document.querySelector('#login-user');
const userName = document.querySelector('#user-profile-name');
const userProfileImage = document.querySelector('#user-profile-img');
const cardContainer = document.querySelector('#card-container');

// Check user authentication status
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userData = await getUserData(user.uid);
        
        // Update UI with logged-in user details
        loginBtn.classList.add('d-none');
        loginUser.classList.remove('d-none');
        userName.innerHTML = `${userData.firstName} ${userData.lastName}`;
        userProfileImage.src = userData.profileImage;

        // Fetch and display posts
        await renderPosts();
    } else {
        window.location = "login.html"; // Redirect if not logged in
    }
});

// Fetch user data from Firestore
async function getUserData(uid) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    let userData = null;
    querySnapshot.forEach((doc) => {
        userData = doc.data();
    });

    return userData;
}

// Fetch and display blog posts
async function renderPosts() {
    if (!cardContainer) {
        console.error('Card container not found!');
        return;
    }

    cardContainer.innerHTML = '';

    const q = query(collection(db, "blogs"), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const post = doc.data();
        console.log("Fetched Post Data:", post); // 👈 Debugging

        if (!post.userName || !post.userImage) {
            console.warn("User data missing in post!", post);
        }

        const postElement = `
        <div class="card">
            <div class="card-header d-flex align-items-center">
                <img src="${post.userImage || 'default-profile.png'}" class="rounded-circle" alt="Profile Image" style="width: 50px; height: 50px; object-fit: cover;">
                <div class="ms-3">
                    <h6 class="mb-0">${post.userName || 'Unknown User'}</h6>
                    <small class="text-muted">Posted on ${post.date.toDate().toLocaleString()}</small>
                </div>
            </div>

            <div class="card-body">
                <p>${post.description}</p>
                <img class="img-fluid rounded" style="width: 100%;" src="${post.profileImg}" alt="Post Image">
            </div>
        </div>`;

        cardContainer.innerHTML += postElement;
    });
}

