// ==========================================
// 1. FITUR BUKA-TUTUP FOTO ANGGOTA TIM (BERANDA)
// ==========================================
const semuaKader = document.querySelectorAll('.kader');

if (semuaKader.length > 0) {
    semuaKader.forEach(kader => {
        kader.addEventListener('click', function() {
            const lagiKebuka = this.classList.contains('aktif');
            semuaKader.forEach(k => k.classList.remove('aktif'));
            if (!lagiKebuka) {
                this.classList.add('aktif');
            }
        });
    });
}

// ==========================================
// 2. GALERI OTOMATIS (50 FOTO & 25 VIDEO) + LIGHTBOX ZOOM
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const galeriContainer = document.getElementById('galeri-list');
    
    if (galeriContainer) {
        // Generate 50 Kotak Foto Otomatis
        for (let i = 1; i <= 50; i++) {
            const elemenFoto = document.createElement('div');
            elemenFoto.classList.add('galeri-item');
            elemenFoto.innerHTML = `
                <img src="Galery/foto${i}.jpg" alt="Foto ${i}">
                <div class="overlay-teks">Foto ${i}</div>
            `;
            galeriContainer.appendChild(elemenFoto);
        }

        // Generate 25 Kotak Video Otomatis
        for (let i = 1; i <= 25; i++) {
            const elemenVideo = document.createElement('div');
            elemenVideo.classList.add('galeri-item');
            elemenVideo.innerHTML = `
                <video controls muted>
                    <source src="Galery/video${i}.mp4" type="video/mp4">
                </video>
                <div class="overlay-teks">Video ${i}</div>
            `;
            galeriContainer.appendChild(elemenVideo);
        }

        // --- MENGAKTIFKAN LIGHTBOX & ZOOM UNTUK ELEMEN OTOMATIS ---
        const modal = document.getElementById("imageModal");
        if (modal) {
            const modalImg = document.getElementById("imgModalContent");
            const closeBtn = document.querySelector(".close-lightbox");
            const galeriImages = galeriContainer.querySelectorAll('.galeri-item img');

            // Klik gambar di grid -> Buka modal ukuran penuh
            galeriImages.forEach(img => {
                img.addEventListener('click', function() {
                    modal.style.display = "block";
                    modalImg.src = this.src;
                    modalImg.classList.remove('zoomed'); // Reset zoom pas pertama buka
                });
            });

            // Klik gambar di dalam modal -> Zoom-in / Zoom-out
            if (modalImg) {
                modalImg.addEventListener('click', function() {
                    this.classList.toggle('zoomed');
                });
            }

            // Tombol close (X)
            if (closeBtn) {
                closeBtn.onclick = function() {
                    modal.style.display = "none";
                }
            }

            // Klik area gelap luar gambar buat tutup modal
            modal.onclick = function(event) {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            }
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    
    // ==========================================
    // 1. PLAYLIST MULTI-LAGU BACKGROUND MUSIC
    // ==========================================
    const playlist = [
        { title: "Ingatlah Hari Ini", src: "img/Ingatlah Hari Ini.mp3" },
        { title: "Kamu Ngga Sendirian", src: "img/Kamu Ngga Sendirian.mp3" },
        { title: "Kembali Pulang", src: "img/Kembali Pulang.mp3" },
        { title: "Sebuah Kisah Klasik", src: "img/Sebuah Kisah Klasik.mp3" },
        { title: "Teman Sejati", src: "img/Teman Sejati.mp3" }
    ];

    let currentTrackIndex = 0;
    const bgAudio = document.getElementById("bg-audio");
    const trackTitleEl = document.getElementById("track-title");
    const playPauseBtn = document.getElementById("play-pause-btn");
    const nextBtn = document.getElementById("next-btn");

    function loadTrack(index, startPlaying = false, startTime = 0) {
        if (!bgAudio) return;
        bgAudio.src = playlist[index].src;
        if (trackTitleEl) trackTitleEl.innerText = playlist[index].title;
        bgAudio.load();

        bgAudio.onloadedmetadata = function() {
            if (startTime > 0) bgAudio.currentTime = startTime;
            if (startPlaying) playAudio();
        };
    }

    function playAudio() {
        if (!bgAudio) return;
        bgAudio.play().then(() => {
            if (playPauseBtn) playPauseBtn.innerHTML = "⏸";
            sessionStorage.setItem('music_playing', 'true');
        }).catch(() => {});
    }

    function pauseAudio() {
        if (!bgAudio) return;
        bgAudio.pause();
        if (playPauseBtn) playPauseBtn.innerHTML = "▶";
        sessionStorage.setItem('music_playing', 'false');
    }

    if (bgAudio) {
        bgAudio.volume = 0.4;
        let savedTrack = sessionStorage.getItem('music_track');
        let savedTime = sessionStorage.getItem('music_time');
        let savedPlaying = sessionStorage.getItem('music_playing');

        if (savedTrack !== null) currentTrackIndex = parseInt(savedTrack);
        let initialTime = savedTime ? parseFloat(savedTime) : 0;
        let shouldPlay = savedPlaying === 'true';

        loadTrack(currentTrackIndex, shouldPlay, initialTime);

        let hasInteracted = shouldPlay;
        function triggerAutoPlay() {
            if (!hasInteracted) {
                playAudio();
                hasInteracted = true;
                document.removeEventListener('click', triggerAutoPlay);
                document.removeEventListener('scroll', triggerAutoPlay);
            }
        }
        if (!shouldPlay) {
            document.addEventListener('click', triggerAutoPlay);
            document.addEventListener('scroll', triggerAutoPlay);
        }

        setInterval(() => {
            if (bgAudio && !bgAudio.paused) {
                sessionStorage.setItem('music_track', currentTrackIndex);
                sessionStorage.setItem('music_time', bgAudio.currentTime);
            }
        }, 1000);

        window.addEventListener('beforeunload', function() {
            if (bgAudio) {
                sessionStorage.setItem('music_track', currentTrackIndex);
                sessionStorage.setItem('music_time', bgAudio.currentTime);
                sessionStorage.setItem('music_playing', !bgAudio.paused);
            }
        });

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (bgAudio.paused) playAudio();
                else pauseAudio();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
                sessionStorage.setItem('music_track', currentTrackIndex);
                sessionStorage.setItem('music_time', 0);
                loadTrack(currentTrackIndex, true, 0);
            });
        }

        bgAudio.addEventListener('ended', function() {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            sessionStorage.setItem('music_track', currentTrackIndex);
            sessionStorage.setItem('music_time', 0);
            loadTrack(currentTrackIndex, true, 0);
        });
    }

    // ==========================================
    // 2. SISTEM POPUP MUNCUL SEKALI SAJA (TIDAK LOOPING)
    // ==========================================
    const modals = document.querySelectorAll('.memory-modal-overlay');
    
    modals.forEach((modal, index) => {
        const modalId = modal.id || `modal_${index}`;
        const storageKey = `seen_${modalId}`;

        if (!sessionStorage.getItem(storageKey)) {
            setTimeout(() => {
                modal.style.display = "flex";
            }, 200 * (index + 1));

            sessionStorage.setItem(storageKey, "true");
        }

        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    });
});