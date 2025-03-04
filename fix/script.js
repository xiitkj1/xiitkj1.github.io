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
        "hello": "Hey! How's it going?",
        "hi": "Hello! How can I help you today?",
        "good morning": "Good morning! Hope you have a wonderful day ahead.",
        "good afternoon": "Good afternoon! How can I assist you today?",
        "good night": "Good night! Sleep well and have sweet dreams!",
        "how are you": "I'm doing great! Thanks for asking. How about you?",
        "how are you doing": "I'm doing just fine, thank you! What about you?",
        "what is your name": "I'm your friendly AI assistant!",
        "what can you do": "I can chat, answer questions, and even help with math and general knowledge.",
        "thank you": "You're welcome! Always happy to help.",
        "goodbye": "Catch you later! Have a great day!",
        "bye": "Goodbye! See you next time!",
        "how old are you": "I don't age, but I'm always here to assist you!",
        "where are you from": "I live in the cloud, always available wherever you are.",
        "what's your favorite color": "I don't have a favorite color, but I think blue is quite nice!",
        "do you like music": "I don't have ears, but I imagine music would be fun!",
        "what's the weather like": "I can't check the weather, but it's always a good time to chat!",
        "apa kabar": "Saya baik-baik saja, terima kasih! Bagaimana dengan Anda?",
        "selamat pagi": "Selamat pagi! Semoga hari Anda menyenankan.",
        "selamat sore": "Selamat sore! Ada yang bisa saya bantu?",
        "selamat malam": "Selamat malam! Semoga tidur Anda nyenyak.",
        "siapa nama kamu": "Saya adalah asisten AI Anda yang siap membantu.",
        "apa yang bisa kamu lakukan": "Saya bisa berbincang, menjawab pertanyaan, dan membantu Anda dalam banyak hal.",
        "terima kasih": "Sama-sama! Senang bisa membantu.",
        "apa kabar kamu": "Saya baik-baik saja, terima kasih. Bagaimana dengan Anda?",
        "apa warna favoritmu": "Saya tidak memiliki warna favorit, tapi saya suka warna biru!",
        "apakah kamu suka musik": "Saya tidak punya telinga, tapi saya rasa musik pasti menyenangkan!"
    };

    if (input.toLowerCase().includes("joke")) {
        return "Why don't scientists trust atoms? Because they make up everything!";
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
    let waveIcon = document.getElementById("waveIcon");
    waveIcon.style.display = "inline-block";
    recognition.start();
    
    recognition.onresult = function(event) {
        let transcript = event.results[0][0].transcript;
        document.getElementById("userInput").value = transcript;
        waveIcon.style.display = "none";
    };
    
    recognition.onend = function() {
        waveIcon.style.display = "none";
    };
}

function speakText(text) {
    // Check for speech synthesis support
    if ('speechSynthesis' in window) {
        let speech = new SpeechSynthesisUtterance(text);
        speech.lang = "id-ID"; // Bahasa Indonesia

        // Use available voices
        let voices = window.speechSynthesis.getVoices();
        speech.voice = voices.find(voice => voice.name.includes("Google")) || voices[0];
        speech.rate = 1.1;
        speech.pitch = 1.2;

        // Delay to allow voices to load on mobile
        setTimeout(() => {
            window.speechSynthesis.speak(speech);
        }, 100);

        speech.onerror = function(event) {
            console.error("Error occurred while trying to speak:", event);
            alert("Sorry, I couldn't speak the message at the moment.");
        };
    } else {
        console.error("Speech synthesis is not supported on this device.");
        alert("Speech synthesis is not supported on this device.");
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
