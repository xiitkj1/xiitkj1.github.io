document.addEventListener('DOMContentLoaded', () => {
    const surahList = document.getElementById('surahList');
    const ayatList = document.getElementById('ayatList');
    const surahTitle = document.getElementById('surahTitle');
    const searchInput = document.getElementById('search');

    const surahs = [
        { number: 1, name: "Al-Fatihah" },
        { number: 2, name: "Al-Baqarah" },
        { number: 3, name: "Ali 'Imran" },
        // Tambahkan daftar surah lainnya
    ];

    // Render daftar surah
    surahs.forEach(surah => {
        const li = document.createElement('li');
        li.textContent = `${surah.number}. ${surah.name}`;
        li.addEventListener('click', () => loadSurah(surah));
        surahList.appendChild(li);
    });

    // Fungsi untuk memuat surah
    function loadSurah(surah) {
        surahTitle.textContent = surah.name;
        ayatList.innerHTML = '';
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}`)
            .then(response => response.json())
            .then(data => {
                data.data.ayahs.forEach(ayah => {
                    const p = document.createElement('p');
                    p.classList.add('fade-in');
                    p.textContent = `${ayah.numberInSurah}. ${ayah.text}`;
                    ayatList.appendChild(p);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Fitur pencarian surah
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredSurahs = surahs.filter(surah =>
            surah.name.toLowerCase().includes(query)
        );
        surahList.innerHTML = '';
        filteredSurahs.forEach(surah => {
            const li = document.createElement('li');
            li.textContent = `${surah.number}. ${surah.name}`;
            li.addEventListener('click', () => loadSurah(surah));
            surahList.appendChild(li);
        });
    });
});
