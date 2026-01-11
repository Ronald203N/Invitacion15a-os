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
    const eventDate = new Date('November 15, 2025 16:00:00').getTime();
    // ============================================
    
    // Elementos de la galería
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryFilters = document.querySelectorAll('.gallery-filter');
    const galleryModal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalClose = document.querySelector('.modal-close');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Variables para la galería
    let currentImageIndex = 0;
    let filteredItems = Array.from(galleryItems);
    
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
    
    // Control de música - MEJORADO
    let isPlaying = false;
    
    // Configurar música para autoplay con interacción del usuario
    musicBtn.addEventListener('click', function() {
        // Si no hay interacción previa, intentamos reproducir
        if (!isPlaying) {
            // Intentar reproducir la música
            const playPromise = backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Éxito: música reproduciéndose
                    isPlaying = true;
                    updateMusicButton();
                }).catch(error => {
                    // Fallo: mostrar mensaje de error
                    console.log("Autoplay prevenido:", error);
                    musicBtn.innerHTML = '<i class="fas fa-play"></i><span>Click para reproducir</span>';
                    alert("Por favor, haz clic nuevamente para reproducir la música");
                });
            }
        } else {
            // Si ya está reproduciendo, pausar
            backgroundMusic.pause();
            isPlaying = false;
            updateMusicButton();
        }
    });
    
    // Función para actualizar el botón de música
    function updateMusicButton() {
        const icon = musicBtn.querySelector('i');
        const text = musicBtn.querySelector('span');
        
        if (isPlaying) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            if (text) text.textContent = 'Pausar música';
            musicBtn.classList.add('playing');
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            if (text) text.textContent = 'Reproducir música';
            musicBtn.classList.remove('playing');
        }
    }
    
    // Intentar cargar el estado de la música desde localStorage
    const savedMusicState = localStorage.getItem('xvMusicPlaying');
    if (savedMusicState === 'true') {
        // Solo intentar reproducir automáticamente si el usuario ya interactuó antes
        backgroundMusic.volume = 0.5; // Volumen moderado
        isPlaying = true;
        updateMusicButton();
    }
    
    // Guardar estado de la música cuando cambie
    backgroundMusic.addEventListener('play', function() {
        isPlaying = true;
        updateMusicButton();
        localStorage.setItem('xvMusicPlaying', 'true');
    });
    
    backgroundMusic.addEventListener('pause', function() {
        isPlaying = false;
        updateMusicButton();
        localStorage.setItem('xvMusicPlaying', 'false');
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
    
    // Funcionalidad de filtrado de galería
    galleryFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remover clase active de todos los filtros
            galleryFilters.forEach(f => f.classList.remove('active'));
            // Agregar clase active al filtro clickeado
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filtrar elementos de galería
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Actualizar lista de elementos filtrados
            filteredItems = Array.from(galleryItems).filter(item => {
                const category = item.getAttribute('data-category');
                return filterValue === 'all' || category === filterValue;
            });
        });
    });
    
    // Funcionalidad de galería modal
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('.gallery-image').style.backgroundImage;
            // Extraer URL de la imagen del estilo background-image
            const urlMatch = imgSrc.match(/url\(["']?(.*?)["']?\)/);
            if (urlMatch && urlMatch[1]) {
                currentImageIndex = filteredItems.indexOf(this);
                openModal(urlMatch[1], this.querySelector('.gallery-caption').textContent);
            }
        });
    });
    
    // Función para abrir modal
    function openModal(imgSrc, caption) {
        modalImage.src = imgSrc;
        modalCaption.textContent = caption;
        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    }
    
    // Función para cerrar modal
    function closeModal() {
        galleryModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restaurar scroll
    }
    
    // Función para mostrar imagen siguiente
    function showNextImage() {
        if (filteredItems.length === 0) return;
        
        currentImageIndex = (currentImageIndex + 1) % filteredItems.length;
        const nextItem = filteredItems[currentImageIndex];
        const imgSrc = nextItem.querySelector('.gallery-image').style.backgroundImage;
        const urlMatch = imgSrc.match(/url\(["']?(.*?)["']?\)/);
        
        if (urlMatch && urlMatch[1]) {
            modalImage.src = urlMatch[1];
            modalCaption.textContent = nextItem.querySelector('.gallery-caption').textContent;
        }
    }
    
    // Función para mostrar imagen anterior
    function showPrevImage() {
        if (filteredItems.length === 0) return;
        
        currentImageIndex = (currentImageIndex - 1 + filteredItems.length) % filteredItems.length;
        const prevItem = filteredItems[currentImageIndex];
        const imgSrc = prevItem.querySelector('.gallery-image').style.backgroundImage;
        const urlMatch = imgSrc.match(/url\(["']?(.*?)["']?\)/);
        
        if (urlMatch && urlMatch[1]) {
            modalImage.src = urlMatch[1];
            modalCaption.textContent = prevItem.querySelector('.gallery-caption').textContent;
        }
    }
    
    // Event listeners para controles del modal
    modalClose.addEventListener('click', closeModal);
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);
    
    // Cerrar modal al hacer clic fuera de la imagen
    galleryModal.addEventListener('click', function(e) {
        if (e.target === galleryModal) {
            closeModal();
        }
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', function(e) {
        if (galleryModal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            }
        }
    });
    
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
        const whatsappNumber = '55996252';
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
                
                // Efecto especial para diferentes elementos
                if (entry.target.classList.contains('detail-card') || 
                    entry.target.classList.contains('location-card') ||
                    entry.target.classList.contains('dress-option') ||
                    entry.target.classList.contains('padrino-card')) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                }
                
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.style.animation = 'slideIn 0.6s ease forwards';
                }
                
                if (entry.target.classList.contains('gallery-item')) {
                    entry.target.style.animation = 'fadeIn 0.8s ease forwards';
                }
            }
        });
    }, observerOptions);
    
    // Observar elementos para animaciones
    document.querySelectorAll('.detail-card, .location-card, .dress-option, .gallery-item, .padrino-card, .timeline-item').forEach(el => {
        el.style.opacity = '0';
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
    
    // Inicializar elementos filtrados
    filteredItems = Array.from(galleryItems);
    
    // Asegurarse de que el botón de música sea visible
    setTimeout(() => {
        musicBtn.style.visibility = 'visible';
        musicBtn.style.opacity = '1';
    }, 100);
});