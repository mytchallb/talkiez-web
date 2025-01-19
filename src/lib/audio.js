import * as lamejs from "@breezystack/lamejs"

export class AudioRecorder {
  constructor() {
    this.mediaRecorder = null
    this.audioChunks = []
    this.stream = null
  }

  async init() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 48000,
          sampleSize: 24,
          channelCount: 1,
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          latency: 0,
        },
      })

      const mimeType = this.getBestAudioType()
      if (!mimeType) {
        throw new Error("No supported audio format found")
      }

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType,
        bitsPerSecond: 256000,
      })

      console.log(`Recording initialized using: ${mimeType}`)
      return true
    } catch (err) {
      console.error("Error initializing recorder:", err)
      return false
    }
  }

  getBestAudioType() {
    const types = ["audio/webm", "audio/mp4", "audio/ogg", "audio/wav"]
    return types.find((type) => MediaRecorder.isTypeSupported(type))
  }

  async startRecording(onDataAvailable) {
    if (!this.mediaRecorder || this.mediaRecorder.state === "recording") return

    this.audioChunks = []
    this.mediaRecorder.ondataavailable = (event) => {
      this.audioChunks.push(event.data)
      if (onDataAvailable) onDataAvailable(event.data)
    }

    this.mediaRecorder.start(10) // Collect data every 10ms for smoother processing
    console.log("Recording started")
  }

  downloadRawAudio(rawAudioBlob) {
    // Download raw audio file
    const rawUrl = URL.createObjectURL(rawAudioBlob)
    const a = document.createElement("a")
    a.href = rawUrl
    a.download = `raw-recording-${new Date().getTime()}.webm` // or .wav depending on mimeType
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(rawUrl)
  }

  async stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state !== "recording") {
        resolve(null)
        return
      }

      this.mediaRecorder.onstop = async () => {
        try {
          console.log("Recording stopped, saving raw audio...")
          const rawAudioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder.mimeType })

          // this.downloadRawAudio(rawAudioBlob)

          console.log("Raw audio size:", Math.round(rawAudioBlob.size / 1024), "KB")
          console.log("Starting MP3 conversion...")

          const mp3Blob = await this.convertToMp3(rawAudioBlob)
          resolve(mp3Blob)
        } catch (err) {
          console.error("Error in stop recording:", err)
          reject(err)
        }
      }

      this.mediaRecorder.stop()
      this.stream.getTracks().forEach((track) => track.stop())
    })
  }

  async convertToMp3(audioBlob) {
    try {
      console.log("Starting MP3 conversion...")

      // Get the raw audio data
      const arrayBuffer = await audioBlob.arrayBuffer()
      const audioContext = new AudioContext()
      const audioData = await audioContext.decodeAudioData(arrayBuffer)

      // Get audio parameters
      const channels = 1
      const sampleRate = audioData.sampleRate

      // Get raw samples and convert to Int16
      const samples = audioData.getChannelData(0)
      const int16Samples = new Int16Array(samples.length)
      for (let i = 0; i < samples.length; i++) {
        int16Samples[i] = samples[i] * 0x7fff
      }

      // Encode to MP3
      const buffer = []
      const mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128)
      const maxSamples = 1152
      let remaining = int16Samples.length

      console.log("Encoding MP3...")
      console.log("Sample length:", int16Samples.length)
      console.log("Sample rate:", sampleRate)

      // Process samples in chunks
      for (let i = 0; remaining >= maxSamples; i += maxSamples) {
        const mono = int16Samples.subarray(i, i + maxSamples)
        const mp3buf = mp3enc.encodeBuffer(mono)
        if (mp3buf.length > 0) {
          buffer.push(new Int8Array(mp3buf))
        }
        remaining -= maxSamples
      }

      // Flush the encoder
      const d = mp3enc.flush()
      if (d.length > 0) {
        buffer.push(new Int8Array(d))
      }

      const mp3Blob = new Blob(buffer, { type: "audio/mp3" })
      console.log("MP3 conversion complete. File size:", Math.round(mp3Blob.size / 1024), "KB")

      // Test the audio before returning
      const url = URL.createObjectURL(mp3Blob)
      console.log("MP3 URL:", url)

      return mp3Blob
    } catch (err) {
      console.error("Error in MP3 conversion:", err)
      throw err
    }
  }

  downloadFile(blob) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `recording-${new Date().getTime()}.mp3`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}
