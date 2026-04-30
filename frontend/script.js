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

    // --- Unlock Screen Logic ---
    const unlockScreen = document.getElementById("unlock-screen");
    const unlockHandle = document.getElementById("unlock-drag-handle");
    if (unlockScreen && unlockHandle) {
        document.body.classList.add("locked"); // prevent scrolling initially
        const unlockContainer = document.querySelector(".slide-to-unlock");
        
        let isDraggingUnlock = false;
        let startXUnlock = 0;
        let currentTranslate = 0;
        const maxTranslate = unlockContainer.clientWidth - unlockHandle.clientWidth - 8;

        const startUnlockDrag = (e) => {
            isDraggingUnlock = true;
            startXUnlock = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
            unlockHandle.style.transition = 'none';
        };

        const moveUnlockDrag = (e) => {
            if (!isDraggingUnlock) return;
            const currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
            let moveX = currentX - startXUnlock;
            
            if (moveX < 0) moveX = 0;
            if (moveX > maxTranslate) moveX = maxTranslate;
            
            currentTranslate = moveX;
            unlockHandle.style.transform = `translateX(${moveX}px)`;
            
            // If moved more than 95% of way, unlock!
            if (moveX >= maxTranslate * 0.95) {
                isDraggingUnlock = false;
                unlockHandle.style.transform = `translateX(${maxTranslate}px)`;
                setTimeout(() => {
                    unlockScreen.classList.add('unlocked');
                    document.body.classList.remove('locked');
                }, 200);
            }
        };

        const endUnlockDrag = () => {
            if (!isDraggingUnlock) return;
            isDraggingUnlock = false;
            // If didn't reach the end, snap back
            if (currentTranslate < maxTranslate * 0.95) {
                unlockHandle.style.transition = 'transform 0.3s ease';
                unlockHandle.style.transform = `translateX(0px)`;
                currentTranslate = 0;
            }
        };

        unlockHandle.addEventListener('mousedown', startUnlockDrag);
        document.addEventListener('mousemove', moveUnlockDrag);
        document.addEventListener('mouseup', endUnlockDrag);

        unlockHandle.addEventListener('touchstart', startUnlockDrag, {passive: true});
        document.addEventListener('touchmove', moveUnlockDrag, {passive: true});
        document.addEventListener('touchend', endUnlockDrag);
    }

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector(".navbar");
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
