(() => {
    let audioContext;

    function getAudioContext() {
        if (audioContext) {
            return audioContext;
        }

        const AudioContextType = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextType) {
            return null;
        }

        audioContext = new AudioContextType();
        return audioContext;
    }

    function unlockAudio() {
        const context = getAudioContext();
        if (context?.state === "suspended") {
            void context.resume();
        }
    }

    document.addEventListener("pointerdown", unlockAudio, true);
    document.addEventListener("keydown", unlockAudio, true);

    function playTone(context, frequency, startTime, duration, volume, type = "sine") {
        const oscillator = context.createOscillator();
        const gain = context.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, startTime);
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }

    window.mathSounds = {
        play(isCorrect) {
            const context = getAudioContext();
            if (!context) {
                return;
            }

            const play = () => {
                const startTime = context.currentTime + 0.02;
                if (isCorrect) {
                    playTone(context, 660, startTime, 0.18, 0.12);
                    playTone(context, 880, startTime + 0.14, 0.2, 0.12);
                    playTone(context, 1100, startTime + 0.29, 0.28, 0.12);
                } else {
                    playTone(context, 330, startTime, 0.22, 0.08, "triangle");
                    playTone(context, 260, startTime + 0.18, 0.28, 0.07, "triangle");
                }
            };

            if (context.state === "suspended") {
                void context.resume().then(play);
                return;
            }

            play();
        }
    };
})();
