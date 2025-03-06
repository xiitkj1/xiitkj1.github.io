// Menambahkan event untuk drag scrolling
document.querySelectorAll('.scroll-container, .right-section').forEach((container) => {
    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.classList.add('active');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
        isDown = false;
        container.classList.remove('active');
    });

    container.addEventListener('mouseup', () => {
        isDown = false;
        container.classList.remove('active');
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2; // Kecepatan scroll
        container.scrollLeft = scrollLeft - walk;
    });
});

// Toggle Mode Gelap/Terang
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const icon = themeToggle.querySelector("span");

// Cek tema yang disimpan sebelumnya
if (localStorage.getItem("theme") === "light") {
    body.classList.add("light-mode");
    icon.textContent = "☀️"; // Ikon matahari untuk mode terang
}

// Fungsi untuk mengganti tema
themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-mode");

    if (body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
        icon.textContent = "☀️"; // Mode terang
    } else {
        localStorage.setItem("theme", "dark");
        icon.textContent = "🌙"; // Mode gelap
    }
});

// ** Toggle Menu Ukuran (☰) **
const sizeMenuIcon = document.getElementById("size-menu-icon");
const sizeOptions = document.getElementById("size-options");

sizeMenuIcon.addEventListener("click", () => {
    sizeOptions.classList.toggle("show");
});

// Sembunyikan menu jika klik di luar
document.addEventListener("click", (event) => {
    if (!sizeMenuIcon.contains(event.target) && !sizeOptions.contains(event.target)) {
        sizeOptions.classList.remove("show");
    }
});

// ** Mengubah Ukuran Card **
document.addEventListener("DOMContentLoaded", function () {
    const sizeButtons = document.querySelectorAll(".size-btn");
    const allCardContainers = document.querySelectorAll(".cards");

    sizeButtons.forEach(button => {
        button.addEventListener("click", function () {
            // Hapus class active dari semua tombol
            sizeButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            // Ambil ukuran yang dipilih
            let size = this.getAttribute("data-size");

            // Update semua card container
            allCardContainers.forEach(container => {
                container.classList.remove("small", "medium", "large");
                container.classList.add(size);
            });

            // Sembunyikan menu setelah memilih ukuran
            sizeOptions.classList.remove("show");
        });
    });
    document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggleLayout");
    const cardsContainer = document.querySelector(".cards");

    // Cek preferensi yang tersimpan
    if (localStorage.getItem("layout") === "list") {
        cardsContainer.classList.add("list-view");
    }

    toggleButton.addEventListener("click", function () {
        cardsContainer.classList.toggle("list-view");

        // Simpan preferensi
        if (cardsContainer.classList.contains("list-view")) {
            localStorage.setItem("layout", "list");
        } else {
            localStorage.setItem("layout", "grid");
        }
    });
});

});

document.querySelectorAll(".scroll-container").forEach((container) => {
    let isDown = false;
    let startX;
    let scrollLeft;

    // Event untuk Mobile (Touch)
    container.addEventListener("touchstart", (e) => {
        isDown = true;
        startX = e.touches[0].pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener("touchmove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - container.offsetLeft;
        const walk = (x - startX) * 2; // Sensitivitas swipe
        container.scrollLeft = scrollLeft - walk;
    });

    container.addEventListener("touchend", () => {
        isDown = false;
    });

    // Event untuk Desktop (Mouse)
    container.addEventListener("mousedown", (e) => {
        isDown = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        container.style.cursor = "grabbing";
    });

    container.addEventListener("mouseleave", () => {
        isDown = false;
        container.style.cursor = "grab";
    });

    container.addEventListener("mouseup", () => {
        isDown = false;
        container.style.cursor = "grab";
    });

    container.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const playlist = document.getElementById("playlist");
    let draggedItem = null;
    
    // Fungsi untuk menyimpan playlist ke localStorage
    function savePlaylist() {
        const items = [...playlist.querySelectorAll(".playlist-item")].map(item => item.innerText);
        localStorage.setItem("savedPlaylist", JSON.stringify(items));
    }

    // Fungsi untuk memuat playlist dari localStorage
    function loadPlaylist() {
        const savedItems = JSON.parse(localStorage.getItem("savedPlaylist"));
        if (savedItems) {
            playlist.innerHTML = ""; // Hapus list lama
            savedItems.forEach(text => {
                const li = document.createElement("li");
                li.classList.add("playlist-item");
                li.setAttribute("draggable", "true");
                li.innerText = text;
                addDragEvents(li);
                playlist.appendChild(li);
            });
        }
    }

    function addDragEvents(item) {
        item.addEventListener("dragstart", (e) => {
            draggedItem = item;
            item.classList.add("dragging");
            playSound("start");
        });

        item.addEventListener("dragend", () => {
            draggedItem.classList.remove("dragging");
            draggedItem = null;
            savePlaylist(); // Simpan urutan playlist
            playSound("drop");
        });
    }

    playlist.addEventListener("dragover", (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(playlist, e.clientY);
        if (draggedItem && afterElement == null) {
            playlist.appendChild(draggedItem);
        } else {
            playlist.insertBefore(draggedItem, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll(".playlist-item:not(.dragging)")];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Fungsi untuk efek suara saat drag & drop
    function playSound(action) {
        const audio = new Audio(action === "start" ? "drag-start.mp3" : "drop.mp3");
        audio.play();
    }

    // Tambahkan event ke semua item playlist
    document.querySelectorAll(".playlist-item").forEach(addDragEvents);

    // Load playlist saat halaman dimuat
    loadPlaylist();
});

// Simpan pemutaran lagu ke Local Storage
function playMusic(songId, songTitle, songImage) {
    let history = JSON.parse(localStorage.getItem("musicHistory")) || {};

    // Jika lagu sudah ada, tambahkan jumlah pemutaran
    if (history[songId]) {
        history[songId].count += 1;
    } else {
        // Jika belum ada, tambahkan lagu ke local storage
        history[songId] = {
            title: songTitle,
            image: songImage,
            count: 1
        };
    }

    // Simpan kembali ke local storage
    localStorage.setItem("musicHistory", JSON.stringify(history));

    // Perbarui tampilan playlist
    updatePlaylist();
}

// Ambil lagu yang paling sering diputar dan tampilkan di playlist
function updatePlaylist() {
    let history = JSON.parse(localStorage.getItem("musicHistory")) || {};
    let sortedSongs = Object.entries(history).sort((a, b) => b[1].count - a[1].count); // Urutkan berdasarkan jumlah pemutaran
    let playlistContainer = document.getElementById("playlist");

    // Kosongkan playlist sebelum memperbarui
    playlistContainer.innerHTML = "";

    sortedSongs.forEach(([songId, song]) => {
        let songCard = document.createElement("div");
        songCard.classList.add("card");
        songCard.innerHTML = `
            <img src="${song.image}" alt="${song.title}">
            <p><strong>${song.title}</strong></p>
            <button onclick="removeFromPlaylist('${songId}')">❌ Hapus</button>
        `;
        playlistContainer.appendChild(songCard);
    });
}

// Hapus lagu dari playlist
function removeFromPlaylist(songId) {
    let history = JSON.parse(localStorage.getItem("musicHistory"));
    delete history[songId];

    localStorage.setItem("musicHistory", JSON.stringify(history));

    // Perbarui tampilan playlist
    updatePlaylist();
}

// Panggil fungsi update saat halaman dimuat
document.addEventListener("DOMContentLoaded", updatePlaylist);

