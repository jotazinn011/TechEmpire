/**
 * Tech Empire - Core Client Architecture v1.0
 * Desenvolvido usando Padrões ES6+ Estritos, Modularizado e Performático.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. GERENCIAMENTO DE ESTADO DO TEMA (Dark/Light Mode)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const toggleIcon = themeToggleBtn.querySelector('i');

    const updateThemeIcon = (theme) => {
        if (theme === 'dark') {
            toggleIcon.className = 'fa-solid fa-sun';
        } else {
            toggleIcon.className = 'fa-solid fa-moon';
        }
    };

    const initializeTheme = () => {
        const savedTheme = localStorage.getItem('techempire-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        htmlElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);
    };

    themeToggleBtn.addEventListener('click', () => {
        const activeTheme = htmlElement.getAttribute('data-theme');
        const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('techempire-theme', newTheme);
        updateThemeIcon(newTheme);
    });

    initializeTheme();

    // ==========================================================================
    // 2. MENU MOBILE RESPONSIVO & ACESSIBILIDADE
    // ==========================================================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta-mobile');

    const toggleMenu = () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        navMenu.setAttribute('aria-hidden', isExpanded);
    };

    const closeMenu = () => {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        navMenu.setAttribute('aria-hidden', 'true');
    };

    hamburger.addEventListener('click', toggleMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    // ==========================================================================
    // 3. INTERSECTION OBSERVER API (Animações Progressivas & Contadores)
    // ==========================================================================
    const animatedElements = document.querySelectorAll('.animate-hidden');
    const statNumbers = document.querySelectorAll('.stat-number');

    const scrollAnimationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    animatedElements.forEach(element => scrollAnimationObserver.observe(element));

    const animateCounter = (element) => {
        const targetValue = parseInt(element.getAttribute('data-target'), 10);
        const duration = 2000;
        const startTime = performance.now();

        const countStep = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuad = progress * (2 - progress);
            const currentValue = Math.floor(easeOutQuad * targetValue);
            
            element.textContent = currentValue.toLocaleString('pt-BR') + (targetValue === 99 ? '%' : '');
            
            if (progress < 1) {
                requestAnimationFrame(countStep);
            } else {
                element.textContent = targetValue.toLocaleString('pt-BR') + (targetValue === 99 ? '%' : '+');
            }
        };

        requestAnimationFrame(countStep);
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));

    // ==========================================================================
    // 4. VALIDAÇÃO DE FORMULÁRIO ROBUSTA & MÁSCARA DINÂMICA
    // ==========================================================================
    const form = document.getElementById('contactForm');
    const telInput = document.getElementById('telefone');

    const applyPhoneMask = (value) => {
        if (!value) return "";
        value = value.replace(/\D/g, "");
        value = value.replace(/(\d{2})(\d)/, "($1) $2");
        value = value.replace(/(\d{5})(\d)/, "$1-$2");
        return value.substring(0, 15);
    };

    telInput.addEventListener('input', (e) => {
        e.target.value = applyPhoneMask(e.target.value);
    });

    const setInputState = (inputElement, state, isValid) => {
        const parent = inputElement.closest('.input-group');
        if (isValid) {
            parent.classList.remove('erro');
            parent.classList.add('sucesso');
        } else {
            parent.classList.remove('sucesso');
            parent.classList.add('erro');
        }
    };

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email.trim());
    };

    const validateField = (input) => {
        if (input.id === 'email') {
            const isEmailValid = validateEmail(input.value);
            setInputState(input, 'email', isEmailValid);
            return isEmailValid;
        }
        
        if (input.id === 'telefone') {
            const isTelValid = input.value.replace(/\D/g, "").length >= 10;
            setInputState(input, 'tel', isTelValid);
            return isTelValid;
        }

        const isGeneralValid = input.value.trim() !== "";
        setInputState(input, 'general', isGeneralValid);
        return isGeneralValid;
    };

    form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.closest('.input-group').classList.contains('erro')) {
                validateField(input);
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFormValid = true;

        form.querySelectorAll('input, select, textarea').forEach(input => {
            const isCurrentFieldValid = validateField(input);
            if (!isCurrentFieldValid) isFormValid = false;
        });

        if (isFormValid) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const successBox = document.getElementById('formSuccess');
            
            submitBtn.disabled = true;
            submitBtn.textContent = "Processando Dados Corporativos...";

            setTimeout(() => {
                successBox.classList.remove('hidden');
                form.reset();
                
                form.querySelectorAll('.input-group').forEach(group => group.classList.remove('sucesso'));
                
                submitBtn.disabled = false;
                submitBtn.textContent = "Enviar Solicitação de Diagnóstico";
                
                setTimeout(() => successBox.classList.add('hidden'), 8000);
            }, 1800);
        }
    });

    // ==========================================================================
    // 5. COMPORTAMENTOS AUXILIARES (Scroll Suave & Back to Top)
    // ==========================================================================
    const backToTopBtn = document.getElementById('backToTop');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        if (scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const activeNavLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

            if (activeNavLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    activeNavLink.classList.add('active');
                } else {
                    activeNavLink.classList.remove('active');
                }
            }
        });
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});