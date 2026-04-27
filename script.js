// ===== SMOOTH SCROLL + ACTIVE NAV =====
const navLinks = document.querySelectorAll("nav a");

navLinks.forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();

        // remove active
        navLinks.forEach(l => l.classList.remove("active"));

        // add active
        this.classList.add("active");

        // scroll to section
        const targetId = this.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        targetSection.scrollIntoView({
            behavior: "smooth"
        });
    });
});


// ===== MOBILE MENU TOGGLE =====
const logo = document.querySelector(".logo");
const nav = document.querySelector("nav");

logo.addEventListener("click", () => {
    nav.classList.toggle("active");
});


// ===== TYPING EFFECT =====
const words = ["Graphic Designer", "Web Developer", "Freelancer"];
let i = 0;
let j = 0;
let currentWord = "";
let isDeleting = false;

const typingSpan = document.querySelector(".typing-text span");

function type() {
    currentWord = words[i];

    if (isDeleting) {
        typingSpan.textContent = currentWord.substring(0, j--);
    } else {
        typingSpan.textContent = currentWord.substring(0, j++);
    }

    if (!isDeleting && j === currentWord.length) {
        isDeleting = true;
        setTimeout(type, 1000);
    } else if (isDeleting && j === 0) {
        isDeleting = false;
        i = (i + 1) % words.length;
        setTimeout(type, 300);
    } else {
        setTimeout(type, isDeleting ? 50 : 100);
    }
}

type();


// ===== HIRE ME BUTTON =====
const hireBtn = document.querySelector(".btn");

hireBtn.addEventListener("click", () => {
    document.querySelector("#contact").scrollIntoView({
        behavior: "smooth"
    });
});