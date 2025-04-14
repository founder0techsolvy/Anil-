//hero img
document.addEventListener("DOMContentLoaded", function () {
    const heroImg = document.querySelector(".hero-img");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    heroImg.classList.add("show");
                } else {
                    heroImg.classList.remove("show"); // Reset animation
                }
            });
        },
        { threshold: 0.3 } // Jab 30% image dikhne lage tab animation chale
    );

    observer.observe(heroImg);
});



//service scroll animation 
document.addEventListener("DOMContentLoaded", function () {
    const serviceCards = document.querySelectorAll(".service-card");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                } else {
                    entry.target.classList.remove("show"); // Auto Reset Animation
                }
            });
        },
        { threshold: 0.2 } // Jab 20% card screen pe dikhne lage tabhi trigger hoga
    );

    serviceCards.forEach((card) => observer.observe(card));
});



// Process section Scroll Animation -->
    function revealProcessSteps() {
        let steps = document.querySelectorAll(".process-box");
        let windowHeight = window.innerHeight;

        steps.forEach(step => {
            let position = step.getBoundingClientRect().top;
            if (position < windowHeight - 100) {
                step.classList.add("show");
            } else {
                step.classList.remove("show");
            }
        });
    }

    window.addEventListener("scroll", revealProcessSteps);


//why chiose us
document.addEventListener("DOMContentLoaded", function () {
    const chooseCards = document.querySelectorAll(".choose-card");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add("show");
                    }, index * 300); // Delay for each card (One-by-One Jump)
                } else {
                    entry.target.classList.remove("show"); // Auto Reset
                }
            });
        },
        { threshold: 0.2 }
    );

    chooseCards.forEach((card) => observer.observe(card));
});

  


    // Animate Why Choose Us Section on Scroll
    function revealCards() {
        let cards = document.querySelectorAll(".choose-card");
        let windowHeight = window.innerHeight;
        cards.forEach(card => {
            let position = card.getBoundingClientRect().top;
            if (position < windowHeight - 100) {
                card.classList.add("show");
            }
        });
    }
    window.addEventListener("scroll", revealCards);

//menu bar 
        function toggleMenu() {
            let nav = document.querySelector(".nav-links");
            let menuIcon = document.querySelector(".menu-icon");
            
            if (nav.style.height === "0px" || nav.style.height === "") {
                nav.style.height = nav.scrollHeight + "px";  // Auto height
                menuIcon.innerHTML = "✖";
            } else {
                nav.style.height = "0px";
                menuIcon.innerHTML = "☰";
            }
        }
        
        // faqs 🔥 JavaScript for Accordion Effect -->
    document.querySelectorAll(".faq-item").forEach((item) => {
        item.addEventListener("click", () => {
            item.classList.toggle("active");
        });
    });

