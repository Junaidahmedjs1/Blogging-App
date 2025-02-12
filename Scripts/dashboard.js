import { onAuthStateChanged, } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth, db } from "./firebaseconfig.js";
import { collection, addDoc, Timestamp,} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const form = document.querySelector(`#form`)
const title = document.querySelector(`#title`)
const description = document.querySelector(`#description`)


let imagePost = ""

onAuthStateChanged(auth,(user) => {
    if (user) {
        const uid = user.uid;
        console.log(uid);

    } else {
        window.location = "login.html"
    }
});

// Cloudinary upload widget initialization
let myWidget = cloudinary.createUploadWidget({
    cloudName: 'dhcqfjulx',
    uploadPreset: 'Blogging App'
}, (error, result) => {
    if (!error && result && result.event === "success") {
        console.log('Done! Here is the image info: ', result.info);
        // Store the image URL once uploaded successfully
        imagePost = result.info.secure_url;
    }
});

// Trigger Cloudinary upload widget on button click
document.getElementById("upload_widget").addEventListener("click", function () {
    myWidget.open();
}, false);

form.addEventListener("submit",async (e)=>{
    e.preventDefault();

    // Check if the user has uploaded an image
    if (!imagePost) {
        alert("Please upload a profile picture first.");
        return;
    }
    
    try {
            const docRef = await addDoc(collection(db, "blogs"), {
                title:title.value,
                description: description.value,
                profileImg:imagePost,
                uid: auth.currentUser.uid,
                date: Timestamp.fromDate(new Date()),
                

            });
           
            console.log("Document written with ID are sumbit of dashborad: ", docRef.id);
            window.location = 'index.html'
        } 
        catch (e) {
            console.error("Error adding document: ", e);
        }
    
})