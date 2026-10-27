// 潮聲小築的下載頁：依瀏覽器的平台換主要的下載按鈕、看大圖、複製 SHA-256（資料在頁面的 window.TH，tools/site.py 產生）
(function () {
	const th = window.TH || {};
	const t = th.text || {};

	// 平台：Android、iPhone／iPad、Windows、Mac、其他
	function platform() {
		const ua = navigator.userAgent || "";
		if (/Android/i.test(ua)) return "android";
		if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
		if (/Windows/i.test(ua)) return "windows";
		if (/Macintosh|Mac OS X/i.test(ua)) return "mac";
		return "other";
	}

	const p = platform();
	const main = document.getElementById("dl-main");
	const note = document.getElementById("dl-note");
	const d = (th.downloads || {})[p];
	if (main) {
		if (d) {
			main.href = d.url;
			main.textContent = t["button_" + p];
			note.textContent = d.file + "・" + d.size_text;
			const card = document.getElementById("dl-" + p);
			if (card) card.setAttribute("data-current", "");
		} else {
			main.href = "#download";
			main.textContent = t.button_choose;
			if (p === "ios") note.textContent = t.no_ios;
		}
	}

	// 看大圖：點截圖打開，左右鍵、按鈕換張，Esc 或點背景關閉
	const viewer = document.getElementById("viewer");
	const big = viewer && viewer.querySelector("img");
	const shots = Array.from(document.querySelectorAll(".strip button"));
	let at = 0;
	function show(i) {
		at = (i + shots.length) % shots.length;
		big.src = shots[at].dataset.full;
		big.alt = shots[at].querySelector("img").alt;
	}
	shots.forEach((b, i) => b.addEventListener("click", () => { show(i); viewer.showModal(); }));
	if (viewer) {
		viewer.querySelector("[data-prev]").addEventListener("click", () => show(at - 1));
		viewer.querySelector("[data-next]").addEventListener("click", () => show(at + 1));
		viewer.querySelector("[data-close]").addEventListener("click", () => viewer.close());
		viewer.addEventListener("click", (e) => { if (e.target === viewer) viewer.close(); });
		document.addEventListener("keydown", (e) => {
			if (!viewer.open) return;
			if (e.key === "ArrowLeft") show(at - 1);
			if (e.key === "ArrowRight") show(at + 1);
		});
	}

	// 複製 SHA-256
	document.querySelectorAll("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
		try {
			await navigator.clipboard.writeText(b.dataset.copy);
			const old = b.textContent;
			b.textContent = t.copied;
			setTimeout(() => { b.textContent = old; }, 1500);
		} catch (e) { /* 不支援剪貼簿：使用者自己選取 */ }
	}));
})();
