import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth, db } from "./firebaseconfig.js";
import { collection, getDocs, orderBy, query, where } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const loginBtn = document.querySelector('#login-btn');
const loginUser = document.querySelector('#login-user');
const userName = document.querySelector('#user-profile-name');
const userProfileImage = document.querySelector('#user-profile-img');
const cardContainer = document.querySelector('#card-container');

// Authentication state observer
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log(uid);

        let users = await getDataFromFirestore(uid); // Fetch user data
        console.log(users);

        // Update UI with logged-in user's data
        loginBtn.classList.add('d-none');
        loginUser.classList.remove('d-none');
        userName.innerHTML = `${users.firstName} ${users.lastName}`;
        userProfileImage.src = users.profileImage;

        // After user authentication, render the posts
        await renderPosts(uid, users);  // Pass uid and users data to render posts
    } else {
        window.location = "login.html";
    }
});

// Fetch user data from Firestore
async function getDataFromFirestore(uid) {
    let user = null;
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        user = doc.data();
    });
    return user;
}

// Fetch and render blog posts
async function renderPosts(uid, users) {
    // Ensure that cardContainer is available
    if (!cardContainer) {
        console.error('Card container not found!');
        return;
    }

    // Clear the container before rendering posts
    cardContainer.innerHTML = '';

    // Query to fetch blog posts from Firestore
    const q = query(collection(db, "blogs"), orderBy('date', 'desc'), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const post = doc.data();

        // Render each post with the user data (first name, last name, profile image)
        const postElement = `
        <div class="card shadow-sm mb-3">
            <div class="card-header d-flex align-items-center">
                <img src="${users.profileImage}" class="rounded-circle" alt="Profile Image" style="width: 50px; height: 50px; object-fit: cover;">
                <div class="ms-3">
                    <h6 class="mb-0">${users.firstName} ${users.lastName}</h6>
                    <small class="text-muted">Posted on ${post.date.toDate().toLocaleString()}</small>
                </div>
            </div>

            <div class="card-body">
                <p>${post.description}</p>
                <img class="img-fluid rounded" style="width: 100%;"  src="${post.profileImg}" alt="Post Image">
            </div>
        </div>`;

        cardContainer.innerHTML += postElement;  // Add post to the container
    });
}
