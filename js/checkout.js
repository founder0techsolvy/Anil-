// ✅ Firebase Import

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js"; // Add Storage import

import { firebaseConfig } from "./firebase.js"; // ✅ Importing only config

// ✅ Firebase Configuration and Initialize

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app); // Initialize Storage

// ✅ Start Loader (Common for Login & Checkout Data)

function startLoader() {

if (!document.getElementById("loadingSpinner")) {

const loader = document.createElement("div");

loader.id = "loadingSpinner";

loader.style.position = "fixed";

loader.style.top = "0";

loader.style.left = "0";

loader.style.width = "100vw";

loader.style.height = "100vh";

loader.style.background = "rgba(0, 0, 0, 0.7)";

loader.style.display = "flex";

loader.style.alignItems = "center";

loader.style.justifyContent = "center";

loader.style.zIndex = "9999";

loader.innerHTML = `

  <div style="width: 60px; height: 60px; border: 5px solid white; border-top-color: #FF0000; border-radius: 50%; animation: spin 1s linear infinite;"></div>  <style>@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }</style>`;

document.body.appendChild(loader);

}

}

// ✅ Stop Loader

function stopLoader() {

const loader = document.getElementById("loadingSpinner");

if (loader) {

loader.remove();

}

}

// ✅ Check Authentication + Load Checkout Data with Loader

startLoader(); // ✅ Loader Start before everything

onAuthStateChanged(auth, (user) => {

if (!user) {

alert("⚠ Please login to continue checkout.");

sessionStorage.setItem("redirectAfterLogin", window.location.href);

window.location.href = "login.html";

} else {

document.getElementById("userEmail").textContent = user.email;

document.getElementById("userEmail").style.display = "inline-block";

loadCheckoutData();

}

});

// ✅ Load Order Details from sessionStorage (Fixed Properly)
function loadCheckoutData() {
  setTimeout(() => {
    const orderDetails = JSON.parse(sessionStorage.getItem("orderDetails"));
    if (!orderDetails) {
      alert("⚠ No order details found! Redirecting to home.");
      window.location.href = "index.html";
      return;
    }
    
    // Fill basic order details
    document.getElementById("orderName").textContent = orderDetails.name || "";
    document.getElementById("orderPrice").textContent = orderDetails.price || "";
    document.getElementById("orderType").textContent = `Product Type: ${orderDetails.type || ""}`;
    document.getElementById("fullName").textContent = orderDetails.fullName || "";
    document.getElementById("address").textContent = orderDetails.address || "";
    document.getElementById("city").textContent = orderDetails.city || "";
    document.getElementById("state").textContent = orderDetails.state || "";
    document.getElementById("pincode").textContent = orderDetails.pincode || "";
    document.getElementById("mobile").textContent = orderDetails.mobile || "";
    
    // Clear previous preview
    document.getElementById("orderImage1").style.display = "none";
    document.getElementById("orderImage2").style.display = "none";
    const pdfPreviewContainer = document.getElementById("pdfPreviewContainer");
    if (pdfPreviewContainer) {
      pdfPreviewContainer.innerHTML = "";
      pdfPreviewContainer.style.display = "none";
    }
    const pdfPasswordDisplay = document.getElementById("pdfPasswordDisplay");
    if (pdfPasswordDisplay) {
      pdfPasswordDisplay.textContent = "";
      pdfPasswordDisplay.style.display = "none";
    }
    
    // Check for PDF or Images
if (orderDetails.pdfBase64) {
  if (pdfPreviewContainer) {
    pdfPreviewContainer.style.display = "flex";
    pdfPreviewContainer.style.flexDirection = "column";
    pdfPreviewContainer.style.justifyContent = "center";
    pdfPreviewContainer.style.alignItems = "center";
    pdfPreviewContainer.style.marginTop = "20px"; // upar thoda gap
    
    pdfPreviewContainer.innerHTML = `
      <embed src="${orderDetails.pdfBase64}" type="application/pdf" width="250px" height="350px" style="border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);" />
    `;
  }
  
  // ✅ Show Password if available
  if (orderDetails.pdfPassword && orderDetails.pdfPassword.trim() !== "") {
    if (pdfPasswordDisplay) {
      pdfPasswordDisplay.style.display = "block";
      pdfPasswordDisplay.style.marginTop = "15px"; // embed ke neeche gap
      pdfPasswordDisplay.style.textAlign = "center"; // center alignment
      pdfPasswordDisplay.style.color = "#28a745"; // Bright professional green color
      pdfPasswordDisplay.style.fontWeight = "bold";
      pdfPasswordDisplay.style.fontSize = "1.2rem"; // Slightly bigger text
      pdfPasswordDisplay.style.fontFamily = "'Segoe UI', sans-serif"; // Professional font
      pdfPasswordDisplay.textContent = `PDF Password: ${orderDetails.pdfPassword}`;
    }
  }
}
else if (orderDetails.image1 && orderDetails.image2) {
      // ✅ Images Upload detected
      const img1 = document.getElementById("orderImage1");
      img1.src = orderDetails.image1;
      img1.style.display = "block";
      
      const img2 = document.getElementById("orderImage2");
      img2.src = orderDetails.image2;
      img2.style.display = "block";
    }
    
    stopLoader();
  }, 1000);
}
// ✅ Payment Integration with Razorpay

document.getElementById("placeOrderBtn").addEventListener("click", async function() {

try {

const orderDetails = JSON.parse(sessionStorage.getItem("orderDetails"));



const user = auth.currentUser;

if (!user) {



  alert("Please login first!");



  return window.location.href = "login.html";



}



// Basic Validation



if (!orderDetails?.price || !orderDetails?.name) {



  throw new Error("Invalid order details");



}
showLoader();


// Convert Price to Paise
const amount = parseInt(orderDetails.price.replace(/[^0-9]/g, "")) * 100;

const options = {



  key: "rzp_test_NfDhAFYplEhZEf",
  amount: amount,
  currency: "INR",
  name: "Print 420",
  description: orderDetails.name,
  image: "https://codesparshofficial.github.io/Print420/img12.png",
  prefill: {
    name: orderDetails.fullName,
    email: user.email,
    contact: orderDetails.mobile
  },
  theme: { color: "#FFB3B3" },
  handler: async function(response) {

    try {



      if (!response.razorpay_payment_id) {



        throw new Error("Payment failed");



      }



      



      // Upload Images to Firebase Storage



      const uploadImage = async (imgData, imgName, onProgress) => {

if (!imgData.startsWith("data:image/")) return imgData;

const blob = await fetch(imgData).then(r => r.blob());

const storageRef = ref(storage, `orders/${auth.currentUser.uid}/${Date.now()}_${imgName}`);

const uploadTask = uploadBytesResumable(storageRef, blob);

return new Promise((resolve, reject) => {

uploadTask.on("state_changed",

  (snapshot) => {

    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

    if (onProgress) onProgress(progress.toFixed(0)); // Send rounded percentage

  },

  (error) => reject(error),

  async () => {

    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

    resolve(downloadURL);

  }

);

});

};

// Upload both images



      let currentUpload = 1;

const [image1Url, image2Url] = await Promise.all([

uploadImage(orderDetails.image1, "design1", (progress) => {

updateProgress(currentUpload, progress);

}),

uploadImage(orderDetails.image2 || "", "design2", (progress) => {

currentUpload = 2;

updateProgress(currentUpload, progress);

})

]);

// Save order with image URLs



      // Save order with paymentStatus

await saveOrderToFirebase({

...orderDetails,

image1: image1Url,

image2: image2Url || "No second image",

email: user.email,

uid: user.uid,

paymentId: response.razorpay_payment_id,

paymentStatus: "Paid",  // ✅ Payment Status Added

timestamp: new Date().toISOString()

});

// ✅ Save Order Details in sessionStorage for order-success.html

sessionStorage.setItem("paymentDetails", JSON.stringify({

orderDetails: {

name: orderDetails.name,



price: orderDetails.price

},

paymentId: response.razorpay_payment_id,

paymentStatus: "Paid"

}));

// ✅ Redirect to Order Success Page

window.location.href = "order-success.html";

window.location.href = "order-success.html";



    } catch (error) {



      alert(`Payment Failed: ${error.message}`);



    } finally {



      hideLoader();



    }



  },



  modal: {



    ondismiss: () => {



      alert("Payment cancelled. You can retry payment.");



      hideLoader();



    }



  }



};

const rzp = new Razorpay(options);
rzp.open();

} catch (error) {

alert(`Error: ${error.message}`);



hideLoader();

}

});

function updateProgress(imageNo, percent) {

const progressBar = document.getElementById("uploadProgressBar");

const progressText = document.getElementById("uploadProgressText");

if (progressBar && progressText) {

progressText.textContent = `Uploading image ${imageNo}: ${percent}%`;

progressBar.style.width = `${percent}%`;

}

}

// ✅ Show Funny Loader Function (Red-White Theme)

function showLoader() {
  if (!document.getElementById("customLoader")) {
    const loader = document.createElement("div");
    loader.id = "customLoader";
    loader.style.position = "fixed";
    loader.style.top = "0";
    loader.style.left = "0";
    loader.style.width = "100vw";
    loader.style.height = "100vh";
    loader.style.background = "#FFFFFF";
    loader.style.backdropFilter = "blur(6px)";
    loader.style.display = "flex";
    loader.style.flexDirection = "column";
    loader.style.alignItems = "center";
    loader.style.justifyContent = "center";
    loader.style.zIndex = "9999";
    
    loader.innerHTML = `
      <div class="loader-animation"></div>
      <div style="margin-top: 30px; width: 80%; max-width: 400px; text-align: center;">
        <div style="position: relative; background: #eee; border-radius: 10px; overflow: hidden; height: 20px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);">
          <div id="uploadProgressBar" style="height: 100%; width: 0%; background: linear-gradient(90deg, #ff4b4b, #d80000); border-radius: 10px; transition: width 0.3s ease;"></div>
          <div id="uploadProgressText" style="position: absolute; width: 100%; top: 0; left: 0; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: bold; background: rgba(0,0,0,0.2);  /* Add this line */ color: white; font-family: 'Segoe UI', sans-serif;">Uploading image 1: 0%</div>
        </div>
        <div style="margin-top: 15px; font-size: 1.5rem; color: #000000;">Please wait while we upload your files...</div>
      </div>
<style>
#uploadProgressBar {
  background: linear-gradient(270deg, #ff4b4b, #d80000);
  background-size: 200% 200%;
  animation: progressAnim 1.5s ease infinite;
}

@keyframes progressAnim {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
} </style>
      <style>
        .loader-animation {
          width: 60px;
          height: 60px;
          border: 6px solid rgba(216, 0, 0, 0.2);
          border-top: 6px solid #d80000;
          border-radius: 50%;
          animation: spin 1.2s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(216, 0, 0, 0.4);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
    `;
    
    document.body.appendChild(loader);
  }
}
// ✅ Hide Loader Function

function hideLoader() {

const loader = document.getElementById("customLoader");

if (loader) {

loader.remove();



console.log("✅ Funny Loader Removed (Red-White Theme)");

}

}

// ✅ Save Order to Firebase Firestore

async function saveOrderToFirebase(order) {

try {

const user = auth.currentUser;
if (!user) throw new Error("User not authenticated");

// ✅ Get Current Date & Time (Formatted)
const now = new Date();

const formattedDateTime = now.toLocaleString("en-IN", { 
  day: "2-digit", month: "2-digit", year: "numeric", 
  hour: "2-digit", minute: "2-digit", second: "2-digit",
  hour12: true 
});

const orderWithUID = {
  ...order,
  uid: user.uid,
  createdAt: formattedDateTime // Save formatted date-time
};

await addDoc(collection(db, "orders"), orderWithUID);

} catch (error) {

throw new Error("Firestore save failed: " + error.message);

}

}

// ✅ Retrieve Payment Details

function getPaymentDetails() {

const paymentData = JSON.parse(sessionStorage.getItem("paymentDetails"));

if (paymentData) {

console.log("✅ Payment Data Retrieved:", paymentData);

return paymentData;

} else {

console.log("❌ No Payment Data Found.");

return null;

}

}
