import { Modal } from "flowbite";
import Toastify from "toastify-js";
import "flowbite";
import type { ModalOptions, ModalInterface } from "flowbite";
import type { InstanceOptions } from "flowbite";

window.onload = () => {
  const $modalElement: HTMLElement = document.querySelector("#modalEl");
  const stopRecord = document.getElementById("stop-record") as HTMLElement;
  const screen = document.getElementById("screen-option") as HTMLInputElement;
  const mic = document.getElementById("mic-option") as HTMLInputElement;
  const closed = document.getElementById("closed") as HTMLElement;
  const video = document.getElementById("video") as HTMLVideoElement;
  const countdown = document.getElementById("countdown");
  const $button = document.getElementById("recorder")!;
  const titleModal = document.getElementById("title-modal");
  const circleAnimate = document.getElementById("circle-animate");

  //opciones del modal
  const modalOptions: ModalOptions = {
    placement: "center",
    backdrop: "static",
    backdropClasses: "bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40",
    closable: false,
  };
  const instanceOptions: InstanceOptions = {
    id: "modalEl",
    override: true,
  };

  //evento que se ejecuta cuando se clickea en el botón de "grabar"
  $button.addEventListener("click", async () => {
    const modal: ModalInterface = new Modal(
      $modalElement,
      modalOptions,
      instanceOptions
    );
    //si no se selecciona ninguna opción se lanza un toast de adventencia.
    if (screen.checked == false && mic.checked == false) {
      Toastify({
        text: "Seleccione al menos una opcion .",
        duration: 1500,
        newWindow: true,
        close: false,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #f25f4c, #ff8906)",
        },
        onClick: function () {},
      }).showToast();
    }

    //Evento que se ejecuta cuando se selecciona la opción de grabar "Pantalla"
    if (screen.checked && mic.checked === false) {
      const media = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 60 } },
      });
      const mediarecorder = new MediaRecorder(media, {
        mimeType: "video/webm;codecs=vp9",
      });
      mediarecorder.start();

      const [video] = media.getVideoTracks();
      video.addEventListener("ended", () => {
        mediarecorder.stop();
      });

      mediarecorder.addEventListener("dataavailable", async (e) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(e.data);
        link.download = "captura.webm";
        link.click();
      });
    }
    //Evento que se ejecuta cuando se selecciona la opción de grabar "Microfono"
    if (mic.checked && screen.checked === false) {
      let chunks = [];
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const mediaStream = stream;
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.addEventListener("dataavailable", (event) => {
        chunks.push(event.data);
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
    }
    //Evento que se ejecuta cuando se selecciona la opción de grabar "Pantalla y Microfono"
    if (screen.checked && mic.checked) {
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

    //Funciones aun no realizadas
  });
};
