// MOBILE MENU
const menuIcon = document.getElementById("menu-icon");
const navbar = document.getElementById("navbar");

menuIcon.onclick = () => {
    navbar.classList.toggle("active");
};

// ACTIVE LINK SCROLL
let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll("header nav a");

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute("id");

        if(top >= offset && top < offset + height){
            navLinks.forEach(link => {
                link.classList.remove("active");
                document.querySelector("header nav a[href*=" + id + "]").classList.add("active");
            });
        }
    });
};

// TYPING EFFECT
const texts = ["Graphic Designer", "Web Developer", "Freelancer"];
let i = 0;
let j = 0;
let currentText = "";
let isDeleting = false;

function typeEffect() {
    let typing = document.getElementById("typing");

    if (i < texts.length) {
        if (!isDeleting && j <= texts[i].length) {
            currentText = texts[i].substring(0, j++);
        } else if (isDeleting && j >= 0) {
            currentText = texts[i].substring(0, j--);
        }

        typing.innerHTML = currentText;

        if (j == texts[i].length) {
            isDeleting = true;
            setTimeout(typeEffect, 1000);
            return;
        }

        if (j == 0 && isDeleting) {
            isDeleting = false;
            i++;
            if (i == texts.length) i = 0;
        }
    }

    setTimeout(typeEffect, isDeleting ? 50 : 100);
}

typeEffect();
