import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

 import { firebaseConfig } from "./firebase.js"; // ✅ Importing only config

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Ensure Navbar Loads First Before Applying Auth State Check
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userEmailDisplay = document.getElementById("userEmail"); // ✅ Email Display Element

  // ✅ Auth State Change Listener (Ensure Navbar Loads First)
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("✅ User Logged In:", user.email);
      loginBtn.style.display = "none";
      signupBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
      
      // ✅ Show Logged-in User Email
      if (userEmailDisplay) {
        userEmailDisplay.textContent = ` ${user.email}`;
        userEmailDisplay.style.display = "inline-block"; // Show email
      }
    } else {
      console.log("❌ User Logged Out");
      loginBtn.style.display = "inline-block";
      signupBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";
      
      // ✅ Hide Email Display on Logout and Show Login Button with Redirect
      if (userEmailDisplay) {
        userEmailDisplay.innerHTML = `<a href="login.html" style="color: #d40000; padding: 8px 16px; text-decoration: none; border-radius: 5px; font-weight: bold; transition: 0.3s;">Login/Signup</a>`; // ✅ Show Login Link
        userEmailDisplay.style.display = "inline-block"; // Ensure visibility
      }
    }
  });

  // ✅ Logout Function
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      alert("✅ Logged Out Successfully!");
      window.location.href = "index.html"; // ✅ Redirect to Home After Logout
    }).catch((error) => {
      console.error("❌ Logout Error:", error);
    });
  });
});

// ✅ Login Functionality
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    document.getElementById("loginBtn").classList.add("hidden");
    document.getElementById("loader").classList.remove("hidden");
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      document.getElementById("successMessage").classList.remove("hidden");
      setTimeout(() => window.location.href = "index.html", 2000);
    } catch (error) {
      alert(error.message);
    }
  });
}

// ✅ Signup Functionality
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    document.getElementById("signupBtn").classList.add("hidden");
    document.getElementById("loader").classList.remove("hidden");
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      document.getElementById("successMessage").classList.remove("hidden");
      setTimeout(() => window.location.href = "index.html", 2000);
    } catch (error) {
      alert(error.message);
    }
  });
}

// ✅ Forgot Password Functionality
document.getElementById("forgotPasswordLink")?.addEventListener("click", async () => {
  const email = prompt("Enter your email to reset password:");
  if (!email) return;
  
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent!");
  } catch (error) {
    alert(error.message);
  }
});


auth.onAuthStateChanged((user) => {
  if (user) {
    // ✅ लॉगिन हो चुका है, अब चेक करें कि पहले कोई redirect URL था या नहीं
    const redirectUrl = sessionStorage.getItem("redirectAfterLogin");

    if (redirectUrl) {
      // ✅ Redirect URL इस्तेमाल कर लो और फिर इसे हटा दो
      sessionStorage.removeItem("redirectAfterLogin");
      window.location.href = redirectUrl;
    } 
  }
});
