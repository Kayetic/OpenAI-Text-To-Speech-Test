document.getElementById("speakButton").addEventListener("click", function () {
  const text = document.getElementById("textInput").value;
  fetchSpeech(text);
});

async function fetchOpenAIKey() {
  try {
    const response = await fetch(
      `https://oh3uau67qoyk7juqhwo75ivyta0hhhcy.lambda-url.eu-west-2.on.aws/`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const responseData = await response.json();
      openAIKey = responseData.key;
    }
  } catch (error) {
    console.error("Error fetching OpenAI key:", error);
  }
}

fetchOpenAIKey();

async function fetchSpeech(text) {
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAIKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1",
      input: text,
      voice: "alloy",
    }),
  });

  if (!response.ok) {
    alert("Error from API: " + response.statusText);
    return;
  }

  const blob = await response.blob();
  const audioUrl = URL.createObjectURL(blob);
  const audioElement = document.getElementById("audioElement");
  audioElement.src = audioUrl;
  audioElement.play();
}
