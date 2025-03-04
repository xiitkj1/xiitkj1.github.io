<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Chat UI</title>
    <style>
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #1a1a1a;
        color: white;
        font-family: Arial, sans-serif;
        text-align: center;
        flex-direction: column;
      }
      .container {
        width: 50%;
      }
      h1 {
        margin-bottom: 20px;
      }
      .chat-box {
        width: 100%;
        height: 300px;
        overflow-y: auto;
        background: #333;
        padding: 10px;
        border-radius: 10px;
        text-align: left;
        margin-bottom: 10px;
      }
      .input-box {
        display: flex;
        align-items: center;
        background: #292929;
        padding: 10px;
        border-radius: 20px;
        position: relative;
      }
      input {
        flex: 1;
        background: none;
        border: none;
        color: white;
        padding: 10px;
        outline: none;
      }
      .buttons-container {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 10px;
      }
      .icon-button,
      .send-button {
        background: none;
        border: none;
        cursor: pointer;
        color: white;
        font-size: 24px;
      }
      .send-button {
        position: absolute;
        right: 10px;
      }
      @media (max-width: 600px) {
        .buttons-container {
          flex-direction: row;
        }
        .send-button {
          display: block;
        }
      }
    </style>
    <script>
      async function sendMessage(event) {
        if (event.key === "Enter" || event.type === "click") {
          let inputField = document.getElementById("user-input");
          let chatBox = document.getElementById("chat-box");
          let userMessage = inputField.value.trim();

          if (userMessage === "") return;

          chatBox.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
          inputField.value = "";

          let response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer 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",
            },
            body: JSON.stringify({
              model: "text-davinci-003",
              prompt: userMessage,
              max_tokens: 100,
            }),
          });

          let data = await response.json();
          let botResponse = data.choices[0].text.trim();

          chatBox.innerHTML += `<p><strong>AI:</strong> ${botResponse}</p>`;
          chatBox.scrollTop = chatBox.scrollHeight;
        }
        let data = await response.json();
console.log(data);

      }
    </script>
  </head>
  <body>
    <div class="container">
      <h1>What can I help with?</h1>
      <div class="chat-box" id="chat-box"></div>
      <div class="input-box">
        <input
          type="text"
          id="user-input"
          placeholder="Ask anything"
          onkeydown="sendMessage(event)"
        />
        <button class="send-button" onclick="sendMessage(event)">📩</button>
      </div>
      <div class="buttons-container">
        <button class="icon-button" onclick="alert('Search Clicked')">
          🔍
        </button>
        <button class="icon-button" onclick="alert('Reason Clicked')">
          💡
        </button>
        <button class="icon-button" onclick="alert('Voice Input Activated')">
          🎙️
        </button>
      </div>
    </div>
  </body>
</html>
