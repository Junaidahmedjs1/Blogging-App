import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth, db } from "./firebaseconfig.js";
import { collection, addDoc, getDocs, query, where, Timestamp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const form = document.querySelector(`#form`);
const description = document.querySelector(`#description`);
let imagePost = "";

onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User logged in:", user.uid);
    } else {
        window.location = "login.html";
    }
});

// ✅ Function to fetch user data from Firestore
async function getUserData(uid) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        console.error("User data not found!");
        return null;
    }

    let userData = null;
    querySnapshot.forEach((doc) => {
        userData = doc.data();
    });

    return userData;
}

// ✅ Cloudinary Image Upload
let myWidget = cloudinary.createUploadWidget({
    cloudName: 'dhcqfjulx',
    uploadPreset: 'Blogging App'
}, (error, result) => {
    if (!error && result && result.event === "success") {
        console.log('Image Uploaded:', result.info.secure_url);
        imagePost = result.info.secure_url;
    }
});

document.getElementById("upload_widget").addEventListener("click", function () {
    myWidget.open();
}, false);

// ✅ Form Submit Event Listener
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!imagePost) {
        alert("Please upload an image first.");
        return;
    }

    try {
        const user = auth.currentUser;
        if (!user) {
            console.error("No authenticated user found.");
            return;
        }

        const userData = await getUserData(user.uid);
        if (!userData) {
            console.error("User data not found in Firestore!");
            return;
        }

        await addDoc(collection(db, "blogs"), {
            description: description.value,
            profileImg: imagePost,
            uid: user.uid,
            userName: `${userData.firstName} ${userData.lastName}`, // ✅ Save correct name
            userImage: userData.profileImage, // ✅ Save correct profile image
            date: Timestamp.fromDate(new Date()),
        });

        console.log("Post added successfully!");
        window.location = 'index.html';
    } catch (error) {
        console.error("Error adding post:", error);
    }
});
