(() => {
    const settingsKey = "beLamToan.soundSettings.v1";
    const soundPatterns = {
        correct: [
            [[659, 0, 0.15, "sine"], [784, 0.13, 0.15, "sine"], [988, 0.26, 0.25, "sine"]],
            [[523, 0, 0.16, "triangle"], [659, 0.14, 0.16, "triangle"], [784, 0.28, 0.16, "triangle"], [1047, 0.42, 0.3, "triangle"]],
            [[880, 0, 0.12, "sine"], [1175, 0.12, 0.12, "sine"], [1397, 0.24, 0.25, "sine"]],
            [[523, 0, 0.12, "sine"], [659, 0.1, 0.15, "sine"], [784, 0.22, 0.2, "sine"], [1047, 0.36, 0.26, "sine"]],
            [[784, 0, 0.1, "triangle"], [988, 0.12, 0.1, "triangle"], [1319, 0.24, 0.13, "triangle"], [1568, 0.39, 0.28, "sine"]],
            [[587, 0, 0.12, "square"], [740, 0.12, 0.12, "square"], [880, 0.24, 0.24, "triangle"]],
            [[440, 0, 0.1, "square"], [660, 0.1, 0.1, "square"], [880, 0.2, 0.1, "square"], [1175, 0.3, 0.3, "triangle"]],
            [[1047, 0, 0.12, "sine"], [1319, 0.12, 0.12, "sine"], [1568, 0.24, 0.26, "sine"]],
            [[392, 0, 0.15, "triangle"], [523, 0.14, 0.15, "triangle"], [659, 0.28, 0.15, "triangle"], [1047, 0.42, 0.3, "sine"]],
            [[659, 0, 0.11, "square"], [784, 0.11, 0.11, "square"], [988, 0.22, 0.11, "square"], [1319, 0.33, 0.32, "triangle"]]
        ],
        incorrect: [
            [[440, 0, 0.13, "triangle"], [349, 0.15, 0.16, "triangle"], [440, 0.33, 0.2, "sine"]],
            [[523, 0, 0.14, "sine"], [440, 0.15, 0.14, "sine"], [523, 0.31, 0.2, "triangle"]],
            [[659, 0, 0.12, "sine"], [494, 0.13, 0.14, "triangle"], [392, 0.28, 0.21, "sine"]],
            [[392, 0, 0.13, "triangle"], [494, 0.12, 0.13, "triangle"], [440, 0.27, 0.23, "sine"]],
            [[587, 0, 0.1, "sine"], [440, 0.12, 0.17, "triangle"], [523, 0.31, 0.2, "sine"]],
            [[330, 0, 0.12, "triangle"], [494, 0.12, 0.12, "triangle"], [370, 0.25, 0.12, "triangle"], [440, 0.38, 0.2, "sine"]],
            [[523, 0, 0.1, "sine"], [587, 0.12, 0.1, "sine"], [523, 0.24, 0.1, "sine"], [659, 0.36, 0.2, "triangle"]],
            [[392, 0, 0.16, "sine"], [330, 0.17, 0.18, "triangle"], [392, 0.37, 0.2, "sine"]],
            [[440, 0, 0.11, "triangle"], [523, 0.13, 0.11, "sine"], [392, 0.27, 0.11, "triangle"], [494, 0.4, 0.2, "sine"]],
            [[523, 0, 0.12, "sine"], [440, 0.14, 0.13, "triangle"], [523, 0.3, 0.12, "sine"], [659, 0.44, 0.23, "triangle"]]
        ]
    };

    let audioContext;
    const soundFileBuffers = new Map();

    function validateSoundId(soundId) {
        if (!Number.isInteger(soundId) || soundId < 1 || soundId > 10) {
            throw new RangeError("Lựa chọn âm thanh không hợp lệ.");
        }
    }

    function validateSound(sound) {
        if (Number.isInteger(sound)) {
            validateSoundId(sound);
            return;
        }

        if (typeof sound === "string" && sound.startsWith("file:")) {
            const fileName = sound.slice(5);
            if (fileName.length > 0 && fileName !== "." && fileName !== ".." &&
                !fileName.includes("/") && !fileName.includes("\\")) {
                return;
            }
        }

        throw new RangeError("Lựa chọn âm thanh không hợp lệ.");
    }

    function validateSettings(settings) {
        if (!settings || typeof settings !== "object") {
            throw new TypeError("Cài đặt âm thanh không hợp lệ.");
        }

        validateSound(settings.correct);
        validateSound(settings.incorrect);
        return settings;
    }

    function getAudioContext() {
        if (audioContext) {
            return audioContext;
        }

        const AudioContextType = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextType) {
            throw new Error("Trình duyệt không hỗ trợ phát âm thanh.");
        }

        audioContext = new AudioContextType();
        return audioContext;
    }

    async function getSoundFileBuffer(fileName, context) {
        const source = new URL(`Sounds/${encodeURIComponent(fileName)}`, document.baseURI).toString();
        if (!soundFileBuffers.has(source)) {
            soundFileBuffers.set(source, (async () => {
                const response = await fetch(source);
                if (!response.ok) {
                    throw new Error(`Không thể tải âm thanh: ${response.status}`);
                }

                return context.decodeAudioData(await response.arrayBuffer());
            })());
        }

        try {
            return await soundFileBuffers.get(source);
        } catch (error) {
            soundFileBuffers.delete(source);
            throw error;
        }
    }

    function unlockAudio() {
        if (!(window.AudioContext || window.webkitAudioContext)) {
            return;
        }

        const context = getAudioContext();
        if (context.state === "suspended") {
            void context.resume();
        }
    }

    document.addEventListener("pointerdown", unlockAudio, true);
    document.addEventListener("keydown", unlockAudio, true);

    async function playPattern(isCorrect, soundId) {
        validateSound(soundId);
        const context = getAudioContext();
        if (context.state === "suspended") {
            await context.resume();
        }

        if (typeof soundId === "string") {
            const buffer = await getSoundFileBuffer(soundId.slice(5), context);
            const source = context.createBufferSource();
            source.buffer = buffer;
            source.connect(context.destination);
            source.start();
            return;
        }

        const pattern = soundPatterns[isCorrect ? "correct" : "incorrect"][soundId - 1];
        const volume = isCorrect ? 0.1 : 0.065;
        const startTime = context.currentTime + 0.02;

        for (const [frequency, offset, duration, type] of pattern) {
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            const noteStart = startTime + offset;

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, noteStart);
            gain.gain.setValueAtTime(0.0001, noteStart);
            gain.gain.exponentialRampToValueAtTime(volume, noteStart + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + duration);

            oscillator.connect(gain);
            gain.connect(context.destination);
            oscillator.start(noteStart);
            oscillator.stop(noteStart + duration);
        }
    }

    function loadSettings() {
        const stored = localStorage.getItem(settingsKey);
        if (stored === null) {
            return { correct: 1, incorrect: 1 };
        }

        const settings = JSON.parse(stored);
        if (!settings || typeof settings !== "object") {
            throw new TypeError("Cài đặt âm thanh không hợp lệ.");
        }

        for (const soundType of ["correct", "incorrect"]) {
            if (settings[soundType] === 11 || settings[soundType] === "11") {
                settings[soundType] = 1;
            }
        }

        validateSettings(settings);
        localStorage.setItem(settingsKey, JSON.stringify(settings));
        return settings;
    }

    window.mathSounds = {
        loadSettings,

        saveSettings(correct, incorrect) {
            const settings = validateSettings({ correct, incorrect });
            localStorage.setItem(settingsKey, JSON.stringify(settings));
        },

        preview(isCorrect, soundId) {
            return playPattern(isCorrect, soundId);
        },

        async play(isCorrect) {
            const settings = loadSettings();
            await playPattern(isCorrect, isCorrect ? settings.correct : settings.incorrect);
        }
    };
})();
