// TOGGLE CHAT
function toggleChat() {
  const chat = document.getElementById("chat-box-container");

  if (chat.style.display === "flex") {
    chat.style.display = "none";
  } else {
    chat.style.display = "flex";
  }
}

// ADD MESSAGE TO CHAT
function addMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");

  const msg = document.createElement("div");
  msg.className = sender;
  msg.innerText = text;

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// SEND MESSAGE TO AI
async function sendChat() {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();

  if (!text) return;

  addMessage("user", text);
  input.value = "";

  try {
    const res = await fetch("/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ message: text })
});
    const data = await res.json();

    addMessage("ai", data.reply);
  } catch (err) {
    addMessage("ai", "⚠️ Error connecting to AI.");
    console.error(err);
  }
}

// ENTER KEY SUPPORT
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("chat-input");

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendChat();
    }
  });
});
