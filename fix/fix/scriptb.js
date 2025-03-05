let userMessages = []; // Menyimpan pesan pengguna
let aiMessages = []; // Menyimpan pesan AI

// Fungsi untuk mengirim pesan dari pengguna
function sendMessage() {
    const userInput = document.getElementById("userInput").value;
    if (userInput.trim() === "") return; // Menghindari input kosong

    // Tampilkan pesan pengguna
    addMessage(userInput, "user");

    // Reset input pengguna setelah pesan terkirim
    document.getElementById("userInput").value = "";

    // Kirim pesan AI setelah menunggu sedikit (simulasi typing)
    setTimeout(() => {
        if (userInput.toLowerCase() === "pantun") {
            sendPantun(); // Kirim pantun pertama
        } else if (userInput.toLowerCase() === "candaan") {
            sendCandaan(); // Kirim candaan
        } else if (userInput.toLowerCase() === "motivasi") {
            sendMotivasi(); // Kirim motivasi
        } else if (aiMessages.length > 0 && aiMessages[aiMessages.length - 1] === "Pantun pertama sudah selesai, ingin pantun lainnya?") {
            handlePantunResponse(userInput); // Menangani respons pantun lanjutan
        } else if (aiMessages.length > 0 && aiMessages[aiMessages.length - 1] === "Candaan pertama sudah selesai, ingin candaan lainnya?") {
            handleCandaanResponse(userInput); // Menangani respons candaan lanjutan
        } else if (aiMessages.length > 0 && aiMessages[aiMessages.length - 1] === "Motivasi pertama sudah selesai, ingin motivasi lainnya?") {
            handleMotivasiResponse(userInput); // Menangani respons motivasi lanjutan
        } else {
            generateResponse(userInput); // Kirim respons AI umum
        }
    }, 3000);
}

// Fungsi untuk menambahkan pesan ke chat
function addMessage(message, sender) {
    const messagesContainer = document.getElementById("messages");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-bubble");
    messageDiv.classList.add(sender === "user" ? "user-message" : "ai-message");
    messageDiv.textContent = message; // Tampilkan langsung pesan
    messagesContainer.appendChild(messageDiv);

    // Auto-scroll ke bawah agar pesan terbaru selalu terlihat
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Fungsi untuk mengirim pantun pertama
function sendPantun() {
    const pantun = getPantun();
    typeMessage(pantun, "ai"); // Ketikkan pesan pantun
    aiMessages.push(pantun); // Menyimpan pesan pantun

    // Kirim pertanyaan setelah pantun pertama
    setTimeout(() => {
        const question = "Pantun pertama sudah selesai, ingin pantun lainnya?";
        typeMessage(question, "ai"); // Ketikkan pertanyaan
        aiMessages.push(question);
    }, pantun.length * 50); // Sesuaikan dengan panjang pantun
}

// Fungsi untuk mengirim candaan pertama
function sendCandaan() {
    const candaan = getCandaan();
    typeMessage(candaan, "ai"); // Ketikkan pesan candaan
    aiMessages.push(candaan); // Menyimpan pesan candaan

    // Kirim pertanyaan setelah candaan pertama
    setTimeout(() => {
        const question = "Candaan pertama sudah selesai, ingin candaan lainnya?";
        typeMessage(question, "ai"); // Ketikkan pertanyaan
        aiMessages.push(question);
    }, candaan.length * 50); // Sesuaikan dengan panjang candaan
}

// Fungsi untuk mengirim motivasi pertama
function sendMotivasi() {
    const motivasi = getMotivasi();
    typeMessage(motivasi, "ai"); // Ketikkan pesan motivasi
    aiMessages.push(motivasi); // Menyimpan pesan motivasi

    // Kirim pertanyaan setelah motivasi pertama
    setTimeout(() => {
        const question = "Ingin motivasi lainnya?";
        typeMessage(question, "ai"); // Ketikkan pertanyaan
        aiMessages.push(question);
    }, motivasi.length * 50); // Sesuaikan dengan panjang motivasi
}

// Fungsi untuk menangani respons dari user terkait pantun
function handlePantunResponse(input) {
    input = input.toLowerCase().trim();

    if (input === "ya" || input === "iya") {
        sendPantun(); // Kirim pantun baru
    } else if (input === "tidak") {
        addMessage("Baiklah! Ada yang lain yang bisa saya bantu?", "ai");
        aiMessages.push("Baiklah! Ada yang lain yang bisa saya bantu?");
    } else {
        addMessage("Mohon ketik 'ya' untuk pantun lainnya atau 'tidak' untuk menghentikan.", "ai");
    }
}

// Fungsi untuk menangani respons dari user terkait candaan
function handleCandaanResponse(input) {
    input = input.toLowerCase().trim();

    if (input === "ya" || input === "iya") {
        sendCandaan(); // Kirim candaan baru
    } else if (input === "tidak") {
        addMessage("Baiklah! Ada yang lain yang bisa saya bantu?", "ai");
        aiMessages.push("Baiklah! Ada yang lain yang bisa saya bantu?");
    } else {
        addMessage("Mohon ketik 'ya' untuk candaan lainnya atau 'tidak' untuk menghentikan.", "ai");
    }
}

// Fungsi untuk menangani respons dari user terkait motivasi
function handleMotivasiResponse(input) {
    input = input.toLowerCase().trim();

    if (input === "ya" || input === "iya") {
        sendMotivasi(); // Kirim motivasi baru
    } else if (input === "tidak") {
        addMessage("Baiklah! Ada yang lain yang bisa saya bantu?", "ai");
        aiMessages.push("Baiklah! Ada yang lain yang bisa saya bantu?");
    } else {
        addMessage("Mohon ketik 'ya' untuk motivasi lainnya atau 'tidak' untuk menghentikan.", "ai");
    }
}

// Fungsi untuk menghasilkan pantun
function getPantun() {
    const pantunList = [
        "Burung terbang tinggi di awan, \nMelayang indah sangat memukau, \nJika hati tenang dan damai, \nSegala masalah pasti terlepas jauh.",
        "Bunga mawar merah berseri, \nTumbuh di taman yang sangat cantik, \nSeperti senyummu yang selalu memberi, \nKebahagiaan tiada habisnya, sangat manis."
    ];
    const randomIndex = Math.floor(Math.random() * pantunList.length);
    return pantunList[randomIndex];
}

// Fungsi untuk menghasilkan candaan
function getCandaan() {
    const candaanList = [
        "Kenapa komputer selalu sepi? Karena jarang ada yang 'klik'!",
        "Apa yang selalu mengikuti kamu tapi tidak pernah lelah? Bayanganmu!"
    ];
    const randomIndex = Math.floor(Math.random() * candaanList.length);
    return candaanList[randomIndex];
}

// Fungsi untuk menghasilkan motivasi
function getMotivasi() {
    const motivasiList = [
        "Jangan pernah menyerah, karena kegagalan adalah bagian dari kesuksesan.",
        "Setiap langkah kecil yang kamu ambil membawa kamu lebih dekat pada tujuan besar."
    ];
    const randomIndex = Math.floor(Math.random() * motivasiList.length);
    return motivasiList[randomIndex];
}

// Fungsi untuk menangani pengetahuan umum
function generateResponse(input) {
    input = input.toLowerCase().trim();

    let responseMessage = "";

    if (input.includes("apa kabar") || input.includes("how are you")) {
        responseMessage = "Saya baik-baik saja, terima kasih! Bagaimana dengan kamu?";
    } else if (input.includes("selamat sore") || input.includes("good evening")) {
        responseMessage = "Selamat sore! Semoga harimu menyenankan!";
    } else if (input.includes("berapa luas samudra pasifik") || input.includes("luas samudra pasifik")) {
        responseMessage = "Samudra Pasifik adalah samudra terbesar di dunia dengan luas sekitar 165,25 juta km².";
    } else {
        responseMessage = "Maaf, saya tidak mengerti pertanyaan itu. Bisa ulangi lagi?";
    }

    // Panggil fungsi typeMessage untuk efek mengetik
    typeMessage(responseMessage, "ai");
    aiMessages.push(responseMessage); // Menyimpan respons AI
}

// Fungsi untuk mengetik pesan (menciptakan efek mengetik)
function typeMessage(message, sender) {
    const messagesContainer = document.getElementById("messages");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-bubble");
    messageDiv.classList.add(sender === "user" ? "user-message" : "ai-message");

    let i = 0;
    messageDiv.textContent = "";
    messagesContainer.appendChild(messageDiv);

    // Efek mengetik
    const typingInterval = setInterval(() => {
        messageDiv.textContent += message.charAt(i);
        i++;

        // Setelah selesai mengetik, berhenti mengetik
        if (i === message.length) {
            clearInterval(typingInterval);
            // Auto-scroll ke bawah agar pesan terbaru selalu terlihat
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }, 100); // Waktu antar huruf saat mengetik
}

// Fungsi untuk menangani event Enter untuk mengirim pesan
document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Mencegah aksi default enter (misalnya line break)
        sendMessage(); // Panggil fungsi untuk mengirim pesan
    }
});
