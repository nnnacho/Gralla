
const $button = document.getElementById('btn-screen')

$button.addEventListener('click', async () => {
    
  const media = await navigator.mediaDevices.getDisplayMedia({
    video: { frameRate: { ideal: 60 } }
  })
  const mediarecorder = new MediaRecorder(media, {
    mimeType: 'video/webm;codecs=vp8,opus'
  })
  mediarecorder.start()

  const [video] = media.getVideoTracks()
  video.addEventListener("ended", () => {
    mediarecorder.stop()
  })

  mediarecorder.addEventListener("dataavailable", (e) => {
    const link = document.createElement("a")
    link.href = URL.createObjectURL(e.data)
    link.download = "captura.mp4"
    link.click()
  })
})





// Referencias DOM
const startBtn = document.getElementById('start-record');
const stopBtn = document.getElementById('stop-record');

// Banderas
let isRecording = false;
let chunks = []; 


// Habilitar/deshabilitar botones
const toggleButtons = () => {
  startBtn.disabled = isRecording;
  stopBtn.disabled = !isRecording;
}

// Al hacer click en start
startBtn.addEventListener('click', async () => {
  isRecording = true;
  toggleButtons();

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  mediaStream = stream;
  const mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.addEventListener('dataavailable', event => {
    chunks.push(event.data);
  });

  mediaRecorder.start();
  stopBtn.addEventListener('click', () => {

    isRecording = false;
    toggleButtons();
  
    mediaRecorder.addEventListener('stop', () => {
        
      // Código para descargar    
      const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = 'recording.mp3';
      document.body.appendChild(link);
      link.click();
      mediaStream.getTracks().forEach(track => track.stop());
      
      // Limpiar chunks
      chunks = [];
  
    });
  
    mediaRecorder.stop();
  
  });
});

// Al hacer click en stop  


// Iniciar con botones deshabilitados
toggleButtons();