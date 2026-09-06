/**
 * Crescent National Academy - School Website Interactions
 * Location: Chunauti Kuan, Khanquah More, Isapur Road, Phulwari Sharif, Patna
 * Phone: 9507995880, 8935918359
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCounters();
  initAcademicTabs();
  initModalListeners();
  initScrollSpy();
  initWhatsAppWidget();
});

/* ==========================================================================
   1. Navbar & Mobile Menu
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const toggleIcon = document.getElementById('toggleIcon');
  const navLinks = document.querySelectorAll('.nav-link');

  // Shrink/shadow navbar on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      if (isOpen) {
        toggleIcon.classList.remove('fa-bars');
        toggleIcon.classList.add('fa-xmark');
        menuToggle.setAttribute('aria-expanded', 'true');
      } else {
        toggleIcon.classList.remove('fa-xmark');
        toggleIcon.classList.add('fa-bars');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          toggleIcon.classList.remove('fa-xmark');
          toggleIcon.classList.add('fa-bars');
        }
      });
    });
  }
}

/* ==========================================================================
   2. Number Counter Animation
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10);
        let current = 0;
        const duration = 1600; // ms
        const increment = Math.max(1, Math.ceil(target / (duration / 25)));

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.innerText = target.toLocaleString('en-IN');
            clearInterval(timer);
          } else {
            counter.innerText = current.toLocaleString('en-IN');
          }
        }, 25);

        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
}

/* ==========================================================================
   3. Academic Wing Tabs (Pre-Primary, Primary, Middle, Secondary)
   ========================================================================== */
function initAcademicTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      // Update button active state
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panel visibility
      tabPanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}

/* ==========================================================================
   4. Admission Modal Management
   ========================================================================== */
function openAdmissionModal(targetClass = '') {
  const modal = document.getElementById('admissionModal');
  const classSelect = document.getElementById('mClass');
  const form = document.getElementById('modalForm');
  const successState = document.getElementById('modalSuccess');

  if (modal) {
    if (form) form.style.display = 'block';
    if (successState) successState.classList.remove('active');

    // Pre-select class if given
    if (targetClass && classSelect) {
      for (let option of classSelect.options) {
        if (option.value.toLowerCase().includes(targetClass.toLowerCase()) || targetClass.toLowerCase().includes(option.value.toLowerCase())) {
          option.selected = true;
          break;
        }
      }
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeAdmissionModal() {
  const modal = document.getElementById('admissionModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function initModalListeners() {
  const modal = document.getElementById('admissionModal');
  if (modal) {
    // Close on clicking backdrop
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAdmissionModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeAdmissionModal();
      }
    });
  }
}

/* ==========================================================================
   5. Form Submissions with Direct WhatsApp & Email Linking
   ========================================================================== */
function handleModalSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('modalForm');
  const submitBtn = document.getElementById('modalSubmitBtn');
  const successState = document.getElementById('modalSuccess');
  const refNumber = document.getElementById('refNumber');
  const modalWaSendBtn = document.getElementById('modalWaSendBtn');
  const modalEmailSendBtn = document.getElementById('modalEmailSendBtn');

  const studentName = document.getElementById('mStudentName').value;
  const parentName = document.getElementById('mParentName').value;
  const grade = document.getElementById('mClass').value;
  const phone = document.getElementById('mPhone').value;
  const location = document.getElementById('mLocation').value || 'Phulwari Sharif / Patna';
  const email = document.getElementById('mEmail').value || 'Not provided';
  const notes = document.getElementById('mNotes').value || 'Admission inquiry for academic session';

  // Set button to loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Connecting to WhatsApp...`;

  setTimeout(() => {
    // Generate reference number
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const refCode = `CNA-2025-${randomCode}`;
    if (refNumber) refNumber.innerText = refCode;

    // Structured WhatsApp Message
    const waText = 
      `*Admission Registration - Crescent National Academy*\n` +
      `---------------------------------------\n` +
      `📄 *Ref No:* ${refCode}\n` +
      `👤 *Student Name:* ${studentName}\n` +
      `👨‍👩‍👦 *Parent/Guardian:* ${parentName}\n` +
      `🎓 *Class:* ${grade}\n` +
      `📱 *Contact Mobile:* ${phone}\n` +
      `📍 *Area/Address:* ${location}\n` +
      `✉️ *Email:* ${email}\n` +
      `📝 *Notes/Query:* ${notes}\n` +
      `---------------------------------------\n` +
      `Kindly confirm admission availability & documentation process.`;

    const waUrl = `https://wa.me/919507995880?text=${encodeURIComponent(waText)}`;
    
    // Structured Email Link
    const mailSubject = `Admission Registration (${refCode}) - ${studentName} - ${grade}`;
    const mailBody = 
      `Dear Admissions Team,\n\nPlease find my child's admission registration details:\n\n` +
      `Reference No: ${refCode}\n` +
      `Student Name: ${studentName}\n` +
      `Parent Name: ${parentName}\n` +
      `Applying For: ${grade}\n` +
      `Mobile: ${phone}\n` +
      `Area/Address: ${location}\n` +
      `Notes: ${notes}\n\nThank you.`;

    const mailUrl = `mailto:admissions@crescentnationalacademy.in?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

    // Update dynamic success action links
    if (modalWaSendBtn) modalWaSendBtn.href = waUrl;
    if (modalEmailSendBtn) modalEmailSendBtn.href = mailUrl;

    form.style.display = 'none';
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-brands fa-whatsapp"></i> Submit & Send via WhatsApp`;
    if (successState) successState.classList.add('active');

    // Automatically trigger WhatsApp in new tab
    window.open(waUrl, '_blank');

    showToast(`Application created for ${studentName} (${grade})! Opened in WhatsApp.`);
  }, 750);
}

function handleContactSubmit(event) {
  event.preventDefault();
  const submitBtn = document.getElementById('contactSubmitBtn');
  const form = document.getElementById('contactForm');
  const successMessage = document.getElementById('contactSuccess');
  const directWaBtn = document.getElementById('contactWaDirectBtn');

  const parentName = document.getElementById('cName').value;
  const phone = document.getElementById('cPhone').value;
  const student = document.getElementById('cStudent').value || 'Prospective Student';
  const grade = document.getElementById('cClass').value;
  const msg = document.getElementById('cMessage').value || 'Inquiring about admission & fee offer';

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Connecting to WhatsApp...`;

  setTimeout(() => {
    const waText = 
      `*Admission Inquiry - Crescent National Academy*\n` +
      `👤 *Parent Name:* ${parentName}\n` +
      `📱 *Contact Mobile:* ${phone}\n` +
      `🎓 *Student / Class:* ${student} (${grade})\n` +
      `💬 *Query:* ${msg}\n` +
      `---------------------------------------\n` +
      `Location: Phulwari Sharif, Patna`;

    const waUrl = `https://wa.me/919507995880?text=${encodeURIComponent(waText)}`;
    
    if (directWaBtn) directWaBtn.href = waUrl;

    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-brands fa-whatsapp"></i> Send via WhatsApp / Inquire Now`;
    form.style.display = 'none';
    if (successMessage) successMessage.classList.add('active');

    // Launch WhatsApp
    window.open(waUrl, '_blank');

    showToast(`Thank you, ${parentName}. Inquiry opened in WhatsApp.`);
  }, 700);
}

function resetContactForm() {
  const form = document.getElementById('contactForm');
  const successMessage = document.getElementById('contactSuccess');
  if (form && successMessage) {
    form.reset();
    form.style.display = 'block';
    successMessage.classList.remove('active');
  }
}

/* ==========================================================================
   6. WhatsApp Floating Quick Chat Widget
   ========================================================================== */
function initWhatsAppWidget() {
  const popup = document.getElementById('whatsappPopup');
  
  // Close popup if user clicks outside
  document.addEventListener('click', (e) => {
    const widget = document.getElementById('whatsappWidget');
    if (widget && !widget.contains(e.target) && popup && popup.classList.contains('open')) {
      popup.classList.remove('open');
    }
  });
}

function toggleWhatsAppPopup() {
  const popup = document.getElementById('whatsappPopup');
  if (popup) {
    popup.classList.toggle('open');
  }
}

/* ==========================================================================
   7. Toast Notification Utility
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   8. Scrollspy for Navigation Link Highlights
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
