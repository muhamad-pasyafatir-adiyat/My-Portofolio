/* =============================================
   PORTFOLIO - JavaScript
   Interactions, Animations & Dynamic Behavior
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Cursor Follower ----------
    const cursorFollower = document.getElementById('cursorFollower');
    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        });
    }

    // ---------- Navbar Scroll Effect ----------
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ---------- Active Nav Link on Scroll ----------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar__link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    });

    sections.forEach(section => sectionObserver.observe(section));

    // ---------- Mobile Menu ----------
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ---------- Reveal on Scroll Animation ----------
    const revealElements = document.querySelectorAll('.reveal-up');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---------- Counter Animation ----------
    const statNumbers = document.querySelectorAll('.hero__stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                animateCounter(el, 0, target, 1500);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(el, start, end, duration) {
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(start + (end - start) * eased);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // ---------- Smooth Scroll for Anchor Links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetEl = document.querySelector(this.getAttribute('href'));
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ---------- Tilt Effect on Project Cards ----------
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (y - rect.height / 2) / 20;
            const rotateY = (rect.width / 2 - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ---------- Skill Chips Stagger Animation ----------
    const chipObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chips = entry.target.querySelectorAll('.skill-chip');
                chips.forEach((chip, index) => {
                    chip.style.opacity = '0';
                    chip.style.transform = 'translateY(10px) scale(0.95)';
                    chip.style.transition = `all 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s`;
                    setTimeout(() => {
                        chip.style.opacity = '1';
                        chip.style.transform = 'translateY(0) scale(1)';
                    }, 100);
                });
                chipObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.skills__grid').forEach(grid => chipObserver.observe(grid));

    // ---------- Parallax for Background Glows ----------
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        document.querySelectorAll('.bg-glow').forEach((glow, index) => {
            glow.style.transform = `translateY(${scrollY * (index + 1) * 0.03}px)`;
        });
    });

    // ============================================================
    // INBOX SYSTEM — Pesan Masuk (disimpan di localStorage)
    // ============================================================

    const INBOX_KEY = 'portfolio_inbox_messages';

    // Helpers
    function getMessages() {
        try {
            return JSON.parse(localStorage.getItem(INBOX_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveMessages(messages) {
        localStorage.setItem(INBOX_KEY, JSON.stringify(messages));
    }

    function countUnread() {
        return getMessages().filter(m => m.unread).length;
    }

    function formatTime(timestamp) {
        const d = new Date(timestamp);
        const now = new Date();
        const diffMs = now - d;
        const diffMin = Math.floor(diffMs / 60000);
        const diffHr  = Math.floor(diffMs / 3600000);
        const diffDay = Math.floor(diffMs / 86400000);

        if (diffMin < 1)  return 'Baru saja';
        if (diffMin < 60) return `${diffMin} menit lalu`;
        if (diffHr  < 24) return `${diffHr} jam lalu`;
        if (diffDay < 7)  return `${diffDay} hari lalu`;
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    // Render
    function renderMessages() {
        const messages = getMessages();
        const body = document.getElementById('inboxBody');

        if (messages.length === 0) {
            body.innerHTML = `
                <div class="inbox-empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <p>Belum ada pesan masuk.<br>Pesan dari form kontak akan muncul di sini.</p>
                </div>`;
            return;
        }

        body.innerHTML = messages
            .slice()
            .reverse()
            .map(msg => `
                <div class="inbox-message ${msg.unread ? 'unread' : ''}" data-id="${msg.id}">
                    <div class="inbox-message__meta">
                        <span class="inbox-message__sender">
                            ${escapeHtml(msg.name)}
                            ${msg.unread ? '<span class="inbox-message__unread-dot"></span>' : ''}
                        </span>
                        <span class="inbox-message__time">${formatTime(msg.timestamp)}</span>
                    </div>
                    <span class="inbox-message__email">${escapeHtml(msg.email)}</span>
                    <p class="inbox-message__text">${escapeHtml(msg.message)}</p>
                    <button class="inbox-message__delete" data-id="${msg.id}" title="Hapus pesan">✕</button>
                </div>
            `)
            .join('');

        // Delete individual message
        body.querySelectorAll('.inbox-message__delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                deleteMessage(id);
            });
        });

        // Mark as read on click
        body.querySelectorAll('.inbox-message').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.getAttribute('data-id');
                markAsRead(id);
            });
        });
    }

    function deleteMessage(id) {
        const messages = getMessages().filter(m => m.id !== id);
        saveMessages(messages);
        renderMessages();
        updateBadge();

        // Animate removal
        const card = document.querySelector(`.inbox-message[data-id="${id}"]`);
        if (card) {
            card.style.transition = 'all 0.25s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateX(20px)';
            setTimeout(() => card.remove(), 250);
        }
    }

    function markAsRead(id) {
        const messages = getMessages().map(m =>
            m.id === id ? { ...m, unread: false } : m
        );
        saveMessages(messages);
        updateBadge();
        const card = document.querySelector(`.inbox-message[data-id="${id}"]`);
        if (card) {
            card.classList.remove('unread');
            const dot = card.querySelector('.inbox-message__unread-dot');
            if (dot) dot.remove();
        }
    }

    function updateBadge() {
        const badge = document.getElementById('inboxBadge');
        const unread = countUnread();
        badge.textContent = unread;
        badge.classList.toggle('hidden', unread === 0);
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Inbox panel toggle
    const inboxFab   = document.getElementById('inboxFab');
    const inboxPanel = document.getElementById('inboxPanel');
    const inboxClose = document.getElementById('inboxClose');
    const inboxClear = document.getElementById('inboxClear');

    inboxFab.addEventListener('click', () => {
        const isOpen = inboxPanel.classList.toggle('active');
        if (isOpen) {
            renderMessages();
            // Mark all unread as read when opening
            const messages = getMessages().map(m => ({ ...m, unread: false }));
            saveMessages(messages);
            updateBadge();
            renderMessages();
        }
    });

    inboxClose.addEventListener('click', () => {
        inboxPanel.classList.remove('active');
    });

    inboxClear.addEventListener('click', () => {
        if (getMessages().length === 0) return;
        if (confirm('Hapus semua pesan masuk?')) {
            saveMessages([]);
            renderMessages();
            updateBadge();
        }
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (
            inboxPanel.classList.contains('active') &&
            !inboxPanel.contains(e.target) &&
            !inboxFab.contains(e.target)
        ) {
            inboxPanel.classList.remove('active');
        }
    });

    // Initialize badge
    updateBadge();

    // ---------- Contact Form Handler ----------
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name    = document.getElementById('formName').value.trim();
        const email   = document.getElementById('formEmail').value.trim();
        const message = document.getElementById('formMessage').value.trim();
        const submitBtn = document.getElementById('submitBtn');
        const originalHTML = submitBtn.innerHTML;

        if (!name || !email || !message) return;

        // Loading state
        submitBtn.innerHTML = `
            <span>Mengirim...</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinning">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>`;
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        setTimeout(() => {
            // Save message to inbox
            const messages = getMessages();
            const newMsg = {
                id: Date.now().toString(),
                name,
                email,
                message,
                timestamp: Date.now(),
                unread: true
            };
            messages.push(newMsg);
            saveMessages(messages);
            updateBadge();

            // Success state
            submitBtn.innerHTML = `<span>Pesan Terkirim! ✓</span>`;
            submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            submitBtn.style.opacity = '1';

            setTimeout(() => {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                contactForm.reset();
            }, 2500);
        }, 1200);
    });

    // ---------- Spinning animation style ----------
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
        }
        .spinning { animation: spin 1s linear infinite; }
    `;
    document.head.appendChild(style);

});
