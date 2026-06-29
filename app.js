window.addEventListener("DOMContentLoaded", () => {

    /* ================= ELEMENTS ================= */
    const startBtn = document.getElementById("startBtn");
    const video = document.getElementById("video");
    const emergencyBar=document.getElementById("emergency Bar");

    /* ================= STATE ================= */
    let recognition;
    let stream = null;
    let listening = false;
    


    /* ================= SPEAK ================= */
    function speak(text) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.rate = 1;
        msg.pitch = 1;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(msg);
    }

    /* ================= CAMERA ================= */
    async function startCamera() {
        try {

            stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });

            video.srcObject = stream;
            await video.play();

            cameraOn = true;

            speak("Camera started. I am monitoring your surroundings.");

        } catch (err) {
            console.log(err);
            speak("Camera access failed.");
        }
    }

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            video.srcObject = null;
        }

        cameraOn = false;
    }

  

    

    /* ================= COMMAND HANDLER ================= */
    function handleCommand(cmd) {

        cmd = cmd.toLowerCase();
        console.log("HEARD:", cmd);

        /* -------- START -------- */
       if(cmd.includes("start")){
        startCamera();
        speak("Echo GUide activated");
       }

        /* -------- SCAN -------- */
        else if (cmd.includes("scan")) {

            speak("Scanning surroundings");

            setTimeout(() => {

                const items = [
                    "Person ahead",
                    "Obstacle detected",
                    "Chair on left",
                    "Clear path",
                    "Door on right"
                ];

                speak(items[Math.floor(Math.random() * items.length)]);

            }, 4500);
        }

        /* -------- NAVIGATION -------- */
        else if (
            cmd.includes("navigate") ||
            cmd.includes("navigation") ||
            cmd.includes("direction")
        ) {

            speak("Navigation mode started");

            setTimeout(() => speak("Walk straight"), 1500);
            setTimeout(() => speak("Turn slightly right"), 3500);
            setTimeout(() => speak("You are safe"), 5500);
        }

        /* -------- EMERGENCY (FIXED) -------- */
        
                   else if (
    cmd.includes("emergency") ||
    cmd.includes("sos") ||
    cmd.includes("help") ||
    cmd.includes("urgent") ||
    cmd.includes("danger") ||
    cmd.includes("i need help") ||
    cmd.includes("help me")
) {

    console.log("🚨 EMERGENCY TRIGGERED");

    // 🔴 SHOW EMERGENCY BAR (if added in HTML)
    if (emergencyBar) {
        emergencyBar.style.display = "block";
    }

    // 🔊 BEEP SOUND
    new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg").play();

    // 🔴 RED SCREEN EFFECT
    document.body.classList.add("sos");

    // 🎤 VOICE ALERT
    speak("Emergency mode activated. Assistance is being provided.");

    // 📍 UPDATE STATUS
    statusBox.innerText = "🚨 Emergency Active";

    // 🧭 AUTO NAVIGATION AFTER SHORT DELAY
    setTimeout(() => {
        speak("Switching to safety navigation mode.");
        startNavigation();
    }, 2000);
}

        /* -------- DEFAULT -------- */
        else {
            speak("Command not recognized");
        }
    }

    /* ================= VOICE ================= */
    function startVoice() {

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech Recognition not supported");
            return;
        }

        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => {
            listening = true;
            speak("Voice assistant activated. Say start, scan, navigate or emergency.");
        };

        recognition.onresult = (event) => {

            const cmd =
                event.results[event.results.length - 1][0].transcript
                    .toLowerCase()
                    .trim();

            handleCommand(cmd);
        };

        recognition.onerror = (err) => {
            console.log("Voice error:", err.error);
        };

        recognition.onend = () => {
            if (listening) recognition.start();
        };

        recognition.start();
    }

    /* ================= START BUTTON ================= */
    startBtn.addEventListener("click", () => {

        speak("EchoGuide AI activated. Say start to begin camera.");

        startVoice();

    });

});