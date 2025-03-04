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
    
    if (userText !== "") {
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
        "how are you": "I'm doing great! Thanks for asking!",
        "what is your name": "I'm your friendly AI assistant!",
        "what can you do": "I can chat, answer questions, and even help with math!",
        "thank you": "No problem! Happy to help!",
        "goodbye": "Catch you later! Have an awesome day!",
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

    return responses[input.toLowerCase()] || "Hmm, I don't understand that yet. Try asking something else!";
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
        speech.lang = "en-US";

        // Use available voices
        let voices = window.speechSynthesis.getVoices();
        speech.voice = voices.find(voice => voice.name.includes("Boy") || voice.name.includes("Teen")) || voices.find(voice => voice.name.includes("Natural")) || voices[0];
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

function isInappropriate(text) {
    let bannedWords = ["badword1", "badword2", "18+content"];
    return bannedWords.some(word => text.toLowerCase().includes(word));
}

// Fitur Pengingat Sederhana (Ikon lonceng)
function handleReminder() {
    let reminderText = prompt("Apa yang ingin Anda ingatkan?");
    if (reminderText) {
        setTimeout(() => alert("Pengingat: " + reminderText), 5000);
        alert("Pengingat telah diset!");
    }
}

// Fitur Humor & Motivasi (Ikon emoji)
function handleHumor() {
    let randomChoice = Math.random();
    if (randomChoice < 0.5) {
        alert("Mengapa ilmuwan tidak mempercayai atom? Karena mereka membuat segalanya!");
    } else {
        alert("Percayalah pada dirimu sendiri! Setiap perjalanan besar dimulai dengan langkah pertama.");
    }
}
