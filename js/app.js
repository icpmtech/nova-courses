 // Progress bar
 function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";
  }

  // Update navbar on scroll
  function handleScroll() {
    updateProgressBar();
    
    // Add shadow and reduce padding on navbar when scrolled
    const navbar = document.getElementById('mainNav');
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Update section dots
    const sections = document.querySelectorAll('section');
    const dots = document.querySelectorAll('.section-dots .dot');
    
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
      }
    });
  }

  // Create section dots
  function createSectionDots() {
    const sections = document.querySelectorAll('section');
    const dotsContainer = document.getElementById('sectionDots');
    
    sections.forEach((section, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      
      // Add click event to navigate to section
      dot.addEventListener('click', () => {
        section.scrollIntoView({ behavior: 'smooth' });
      });
      
      dotsContainer.appendChild(dot);
    });
  }

  // Show swipe indicator
  function showSwipeIndicator() {
    const indicator = document.getElementById('swipeIndicator');
    indicator.classList.add('show');
    
    setTimeout(() => {
      indicator.classList.remove('show');
    }, 2000);
  }

  // Initialize ScrollSpy
  document.addEventListener('DOMContentLoaded', function() {
    new bootstrap.ScrollSpy(document.body, {
      target: '#navMenu',
      offset: 80
    });
    
    // Create section dots
    createSectionDots();
    
    // Handle scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Initialize scroll position
    handleScroll();
    
    // Close offcanvas on link click
    document.querySelectorAll('#navMenu .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const offcanvasEl = document.getElementById('sidebar');
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (bsOffcanvas) bsOffcanvas.hide();
      });
    });
    
    // Show swipe indicator after a short delay
    setTimeout(showSwipeIndicator, 1500);
    
    // Chat toggle functions
    document.getElementById('chatBtn').addEventListener('click', () => {
      document.getElementById('chatWindow').style.display = 'block';
    });
    
    document.getElementById('closeChat').addEventListener('click', () => {
      document.getElementById('chatWindow').style.display = 'none';
    });
    
    document.getElementById('sendBtn').addEventListener('click', () => {
      sendChatMessage();
    });
    
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendChatMessage();
      }
    });
    
    function sendChatMessage() {
      const input = document.getElementById('chatInput');
      const message = input.value.trim();
      
      if (!message) return;
      
      const chatBody = document.querySelector('#chatWindow .card-body');
      
      // User message
      const userMsg = document.createElement('p');
      userMsg.textContent = message;
      userMsg.classList.add('user-message');
      chatBody.appendChild(userMsg);
      
      // Bot response (simulated)
      setTimeout(() => {
        const botMsg = document.createElement('p');
        botMsg.textContent = "Obrigado por sua mensagem! Um especialista responderá em breve.";
        botMsg.classList.add('bot-message');
        chatBody.appendChild(botMsg);
        
        // Scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 800);
      
      input.value = '';
      chatBody.scrollTop = chatBody.scrollHeight;
    }
    
    // Add touch swipe navigation on mobile
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', (e) => {
      touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', (e) => {
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    });
    
    function handleSwipe() {
      const sections = document.querySelectorAll('section');
      const currentSection = [...sections].find(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      
      if (!currentSection) return;
      
      const currentIndex = [...sections].indexOf(currentSection);
      
      if (touchEndY < touchStartY - 70) {
        // Swipe up - go to next section
        if (currentIndex < sections.length - 1) {
          sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
          showSwipeIndicator();
        }
      } else if (touchEndY > touchStartY + 70) {
        // Swipe down - go to previous section
        if (currentIndex > 0) {
          sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
          showSwipeIndicator();
        }
      }
    }
  });

  // Register service worker for PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(console.error);
  }