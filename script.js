// Navegación responsive
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Efecto de scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Contador regresivo
    function updateCountdown() {
        const targetDate = new Date('May 16, 2026 16:00:00').getTime();
        const now = new Date().getTime();
        const timeLeft = targetDate - now;
        
        if (timeLeft < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    setInterval(updateCountdown, 1000);
    updateCountdown();
    
    // Controlador de música
    

// Elementos del DOM
const playBtn = document.querySelector('.play-btn');
const pauseBtn = document.querySelector('.pause-btn');
const volumeBtn = document.querySelector('.volume-btn');
const volumeSlider = document.getElementById('volumeSlider');
const audioPlayer = document.getElementById('backgroundAudio');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

// Estado inicial
audioPlayer.volume = 0.7;

// Formatear tiempo (segundos a MM:SS)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Actualizar barra de progreso y tiempo
function updateProgress() {
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progress.style.width = `${percent}%`;
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
}

// Actualizar duración total
audioPlayer.addEventListener('loadedmetadata', function() {
    durationEl.textContent = formatTime(audioPlayer.duration);
});

// Actualizar progreso mientras se reproduce
audioPlayer.addEventListener('timeupdate', updateProgress);

// Hacer clic en la barra de progreso para saltar
progressBar.addEventListener('click', function(e) {
    const clickX = e.offsetX;
    const width = this.clientWidth;
    const percent = clickX / width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
});

// Control de volumen con slider
volumeSlider.addEventListener('input', function() {
    const volume = this.value / 100;
    audioPlayer.volume = volume;
    
    // Cambiar ícono según volumen
    if (volume === 0) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else if (volume < 0.5) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
});

// Resto del código igual que la Opción 1 para play/pause...
playBtn.addEventListener('click', function() {
    audioPlayer.play();
    playBtn.style.background = "var(--dorado)";
    playBtn.style.borderColor = "var(--dorado)";
    playBtn.style.color = "var(--azul-marino)";
    pauseBtn.style.background = "rgba(255, 255, 255, 0.1)";
    pauseBtn.style.borderColor = "var(--plateado)";
    pauseBtn.style.color = "var(--plateado)";
    showMusicNotification("🎵 Reproduciendo música de los XV años");
});

pauseBtn.addEventListener('click', function() {
    audioPlayer.pause();
    pauseBtn.style.background = "var(--dorado)";
    pauseBtn.style.borderColor = "var(--dorado)";
    pauseBtn.style.color = "var(--azul-marino)";
    playBtn.style.background = "rgba(255, 255, 255, 0.1)";
    playBtn.style.borderColor = "var(--plateado)";
    playBtn.style.color = "var(--plateado)";
    showMusicNotification("⏸️ Música pausada");
});

// Función de notificación (igual que antes)
function showMusicNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'music-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}
    
    // Formulario de confirmación
    const confirmationForm = document.getElementById('confirmationForm');
    const ticketSection = document.getElementById('ticketSection');
    
    confirmationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const nombre = document.getElementById('nombre').value;
        const telefono = document.getElementById('telefono').value;
        const asistentes = document.getElementById('asistentes').value;
        const mensaje = document.getElementById('mensaje').value;
        
        // Validación básica
        if (!nombre || !telefono || !asistentes) {
            alert("Por favor, completa todos los campos obligatorios (*)");
            return;
        }
        
        // Crear mensaje para WhatsApp
        const whatsappMessage = `*CONFIRMACIÓN DE ASISTENCIA - XV AÑOS RAQUEL ESTER*%0A%0A` +
                               `Hola, soy *${nombre}*. Confirmo mi asistencia a los XV años de Raquel Ester.%0A%0A` +
                               `*Número de teléfono:* ${telefono}%0A` +
                               `*Número de asistentes:* ${asistentes}%0A` +
                               (mensaje ? `*Mensaje para Raquel:* ${mensaje}%0A` : "") +
                               `%0A¡Nos vemos el 16 de mayo de 2026! 🦋`;
        
        // Número de WhatsApp (reemplazar con el número real)
        const whatsappNumber = "55996252";
        
        // Abrir WhatsApp en una nueva ventana
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
        window.open(whatsappUrl, '_blank');
        
        // Mostrar instrucción para regresar
        alert("✅ Formulario completado correctamente.\n\n📱 Se ha abierto WhatsApp con tu mensaje de confirmación.\n\n🔄 Por favor, REGRESA A ESTA PÁGINA después de enviar el mensaje para generar tu pase de acceso.");
        
        // Generar el ticket después de un breve retraso (para dar tiempo a enviar el WhatsApp)
        setTimeout(() => {
            generarTicket(nombre, asistentes);
        }, 1000);
    });
    
    // Función para generar el ticket
    function generarTicket(nombre, asistentes) {
        // Actualizar información del ticket
        document.getElementById('ticketNombre').textContent = nombre;
        document.getElementById('ticketAsistentes').textContent = asistentes;
        
        // Generar un código único para el ticket
        const codigo = Math.floor(1000 + Math.random() * 9000);
        document.getElementById('ticketCodigo').textContent = codigo;
        
        // Mostrar la sección del ticket
        ticketSection.style.display = 'block';
        
        // Desplazarse suavemente hacia el ticket
        ticketSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    

// Función para descargar el ticket como IMAGEN
const downloadBtn = document.getElementById('downloadTicket');

downloadBtn.addEventListener('click', async function() {
    // Mostrar mensaje de carga
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
    downloadBtn.disabled = true;
    
    try {
        // Obtener el elemento del ticket
        const ticketElement = document.querySelector('.ticket-container');
        
        // Configuración para html2canvas
        const options = {
            scale: 3, // Mayor calidad
            useCORS: true, // Permitir imágenes externas
            backgroundColor: null, // Fondo transparente
            logging: false, // No mostrar logs
            onclone: function(clonedDoc) {
                // Asegurar que los estilos se mantengan
                const clonedTicket = clonedDoc.querySelector('.ticket-container');
                clonedTicket.style.boxShadow = 'none';
                clonedTicket.style.margin = '0';
                clonedTicket.style.transform = 'scale(1)';
            }
        };
        
        // Crear el canvas con html2canvas
        const canvas = await html2canvas(ticketElement, options);
        
        // Convertir canvas a imagen
        const imageData = canvas.toDataURL('image/png', 1.0);
        
        // Crear enlace de descarga
        const downloadLink = document.createElement('a');
        const ticketCode = document.getElementById('ticketCodigo').textContent;
        const nombreInvitado = document.getElementById('ticketNombre').textContent;
        
        // Nombre del archivo
        const fileName = `Pase-XV-Raquel-${ticketCode}-${nombreInvitado.replace(/\s+/g, '_')}.png`;
        
        downloadLink.href = imageData;
        downloadLink.download = fileName;
        
        // Simular clic en el enlace para descargar
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Mostrar notificación de éxito
        showDownloadNotification(nombreInvitado, ticketCode);
        
    } catch (error) {
        console.error('Error al generar la imagen:', error);
        alert('❌ Error al generar el pase. Por favor, intenta nuevamente.');
    } finally {
        // Restaurar el botón
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Descargar Pase';
        downloadBtn.disabled = false;
    }
});

// Función para mostrar notificación de descarga exitosa
function showDownloadNotification(nombre, codigo) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <div>
                <h4>✅ Pase descargado exitosamente</h4>
                <p><strong>Invitado:</strong> ${nombre}</p>
                <p><strong>Código:</strong> XV-RAQUEL-${codigo}</p>
                <p class="notification-tip">💡 Guarda esta imagen o imprímela para presentarla en la entrada.</p>
            </div>
        </div>
    `;
    
    // Aplicar estilos
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, var(--azul-marino), var(--azul-medio));
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 350px;
        border-left: 5px solid var(--dorado);
        animation: slideInRight 0.5s ease, fadeOut 0.5s ease 5s forwards;
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}




    
    // Efecto de scroll para navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 35, 66, 0.98)';
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
        } else {
            navbar.style.background = 'rgba(10, 35, 66, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Efecto de carga inicial
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 1s';
        
        setTimeout(function() {
            document.body.style.opacity = '1';
        }, 300);
        
        // Efecto de aparición de elementos al hacer scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observar elementos para animación
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(section);
        });
    });
});