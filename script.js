"use strict";

/* ==========================================================================
   CENTRAL WEDDING DATA
   Edit everything here to customize the invitation.
   ========================================================================== */

const weddingData = {
  groom: {
    name: "Ahmad Fauzan",
    instagram: "@ahmad",
    parents: "Bapak Wasor (Alm.) & Ibu Nurul",
    image: "assets/images/groom.png",
  },
  bride: {
    name: "Nur Syafitri",
    instagram: "@syafitri",
    parents: "Bapak Misde & Ibu Nurul Qamariayh",
    image: "assets/images/bride.png",
  },

  weddingDate: "2026-11-15T08:00:00",

  akad: {
    title: "Akad Nikah",
    date: "2026-11-15",
    time: "08.00 WIB",
    venue: "Kediaman Kami",
    address: "Jl. Kramat II, Bajik City, Sampang",
    mapsUrl: "https://maps.app.goo.gl/m31sndEcrutKRgfe7",
    startISO: "2026-11-15T08:00:00",
    endISO: "2026-11-15T10:00:00",
  },

  reception: {
    title: "Resepsi",
    date: "2026-11-15",
    time: "Sehari Penuh",
    venue: "Kediaman Kami",
    address: "Jl. Kramat II, Bajik City, Sampang",
    mapsUrl: "https://maps.app.goo.gl/m31sndEcrutKRgfe7",
    startISO: "2026-11-15T11:00:00",
    endISO: "2026-11-15T23:59:00",
  },

  bankAccounts: [
    { bank: "BCA", number: "1234567890", owner: "Ahmad Fauzan" },
    { bank: "Mandiri", number: "0987654321", owner: "Nur Syafitri" },
  ],

  giftAddress: {
    line1: "Jl. Kramat II, RT 02/RW 04",
    line2: "Sampang, 12345",
  },

  city: "Sampang",

  rsvpEndpoint: null, // set to a URL (Google Apps Script / Firebase / REST API) to enable real submissions
};

/* ==========================================================================
   Guest name (from ?to= URL parameter) — XSS-safe via textContent
   ========================================================================== */

function getGuestName() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("to");
  if (!raw) return "Tamu Undangan";
  const decoded = raw.trim();
  return decoded.length > 0 ? decoded : "Tamu Undangan";
}

function renderGuestName() {
  const name = getGuestName();
  const targets = document.querySelectorAll("[data-guest-name]");
  targets.forEach((el) => {
    el.textContent = name; // never innerHTML — protects against injected markup
  });
}

document.getElementById("rsvpName").value =
  getGuestName() == "Tamu Undangan" ? "" : getGuestName();

/* ==========================================================================
   Central data binding
   Every place in the HTML that shows wedding info carries a
   data-bind="key" (or data-bind-href="key" for links). This function is
   the single place that reads weddingData and writes it into the DOM, so
   editing weddingData is enough — no manual HTML edits required.
   ========================================================================== */

function formatDayNumber(dateStr) {
  return String(new Date(`${dateStr}T00:00:00`).getDate());
}

function formatMonthYear(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  const month = d.toLocaleDateString("en-US", { month: "long" });
  return `${month} ${d.getFullYear()}`;
}

function formatLongDate(isoDateTime) {
  const d = new Date(isoDateTime);
  const month = d.toLocaleDateString("en-US", { month: "long" });
  return `${d.getDate()} ${month} ${d.getFullYear()}`;
}

function formatDotDate(isoDateTime) {
  const d = new Date(isoDateTime);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())} . ${pad(d.getMonth() + 1)} . ${d.getFullYear()}`;
}

function formatMiddotDate(isoDateTime) {
  const d = new Date(isoDateTime);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}\u00A0\u00A0\u00B7\u00A0\u00A0${pad(
    d.getMonth() + 1
  )}\u00A0\u00A0\u00B7\u00A0\u00A0${d.getFullYear()}`;
}

function formatAccountNumber(number) {
  return number.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function renderWeddingData() {
  const groomFirstName = weddingData.groom.name.split(" ")[1];
  const brideFirstName = weddingData.bride.name.split(" ")[1];
  const groomInstagramUrl = `https://instagram.com/${weddingData.groom.instagram.replace(
    "@",
    ""
  )}`;
  const brideInstagramUrl = `https://instagram.com/${weddingData.bride.instagram.replace(
    "@",
    ""
  )}`;

  const bindings = {
    groomFirstName,
    brideFirstName,
    groomName: weddingData.groom.name,
    brideName: weddingData.bride.name,
    groomParents: weddingData.groom.parents,
    brideParents: weddingData.bride.parents,
    groomInstagramHandle: weddingData.groom.instagram,
    brideInstagramHandle: weddingData.bride.instagram,
    weddingDateDots: formatMiddotDate(weddingData.weddingDate),
    weddingDateLong: formatLongDate(weddingData.weddingDate),
    weddingCity: weddingData.city,
    akadDay: formatDayNumber(weddingData.akad.date),
    akadMonthYear: formatMonthYear(weddingData.akad.date),
    akadTime: weddingData.akad.time,
    akadVenue: weddingData.akad.venue,
    akadAddress: weddingData.akad.address,
    resepsiDay: formatDayNumber(weddingData.reception.date),
    resepsiMonthYear: formatMonthYear(weddingData.reception.date),
    resepsiTime: weddingData.reception.time,
    resepsiVenue: weddingData.reception.venue,
    resepsiAddress: weddingData.reception.address,
    giftAddressLine1: weddingData.giftAddress.line1,
    giftAddressLine2: weddingData.giftAddress.line2,
    footerMonogram: `${groomFirstName.charAt(0)} & ${brideFirstName.charAt(0)}`,
    footerNames: `${groomFirstName} & ${brideFirstName}`,
    footerDate: formatDotDate(weddingData.weddingDate),
  };

  Object.entries(bindings).forEach(([key, value]) => {
    document.querySelectorAll(`[data-bind="${key}"]`).forEach((el) => {
      el.textContent = value;
    });
  });

  document
    .querySelectorAll('[data-bind-href="groomInstagramUrl"]')
    .forEach((el) => {
      el.href = groomInstagramUrl;
    });
  document
    .querySelectorAll('[data-bind-href="brideInstagramUrl"]')
    .forEach((el) => {
      el.href = brideInstagramUrl;
    });

  weddingData.bankAccounts.forEach((account, index) => {
    const row = document.querySelector(`[data-bank-index="${index}"]`);
    if (!row) return;
    const bankEl = row.querySelector('[data-bind="bankName"]');
    const numberEl = row.querySelector('[data-bind="bankNumber"]');
    const ownerEl = row.querySelector('[data-bind="bankOwner"]');
    const copyBtn = row.querySelector(".copy-btn");
    if (bankEl) bankEl.textContent = account.bank;
    if (numberEl) numberEl.textContent = formatAccountNumber(account.number);
    if (ownerEl) ownerEl.textContent = `a.n. ${account.owner}`;
    if (copyBtn) copyBtn.setAttribute("data-copy", account.number);
  });

  document.title = `Wedding of ${brideFirstName} & ${groomFirstName}`;
}

/* ==========================================================================
   Opening screen / invitation unlock
   ========================================================================== */

function initInvitation() {
  const body = document.body;
  const opening = document.getElementById("opening");
  const openBtn = document.getElementById("openInvitation");
  const main = document.getElementById("main");
  const musicToggle = document.getElementById("musicToggle");
  const mobileNav = document.getElementById("mobileNav");

  body.classList.add("lock");

  openBtn.addEventListener(
    "click",
    () => {
      opening.classList.add("is-closing");
      main.hidden = false;
      body.classList.remove("lock");
      body.classList.add("unlocked");

      if (musicToggle) {
        musicToggle.hidden = false;
        startMusic();
      }
      if (mobileNav) mobileNav.hidden = false;

      window.scrollTo({ top: 0, behavior: "auto" });

      setTimeout(() => {
        opening.setAttribute("hidden", "");
        initRevealAnimations(); // start observing only once content is visible
      }, 900);
    },
    { once: true }
  );
}

/* ==========================================================================
   Countdown
   ========================================================================== */

function initCountdown() {
  const target = new Date(weddingData.weddingDate).getTime();
  const grid = document.getElementById("countdown");
  const arrivedEl = document.getElementById("countdownArrived");

  const els = {
    days: document.querySelector('[data-unit="days"]'),
    hours: document.querySelector('[data-unit="hours"]'),
    minutes: document.querySelector('[data-unit="minutes"]'),
    seconds: document.querySelector('[data-unit="seconds"]'),
  };

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, "0");
  }

  function tick() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      grid.hidden = true;
      arrivedEl.hidden = false;
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.minutes.textContent = pad(minutes);
    els.seconds.textContent = pad(seconds);
  }

  tick();
  const timer = setInterval(tick, 1000);
}

/* ==========================================================================
   Reveal animations (IntersectionObserver)
   ========================================================================== */

function initRevealAnimations() {
  const targets = document.querySelectorAll(
    ".reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale"
  );

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   Event section: maps links + .ics download
   ========================================================================== */

function formatICSDate(iso) {
  return iso.replace(/[-:]/g, "").replace(/\.\d+/, "") + "";
}

function buildICS(event) {
  const dtStart = new Date(event.startISO);
  const dtEnd = new Date(event.endISO);

  const toICS = (d) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(
      d.getHours()
    )}${pad(d.getMinutes())}00`;
  };

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//Ahmad & Aisyah//ID",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@wedding-ahmad-aisyah`,
    `DTSTAMP:${toICS(new Date())}`,
    `DTSTART:${toICS(dtStart)}`,
    `DTEND:${toICS(dtEnd)}`,
    `SUMMARY:${event.title} - Ahmad & Aisyah`,
    `LOCATION:${event.venue}, ${event.address}`,
    `DESCRIPTION:${event.title} pernikahan Ahmad & Aisyah`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}

function downloadICS(event) {
  const content = buildICS(event);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.title
    .replace(/\s+/g, "-")
    .toLowerCase()}-ahmad-aisyah.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function initEventSection() {
  const akadMap = document.getElementById("akadMapLink");
  const resepsiMap = document.getElementById("resepsiMapLink");
  const akadIcs = document.getElementById("akadIcsBtn");
  const resepsiIcs = document.getElementById("resepsiIcsBtn");

  if (akadMap) akadMap.href = weddingData.akad.mapsUrl;
  if (resepsiMap) resepsiMap.href = weddingData.reception.mapsUrl;

  if (akadIcs) {
    akadIcs.addEventListener("click", () => downloadICS(weddingData.akad));
  }
  if (resepsiIcs) {
    resepsiIcs.addEventListener("click", () =>
      downloadICS(weddingData.reception)
    );
  }
}

/* ==========================================================================
   Gallery + Lightbox (vanilla, no libraries)
   ========================================================================== */

function initGallery() {
  const items = Array.from(document.querySelectorAll(".gallery__item"));
  if (items.length === 0) return;

  const images = items.map((btn) => {
    const img = btn.querySelector("img");
    return { src: img.getAttribute("src"), alt: img.getAttribute("alt") || "" };
  });

  items.forEach((btn, index) => {
    btn.addEventListener("click", () => openLightbox(index, images));
  });
}

let lightboxState = { images: [], index: 0 };

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");
  const imgEl = document.getElementById("lightboxImage");

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", () => stepLightbox(-1));
  nextBtn.addEventListener("click", () => stepLightbox(1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  imgEl.addEventListener("load", () => imgEl.classList.add("is-loaded"));
}

function openLightbox(index, images) {
  lightboxState = { images, index };
  const lightbox = document.getElementById("lightbox");
  lightbox.hidden = false;
  requestAnimationFrame(() => lightbox.classList.add("is-open"));
  renderLightboxImage();
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.remove("is-open");
  setTimeout(() => {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }, 300);
}

function stepLightbox(delta) {
  const total = lightboxState.images.length;
  lightboxState.index = (lightboxState.index + delta + total) % total;
  renderLightboxImage();
}

function renderLightboxImage() {
  const imgEl = document.getElementById("lightboxImage");
  const counter = document.getElementById("lightboxCounter");
  const { images, index } = lightboxState;

  imgEl.classList.remove("is-loaded");
  imgEl.src = images[index].src;
  imgEl.alt = images[index].alt;
  counter.textContent = `${index + 1} / ${images.length}`;
}

/* ==========================================================================
   Gift: accordion + copy to clipboard
   ========================================================================== */

function initGiftCopy() {
  const triggers = document.querySelectorAll(".accordion__trigger");
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!expanded));
    });
  });

  const copyButtons = document.querySelectorAll(".copy-btn");
  copyButtons.forEach((btn) => {
    const originalLabel = btn.textContent;
    btn.addEventListener("click", async () => {
      const number = btn.getAttribute("data-copy");
      try {
        await navigator.clipboard.writeText(number);
      } catch (err) {
        // Fallback for environments without Clipboard API permission
        const temp = document.createElement("textarea");
        temp.value = number;
        temp.style.position = "fixed";
        temp.style.opacity = "0";
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
      }
      btn.textContent = "Berhasil Disalin ✓";
      btn.classList.add("is-copied");
      setTimeout(() => {
        btn.textContent = originalLabel;
        btn.classList.remove("is-copied");
      }, 2000);
    });
  });
}

/* ==========================================================================
   RSVP
   ========================================================================== */

async function submitRSVP(data) {
  if (weddingData.rsvpEndpoint) {
    const response = await fetch(weddingData.rsvpEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("RSVP submission failed");
    return response.json().catch(() => ({ success: true }));
  }

  // Simulated success response until a real endpoint is configured
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, simulated: true }), 800);
  });
}

function initRSVP() {
  const form = document.getElementById("rsvpForm");
  if (!form) return;

  const nameInput = document.getElementById("rsvpName");
  const nameError = document.getElementById("rsvpNameError");
  const attendanceError = document.getElementById("rsvpAttendanceError");
  const submitBtn = form.querySelector(".btn--submit");
  const btnLabel = submitBtn.querySelector(".btn__label");
  const btnLoading = submitBtn.querySelector(".btn__loading");
  const successEl = document.getElementById("rsvpSuccess");

  function validate() {
    let valid = true;

    nameError.textContent = "";
    attendanceError.textContent = "";
    nameInput.classList.remove("is-invalid");

    if (!nameInput.value.trim()) {
      nameError.textContent = "Nama wajib diisi.";
      nameInput.classList.add("is-invalid");
      valid = false;
    }

    const attendance = form.querySelector('input[name="attendance"]:checked');
    if (!attendance) {
      attendanceError.textContent = "Silakan pilih konfirmasi kehadiran.";
      valid = false;
    }

    return valid;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData(form);
    const data = {
      name: formData.get("name").toString().trim(),
      attendance: formData.get("attendance"),
      guests: formData.get("guests"),
      message: formData.get("message").toString().trim(),
      submittedAt: new Date().toISOString(),
    };

    submitBtn.disabled = true;
    btnLabel.hidden = true;
    btnLoading.hidden = false;

    try {
      await submitRSVP(data);
      form.reset();
      successEl.hidden = false;
      form
        .querySelectorAll(".field, fieldset")
        .forEach((f) => (f.hidden = true));
      submitBtn.hidden = true;
    } catch (err) {
      attendanceError.textContent = "Terjadi kesalahan. Silakan coba lagi.";
    } finally {
      submitBtn.disabled = false;
      btnLabel.hidden = false;
      btnLoading.hidden = true;
    }
  });
}

/* ==========================================================================
   Music
   ========================================================================== */

function startMusic() {
  const audio = document.getElementById("bgMusic");
  const toggle = document.getElementById("musicToggle");
  if (!audio || !toggle) return;

  audio
    .play()
    .then(() => {
      setMusicIcon(true);
    })
    .catch(() => {
      // Autoplay blocked or file missing — invitation still works without sound
      setMusicIcon(false);
    });
}

function setMusicIcon(playing) {
  const toggle = document.getElementById("musicToggle");
  if (!toggle) return;
  toggle.setAttribute("aria-pressed", String(playing));
  toggle.setAttribute("aria-label", playing ? "Jeda musik" : "Putar musik");
  toggle.innerHTML = `<i data-lucide="${
    playing ? "volume-2" : "volume-x"
  }"></i>`;
  if (window.lucide) window.lucide.createIcons();
}

function initMusic() {
  const audio = document.getElementById("bgMusic");
  const toggle = document.getElementById("musicToggle");
  if (!audio || !toggle) return;

  toggle.addEventListener("click", () => {
    if (audio.paused) {
      audio
        .play()
        .then(() => setMusicIcon(true))
        .catch(() => setMusicIcon(false));
    } else {
      audio.pause();
      setMusicIcon(false);
    }
  });

  audio.addEventListener("error", () => {
    toggle.hidden = true; // gracefully hide control if music file is unavailable
  });
}

/* ==========================================================================
   Mobile navigation (active section highlight)
   ========================================================================== */

function initNavigation() {
  const nav = document.getElementById("mobileNav");
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll("a[data-nav]"));
  const sections = links
    .map((link) => document.getElementById(link.dataset.nav))
    .filter(Boolean);

  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = nav.querySelector(`a[data-nav="${entry.target.id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ==========================================================================
   Image fallback
   If a photo asset hasn't been added yet, hide the broken-image icon and
   let the surrounding warm gradient placeholder show through instead.
   ========================================================================== */

function initImageFallback() {
  const images = document.querySelectorAll(
    ".hero__image, .couple__portrait img, .gallery__item img"
  );
  images.forEach((img) => {
    img.addEventListener(
      "error",
      () => {
        img.style.display = "none";
      },
      { once: true }
    );
  });
}

/* ==========================================================================
   Lucide icons
   ========================================================================== */

function initIcons() {
  if (window.lucide) window.lucide.createIcons();
}

/* ==========================================================================
   Bootstrap
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  renderWeddingData();
  renderGuestName();
  initInvitation();
  initCountdown();
  initEventSection();
  initGallery();
  initLightbox();
  initGiftCopy();
  initRSVP();
  initMusic();
  initNavigation();
  initImageFallback();
  initIcons();
});
