document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const musicBtn = document.getElementById('musicBtn');
    const spotifyPlayBtn = document.getElementById('spotifyPlayBtn');
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
    const ticketBarcodeNumber = document.getElementById('ticketBarcodeNumber');
    const saveTicketBtn = document.getElementById('saveTicketBtn');
    const newConfirmationBtn = document.getElementById('newConfirmationBtn');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const progressFill = document.querySelector('.progress-fill');
    
    // ============================================
    // CONFIGURACIÓN IMPORTANTE: FECHA DEL EVENTO
    // ============================================
    // CAMBIA ESTA FECHA POR LA FECHA REAL DE TU EVENTO
    // Formato: 'Mes Dia, Año Hora:Minutos:Segundos'
    // Ejemplo: 'December 15, 2024 16:00:00'
    const eventDate = new Date('December 15, 2024 16:00:00').getTime();
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
    
    // Variables para el reproductor
    let isPlaying = false;
    let progressInterval;
    let currentTime = 0;
    const totalTime = 225; // 3:45 en segundos
    
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
    
    // Control de música - DISEÑO SPOTIFY
    function toggleMusic() {
        if (!isPlaying) {
            // Intentar reproducir la música
            const playPromise = backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Éxito: música reproduciéndose
                    isPlaying = true;
                    updateMusicButton();
                    startProgressAnimation();
                }).catch(error => {
                    // Fallo: mostrar mensaje de error
                    console.log("Autoplay prevenido:", error);
                    showNotification("Haz clic en el botón de play para reproducir la música");
                });
            }
        } else {
            // Si ya está reproduciendo, pausar
            backgroundMusic.pause();
            isPlaying = false;
            updateMusicButton();
            stopProgressAnimation();
        }
    }
    
    // Botón principal de música
    musicBtn.addEventListener('click', toggleMusic);
    
    // Botón de play en la imagen de Spotify
    spotifyPlayBtn.addEventListener('click', toggleMusic);
    
    // Función para actualizar el botón de música
    function updateMusicButton() {
        const icon = musicBtn.querySelector('i');
        const spotifyIcon = spotifyPlayBtn.querySelector('i');
        
        if (isPlaying) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            spotifyIcon.classList.remove('fa-play');
            spotifyIcon.classList.add('fa-pause');
            musicBtn.classList.add('playing');
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            spotifyIcon.classList.remove('fa-pause');
            spotifyIcon.classList.add('fa-play');
            musicBtn.classList.remove('playing');
        }
    }
    
    // Función para animar la barra de progreso
    function startProgressAnimation() {
        stopProgressAnimation();
        currentTime = 0;
        
        progressInterval = setInterval(() => {
            if (currentTime >= totalTime) {
                currentTime = 0;
                progressFill.style.width = '0%';
            } else {
                currentTime += 1;
                const progressPercent = (currentTime / totalTime) * 100;
                progressFill.style.width = `${progressPercent}%`;
            }
        }, 1000);
    }
    
    // Función para detener la animación de progreso
    function stopProgressAnimation() {
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }
    
    // Actualizar el tiempo actual de la canción
    backgroundMusic.addEventListener('timeupdate', function() {
        currentTime = backgroundMusic.currentTime;
        const progressPercent = (currentTime / totalTime) * 100;
        progressFill.style.width = `${progressPercent}%`;
    });
    
    // Cuando la canción termine, reiniciar
    backgroundMusic.addEventListener('ended', function() {
        isPlaying = false;
        updateMusicButton();
        stopProgressAnimation();
        progressFill.style.width = '0%';
        currentTime = 0;
    });
    
    // Intentar cargar el estado de la música desde localStorage
    const savedMusicState = localStorage.getItem('xvMusicPlaying');
    if (savedMusicState === 'true') {
        // Solo intentar reproducir automáticamente si el usuario ya interactuó antes
        backgroundMusic.volume = 0.7; // Volumen moderado
        isPlaying = true;
        updateMusicButton();
        startProgressAnimation();
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
        const phoneInput = document.getElementById('phone');
        const guestsSelect = document.getElementById('guests');
        const asistenciaCheckbox = document.getElementById('asistencia');
        
        if (!nameInput.value.trim()) {
            alert('Por favor ingresa tu nombre completo');
            nameInput.focus();
            return;
        }
        
        if (!phoneInput.value.trim()) {
            alert('Por favor ingresa tu número de celular');
            phoneInput.focus();
            return;
        }
        
        // Validar formato de teléfono (mínimo 8 dígitos para Guatemala)
        const phoneRegex = /^[0-9\s\+\-\(\)]{8,}$/;
        const cleanedPhone = phoneInput.value.replace(/\D/g, '');
        
        if (cleanedPhone.length < 8) {
            alert('Por favor ingresa un número de celular válido (mínimo 8 dígitos)');
            phoneInput.focus();
            return;
        }
        
        if (!guestsSelect.value) {
            alert('Por favor selecciona el número de acompañantes');
            guestsSelect.focus();
            return;
        }
        
        if (!asistenciaCheckbox.checked) {
            alert('Debes confirmar que asistirás al evento');
            return;
        }
        
        // Obtener datos del formulario
        const name = nameInput.value.trim();
        const phone = cleanedPhone;
        const guests = guestsSelect.value;
        const message = document.getElementById('message').value;
        
        // Generar código único para el pase
        const randomCode = Math.floor(1000 + Math.random() * 9000);
        
        // Actualizar información del pase
        ticketName.textContent = name;
        ticketGuests.textContent = guests;
        ticketCode.textContent = randomCode;
        ticketBarcodeNumber.textContent = randomCode;
        
        // Preparar mensaje para WhatsApp con el pase incluido
        // ============================================
        // CONFIGURACIÓN: NÚMERO DE WHATSAPP DE RAQUELITA
        // ============================================
        // CAMBIA ESTE NÚMERO POR EL NÚMERO REAL DE RAQUELITA
        const whatsappNumber = '55996252'; // Número de Raquelita (Guatemala)
        // ============================================
        
        const paseWhatsApp = `
🎟️ *PASE DE ACCESO - XV AÑOS DE RAQUELITA* 🎟️
📍 *Antigua Guatemala, Guatemala*

👤 *Invitado:* ${name}
👥 *Acompañantes:* ${guests}
📅 *Fecha:* 15 de Diciembre, 2024
⏰ *Hora de recepción:* 17:30 hrs
📍 *Lugar:* Salón "Jardines de la Antigua"
🔑 *Código de acceso:* XV-2024-${randomCode}

*Instrucciones:*
1. Presenta este pase en la entrada del salón
2. Llega puntual para disfrutar todas las actividades
3. Comparte tus fotos con #XVRaquelita2024

¡Te esperamos con mucha alegría! 🎉
        `;
        
        const confirmacionWhatsApp = `¡Hola Raquelita! Confirmo mi asistencia a tus XV años.

👤 Nombre: ${name}
📱 Teléfono: ${phoneInput.value}
👥 Acompañantes: ${guests}
💌 Mensaje: ${message || 'Sin mensaje adicional'}

Código de confirmación: XV-2024-${randomCode}`;
        
        // Codificar mensajes para URL
        const encodedPase = encodeURIComponent(paseWhatsApp);
        const encodedConfirmacion = encodeURIComponent(confirmacionWhatsApp);
        
        // Enviar confirmación a Raquelita
        const whatsappURLConfirmacion = `https://wa.me/${whatsappNumber}?text=${encodedConfirmacion}`;
        
        // Enviar pase al invitado (a su propio número)
        const whatsappURLPase = `https://wa.me/502${phone}?text=${encodedPase}`;
        
        // Abrir WhatsApp para confirmación
        window.open(whatsappURLConfirmacion, '_blank');
        
        // Enviar pase después de un breve retraso
        setTimeout(() => {
            window.open(whatsappURLPase, '_blank');
        }, 1000);
        
        // Mostrar sección del pase
        paseSection.style.display = 'block';
        
        // Desplazarse a la sección del pase
        setTimeout(() => {
            paseSection.scrollIntoView({ behavior: 'smooth' });
        }, 500);
        
        // Guardar datos en localStorage
        const confirmationData = {
            name: name,
            phone: phone,
            guests: guests,
            code: randomCode,
            date: new Date().toISOString()
        };
        
        localStorage.setItem('xvRaquelitaConfirmation', JSON.stringify(confirmationData));
        
        // Mostrar notificación de éxito
        showNotification('¡Confirmación exitosa! Revisa tu WhatsApp para recibir tu pase.');
    });
    
    // Guardar pase como imagen - FUNCIONALIDAD COMPLETA
    saveTicketBtn.addEventListener('click', function() {
        const ticketElement = document.getElementById('ticketToSave');
        
        // Cambiar texto del botón para indicar que está procesando
        const originalText = saveTicketBtn.innerHTML;
        saveTicketBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando imagen...';
        saveTicketBtn.disabled = true;
        
        // Usar html2canvas para generar la imagen
        html2canvas(ticketElement, {
            scale: 2, // Mayor resolución
            useCORS: true, // Para imágenes externas
            backgroundColor: '#ffffff'
        }).then(canvas => {
            // Convertir canvas a imagen
            const imgData = canvas.toDataURL('image/png');
            
            // Crear enlace para descarga
            const link = document.createElement('a');
            link.href = imgData;
            link.download = `Pase-XV-Raquelita-${ticketCode.textContent}.png`;
            
            // Simular clic para descargar
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Restaurar botón
            saveTicketBtn.innerHTML = originalText;
            saveTicketBtn.disabled = false;
            
            // Mostrar notificación
            showNotification('¡Pase descargado exitosamente!');
        }).catch(error => {
            console.error('Error al generar la imagen:', error);
            
            // Si html2canvas falla, dar instrucciones para captura de pantalla
            saveTicketBtn.innerHTML = '<i class="fas fa-camera"></i> Usa captura de pantalla';
            showNotification('Para guardar el pase, toma una captura de pantalla. En móviles: presiona volumen + encendido.');
            
            // Restaurar después de 3 segundos
            setTimeout(() => {
                saveTicketBtn.innerHTML = originalText;
                saveTicketBtn.disabled = false;
            }, 3000);
        });
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
    const savedConfirmation = localStorage.getItem('xvRaquelitaConfirmation');
    if (savedConfirmation) {
        const data = JSON.parse(savedConfirmation);
        ticketName.textContent = data.name;
        ticketGuests.textContent = data.guests;
        ticketCode.textContent = data.code;
        ticketBarcodeNumber.textContent = data.code;
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
            background-color: var(--spotify-green);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-strong);
            z-index: 9999;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Remover notificación después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
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
    
    // Asegurarse de que el reproductor sea visible
    setTimeout(() => {
        const spotifyContainer = document.querySelector('.spotify-container');
        if (spotifyContainer) {
            spotifyContainer.style.opacity = '1';
            spotifyContainer.style.transform = 'translateY(0)';
        }
        
        // Iniciar animación de la barra de progreso si la música está reproduciéndose
        if (isPlaying) {
            startProgressAnimation();
        }
    }, 300);
});