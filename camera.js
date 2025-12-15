const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const status = document.getElementById("status");
const gallery = document.getElementById("gallery");
const galleryCard = document.getElementById("galleryCard");

const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");

const startBtn = document.getElementById("startBtn");
const captureBtn = document.getElementById("captureBtn");
const stopBtn = document.getElementById("stopBtn");

let stream = null;

/* START CAMERA */
startBtn.onclick = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    status.innerText = "Camera started";
  } catch {
    status.innerText = "Camera permission denied";
  }
};

/* CAPTURE IMAGE */
captureBtn.onclick = () => {
  if (!stream) return;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  const img = document.createElement("img");
  img.src = canvas.toDataURL("image/png");

  img.onclick = () => {
    modalImg.src = img.src;
    modal.style.display = "flex";
  };

  gallery.prepend(img);
  status.innerText = "Image added to gallery";
};

/* STOP CAMERA */
stopBtn.onclick = () => {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
    video.srcObject = null;
    status.innerText = "Camera stopped";
  }
};

/* CLOSE MODAL */
closeModal.onclick = () => modal.style.display = "none";
modal.onclick = e => {
  if (e.target === modal) modal.style.display = "none";
};

/* SHADOW-ONLY MOUSE EFFECT */
galleryCard.addEventListener("mousemove", (e) => {
  const rect = galleryCard.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;

  gallery.querySelectorAll("img").forEach((img, i) => {
    const depth = (i % 5 + 1);
    img.style.boxShadow =
      `${-x / 20 * depth}px ${-y / 20 * depth}px 28px rgba(56,189,248,0.85)`;
  });
});

galleryCard.addEventListener("mouseleave", () => {
  gallery.querySelectorAll("img").forEach(img => {
    img.style.boxShadow = "0 12px 22px rgba(0,0,0,0.45)";
  });
});
