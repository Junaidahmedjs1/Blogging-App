// Firebase imports
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth, db } from "./firebaseconfig.js";
import { collection, getDocs, where, query } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Selectors
const loginBtn = document.querySelector('#login-btn');
const loginUser = document.querySelector('#login-user');
const userName = document.querySelector('#user-profile-name');
const userProfileImage = document.querySelector('#user-profile-img');

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


document.addEventListener("DOMContentLoaded", async () => {

    //  Ensure userPostsContainer exists
    const userPostsContainer = document.querySelector("#user-posts-container");

    //  Fetch User ID from Local Storage
    const userId = localStorage.getItem("selectedUserId");
    console.log("Fetched User ID:", userId);

    if (!userId) {
        console.error(" Error: No User ID Found in Local Storage!");
        userPostsContainer.innerHTML = "<h3 class='text-danger'>Invalid User</h3>";
        return;
    }

    //  Fetch and display user posts
    await fetchUserPosts(userId, userPostsContainer);
});

// Function to fetch user posts
async function fetchUserPosts(userId, userPostsContainer, userProfileSection) {
    try {
        console.log(" Fetching User Data...");
        const usersRef = collection(db, "users");
        const userQuery = query(usersRef, where("uid", "==", userId));
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
            console.error(" User Not Found in Firestore");
            userPostsContainer.innerHTML = "<h3 class='text-danger'>User Not Found</h3>";
            return;
        }

        let userData;
        userSnapshot.forEach((doc) => {
            userData = doc.data();
        });

        console.log(" User Data Fetched:", userData);


        // Fetch user's blog posts
        console.log(" Fetching User Blogs...");
        const blogsRef = collection(db, "blogs");
        const blogsQuery = query(blogsRef, where("uid", "==", userId));
        const blogsSnapshot = await getDocs(blogsQuery);

        if (blogsSnapshot.empty) {
            userPostsContainer.innerHTML = "<h4 class='text-muted'>No Blogs Found</h4>";
            return;
        }

        userPostsContainer.innerHTML = "";
        blogsSnapshot.forEach((doc) => {
            const post = doc.data();
            console.log("Blog Post Data:", post);

            userPostsContainer.innerHTML += `
                <div class="card mt-5">
                    <div class="card-header d-flex align-items-center">
                        <img src="${post.userImage}" class="rounded-circle" alt="User Image" width="50">
                        <div class="ms-3">
                            <h6 class="fw-bold fs-6">${post.userName}</h6>
                            <small class="text-muted">${post.date.toDate().toLocaleString()}</small>
                        </div>
                    </div>
                    <div class="card-body">
                        <p>${post.description}</p>
                        <img src="${post.profileImg}" class="img-fluid rounded">
                    </div>
                </div>
            `;
        });

        console.log("All User Blogs Displayed!");
    } catch (error) {
        console.error("Error Fetching User Posts:", error);
        userPostsContainer.innerHTML = "<h3 class='text-danger'>Something went wrong!</h3>";
    }
}
