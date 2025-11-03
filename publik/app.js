const form = document.querySelector("#loginForm");
const messageBox = document.querySelector(".message");

function setMessage(text, type = "info") {
  messageBox.textContent = text;
  messageBox.classList.remove("info", "success", "error");
  messageBox.classList.add(type);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage("Memproses...");

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (data.success) {
      setMessage(data.message || "Login berhasil.", "success");
    } else {
      setMessage(data.message || "Terjadi kesalahan", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    setMessage("Gagal terhubung ke server.", "error");
  }
});
