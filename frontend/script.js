document.addEventListener("DOMContentLoaded", () => {
    // 1. Custom Cursor
    const cursor = document.querySelector(".cursor");
    const interactiveElements = document.querySelectorAll("a, button, input, select, .gallery-item, .ba-slider");
    const dragArea = document.querySelector(".hero-slider-wrap");

    document.addEventListener("mousemove", (e) => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
    });

    interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            cursor.classList.add("expand");
        });
        el.addEventListener("mouseleave", () => {
            cursor.classList.remove("expand");
        });
    });

    if (dragArea) {
        dragArea.addEventListener("mouseenter", () => {
            cursor.classList.add("drag-mode");
        });
        dragArea.addEventListener("mouseleave", () => {
            cursor.classList.remove("drag-mode");
        });
    }

    // --- Unlock Screen (Interactive Lamp Pull-Cord) Logic ---
    const unlockScreen = document.getElementById("unlock-screen");
    const pullCord = document.getElementById("pull-cord-group");
    const lightCone = document.getElementById("light-cone");
    const cartoonBoy = document.getElementById("cartoon-boy");
    const boyArm = document.getElementById("boy-right-arm");
    const boyHand = document.getElementById("boy-right-hand");

    if (unlockScreen && pullCord) {
        document.body.classList.add("locked"); // Prevent scrolling initially
        
        let isDraggingCord = false;
        let startY = 0;
        let currentTranslateY = 0;
        const maxDrag = 60; // Maximum drag distance in pixels
        let lightTriggered = false;

        const startCordDrag = (e) => {
            if (lightTriggered) return;
            isDraggingCord = true;
            startY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;
            pullCord.classList.remove("snap-back");
        };

        const moveCordDrag = (e) => {
            if (!isDraggingCord || lightTriggered) return;
            const currentY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;
            let dy = currentY - startY;

            // Only allow dragging downwards
            if (dy < 0) dy = 0;
            if (dy > maxDrag) dy = maxDrag;

            currentTranslateY = dy;
            pullCord.style.transform = `translateY(${dy}px)`;

            // Trigger the light if pulled past 40px
            if (dy >= 40 && !lightTriggered) {
                triggerLight();
            }
        };

        const endCordDrag = () => {
            if (!isDraggingCord) return;
            isDraggingCord = false;

            // Elastic snap back
            pullCord.classList.add("snap-back");
            pullCord.style.transform = `translateY(0px)`;
            
            // If they released it after a click/short pull, check if we want to trigger it anyway
            if (currentTranslateY > 15 && !lightTriggered) {
                triggerLight();
            }
            
            currentTranslateY = 0;
        };

        const triggerLight = () => {
            lightTriggered = true;
            
            // 1. Turn on the lamp light cone and illuminate the room
            if (lightCone) {
                lightCone.style.opacity = "1";
                lightCone.style.transition = "opacity 0.1s ease";
            }
            unlockScreen.classList.add("lit");
            
            // Restore boy's arm and snap cord back immediately on trigger
            if (boyArm && boyHand) {
                boyArm.setAttribute("d", "M 170 215 Q 185 245 178 275");
                boyHand.setAttribute("cx", "178");
                boyHand.setAttribute("cy", "277");
            }
            pullCord.classList.add("snap-back");
            pullCord.style.transform = `translateY(0px)`;

            // Optional: subtle device haptic feedback or audio click can be added here
            
            // 2. Fade/Scale out the unlock overlay after a short delay
            setTimeout(() => {
                unlockScreen.classList.add("unlocked");
                document.body.classList.remove("locked");
                
                // Remove from layout after transition completes
                setTimeout(() => {
                    unlockScreen.style.display = "none";
                }, 800);
            }, 500);
        };

        // Click event on cord to also trigger it
        pullCord.addEventListener("click", (e) => {
            e.stopPropagation(); // Avoid triggering boy's click if inside the SVG
            if (!lightTriggered) {
                // Quick pull down and release animation
                pullCord.classList.remove("snap-back");
                pullCord.style.transform = `translateY(25px)`;
                setTimeout(() => {
                    triggerLight();
                }, 100);
            }
        });

        // Click/Touch on cartoon boy triggers him reaching out and pulling the cord
        if (cartoonBoy && boyArm && boyHand) {
            cartoonBoy.addEventListener("click", () => {
                if (lightTriggered) return;

                // Step 1: Reach out to grab the cord
                // Grab path coordinates: M 170 215 Q 210 180 235 140
                boyArm.setAttribute("d", "M 170 215 Q 210 180 235 140");
                boyHand.setAttribute("cx", "235");
                boyHand.setAttribute("cy", "140");

                // Step 2: Pull down the cord (after arm reaches cord)
                setTimeout(() => {
                    if (lightTriggered) return;
                    // Pull path coordinates: M 170 215 Q 215 210 235 180
                    boyArm.setAttribute("d", "M 170 215 Q 215 210 235 180");
                    boyHand.setAttribute("cx", "235");
                    boyHand.setAttribute("cy", "180");

                    // Pull cord SVG group down simultaneously
                    pullCord.classList.remove("snap-back");
                    pullCord.style.transform = "translateY(40px)";

                    // Step 3: Trigger light
                    setTimeout(() => {
                        triggerLight();
                    }, 200);

                }, 250); // Matches the arm transition time
            });
        }

        pullCord.addEventListener("mousedown", startCordDrag);
        document.addEventListener("mousemove", moveCordDrag);
        document.addEventListener("mouseup", endCordDrag);

        pullCord.addEventListener("touchstart", startCordDrag, { passive: true });
        document.addEventListener("touchmove", moveCordDrag, { passive: true });
        document.addEventListener("touchend", endCordDrag);
    }

    // 2. Navbar Scroll Effect & Mobile Menu
    const navbar = document.querySelector(".navbar");
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
        
        // Close menu when a link is clicked
        const navItems = navLinks.querySelectorAll("a");
        navItems.forEach(item => {
            item.addEventListener("click", () => {
                navLinks.classList.remove("active");
            });
        });
    }

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 3. Scroll Reveal Animation (Intersection Observer)
    const revealElements = document.querySelectorAll(".reveal");
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 4. Hero Slider Button Logic
    const sliderTrack = document.getElementById("hero-slider");
    const heroPrev = document.getElementById("hero-prev");
    const heroNext = document.getElementById("hero-next");
    
    if (sliderTrack && heroPrev && heroNext) {
        let currentIndex = 0;
        const totalImages = sliderTrack.children.length;
        
        function updateSlider() {
            sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        
        heroNext.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalImages;
            updateSlider();
        });
        
        heroPrev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalImages) % totalImages;
            updateSlider();
        });
        
        // Auto-slide every 5 seconds
        setInterval(() => {
            currentIndex = (currentIndex + 1) % totalImages;
            updateSlider();
        }, 5000);
    }

    // 5. Portfolio Filtering
    const tabBtns = document.querySelectorAll(".tab-btn");
    const galleryItems = document.querySelectorAll(".gallery-item");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(t => t.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.getAttribute("data-filter");

            galleryItems.forEach(item => {
                if (filter === "all" || item.classList.contains(`item-${filter}`)) {
                    item.classList.remove("hide");
                    setTimeout(() => { item.style.opacity = 1; item.style.transform = 'scale(1)'; }, 50);
                } else {
                    item.style.opacity = 0;
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => item.classList.add("hide"), 300);
                }
            });
        });
    });

    // 6. Before and After Slider Logic (Custom Icon Slider)
    const baContainer = document.querySelector(".ba-slider");
    const beforeImage = document.querySelector(".image-before-container");
    const sliderHandleIcon = document.querySelector(".slider-handle-icon");

    if (baContainer) {
        let isDragging = false;

        const updateSlider = (e) => {
            const rect = baContainer.getBoundingClientRect();
            let x = e.clientX - rect.left;
            x = Math.max(0, Math.min(x, rect.width));
            const percent = (x / rect.width) * 100;
            beforeImage.style.width = percent + "%";
            sliderHandleIcon.style.left = percent + "%";
        };

        baContainer.addEventListener("mousedown", () => { isDragging = true; baContainer.style.cursor = 'ew-resize'; });
        document.addEventListener("mouseup", () => { isDragging = false; });
        window.addEventListener("mousemove", (e) => {
            if (isDragging) updateSlider(e);
        });

        // Touch Events
        baContainer.addEventListener("touchstart", () => isDragging = true, {passive: true});
        document.addEventListener("touchend", () => isDragging = false);
        window.addEventListener("touchmove", (e) => {
            if (isDragging) {
                const touchEvent = e.touches[0];
                updateSlider(touchEvent);
            }
        }, {passive: true});
    }

    // 7. Testimonials Carousel
    const testimoSlides = document.querySelectorAll(".testimo-slide");
    const btnNext = document.getElementById("nextTestimo");
    const btnPrev = document.getElementById("prevTestimo");

    if(testimoSlides.length > 0 && btnNext && btnPrev) {
        let tIndex = 0;
        
        const showSlide = (index) => {
            testimoSlides.forEach(s => s.classList.remove("active"));
            testimoSlides[index].classList.add("active");
        };

        btnNext.addEventListener("click", () => {
            tIndex = (tIndex + 1) % testimoSlides.length;
            showSlide(tIndex);
        });

        btnPrev.addEventListener("click", () => {
            tIndex = (tIndex - 1 + testimoSlides.length) % testimoSlides.length;
            showSlide(tIndex);
        });

        setInterval(() => {
            tIndex = (tIndex + 1) % testimoSlides.length;
            showSlide(tIndex);
        }, 8000);
    }

    // About Me Section Slider
    const aboutSlides = document.querySelectorAll(".about-slide");
    const aboutPrev = document.getElementById("about-prev");
    const aboutNext = document.getElementById("about-next");
    
    if (aboutSlides.length > 0 && aboutPrev && aboutNext) {
        let aboutIndex = 0;
        
        const showAboutSlide = (index) => {
            aboutSlides.forEach(slide => slide.classList.remove("active"));
            aboutSlides[index].classList.add("active");
        };
        
        aboutNext.addEventListener("click", () => {
            aboutIndex = (aboutIndex + 1) % aboutSlides.length;
            showAboutSlide(aboutIndex);
        });
        
        aboutPrev.addEventListener("click", () => {
            aboutIndex = (aboutIndex - 1 + aboutSlides.length) % aboutSlides.length;
            showAboutSlide(aboutIndex);
        });
        
        // Auto slide every 5 seconds
        setInterval(() => {
            aboutIndex = (aboutIndex + 1) % aboutSlides.length;
            showAboutSlide(aboutIndex);
        }, 5000);
    }

    // 8. Contact Form Submission
    const bookingForm = document.getElementById("bookingForm");
    const formMessage = document.getElementById("formMessage");

    if (bookingForm) {
        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const name = document.getElementById("name").value;
            const contact = document.getElementById("contact").value;
            const service = document.getElementById("service").value;
            const date = document.getElementById("date").value;
            
            // Format the message for WhatsApp
            const message = `Hello Anjani! I would like to book an appointment.\n\n*Name:* ${name}\n*Contact:* ${contact}\n*Service Segment:* ${service}\n*Date:* ${date}`;
            
            // Encode the message for the URL
            const encodedMessage = encodeURIComponent(message);
            
            // WhatsApp number with country code
            const whatsappNumber = "916264547696";
            
            // Show feedback
            const btn = bookingForm.querySelector("button");
            const originalText = btn.innerHTML;
            btn.innerHTML = "Redirecting...";
            
            if (formMessage) {
                formMessage.style.color = "var(--primary-color)";
                formMessage.innerText = "Opening WhatsApp...";
                formMessage.style.display = "block";
            }
            
            // Open WhatsApp directly
            window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                if (formMessage) formMessage.style.display = "none";
                bookingForm.reset();
            }, 3000);
        });
    }
});
