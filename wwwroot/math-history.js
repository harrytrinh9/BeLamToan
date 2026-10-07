(() => {
    const storageKey = "beLamToan.history.v1";

    window.mathHistory = {
        load() {
            const stored = localStorage.getItem(storageKey);
            const history = stored ? JSON.parse(stored) : [];
            if (!Array.isArray(history)) {
                throw new TypeError("Lịch sử bài tập không hợp lệ.");
            }

            return history;
        },

        save(history) {
            localStorage.setItem(storageKey, JSON.stringify(history));
        },

        getLocalDateTime() {
            const now = new Date();
            const pad = value => String(value).padStart(2, "0");

            return {
                date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
                time: `${pad(now.getHours())}:${pad(now.getMinutes())}`
            };
        }
    };
})();
