//menu bar toggle
function toggleMenu() {
  
  let nav = document.querySelector(".nav-links");
  let menuIcon = document.querySelector(".menu-icon");
  
  if (nav.style.height === "0px" || nav.style.height === "") {
    nav.style.height = nav.scrollHeight + "px"; // Auto height
    menuIcon.innerHTML = "✖";
  } else {
    nav.style.height = "0px";
    menuIcon.innerHTML = "☰";
  }
}






document.getElementById("contactForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Form submission roko, pehle validate karein
  
  let valid = true;
  
  // Name Validation
  let name = document.getElementById("name").value.trim();
  if (name === "") {
    document.getElementById("nameError").innerText = "Name is required.";
    valid = false;
  } else {
    document.getElementById("nameError").innerText = "";
  }
  
  // Phone Validation (Only Numbers, 10 digits)
  let phone = document.getElementById("phone").value.trim();
  let phonePattern = /^[0-9]{10}$/;
  if (!phonePattern.test(phone)) {
    document.getElementById("phoneError").innerText = "Enter a valid 10-digit phone number.";
    valid = false;
  } else {
    document.getElementById("phoneError").innerText = "";
  }
  
  // Subject Validation
  let subject = document.getElementById("subject").value;
  if (subject === "") {
    document.getElementById("subjectError").innerText = "Please select a subject.";
    valid = false;
  } else {
    document.getElementById("subjectError").innerText = "";
  }
  
  // Message Validation
  let message = document.getElementById("message").value.trim();
  if (message === "") {
    document.getElementById("messageError").innerText = "Message cannot be empty.";
    valid = false;
  } else {
    document.getElementById("messageError").innerText = "";
  }
  
  // Agar sab sahi hai toh submit hone do
  if (valid) {
    let submitButton = document.getElementById("submitBtn");
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";
    
    localStorage.setItem("formSubmitted", "true"); // Store submission state
    
    this.submit(); // Form ko submit karo
  }
});

// **Page Load hone par form reset kare**
window.onload = function() {
  if (localStorage.getItem("formSubmitted") === "true") {
    document.getElementById("contactForm").reset();
    localStorage.removeItem("formSubmitted"); // Remove flag
  }
};

// **Back karne par bhi form empty rahe**
window.addEventListener("pageshow", function(event) {
  document.getElementById("contactForm").reset(); // Force Reset
});

