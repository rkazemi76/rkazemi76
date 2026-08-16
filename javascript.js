        // ========== ذرات متحرک ==========
        const canvas = document.getElementById('particles-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                const theme = document.documentElement.getAttribute('data-theme');
                const color = theme === 'dark' ? '150, 200, 255' : '56, 189, 248';
                ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(80, Math.floor(window.innerWidth / 15));
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            // خطوط اتصال
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 120) {
                        const theme = document.documentElement.getAttribute('data-theme');
                        const color = theme === 'dark' ? '150, 200, 255' : '56, 189, 248';
                        ctx.strokeStyle = `rgba(${color}, ${0.1 * (1 - distance / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            animationId = requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        });

        resizeCanvas();
        initParticles();
        animateParticles();

        // ========== تم تاریک/روشن ==========
        const themeToggle = document.getElementById('themeToggle');
        const html = document.documentElement;

       themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';

    // تغییر لوگو بر اساس تم
    const logoImage = document.getElementById('logoImage');
    if (newTheme === 'dark') {
        logoImage.src = 'logo-dark.png';
    } else {
        logoImage.src = 'logo-light.png';
    }
});




        // ========== منوی همبرگری ==========
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // بستن منو هنگام کلیک روی لینک
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // ========== افکت تایپ ==========
        const typedElement = document.getElementById('typed');
        const roles = [
            'توسعه‌دهنده فرانت‌اند',
            'طراح رابط کاربری',
            'React Developer',
            'UI/UX Designer',
            'برنامه‌نویس خلاق'
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentRole = roles[roleIndex];
            if (isDeleting) {
                typedElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typedElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                setTimeout(typeEffect, 1500);
                return;
            }

            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }

            const speed = isDeleting ? 50 : 100;
            setTimeout(typeEffect, speed);
        }

        typeEffect();

        // ========== انیمیشن ظهور هنگام اسکرول ==========
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // اگر آیتم شامل شمارنده است
                    const counters = entry.target.querySelectorAll('.counter');
                    counters.forEach(counter => {
                        if (!counter.dataset.animated) {
                            counter.dataset.animated = 'true';
                            animateCounter(counter);
                        }
                    });
                    // اگر آیتم شامل نوار مهارت است
                    const skillFills = entry.target.querySelectorAll('.skill-fill');
                    skillFills.forEach(fill => {
                        if (!fill.dataset.animated) {
                            fill.dataset.animated = 'true';
                            fill.style.width = fill.dataset.width + '%';
                        }
                    });
                }
            });
        }, { threshold: 0.2 });

        // مشاهده همه عناصر reveal و skill-group
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .skill-group, .stats').forEach(el => {
            observer.observe(el);
        });

        // ========== انیمیشن شمارنده ==========
        function animateCounter(element) {
            const target = parseInt(element.dataset.target);
            const duration = 2000;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                element.textContent = Math.floor(ease * target);
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    element.textContent = target;
                }
            }
            requestAnimationFrame(update);
        }

        // ========== ارسال فرم (نمایش پیام) ==========
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('پیام شما با موفقیت ارسال شد! (این یک نمونه است)');
            this.reset();
        });
