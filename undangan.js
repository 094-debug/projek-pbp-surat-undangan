document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('to');
    const guestNameElement = document.getElementById('guest-name');
    
    if (guestParam) {
        guestNameElement.textContent = guestParam;
    }

    const btnOpen = document.getElementById('btn-open');
    const coverOverlay = document.getElementById('cover-overlay');
    const mainContent = document.getElementById('main-content');
    const musicControl = document.getElementById('music-control');
    const bgMusic = document.getElementById('bg-music');

    btnOpen.addEventListener('click', () => {
        coverOverlay.classList.add('open');
        mainContent.classList.remove('hidden');
        musicControl.classList.remove('hidden');
        
        bgMusic.play().catch(() => {
            console.log("Autoplay ditolak oleh browser, silakan klik tombol musik.");
        });
        
        document.body.style.overflow = 'auto';
    });

    document.body.style.overflow = 'hidden';

    const eventDate = new Date("October 24, 2026 08:00:00").getTime();

    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const diff = eventDate - now;

        if (diff < 0) {
            clearInterval(timerInterval);
            document.getElementById('days').textContent = '22';
            document.getElementById('hours').textContent = '12';
            document.getElementById('minutes').textContent = '30';
            document.getElementById('seconds').textContent = '40';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '22');
        document.getElementById('hours').textContent = String(hours).padStart(2, '12');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '30');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '40');
    }, 1000);

    const rsvpForm = document.getElementById('rsvp-form');
    const messagesList = document.getElementById('messages-list');
    loadMessages();

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('rsvp-name').value.trim();
        const status = document.getElementById('rsvp-status').value;
        const message = document.getElementById('rsvp-message').value.trim();

        if (name && status && message) {
            const newMessage = { name, status, message, date: new Date().toLocaleDateString('id-ID') };
            
            saveMessage(newMessage);
            addMessageToDOM(newMessage);
            
            rsvpForm.reset();
            alert("Terima kasih atas konfirmasi dan doa Anda!");
        }
    });

    function saveMessage(msg) {
        let messages = JSON.parse(localStorage.getItem('wedding_rsvp_messages')) || [];
        messages.unshift(msg);
        localStorage.setItem('wedding_rsvp_messages', JSON.stringify(messages));
    }

    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('wedding_rsvp_messages')) || [];
        messagesList.innerHTML = '';
        if(messages.length === 0) {
            messagesList.innerHTML = '<p style="font-size: 0.8rem; color: #888;">Belum ada ucapan.</p>';
            return;
        }
        messages.forEach(msg => addMessageToDOM(msg));
    }

    function addMessageToDOM(msg) {
        const item = document.createElement('div');
        item.className = 'msg-item';
        item.innerHTML = `
            <strong>${escapeHTML(msg.name)}</strong> 
            <span style="color: ${msg.status === 'Hadir' ? 'green' : 'red'};">(${escapeHTML(msg.status)})</span>
            <span>- ${escapeHTML(msg.date)}</span>
            <p style="margin-top: 4px; color: #444;">${escapeHTML(msg.message)}</p>
        `;
        messagesList.prepend(item);
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }
});

function toggleMusic() {
    const bgMusic = document.getElementById('bg-music');
    const musicIcon = document.getElementById('music-icon');

    if (bgMusic.paused) {
        bgMusic.play();
        musicIcon.className = "fa-solid fa-music";
    } else {
        bgMusic.pause();
        musicIcon.className = "fa-solid fa-volume-xmark";
    }
}

function copyBankNumber(accountNumber) {
    navigator.clipboard.writeText(accountNumber).then(() => {
        alert("Nomor rekening " + accountNumber + " berhasil disalin!");
    }).catch(err => {
        console.error("Gagal menyalin: ", err);
    });
}