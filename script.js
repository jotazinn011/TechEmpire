document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================
    // 1. MENU MOBILE (HAMBURGER)
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (hamburger && navbarMenu) {
        hamburger.addEventListener('click', () => {
            navbarMenu.style.display = navbarMenu.style.display === 'flex' ? 'none' : 'flex';
            navbarMenu.style.position = 'absolute';
            navbarMenu.style.top = '100%';
            navbarMenu.style.left = '0';
            navbarMenu.style.right = '0';
            navbarMenu.style.background = 'white';
            navbarMenu.style.flexDirection = 'column';
            navbarMenu.style.padding = '20px';
            navbarMenu.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
        });

        document.querySelectorAll('.navbar-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navbarMenu.style.display = 'none';
            });
        });
    }

    // ==========================================
    // 2. FORMULÁRIO DE TRIAGEM INTEGRADO AO WHATSAPP
    // ==========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Impede a página de recarregar

            // Captura os valores digitados pelo usuário
            const nome = document.getElementById('nome').value.trim();
            const aparelho = document.getElementById('aparelho').value.trim();
            const defeito = document.getElementById('defeito').value.trim();

            // Validação de segurança básica dos campos obrigatórios
            if (!nome || !aparelho || !defeito) {
                alert('Por favor, preencha todos os campos!');
                return;
            }

            // Seu número comercial correto da Tech Empire
            const numeroWhatsApp = '5533988841468';

            // CRIAÇÃO DA MENSAGEM EXATAMENTE COMO VOCÊ PEDIU (INFORMAL)
            const mensagem = `Olá! Meu nome é ${nome}. Tenho um ${aparelho} com o seguinte defeito: ${defeito}. Gostaria de ser atendido!`;

            // Codifica a mensagem mantendo os espaços e acentos legíveis para a URL
            const mensagemCodificada = encodeURIComponent(mensagem);

            // Monta o link oficial de redirecionamento da API do WhatsApp
            const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
            
            // Abre o WhatsApp (Web ou Aplicativo) em uma nova aba
            window.open(urlWhatsApp, '_blank');

            // Limpa os campos do formulário para o usuário após o envio
            this.reset();
        });
    }

    // ==========================================
    // 3. SMOOTH SCROLL (ROLAGEM SUAVE) PARA LINKS INTERNOS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // ==========================================
    // 4. EFEITO VISUAL DINÂMICO NA NAVBAR AO ROLAR A PÁGINA
    // ==========================================
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
            }
        }
    });

});