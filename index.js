const $button = document.querySelector('button')

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