// Data lokal untuk prediksi pencarian
const searchData = ["Pop", "Indie", "Ramadan", "Podcast", "K-Pop", "Jazz", "Rock", "Hip-Hop"];

// Event listener untuk input pencarian
document.getElementById("searchInput").addEventListener("input", function() {
    let input = this.value.toLowerCase();  // Ambil input dan ubah ke huruf kecil
    let suggestions = document.getElementById("suggestions");

    // Filter data berdasarkan input
    let filtered = searchData.filter(item => item.toLowerCase().includes(input));

    // Tampilkan hasil pencarian
    if (input === "" || filtered.length === 0) {
        suggestions.style.display = "none";  // Sembunyikan jika tidak ada hasil
        suggestions.innerHTML = "";
    } else {
        suggestions.style.display = "block";  // Tampilkan jika ada hasil
        suggestions.innerHTML = filtered.map(item => 
            `<li onclick="selectSuggestion('${item}')">${item}</li>`
        ).join("");  // Menampilkan hasil pencarian dalam daftar
    }
});

// Pilih hasil pencarian
function selectSuggestion(value) {
    document.getElementById("searchInput").value = value;  // Isi input dengan nilai yang dipilih
    document.getElementById("suggestions").style.display = "none";  // Sembunyikan saran setelah dipilih
}

// Fitur Rotate Gambar (tetap dipertahankan)
document.querySelectorAll(".rotated-img").forEach(img => {
    let randomRotation = Math.floor(Math.random() * 11) - 5;  // Antara -5° sampai 5°
    img.style.transform = `rotate(${randomRotation}deg)`;
});

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchInitial = document.getElementById("searchInitial");
    const suggestions = document.getElementById("suggestions");

    // Data rekomendasi pencarian
    const searchResults = [
        { name: "Taylor Swift", type: "Artis", image: "WhatsApp Image 2025-03-06 at 10.21.16.jpeg" },
        { name: "Tyla", type: "Artis", image: "tyla.jpg" },
        { name: "Tyler, The Creator", type: "Artis", image: "tyler.jpg" },
        { name: "taylor swift playlist (a really good playlist)", type: "Playlist", image: "playlist.jpg" },
        { name: "PUSH 2 START", type: "Lagu • Tyla", image: "push2start.jpg" },
        { name: "Water", type: "Lagu • Tyla", image: "water.jpg" },
        { name: "Typa Girl", type: "Lagu • BLACKPINK", image: "typagirl.jpg" }
    ];

    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase().trim();
        suggestions.innerHTML = ""; // Hapus hasil sebelumnya

        if (query !== "") {
            searchInitial.style.display = "none"; // Sembunyikan tampilan awal
            suggestions.style.display = "block"; // Tampilkan daftar pencarian
            
            // Filter hasil berdasarkan input pengguna
            const filteredResults = searchResults.filter(item => item.name.toLowerCase().includes(query));

            // Jika ada hasil, tampilkan di daftar saran
            if (filteredResults.length > 0) {
                filteredResults.forEach(item => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" class="search-img">
                        <div class="search-info">
                            <span class="search-name">${item.name}</span>
                            <span class="search-type">${item.type}</span>
                        </div>
                    `;
                    li.classList.add("search-item");
                    suggestions.appendChild(li);
                });
            } else {
                // Jika tidak ada hasil, tampilkan teks "Tidak ditemukan"
                suggestions.innerHTML = `<li class="no-result">Tidak ada hasil untuk "${query}"</li>`;
            }
        } else {
            searchInitial.style.display = "block"; // Tampilkan kembali tampilan awal
            suggestions.style.display = "none"; // Sembunyikan daftar pencarian
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const searchResultsList = document.getElementById("searchResults");
    const categoryGrid = document.querySelector(".category-grid");
    const playerScreen = document.getElementById("playerScreen");
    const songTitle = document.getElementById("songTitle");
    const songArtist = document.getElementById("songArtist");
    const songCover = document.getElementById("songCover");
    const audioPlayer = document.getElementById("audioPlayer");

    // Data hasil pencarian
    const searchResults = [
        { name: "You're On Your Own, Kid", artist: "Taylor Swift", image: "midnights.jpg", audio: "youre-on-your-own-kid.mp3" },
        { name: "Unforgettable", artist: "French Montana, Swae Lee", image: "jungle-rules.jpg", audio: "unforgettable.mp3" },
        { name: "Style", artist: "Taylor Swift", image: "1989.jpg", audio: "style.mp3" }
    ];

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        searchResultsList.innerHTML = "";

        if (query !== "") {
            categoryGrid.style.display = "none"; // Sembunyikan kategori awal

            const filteredResults = searchResults.filter(item =>
                item.name.toLowerCase().includes(query)
            );

            if (filteredResults.length > 0) {
                filteredResults.forEach(item => {
                    const li = document.createElement("li");
                    li.classList.add("search-item");
                    li.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" class="search-img">
                        <div class="search-info">
                            <span class="search-name">${item.name}</span>
                            <span class="search-artist">${item.artist}</span>
                        </div>
                    `;

                    // Klik untuk memutar lagu
                    li.addEventListener("click", function () {
                        playSong(item);
                    });

                    searchResultsList.appendChild(li);
                });
            } else {
                searchResultsList.innerHTML = `<li class="no-result">Tidak ada hasil untuk "${query}"</li>`;
            }

            searchResultsList.style.display = "block";
        } else {
            categoryGrid.style.display = "grid";
            searchResultsList.style.display = "none";
        }
    }

    function playSong(song) {
        // Tampilkan tampilan pemutar lagu
        playerScreen.style.display = "flex";
        searchResultsList.style.display = "none";

        // Update informasi lagu
        songTitle.textContent = song.name;
        songArtist.textContent = song.artist;
        songCover.src = song.image;
        audioPlayer.src = song.audio;

        // Mulai putar lagu
        audioPlayer.play();
    }

    searchInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            performSearch();
        }
    });

    searchButton.addEventListener("click", function () {
        performSearch();
    });
});

function playSong(song) {
    console.log("Lagu yang diklik:", song.title); // Debugging

    // Tampilkan halaman pemutar lagu
    document.getElementById("playerScreen").style.display = "block";
    
    // Perbarui informasi lagu
    document.getElementById("songTitle").innerText = song.title;
    document.getElementById("songArtist").innerText = song.artist;
    document.getElementById("songCover").src = song.cover;
    
    // Setel lagu di pemutar audio
    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.src = song.audioSrc;
    audioPlayer.play();
}
