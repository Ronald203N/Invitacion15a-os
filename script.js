document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const musicBtn = document.getElementById('musicBtn');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const footerDaysElement = document.getElementById('footerDays');
    const attendanceForm = document.getElementById('attendanceForm');
    const confirmBtn = document.getElementById('confirmBtn');
    const paseSection = document.getElementById('pase');
    const ticketName = document.getElementById('ticketName');
    const ticketGuests = document.getElementById('ticketGuests');
    const ticketCode = document.getElementById('ticketCode');
    const saveTicketBtn = document.getElementById('saveTicketBtn');
    const newConfirmationBtn = document.getElementById('newConfirmationBtn');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // ============================================
    // CONFIGURACIÓN IMPORTANTE: FECHA DEL EVENTO
    // ============================================
    // CAMBIA ESTA FECHA POR LA FECHA REAL DE TU EVENTO
    // Formato: 'Mes Dia, Año Hora:Minutos:Segundos'
    // Ejemplo: 'November 15, 2025 16:00:00'
    const eventDate = new Date('april 16, 2026 16:00:00').getTime();
    // ============================================
    
    // Control de navegación móvil
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
    
    // Control de música
    let isPlaying = false;
    
    musicBtn.addEventListener('click', function() {
        if (isPlaying) {
            backgroundMusic.pause();
            musicBtn.innerHTML = '<i class="fas fa-play"></i><span>Reproducir música</span>';
            musicBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            musicBtn.style.color = 'var(--dark)';
        } else {
            backgroundMusic.play().catch(e => {
                console.log("Autoplay prevenido, el usuario debe interactuar primero");
                musicBtn.innerHTML = '<i class="fas fa-play"></i><span>Click para reproducir</span>';
            });
            musicBtn.innerHTML = '<i class="fas fa-pause"></i><span>Pausar música</span>';
            musicBtn.style.backgroundColor = 'var(--primary)';
            musicBtn.style.color = 'white';
        }
        isPlaying = !isPlaying;
    });
    
    // Contador regresivo
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = eventDate - now;
        
        if (timeLeft < 0) {
            // Si la fecha ya pasó
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            if(footerDaysElement) footerDaysElement.textContent = '00';
            return;
        }
        
        // Calcular días, horas, minutos y segundos
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Actualizar elementos del DOM
        daysElement.textContent = days.toString().padStart(2, '0');
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Actualizar contador en el footer
        if(footerDaysElement) footerDaysElement.textContent = days;
        
        // Efecto visual al cambiar los segundos
        if (seconds === 59) {
            secondsElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                secondsElement.style.transform = 'scale(1)';
            }, 300);
        }
    }
    
    // Actualizar el contador cada segundo
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Confirmación de asistencia
    confirmBtn.addEventListener('click', function() {
        // Validar formulario
        const nameInput = document.getElementById('name');
        const guestsSelect = document.getElementById('guests');
        const asistenciaCheckbox = document.getElementById('asistencia');
        
        if (!nameInput.value.trim()) {
            alert('Por favor ingresa tu nombre completo');
            nameInput.focus();
            return;
        }
        
        if (!asistenciaCheckbox.checked) {
            alert('Debes confirmar que asistirás al evento');
            return;
        }
        
        // Obtener datos del formulario
        const name = nameInput.value.trim();
        const guests = guestsSelect.value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;
        
        // Generar código único para el pase
        const randomCode = Math.floor(1000 + Math.random() * 9000);
        
        // Actualizar información del pase
        ticketName.textContent = name;
        ticketGuests.textContent = guests;
        ticketCode.textContent = randomCode;
        
        // Preparar mensaje para WhatsApp
        // ============================================
        // CONFIGURACIÓN: NÚMERO DE WHATSAPP
        // ============================================
        // CAMBIA ESTE NÚMERO POR EL NÚMERO REAL
        // Formato: 521234567890 (sin +, espacios o guiones)
        const whatsappNumber = '5215512345678';
        // ============================================
        
        const whatsappMessage = `¡Hola! Confirmo mi asistencia a los XV años de Valeria.\n\n` +
                                `Nombre: ${name}\n` +
                                `Acompañantes: ${guests}\n` +
                                (phone ? `Teléfono: ${phone}\n` : '') +
                                (email ? `Email: ${email}\n` : '') +
                                (message ? `Mensaje: ${message}\n` : '') +
                                `\nCódigo de confirmación: XV-2025-${randomCode}`;
        
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Abrir WhatsApp en una nueva pestaña
        window.open(whatsappURL, '_blank');
        
        // Mostrar sección del pase
        paseSection.style.display = 'block';
        
        // Desplazarse a la sección del pase
        setTimeout(() => {
            paseSection.scrollIntoView({ behavior: 'smooth' });
        }, 500);
        
        // Guardar datos en localStorage
        const confirmationData = {
            name: name,
            guests: guests,
            email: email,
            phone: phone,
            code: randomCode,
            date: new Date().toISOString()
        };
        
        localStorage.setItem('xvValeriaConfirmation', JSON.stringify(confirmationData));
        
        // Mostrar notificación de éxito
        showNotification('¡Confirmación exitosa! Revisa tu pase de acceso.');
    });
    
    // Guardar pase como imagen
    saveTicketBtn.addEventListener('click', function() {
        // En un entorno real, aquí se usaría html2canvas para generar una imagen
        // Por ahora, damos instrucciones para captura de pantalla
        showNotification('Toma una captura de pantalla de tu pase. En dispositivos móviles: presiona los botones de volumen y encendido al mismo tiempo.');
        
        // Simular descarga
        saveTicketBtn.innerHTML = '<i class="fas fa-check"></i> Instrucciones mostradas';
        saveTicketBtn.disabled = true;
        
        setTimeout(() => {
            saveTicketBtn.innerHTML = '<i class="fas fa-download"></i> Guardar pase';
            saveTicketBtn.disabled = false;
        }, 3000);
    });
    
    // Nueva confirmación
    newConfirmationBtn.addEventListener('click', function() {
        paseSection.style.display = 'none';
        attendanceForm.reset();
        
        // Desplazarse a la sección de confirmación
        document.getElementById('confirmacion').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Efectos de scroll para elementos
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Efecto especial para cards
                if (entry.target.classList.contains('detail-card') || 
                    entry.target.classList.contains('location-card') ||
                    entry.target.classList.contains('dress-option') ||
                    entry.target.classList.contains('padrino-card')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos para animaciones
    document.querySelectorAll('.detail-card, .location-card, .dress-option, .gallery-item, .padrino-card, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
    
    // Cargar confirmación previa si existe
    const savedConfirmation = localStorage.getItem('xvValeriaConfirmation');
    if (savedConfirmation) {
        const data = JSON.parse(savedConfirmation);
        ticketName.textContent = data.name;
        ticketGuests.textContent = data.guests;
        ticketCode.textContent = data.code;
    }
    
    // Función para mostrar notificaciones
    function showNotification(message) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: var(--primary);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-strong);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remover notificación después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Efecto de partículas decorativas
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.position = 'fixed';
        particlesContainer.style.top = '0';
        particlesContainer.style.left = '0';
        particlesContainer.style.width = '100%';
        particlesContainer.style.height = '100%';
        particlesContainer.style.pointerEvents = 'none';
        particlesContainer.style.zIndex = '0';
        document.body.appendChild(particlesContainer);
        
        // Crear partículas solo para el header
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 5 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            particle.style.borderRadius = '50%';
            particle.style.top = Math.random() * 100 + 'vh';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.opacity = Math.random() * 0.5 + 0.3;
            
            // Animación
            particle.animate([
                { transform: 'translateY(0px)', opacity: particle.style.opacity },
                { transform: `translateY(${Math.random() * 100 + 50}px)`, opacity: 0 }
            ], {
                duration: Math.random() * 3000 + 2000,
                iterations: Infinity,
                delay: Math.random() * 2000
            });
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // Llamar a la función de partículas
    createParticles();
    
    // Efecto de scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});