import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { auth, db } from "./firebaseconfig.js";

// Form and input selectors
const form = document.querySelector("#form");
const email = document.querySelector("#signupEmail");
const password = document.querySelector("#signupPassword");
const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");

let userProfilePicUrl = "";

// Cloudinary upload widget initialization
let myWidget = cloudinary.createUploadWidget({
    cloudName: 'dhcqfjulx',
    uploadPreset: 'ThinkSpot'
}, (error, result) => {
    if (!error && result && result.event === "success") {
        console.log('Done! Here is the image info: ', result.info);
        // Store the image URL once uploaded successfully
        userProfilePicUrl = result.info.secure_url;
    }
});

// Trigger Cloudinary upload widget on button click
document.getElementById("upload_widget").addEventListener("click", function () {
    myWidget.open();
}, false);

form.addEventListener("submit", event => {
    event.preventDefault();

    // Check if the user has uploaded an image
    if (!userProfilePicUrl) {
        alert("Please upload a profile picture first.");
        return;
    }

    console.log(email.value);
    console.log(password.value);
    console.log(firstName.value);
    console.log(lastName.value);

    // Create a user in Firebase Authentication
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then(async (userCredential) => {
            const user = userCredential.user;
            console.log(user);

            // Add user data to Firestore only after successful Firebase Authentication
            try {
                const docRef = await addDoc(collection(db, "users"), {
                    firstName: firstName.value,
                    lastName: lastName.value,
                    email: email.value,
                    profileImage: userProfilePicUrl,
                    uid: user.uid
                });
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
        });
});
