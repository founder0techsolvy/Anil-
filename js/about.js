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

    
    
        // ✅ Counter Effect
        function counterEffect(id, target) {
            let count = 0;
            let interval = setInterval(() => {
                count++;
                document.getElementById(id).textContent = count;
                if (count >= target) clearInterval(interval);
            }, 0.000001);
        }
        counterEffect("years", 5);
        counterEffect("prints", 50000);
        counterEffect("clients", 10000);

        // ✅ Team Animation
        window.addEventListener("scroll", function() {
            document.querySelectorAll(".team-member").forEach(member => {
                if (member.getBoundingClientRect().top < window.innerHeight - 100) {
                    member.classList.add("show");
                }
            });
        });