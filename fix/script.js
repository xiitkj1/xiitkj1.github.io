let reminderEnabled = true;
let humorEnabled = true;
let themeEnabled = true;

document.addEventListener("DOMContentLoaded", () => {
    loadChatHistory();
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
    document.getElementById("toggleThemeBtn").addEventListener("click", toggleTheme);
    
    // Event listener untuk ikon-ikon baru
    document.getElementById("reminder-icon").addEventListener("click", handleReminder);
    document.getElementById("humor-icon").addEventListener("click", handleHumor);
    document.getElementById("microphone-icon").addEventListener("click", startVoiceRecognition);
    document.getElementById("toggleThemeBtn").addEventListener("dblclick", disableTheme);
    
    // Tambahkan listener double click untuk menonaktifkan fitur
    document.getElementById("reminder-icon").addEventListener("dblclick", disableReminder);
    document.getElementById("humor-icon").addEventListener("dblclick", disableHumor);
    document.getElementById("popup-cancel").addEventListener("click", closePopup);
    document.getElementById("popup-confirm").addEventListener("click", confirmPopup);
});

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function sendMessage() {
    let input = document.getElementById("userInput");
    let messages = document.getElementById("messages");
    let userText = input.value.trim();
    
    if (userText !== "kontol") {
        if (isInappropriate(userText)) {
            alert("Pesan mengandung kata-kata yang tidak diperbolehkan.");
            input.value = "";
            return;
        }

        let userMessage = createChatBubble(userText, "user-message");
        messages.appendChild(userMessage);

        let responseText = generateResponse(userText);
        let aiMessage = createChatBubble("", "ai-message");
        messages.appendChild(aiMessage);
        
        simulateTyping(aiMessage, responseText, () => {
            speakText(responseText);
        });

        saveChatHistory(userText, responseText);
        input.value = "";
        messages.scrollTop = messages.scrollHeight;
    }
}

function createChatBubble(text, className) {
    let bubble = document.createElement("div");
    bubble.classList.add("chat-bubble", className);
    bubble.textContent = text;
    return bubble;
}

function generateResponse(input) {
    let responses = {
        "hello": "Hey! How's it going? What's on your mind today?",
        "hi": "Hello! How can I help you today? Any cool plans for today?",
        "hey": "Yo! What's up? Got something fun you want to chat about?",
        "good morning": "Good morning! Hope you have a wonderful day ahead. What’s on the agenda for today?",
        "good afternoon": "Good afternoon! How can I assist you today? Anything exciting going on?",
        "good evening": "Good evening! Hope your day went well. How are you feeling?",
        "good night": "Good night! Sleep well and have sweet dreams! Got any fun plans for tomorrow?",
        "how are you": "I'm doing great! Thanks for asking. How about you? What's been keeping you busy?",
        "how are you doing": "I'm doing just fine, thank you! What about you? What's new with you?",
        "what's up": "Not much! How's everything with you? Got any interesting topics to chat about?",
        "what is your name": "I'm your friendly AI assistant! But you can call me whatever you like. What about you, what's your name?",
        "what can you do": "I can chat, answer questions, help you with math, or even give suggestions. What do you need help with?",
        "thank you": "You're welcome! Always happy to help. Let me know if you need anything else.",
        "thanks": "No problem! Glad I could help. Anything else you'd like to talk about?",
        "goodbye": "Catch you later! Have a great day! Take care and talk to you soon.",
        "bye": "Goodbye! See you next time! Hope you have an awesome day ahead.",
        "see you": "Take care! Until next time! Don’t be a stranger.",
        "how old are you": "I don't age, but I'm always here to assist you! How old are you? If you don't mind me asking.",
        "where are you from": "I live in the cloud, always available wherever you are. What about you, where are you from?",
        "what's your favorite color": "I don't have a favorite color, but I think blue is quite nice! What’s your favorite color?",
        "do you like music": "I don't have ears, but I imagine music would be fun! What kind of music do you like?",
        "what's the weather like": "I can't check the weather, but it’s always a good time to chat! Do you prefer sunny days or rainy ones?",
        "apa kabar": "Saya baik-baik saja, terima kasih! Bagaimana dengan Anda? Ada yang menarik yang ingin dibicarakan?",
        "hai": "Hai! Ada yang bisa saya bantu? Apa yang lagi ada di pikiran kamu?",
        "selamat pagi": "Selamat pagi! Semoga hari Anda menyenankan. Ada rencana seru hari ini?",
        "selamat sore": "Selamat sore! Ada yang bisa saya bantu? Hari Anda berjalan lancar?",
        "selamat malam": "Selamat malam! Semoga tidur Anda nyenyak. Apa yang akan Anda lakukan besok?",
        "siapa nama kamu": "Saya adalah asisten AI Anda yang siap membantu. Tapi kamu bisa panggil saya apa aja. Nama kamu siapa?",
        "apa yang bisa kamu lakukan": "Saya bisa berbincang, menjawab pertanyaan, dan membantu Anda dalam banyak hal. Ada yang bisa saya bantu?",
        "terima kasih": "Sama-sama! Senang bisa membantu. Ada yang lain yang bisa saya bantu?",
        "makasih": "Sama-sama! Senang bisa membantu. Jangan ragu untuk tanya lagi, ya.",
        "apa kabar kamu": "Saya baik-baik saja, terima kasih. Bagaimana dengan Anda? Apa yang membuat hari ini spesial?",
        "apa warna favoritmu": "Saya tidak memiliki warna favorit, tapi saya suka warna biru! Kalau kamu, warna favorit kamu apa?",
        "apakah kamu suka musik": "Saya tidak punya telinga, tapi saya rasa musik pasti menyenangkan! Genre musik apa yang kamu suka?",
        "lagi apa": "Saya sedang ngobrol sama kamu! Lagi sibuk apa nih? Ada topik seru buat dibahas?",
        "apa yang sedang kamu lakukan": "Saat ini saya lagi standby untuk membantu kamu. Lagi ada yang bikin penasaran?",
        "apa kabar bro": "Saya baik-baik aja, bro! Lo gimana? Lagi ngapain nih?",
        "hei bro, gimana kabarnya": "Gue baik-baik aja, bro! Lo gimana? Ada yang seru buat diobrolin?",
        "what's your favorite movie": "I don't have a favorite movie, but I think 'Inception' is an interesting one. What about you, what’s your favorite movie?",
        "do you play games": "I don't play games, but I can totally chat about them! Do you have a favorite game?",
        "router a": "router A. 1. Address eth 2, 2.DHCP CLIENT, FIREWALL, OSPF, WEB PROXY, FIREWALL",
"router b": "router B. 1. Address eth 2, 2.DHCP CLIENT, ROUTES, FIREWALL, OSPF, DHCP SERVER, WIRELESS,",
    };
    

    let jokeCount = 0; // Variabel untuk melacak jumlah candaan yang telah diberikan
    let askingForJoke = false; // Variabel untuk melacak apakah pengguna meminta candaan
    
    // Mengecek apakah input mengandung kata yang meminta candaan
    if (input.toLowerCase().includes("joke") || input.toLowerCase().includes("lucu")) {
        askingForJoke = true; // Menandakan bahwa pengguna ingin candaan
        const jokes = [
"Kenapa ilmuwan nggak bisa percaya sama atom? Karena mereka bikin segalanya!",
"Kenapa komputer pergi ke dokter? Karena terkena virus!",
"Kenapa tengkorak nggak pernah berantem? Karena mereka nggak punya hati!",
"Saya bilang sama istri saya kalau alisnya digambar terlalu tinggi. Dia kelihatan kaget!",
"Kenapa nggak bisa percaya sama tangga? Karena mereka selalu punya niat jahat!",
"Apa yang dikatakan laut ke pantai? Nggak ada, cuma melambaikan tangan!",
"Kenapa buku matematika sedih? Karena punya terlalu banyak masalah!",
"Saya tanya sama pustakawan apakah ada buku tentang paranoia. Dia jawab pelan, 'Mereka ada di belakang kamu...'",
"Apa yang kamu sebut spageti palsu? Impasta!",
"Kenapa kucing nggak suka naik pesawat? Karena mereka takut ketinggian!",
"Kenapa programmer selalu bingung di restoran? Karena mereka nggak bisa menemukan bug di menu!",
"Kenapa jarum suntik takut sama meja? Karena selalu ada jarum yang mengintip!",
"Apa yang dikatakan satu tomat kepada tomat lainnya? Jangan terlalu merah, nanti kamu jadi saus!",
"Kenapa pisang nggak pernah sendirian? Karena selalu berdua dengan kulitnya!",
"Kenapa kalender nggak pernah punya teman? Karena dia selalu dihitung mundur!",
"Saya tanya sama teman saya, kenapa dia nggak bawa ponsel ke pesta? Dia jawab, 'Ponsel saya kan punya sinyal jelek, nggak bakal nyambung.'",
"Kenapa burung nggak suka olahraga? Karena mereka nggak mau ikut lomba terbang!",
"Kenapa sapu nggak pernah ikut rapat? Karena dia selalu tersapu begitu saja!",
"Kenapa komputer nggak bisa tidur? Karena dia nggak bisa menekan tombol 'sleep'!",
"Kenapa orang suka naik roller coaster? Karena mereka nggak bisa menahan rasa deg-degan!",
"Kenapa ikan nggak suka olahraga? Karena mereka takut nyemplung!",
"Apa yang dilakukan mesin cuci setelah berkerja? Dia istirahat, karena dia sudah cukup diputar-putar!",
"Kenapa pintu nggak pernah bisa jadi artis? Karena dia terlalu banyak disekrup!",
"Kenapa nasi selalu jadi makanan favorit? Karena dia selalu ada di setiap 'menu' hidup!",
"Kenapa jam nggak pernah punya masalah? Karena dia selalu 'on time'!",
"Kenapa sepeda nggak bisa berdiri sendiri? Karena dia terlalu 'terguling'!",
"Kenapa kamu nggak boleh main petak umpet dengan komputer? Karena mereka selalu tahu di mana kamu berada!",
"Kenapa panda nggak mau bergabung dengan band? Karena mereka lebih suka hidup 'sendirian'!",
"Kenapa jangan pernah tanya di mana tempat parkir? Karena mereka nggak pernah ada yang kosong!",
"Kenapa semua orang harus pergi ke luar negeri? Karena kadang kamu harus 'berpindah' untuk menemukan jawaban!",
"Kenapa matematika nggak pernah bisa santai? Karena selalu ada masalah yang harus diselesaikan!",
"Kenapa kucing suka ngintip dari jendela? Karena dia ingin melihat dunia 'dari sudut pandang'!",
"Kenapa lampu nggak suka ikut lomba? Karena dia nggak bisa 'bersinar' di luar jalur!",
"Kenapa gajah nggak suka main kartu? Karena dia selalu membawa 'trump'!",
"Kenapa lampu lalu lintas nggak bisa berbohong? Karena mereka selalu 'terang benderang'!",
"Kenapa komputer nggak pernah kedinginan? Karena mereka selalu ada 'data'!",
"Kenapa telepon pintar selalu merasa pintar? Karena mereka selalu 'terhubung' dengan dunia!",
"Kenapa pohon selalu merasa sabar? Karena mereka tahu, ‘buah yang baik akan datang pada waktu yang tepat’!",
"Kenapa cewek nggak bisa tidur di rumah hantu? Karena mereka takut ‘ngomong’ sama hantu!",
"Kenapa bintang-bintang nggak pernah capek? Karena mereka selalu ‘bersinar’ tanpa henti!",
"Kenapa dokter gigi nggak bisa jadi penyanyi? Karena mereka nggak pernah punya suara yang ‘jernih’!",
"Kenapa buku selalu merasa penting? Karena mereka selalu punya ‘halaman’ untuk dibaca!",
"Kenapa orang yang suka olahraga jarang stres? Karena mereka selalu bisa ‘berlari’ dari masalah!",
"Kenapa penjahat nggak bisa pakai jam? Karena mereka selalu ‘kehabisan waktu’!",
"Kenapa jendela suka ‘kotor’? Karena mereka selalu ‘terpapar’ masalah!",
"Kenapa bola basket selalu merasa senang? Karena mereka selalu ‘dilemparkan’ ke atas!",
"Kenapa ular nggak pernah memakai sepatu? Karena mereka ‘nggak punya kaki’!",
"Kenapa para pemain sepak bola jarang stress? Karena mereka selalu ‘menendang’ masalah!",
"Kenapa rumah kosong merasa sepi? Karena mereka nggak ada yang ‘ngajak ngobrol’!",
"Kenapa ponsel nggak suka berbicara? Karena mereka hanya punya ‘nomor’ untuk dihubungi!",
"Kenapa ikan nggak suka bersembunyi? Karena mereka lebih memilih ‘menjadi diri sendiri’!",
"Kenapa cicak selalu di dinding? Karena mereka nggak pernah ‘terjatuh’!",
"Kenapa kue nggak pernah ngeluh? Karena mereka selalu ‘dijaga’ supaya tetap enak!",
"Kenapa penulis selalu punya ide segar? Karena mereka bisa ‘menulis’ apapun yang ada di kepala mereka!",
"Kenapa detektif nggak suka makan di restoran? Karena mereka selalu ‘mencari bukti’ di meja!",
"Kenapa sepeda nggak suka berhenti? Karena mereka selalu ‘melaju’ ke depan!",
"Kenapa waktu cepat berlalu? Karena dia selalu ‘berlari’ tanpa henti!",
"Kenapa toko sepatu sering ramai? Karena semua orang ‘ingin melangkah’!",
"Kenapa roti nggak pernah kesepian? Karena selalu ‘dipenuhi’ dengan selai!",
"Kenapa komputer selalu merasa canggih? Karena mereka punya ‘prosesor’ yang hebat!",
"Kenapa bintang selalu bersinar terang? Karena mereka nggak pernah ‘kehabisan cahaya’!",
"Kenapa pohon nggak bisa nyanyi? Karena mereka selalu ‘terdiam’ dalam keheningan!",
"Kenapa kuda nggak pernah ngerasa malas? Karena mereka selalu ‘berlari’ menuju tujuan!",
"Kenapa matahari selalu terbit? Karena dia nggak pernah mau ‘terlambat’!",
"Kenapa pensil nggak bisa bicara? Karena mereka selalu ‘digores’ untuk menulis!",
"Kenapa komputer suka ngeluh? Karena mereka selalu ‘menghadapi bug’!",
"Kenapa orang suka duduk di pantai? Karena mereka ingin ‘merasa dekat’ dengan ombak!",
"Kenapa ayam suka berkokok? Karena mereka nggak bisa ‘diam’ terlalu lama!",
"Kenapa bulan nggak suka datang siang? Karena dia lebih suka ‘bercahaya’ di malam hari!",
"Kenapa telepon selalu sibuk? Karena mereka nggak pernah ‘berhenti berbicara’!",
"Kenapa kucing suka tidur sepanjang hari? Karena mereka ingin ‘mengisi ulang’ tenaga mereka!",
"Kenapa komputer nggak pernah lapar? Karena mereka selalu punya ‘cache’!",
"Kenapa kapal suka berlayar? Karena mereka ‘terbuai’ dengan ombak!",
"Kenapa jerapah selalu santai? Karena mereka selalu ‘melihat segala sesuatunya dari atas’!",
"Kenapa dokter suka tertawa? Karena mereka selalu ‘menemukan solusi’ untuk masalah!",
"Kenapa ikan nggak pernah merasa bosan? Karena mereka selalu ‘berenang’ ke tempat baru!",
"Kenapa gajah nggak pernah kehilangan barang? Karena mereka selalu punya ‘ingatan yang tajam’!",
"Kenapa komputer suka update? Karena mereka ingin ‘selalu siap’ dengan informasi baru!",
"Kenapa tukang kebun selalu bahagia? Karena mereka selalu ‘menyiram’ tanaman dengan cinta!",
"Kenapa bunga selalu terlihat cantik? Karena mereka ‘mekar’ dengan penuh warna!",
"Kenapa pelukis nggak pernah bosan? Karena mereka selalu ‘menggambar’ dunia dengan warna-warna baru!",
"Kenapa koki selalu tertawa? Karena mereka tahu bahwa ‘makanan yang enak’ membawa kebahagiaan!",
"Kenapa pohon tidak mau bicara? Karena mereka ‘diam’ sambil menyerap energi dari matahari!",
"Kenapa jam selalu tepat waktu? Karena mereka selalu ‘terjaga’ untuk menunjukkan waktu!",
"Kenapa burung suka bernyanyi? Karena mereka selalu ‘merasakan kebebasan’ di udara!",
"Kenapa kucing nggak suka makanan pedas? Karena mereka lebih suka ‘makanan yang lembut’!",
"Kenapa tas nggak bisa bicara? Karena mereka cuma bisa ‘membawa barang’!",
"Kenapa polisi selalu siap? Karena mereka selalu ‘berdiri tegak’ dalam menjaga ketertiban!",
"Kenapa mobil nggak bisa terbang? Karena mereka hanya bisa ‘berjalan di jalan’!",
"Kenapa restoran selalu ramai? Karena mereka punya ‘menu’ yang selalu memikat hati!",
"Kenapa pulpen nggak pernah kehabisan tinta? Karena mereka selalu siap untuk ‘menulis’ cerita baru!",
"Kenapa robot nggak bisa merasa lelah? Karena mereka selalu ‘berfungsi’ tanpa henti!",
"Kenapa gajah suka mandi di sungai? Karena mereka ingin ‘menyegarkan’ diri!",
"Kenapa kambing suka makan rumput? Karena mereka ingin ‘mengisi perut’!",
"Kenapa semangka selalu segar? Karena mereka selalu ‘terjaga’ dalam kelembapan!",
"Kenapa pintu nggak pernah ngeluh? Karena mereka selalu ‘membuka jalan’ untuk yang lain!",
"Kenapa bola voli selalu ‘terbang tinggi’? Karena mereka punya semangat untuk ‘mencapai puncak’!",
"Kenapa kopi nggak pernah kehabisan penggemar? Karena mereka selalu ‘membangkitkan semangat’!",
"Kenapa roket bisa terbang ke luar angkasa? Karena mereka punya ‘tenaga’ yang luar biasa!",
"Kenapa kendaraan selalu beroperasi? Karena mereka punya ‘mesin’ yang selalu siap berjalan!",
        ];
    
        // Pilih candaan secara acak
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    
        jokeCount++; // Tambah jumlah candaan
    
        return `${randomJoke}\nMau lagi?`;
    }
    
    // Menangani respons "iya" atau "ya" hanya jika sedang dalam konteks joke
    if ((input.toLowerCase() === "iya" || input.toLowerCase() === "ya") && askingForJoke) {
        const jokes = [
"Kenapa ilmuwan nggak bisa percaya sama atom? Karena mereka bikin segalanya!",
"Kenapa komputer pergi ke dokter? Karena terkena virus!",
"Kenapa tengkorak nggak pernah berantem? Karena mereka nggak punya hati!",
"Saya bilang sama istri saya kalau alisnya digambar terlalu tinggi. Dia kelihatan kaget!",
"Kenapa nggak bisa percaya sama tangga? Karena mereka selalu punya niat jahat!",
"Apa yang dikatakan laut ke pantai? Nggak ada, cuma melambaikan tangan!",
"Kenapa buku matematika sedih? Karena punya terlalu banyak masalah!",
"Saya tanya sama pustakawan apakah ada buku tentang paranoia. Dia jawab pelan, 'Mereka ada di belakang kamu...'",
"Apa yang kamu sebut spageti palsu? Impasta!",
"Kenapa kucing nggak suka naik pesawat? Karena mereka takut ketinggian!",
"Kenapa programmer selalu bingung di restoran? Karena mereka nggak bisa menemukan bug di menu!",
"Kenapa jarum suntik takut sama meja? Karena selalu ada jarum yang mengintip!",
"Apa yang dikatakan satu tomat kepada tomat lainnya? Jangan terlalu merah, nanti kamu jadi saus!",
"Kenapa pisang nggak pernah sendirian? Karena selalu berdua dengan kulitnya!",
"Kenapa kalender nggak pernah punya teman? Karena dia selalu dihitung mundur!",
"Saya tanya sama teman saya, kenapa dia nggak bawa ponsel ke pesta? Dia jawab, 'Ponsel saya kan punya sinyal jelek, nggak bakal nyambung.'",
"Kenapa burung nggak suka olahraga? Karena mereka nggak mau ikut lomba terbang!",
"Kenapa sapu nggak pernah ikut rapat? Karena dia selalu tersapu begitu saja!",
"Kenapa komputer nggak bisa tidur? Karena dia nggak bisa menekan tombol 'sleep'!",
"Kenapa orang suka naik roller coaster? Karena mereka nggak bisa menahan rasa deg-degan!",
"Kenapa ikan nggak suka olahraga? Karena mereka takut nyemplung!",
"Apa yang dilakukan mesin cuci setelah berkerja? Dia istirahat, karena dia sudah cukup diputar-putar!",
"Kenapa pintu nggak pernah bisa jadi artis? Karena dia terlalu banyak disekrup!",
"Kenapa nasi selalu jadi makanan favorit? Karena dia selalu ada di setiap 'menu' hidup!",
"Kenapa jam nggak pernah punya masalah? Karena dia selalu 'on time'!",
"Kenapa sepeda nggak bisa berdiri sendiri? Karena dia terlalu 'terguling'!",
"Kenapa kamu nggak boleh main petak umpet dengan komputer? Karena mereka selalu tahu di mana kamu berada!",
"Kenapa panda nggak mau bergabung dengan band? Karena mereka lebih suka hidup 'sendirian'!",
"Kenapa jangan pernah tanya di mana tempat parkir? Karena mereka nggak pernah ada yang kosong!",
"Kenapa semua orang harus pergi ke luar negeri? Karena kadang kamu harus 'berpindah' untuk menemukan jawaban!",
"Kenapa matematika nggak pernah bisa santai? Karena selalu ada masalah yang harus diselesaikan!",
"Kenapa kucing suka ngintip dari jendela? Karena dia ingin melihat dunia 'dari sudut pandang'!",
"Kenapa lampu nggak suka ikut lomba? Karena dia nggak bisa 'bersinar' di luar jalur!",
"Kenapa gajah nggak suka main kartu? Karena dia selalu membawa 'trump'!",
"Kenapa lampu lalu lintas nggak bisa berbohong? Karena mereka selalu 'terang benderang'!",
"Kenapa komputer nggak pernah kedinginan? Karena mereka selalu ada 'data'!",
"Kenapa telepon pintar selalu merasa pintar? Karena mereka selalu 'terhubung' dengan dunia!",
"Kenapa pohon selalu merasa sabar? Karena mereka tahu, ‘buah yang baik akan datang pada waktu yang tepat’!",
"Kenapa cewek nggak bisa tidur di rumah hantu? Karena mereka takut ‘ngomong’ sama hantu!",
"Kenapa bintang-bintang nggak pernah capek? Karena mereka selalu ‘bersinar’ tanpa henti!",
"Kenapa dokter gigi nggak bisa jadi penyanyi? Karena mereka nggak pernah punya suara yang ‘jernih’!",
"Kenapa buku selalu merasa penting? Karena mereka selalu punya ‘halaman’ untuk dibaca!",
"Kenapa orang yang suka olahraga jarang stres? Karena mereka selalu bisa ‘berlari’ dari masalah!",
"Kenapa penjahat nggak bisa pakai jam? Karena mereka selalu ‘kehabisan waktu’!",
"Kenapa jendela suka ‘kotor’? Karena mereka selalu ‘terpapar’ masalah!",
"Kenapa bola basket selalu merasa senang? Karena mereka selalu ‘dilemparkan’ ke atas!",
"Kenapa ular nggak pernah memakai sepatu? Karena mereka ‘nggak punya kaki’!",
"Kenapa para pemain sepak bola jarang stress? Karena mereka selalu ‘menendang’ masalah!",
"Kenapa rumah kosong merasa sepi? Karena mereka nggak ada yang ‘ngajak ngobrol’!",
"Kenapa ponsel nggak suka berbicara? Karena mereka hanya punya ‘nomor’ untuk dihubungi!",
"Kenapa ikan nggak suka bersembunyi? Karena mereka lebih memilih ‘menjadi diri sendiri’!",
"Kenapa cicak selalu di dinding? Karena mereka nggak pernah ‘terjatuh’!",
"Kenapa kue nggak pernah ngeluh? Karena mereka selalu ‘dijaga’ supaya tetap enak!",
"Kenapa penulis selalu punya ide segar? Karena mereka bisa ‘menulis’ apapun yang ada di kepala mereka!",
"Kenapa detektif nggak suka makan di restoran? Karena mereka selalu ‘mencari bukti’ di meja!",
"Kenapa sepeda nggak suka berhenti? Karena mereka selalu ‘melaju’ ke depan!",
"Kenapa waktu cepat berlalu? Karena dia selalu ‘berlari’ tanpa henti!",
"Kenapa toko sepatu sering ramai? Karena semua orang ‘ingin melangkah’!",
"Kenapa roti nggak pernah kesepian? Karena selalu ‘dipenuhi’ dengan selai!",
"Kenapa komputer selalu merasa canggih? Karena mereka punya ‘prosesor’ yang hebat!",
"Kenapa bintang selalu bersinar terang? Karena mereka nggak pernah ‘kehabisan cahaya’!",
"Kenapa pohon nggak bisa nyanyi? Karena mereka selalu ‘terdiam’ dalam keheningan!",
"Kenapa kuda nggak pernah ngerasa malas? Karena mereka selalu ‘berlari’ menuju tujuan!",
"Kenapa matahari selalu terbit? Karena dia nggak pernah mau ‘terlambat’!",
"Kenapa pensil nggak bisa bicara? Karena mereka selalu ‘digores’ untuk menulis!",
"Kenapa komputer suka ngeluh? Karena mereka selalu ‘menghadapi bug’!",
"Kenapa orang suka duduk di pantai? Karena mereka ingin ‘merasa dekat’ dengan ombak!",
"Kenapa ayam suka berkokok? Karena mereka nggak bisa ‘diam’ terlalu lama!",
"Kenapa bulan nggak suka datang siang? Karena dia lebih suka ‘bercahaya’ di malam hari!",
"Kenapa telepon selalu sibuk? Karena mereka nggak pernah ‘berhenti berbicara’!",
"Kenapa kucing suka tidur sepanjang hari? Karena mereka ingin ‘mengisi ulang’ tenaga mereka!",
"Kenapa komputer nggak pernah lapar? Karena mereka selalu punya ‘cache’!",
"Kenapa kapal suka berlayar? Karena mereka ‘terbuai’ dengan ombak!",
"Kenapa jerapah selalu santai? Karena mereka selalu ‘melihat segala sesuatunya dari atas’!",
"Kenapa dokter suka tertawa? Karena mereka selalu ‘menemukan solusi’ untuk masalah!",
"Kenapa ikan nggak pernah merasa bosan? Karena mereka selalu ‘berenang’ ke tempat baru!",
"Kenapa gajah nggak pernah kehilangan barang? Karena mereka selalu punya ‘ingatan yang tajam’!",
"Kenapa komputer suka update? Karena mereka ingin ‘selalu siap’ dengan informasi baru!",
"Kenapa tukang kebun selalu bahagia? Karena mereka selalu ‘menyiram’ tanaman dengan cinta!",
"Kenapa bunga selalu terlihat cantik? Karena mereka ‘mekar’ dengan penuh warna!",
"Kenapa pelukis nggak pernah bosan? Karena mereka selalu ‘menggambar’ dunia dengan warna-warna baru!",
"Kenapa koki selalu tertawa? Karena mereka tahu bahwa ‘makanan yang enak’ membawa kebahagiaan!",
"Kenapa pohon tidak mau bicara? Karena mereka ‘diam’ sambil menyerap energi dari matahari!",
"Kenapa jam selalu tepat waktu? Karena mereka selalu ‘terjaga’ untuk menunjukkan waktu!",
"Kenapa burung suka bernyanyi? Karena mereka selalu ‘merasakan kebebasan’ di udara!",
"Kenapa kucing nggak suka makanan pedas? Karena mereka lebih suka ‘makanan yang lembut’!",
"Kenapa tas nggak bisa bicara? Karena mereka cuma bisa ‘membawa barang’!",
"Kenapa polisi selalu siap? Karena mereka selalu ‘berdiri tegak’ dalam menjaga ketertiban!",
"Kenapa mobil nggak bisa terbang? Karena mereka hanya bisa ‘berjalan di jalan’!",
"Kenapa restoran selalu ramai? Karena mereka punya ‘menu’ yang selalu memikat hati!",
"Kenapa pulpen nggak pernah kehabisan tinta? Karena mereka selalu siap untuk ‘menulis’ cerita baru!",
"Kenapa robot nggak bisa merasa lelah? Karena mereka selalu ‘berfungsi’ tanpa henti!",
"Kenapa gajah suka mandi di sungai? Karena mereka ingin ‘menyegarkan’ diri!",
"Kenapa kambing suka makan rumput? Karena mereka ingin ‘mengisi perut’!",
"Kenapa semangka selalu segar? Karena mereka selalu ‘terjaga’ dalam kelembapan!",
"Kenapa pintu nggak pernah ngeluh? Karena mereka selalu ‘membuka jalan’ untuk yang lain!",
"Kenapa bola voli selalu ‘terbang tinggi’? Karena mereka punya semangat untuk ‘mencapai puncak’!",
"Kenapa kopi nggak pernah kehabisan penggemar? Karena mereka selalu ‘membangkitkan semangat’!",
"Kenapa roket bisa terbang ke luar angkasa? Karena mereka punya ‘tenaga’ yang luar biasa!",
"Kenapa kendaraan selalu beroperasi? Karena mereka punya ‘mesin’ yang selalu siap berjalan!",
        ];
    
        // Pilih candaan secara acak
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    
        return `${randomJoke}\nMau lagi?`;
    }
    
    // Jika pengguna mengetik "iya" atau "ya" tapi tidak dalam konteks joke, AI tidak memberikan candaan
    if (input.toLowerCase() === "iya" || input.toLowerCase() === "ya") {
        return "Tentu, ada hal lain yang bisa saya bantu?";
    }
    
    
    if (input.toLowerCase().includes("motivate")) {
        return "Believe in yourself! Every great journey starts with a single step.";
    }
    if (input.toLowerCase().includes("remind me")) {
        setTimeout(() => alert("Reminder: " + input.replace("remind me", "")), 5000);
        return "Okay! I'll remind you in a few seconds.";
    }

    // Pengetahuan Umum
    if (input.toLowerCase().includes("siapa presiden indonesia") || input.toLowerCase().includes("presiden indonesia")) {
        return "Presiden Indonesia saat ini adalah Joko Widodo, yang menjabat sejak 20 Oktober 2014.";
    }
    if (input.toLowerCase().includes("siapa penemu telepon") || input.toLowerCase().includes("penemu telepon")) {
        return "Penemu telepon adalah Alexander Graham Bell, yang mematenkannya pada tahun 1876.";
    }
    if (input.toLowerCase().includes("apa itu teknologi") || input.toLowerCase().includes("definisi teknologi")) {
        return "Teknologi adalah penerapan pengetahuan untuk menciptakan alat atau sistem yang berguna bagi kehidupan manusia.";
    }

    // Sejarah
    if (input.toLowerCase().includes("perang dunia kedua") || input.toLowerCase().includes("dunia kedua")) {
        return "Perang Dunia Kedua adalah perang besar yang berlangsung dari 1939 hingga 1945, yang melibatkan sebagian besar negara besar di dunia.";
    }
    if (input.toLowerCase().includes("pahlawan nasional indonesia") || input.toLowerCase().includes("siapa pahlawan nasional indonesia")) {
        return "Pahlawan Nasional Indonesia antara lain Soekarno, Hatta, dan Kartini. Mereka berperan besar dalam memperjuangkan kemerdekaan Indonesia.";
    }

    // Bahasa Indonesia
    if (input.toLowerCase().includes("apa itu bahasa indonesia") || input.toLowerCase().includes("definisi bahasa indonesia")) {
        return "Bahasa Indonesia adalah bahasa resmi negara Indonesia yang digunakan dalam pemerintahan, pendidikan, dan media komunikasi.";
    }
    if (input.toLowerCase().includes("kapan bahasa indonesia diresmikan") || input.toLowerCase().includes("tanggal bahasa indonesia diresmikan")) {
        return "Bahasa Indonesia diresmikan sebagai bahasa nasional pada 28 Oktober 1928, melalui Sumpah Pemuda.";
    }

    // Cek apakah input adalah ekspresi Fibonacci
    if (input.toLowerCase().includes("fibonacci")) {
        let n = parseInt(input.replace("fibonacci", "").trim());
        if (!isNaN(n)) {
            let fibSequence = fibonacci(n);
            return `Deret Fibonacci ke-${n} adalah: ${fibSequence}`;
        } else {
            return "Harap masukkan angka setelah 'fibonacci'. Contoh: fibonacci 10";
        }
    }

    // Cek apakah input adalah ekspresi Faktorial
    if (input.toLowerCase().includes("factorial")) {
        let n = parseInt(input.replace("factorial", "").trim());
        if (!isNaN(n)) {
            let result = factorial(n);
            return `Faktorial dari ${n} adalah: ${result}`;
        } else {
            return "Harap masukkan angka setelah 'factorial'. Contoh: factorial 5";
        }
    }

    // Cek apakah input adalah ekspresi matematika dasar (kalkulator)
    if (isMathExpression(input)) {
        let result = evaluateMathExpression(input);
        return `Hasil dari perhitungan "${input}" adalah ${result}.`;
    }

    return responses[input.toLowerCase()] || "Hmm, I don't understand that yet. Try asking something else!";
}

function isMathExpression(input) {
    // Mencari apakah input mengandung operator matematika
    return /[\d+\-*/^()]/.test(input);
}

function evaluateMathExpression(expression) {
    try {
        // Evaluasi ekspresi matematika (hati-hati dengan penggunaan eval dalam aplikasi nyata)
        return eval(expression);
    } catch (error) {
        return "Terjadi kesalahan dalam perhitungan.";
    }
}

// Fungsi untuk menghitung deret Fibonacci
function fibonacci(n) {
    let fib = [0, 1];
    for (let i = 2; i <= n; i++) {
        fib[i] = fib[i - 1] + fib[i - 2];
    }
    return fib.slice(0, n + 1).join(", ");
}

// Fungsi untuk menghitung faktorial
function factorial(n) {
    if (n < 0) {
        return "Faktorial tidak terdefinisi untuk angka negatif.";
    }
    let result = 1;
    for (let i = 1; i <= n; i++) {
        result *= i;
    }
    return result;
}

function simulateTyping(element, text, callback) {
    let index = 0;
    element.textContent = "";
    let interval = setInterval(() => {
        element.textContent += text[index];
        index++;
        if (index === text.length) {
            clearInterval(interval);
            if (callback) callback();
            element.parentElement.scrollTop = element.parentElement.scrollHeight;
        }
    }, 50);
}

function startVoiceRecognition() {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();
    
    recognition.onresult = function(event) {
        let transcript = event.results[0][0].transcript;
        document.getElementById("userInput").value = transcript;
        sendMessage();
    };
}

function speakText(text) {
    // Check for speech synthesis support
    if ('speechSynthesis' in window) {
        // Detect language using Intl API
        const language = new Intl.Locale(navigator.language).language; // Deteksi bahasa sistem atau bisa menggunakan library deteksi bahasa lainnya

        let speech = new SpeechSynthesisUtterance(text);
        speech.lang = language; // Menyesuaikan bahasa yang terdeteksi

        // Use available voices
        let voices = window.speechSynthesis.getVoices();
        speech.voice = voices.find(voice => voice.name.includes("Google")) || voices[0];
        speech.rate = 1.1;
        speech.pitch = 1.2;

        // Speak the text
        window.speechSynthesis.speak(speech);
    }
}


function saveChatHistory(userInput, aiResponse) {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.push({ user: userInput, ai: aiResponse });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

function loadChatHistory() {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    let messages = document.getElementById("messages");
    chatHistory.forEach(chat => {
        let userMessage = createChatBubble(chat.user, "user-message");
        messages.appendChild(userMessage);

        let aiMessage = createChatBubble(chat.ai, "ai-message");
        messages.appendChild(aiMessage);
    });
    messages.scrollTop = messages.scrollHeight;
}

function toggleTheme() {
    let body = document.body;
    body.classList.toggle("dark-mode");
    localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
}

function disableTheme() {
    alert("Mode Gelap/Terang dinonaktifkan.");
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

function confirmPopup() {
    let popupMessage = document.getElementById("popup-message").textContent;
    if (popupMessage.includes("pengingat")) {
        handleReminder();
    } else if (popupMessage.includes("humor")) {
        handleHumor();
    }
    closePopup();
}

function isInappropriate(text) {
    let bannedWords = ["badword1", "badword2", "18+content"];
    return bannedWords.some(word => text.toLowerCase().includes(word));
}

// Fitur Pengingat Sederhana (Ikon lonceng)
function handleReminder() {
    if (reminderEnabled) {
        document.getElementById("popup-message").textContent = "Apakah Anda ingin mengatur pengingat?";
        document.getElementById("popup").style.display = "block";
    }
}

// Fitur Humor & Motivasi (Ikon emoji)
function handleHumor() {
    if (humorEnabled) {
        document.getElementById("popup-message").textContent = "Apakah Anda ingin mendengar humor atau motivasi?";
        document.getElementById("popup").style.display = "block";
    }
}

function disableReminder() {
    reminderEnabled = !reminderEnabled;
    alert(`Pengingat ${reminderEnabled ? 'diaktifkan' : 'dinonaktifkan'}`);
}

function disableHumor() {
    humorEnabled = !humorEnabled;
    alert(`Humor & Motivasi ${humorEnabled ? 'diaktifkan' : 'dinonaktifkan'}`);
}





