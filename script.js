// ===== MOBILE MENU TOGGLE =====
const menu = document.querySelector("nav");
const logo = document.querySelector(".logo");

logo.addEventListener("click", () => {
    menu.classList.toggle("active");
});


// ===== TYPING TEXT EFFECT =====
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