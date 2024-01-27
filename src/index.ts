import { Modal } from "flowbite";
import type { ModalOptions, ModalInterface } from "flowbite";
import type { InstanceOptions } from "flowbite";
const $modalElementTwo: HTMLElement = document.querySelector("#modal-two");

const modalOptionsTwo: ModalOptions = {
  placement: "center",
  backdrop: "dynamic",
  backdropClasses: "bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40",
  closable: true,
  onHide: () => {
    console.log("modal is hidden");
  },
  onShow: () => {
    console.log("modal is shown");
  },
  onToggle: () => {
    console.log("modal has been toggled");
  },
};

// instance options object
const instanceOptionsTwo: InstanceOptions = {
  id: "modalEl",
  override: true,
};

const modalTwo: ModalInterface = new Modal(
  $modalElementTwo,
  modalOptionsTwo,
  instanceOptionsTwo
);
const $modalElement: HTMLElement = document.querySelector("#modalEl");

const modalOptions: ModalOptions = {
  placement: "center",
  backdrop: "static",
  backdropClasses: "bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40",
  closable: false,
};

// instance options object
const instanceOptions: InstanceOptions = {
  id: "modalEl",
  override: true,
};

import "flowbite";
import Swal from "sweetalert2";
window.onload = () => {
  const animation = document.getElementById("animation") as HTMLElement;
  const title = document.getElementById("title-record-audio") as HTMLElement;
  const stopRecord = document.getElementById("stop-record") as HTMLElement;
  const screen = document.getElementById("screen-option") as HTMLInputElement;
  const mic = document.getElementById("mic-option") as HTMLInputElement;
  const cam = document.getElementById("cam-option") as HTMLInputElement;
  const closed = document.getElementById("closed") as HTMLElement;
  const video = document.getElementById("video") as HTMLVideoElement;
  const camara = document.getElementById("camara") as HTMLVideoElement;
  const videoElement = document.getElementById(
    "output-video"
  ) as HTMLVideoElement;
  const countdown = document.getElementById("countdown");

  const $button = document.getElementById("recorder")!;
  const titleModal = document.getElementById("title-modal");
  const circleAnimate = document.getElementById("circle-animate");

  $button.addEventListener("click", async () => {
    const modal: ModalInterface = new Modal(
      $modalElement,
      modalOptions,
      instanceOptions
    );

    if (
      screen.checked == false &&
      mic.checked == false &&
      cam.checked == false
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Selecciona una opción de grabación",
      });
    }
    if (screen.checked && mic.checked === false && cam.checked === false) {
      const media = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 60 } },
      });
      const mediarecorder = new MediaRecorder(media, {
        mimeType: "video/webm;codecs=vp8,opus",
      });
      mediarecorder.start();

      const [video] = media.getVideoTracks();
      video.addEventListener("ended", () => {
        mediarecorder.stop();
      });

      mediarecorder.addEventListener("dataavailable", (e) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(e.data);
        link.download = "captura.mp4";
        link.click();
      });
    }
    if (mic.checked && screen.checked === false && cam.checked === false) {
      let chunks = [];
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const mediaStream = stream;
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.addEventListener("dataavailable", (event) => {
        chunks.push(event.data);
      });
      closed.addEventListener("click", () => {
        modal.hide();
        stopRecord.setAttribute("disabled", "");
        countdown.classList.remove("animate-pulse");
        stopRecord.classList.add("cursor-not-allowed");
        mediaRecorder.stop();
        mediaStream.getTracks().forEach((track) => track.stop());
        modal.isVisible();
        titleModal.classList.remove("hidden");
        circleAnimate.classList.add("hidden");
      });
      modal.show();
      let totalTime = 3;

      function updateClock() {
        if (countdown) {
          countdown.innerHTML = totalTime.toString();
        }

        if (totalTime === 0 && modal.isVisible()) {
          console.log("grabando");
          circleAnimate.classList.remove("hidden");
          titleModal.classList.add("hidden");
          stopRecord.classList.remove("hidden");
          countdown.classList.add("animate-pulse");
          countdown.innerHTML = "Grabando...";
          stopRecord.classList.remove("cursor-not-allowed");
          stopRecord.removeAttribute("disabled");
          mediaRecorder.start();
          stopRecord.addEventListener("click", () => {
            mediaRecorder.addEventListener("stop", () => {
              // Código para descargar
              const audioBlob = new Blob(chunks, { type: "audio/mp3" });
              const audioUrl = URL.createObjectURL(audioBlob);
              const link = document.createElement("a");
              link.href = audioUrl;
              link.download = "recording.mp3";
              document.body.appendChild(link);
              link.click();
              mediaStream.getTracks().forEach((track) => track.stop());
              stopRecord.setAttribute("disabled", "");
              titleModal.classList.remove("hidden");
              countdown.classList.remove("animate-pulse");
              circleAnimate.classList.add("hidden");
              stopRecord.classList.add("cursor-not-allowed");

              // Limpiar chunks
              chunks = [];
              modal.hide();
            });
            mediaRecorder.stop();
          });
        } else {
          if (modal.isVisible()) {
            console.log(totalTime);
            totalTime -= 1;
            setTimeout(updateClock, 1000);
          } else {
            totalTime = 3;
          }
        }
      }

      updateClock();
    }
    if (screen.checked && mic.checked && cam.checked == false) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: { ideal: 60 } },
        });

        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        const combinedStream = new MediaStream([
          ...screenStream.getTracks(),
          ...audioStream.getTracks(),
        ]);

        const mediarecorder = new MediaRecorder(combinedStream, {
          mimeType: "video/webm;codecs=vp8,opus",
        });

        mediarecorder.start();

        const [video] = screenStream.getVideoTracks();
        video.addEventListener("ended", () => {
          mediarecorder.stop();
        });

        mediarecorder.addEventListener("dataavailable", (e) => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(e.data);
          link.download = "captura_con_audio.mp4";
          link.click();
        });
      } catch (error) {
        console.error("Error capturing screen and microphone:", error);
      }
    }
    if (cam.checked && screen.checked === false && mic.checked === false) {
      let chunks = [];
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const mediaStream = stream;
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.addEventListener("dataavailable", (event) => {
        chunks.push(event.data);
      });
      closed.addEventListener("click", () => {
        modal.hide();
        stopRecord.setAttribute("disabled", "");
        countdown.classList.remove("animate-pulse");
        stopRecord.classList.add("cursor-not-allowed");
        mediaRecorder.stop();
        mediaStream.getTracks().forEach((track) => track.stop());
        modal.isVisible();
        titleModal.classList.remove("hidden");
        circleAnimate.classList.add("hidden");
        video.classList.add("hidden");
      });
      modal.show();
      let totalTime = 3;

      function updateClock() {
        if (countdown) {
          countdown.innerHTML = totalTime.toString();
        }

        if (totalTime === 0 && modal.isVisible()) {
          console.log("grabando");
          video.classList.remove("hidden");
          video.srcObject = mediaStream;
          video.onloadedmetadata = (ev) => video.play();
          circleAnimate.classList.remove("hidden");
          titleModal.classList.add("hidden");
          countdown.classList.add("animate-pulse");
          countdown.innerHTML = "Grabando...";
          stopRecord.classList.remove("cursor-not-allowed");
          stopRecord.removeAttribute("disabled");
          mediaRecorder.start();
          stopRecord.addEventListener("click", () => {
            mediaRecorder.addEventListener("stop", () => {
              // Código para descargar
              const audioBlob = new Blob(chunks, { type: "video/mp4" });
              const audioUrl = URL.createObjectURL(audioBlob);
              const link = document.createElement("a");
              link.href = audioUrl;
              link.download = "recording.mp4";
              document.body.appendChild(link);
              link.click();
              mediaStream.getTracks().forEach((track) => track.stop());
              stopRecord.setAttribute("disabled", "");
              titleModal.classList.remove("hidden");
              countdown.classList.remove("animate-pulse");
              circleAnimate.classList.add("hidden");
              stopRecord.classList.add("cursor-not-allowed");
              video.classList.add("hidden");

              // Limpiar chunks
              chunks = [];
              modal.hide();
            });
            mediaRecorder.stop();
          });
        } else {
          if (modal.isVisible()) {
            console.log(totalTime);
            totalTime -= 1;
            setTimeout(updateClock, 1000);
          } else {
            totalTime = 3;
          }
        }
      }

      updateClock();
    }
    if (cam.checked && screen.checked === false && mic.checked) {
      let chunks = [];
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const mediaStream = stream;
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.addEventListener("dataavailable", (event) => {
        chunks.push(event.data);
      });
      //cierra el modal
      closed.addEventListener("click", () => {
        modal.hide();
        stopRecord.setAttribute("disabled", "");
        countdown.classList.remove("animate-pulse");
        stopRecord.classList.add("cursor-not-allowed");
        mediaRecorder.stop();
        mediaStream.getTracks().forEach((track) => track.stop());
        titleModal.classList.remove("hidden");
        circleAnimate.classList.add("hidden");
        video.classList.add("hidden");
      });

      modal.show();
      let totalTime = 3;

      function updateClock() {
        if (countdown) {
          countdown.innerHTML = totalTime.toString();
        }

        if (totalTime === 0 && modal.isVisible()) {
          video.classList.remove("hidden");
          video.srcObject = mediaStream;
          video.onloadedmetadata = (ev) => video.play();
          circleAnimate.classList.remove("hidden");
          titleModal.classList.add("hidden");
          countdown.classList.add("animate-pulse");
          countdown.innerHTML = "Grabando...";
          stopRecord.classList.remove("cursor-not-allowed");
          stopRecord.removeAttribute("disabled");
          mediaRecorder.start();
          stopRecord.addEventListener("click", () => {
            mediaRecorder.addEventListener("stop", () => {
              // Código para descargar
              const audioBlob = new Blob(chunks, { type: "video/mp4" });
              const audioUrl = URL.createObjectURL(audioBlob);
              const link = document.createElement("a");
              link.href = audioUrl;
              link.download = "recording.mp4";
              document.body.appendChild(link);
              link.click();
              mediaStream.getTracks().forEach((track) => track.stop());
              stopRecord.setAttribute("disabled", "");
              titleModal.classList.remove("hidden");
              countdown.classList.remove("animate-pulse");
              circleAnimate.classList.add("hidden");
              stopRecord.classList.add("cursor-not-allowed");
              video.classList.add("hidden");

              // Limpiar chunks
              chunks = [];
              modal.hide();
            });
            mediaRecorder.stop();
          });
        } else {
          if (modal.isVisible()) {
            console.log(totalTime);
            totalTime -= 1;
            setTimeout(updateClock, 1000);
          } else {
            totalTime = 3;
          }
        }
      }

      updateClock();
    }
    //retomar desde aquí
    if (screen.checked && cam.checked && mic.checked == false) {
      modalTwo.show();
      const startRecord = document.getElementById("stop");
      const stopRecord = document.getElementById("stopdos");
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const media = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 60 } },
      });
      const mediaStream = media;
      const context = canvas.getContext("2d");
      const videoElement = document.createElement("video");
      videoElement.srcObject = media;
      videoElement.autoplay = true;
      const video2 = document.createElement("video");
      video2.srcObject = cameraStream;
      video2.autoplay = true;
      videoElement.addEventListener("loadedmetadata", function () {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
      });
      videoElement.addEventListener("loadeddata", function () {
        video2.addEventListener("loadeddata", function () {
          requestAnimationFrame(draw);
        });
      });
      function draw() {
        // Dibuja el fotograma actual del video en el canvas
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Vuelve a llamar a la función para el siguiente cuadro de animación
        const cameraWidth = 160; // ajusta el ancho de la cámara según tus preferencias
        const cameraHeight =
          (cameraWidth / video2.videoWidth) * video2.videoHeight;
        context.drawImage(video2, 10, 10, cameraWidth, cameraHeight);

        // Vuelve a llamar a la función para el siguiente cuadro de animación
        requestAnimationFrame(draw);
      }
      let mediaRecorder;
      let recordedBlobs;
      startRecord.addEventListener("click", () => {
        console.log("Grabando");
        const stream = canvas.captureStream();

        // Iniciar MediaRecorder
        recordedBlobs = [];
        mediaRecorder = new MediaRecorder(stream);

        // Manejar datos grabados
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedBlobs.push(event.data);
          }
        };

        // Iniciar grabación
        mediaRecorder.start();
        startRecord.innerHTML = "Terminar Grabación";
      });
      stopRecord.addEventListener("click", () => {
        console.log("Terminó la grabación");
        mediaRecorder.stop();

        // Descargar el video grabado
        const blob = new Blob(recordedBlobs, { type: "video/mp4" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "canvas.mp4";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
      });
    }
  });
};
