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
    const bookmarksKey = 'nc_bookmarks';
    const bookmarksList = document.getElementById('bookmarksList');
    const clearBtn = document.getElementById('clearBookmarksBtn');
  
    function loadBookmarks() {
      const stored = localStorage.getItem(bookmarksKey);
      return stored ? JSON.parse(stored) : [];
    }
  
    function saveBookmarks(bm) {
      localStorage.setItem(bookmarksKey, JSON.stringify(bm));
    }
  
    function renderBookmarks() {
      const items = loadBookmarks();
      bookmarksList.innerHTML = '';
      items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
  
        const link = document.createElement('a');
        link.href = item.url;
        link.textContent = item.title;
        link.addEventListener('click', () => {
          // Navega para o marcador
        });
  
        const del = document.createElement('button');
        del.className = 'btn btn-sm btn-outline-danger';
        del.innerHTML = '<i class="bi bi-trash"></i>';
        del.addEventListener('click', () => {
          const updated = loadBookmarks().filter(b => b.url !== item.url);
          saveBookmarks(updated);
          renderBookmarks();
        });
  
        li.append(link, del);
        bookmarksList.append(li);
      });
    }
  
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem(bookmarksKey);
      renderBookmarks();
    });
  
    // Re-render sempre que o painel for aberto
    const offcanvasEl = document.getElementById('bookmarksCanvas');
    offcanvasEl.addEventListener('show.bs.offcanvas', renderBookmarks);
    const shareBtn = document.getElementById('shareBtn');
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: document.title,
        text: 'Confira este tutorial do Nova Courses!',
        url: window.location.href
      };
  
      // Se o navegador suportar a API de compartilhamento nativa
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          console.log('Página compartilhada com sucesso');
        } catch (err) {
          console.error('Erro ao compartilhar:', err);
        }
      } else if (navigator.clipboard) {
        // fallback: copia o link para o clipboard
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert('URL copiada para a área de transferência!');
        } catch (err) {
          console.error('Falha ao copiar:', err);
          alert('Não foi possível copiar o link. Por favor, copie manualmente.');
        }
      } else {
        // fallback final: prompt de cópia manual
        prompt('Copie este link:', window.location.href);
      }
    });
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', () => {
      // Pega lista atual de bookmarks ou inicia vazia
      const key = 'nc_bookmarks';
      const stored = localStorage.getItem(key);
      const bookmarks = stored ? JSON.parse(stored) : [];
  
      const current = {
        title: document.title,
        url: window.location.href,
        savedAt: new Date().toISOString()
      };
  
      // Evita duplicados
      if (bookmarks.find(b => b.url === current.url)) {
        alert('Esta página já está nos seus marcadores.');
      } else {
        bookmarks.push(current);
        localStorage.setItem(key, JSON.stringify(bookmarks));
        alert('Página salva nos seus marcadores!');
      }
    });
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