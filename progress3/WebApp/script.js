const form = document.getElementById('question-form');
const questionInput = document.getElementById('question');
const statusBox = document.getElementById('status');
const answerBox = document.getElementById('answer');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const question = questionInput.value.trim();
  if (!question) {
    statusBox.textContent = 'Pertanyaan masih kosong.';
    return;
  }

  statusBox.textContent = 'Menghubungi n8n...';
  answerBox.textContent = '';

  try {
    const response = await fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || 'Permintaan gagal.');
    }

    answerBox.textContent = payload.answer || JSON.stringify(payload, null, 2);
    const usage = payload.usage
      ? `, tokens input: ${payload.usage.totalTokenCount ?? payload.usage.promptTokenCount}`
      : '';
    statusBox.textContent = `Berhasil dari ${payload.model || 'Gemini'}${usage}`;
  } catch (error) {
    statusBox.textContent = 'Terjadi kesalahan.';
    answerBox.textContent = error.message;
  }
});
