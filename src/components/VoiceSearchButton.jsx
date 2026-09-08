import { Mic } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

function VoiceSearchButton({ disabled, onResult, onError, onBusyChange }) {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => () => {
    const recognition = recognitionRef.current
    if (recognition) {
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
      recognition.abort()
    }
  }, [])

  function startListening() {
    if (isListening) { recognitionRef.current?.abort(); return }
    if (disabled) return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      onError('Voice search is not supported in this browser. Please type a city name.')
      return
    }
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.lang = navigator.language || 'en-US'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    let receivedResult = false
    let failed = false
    recognition.onresult = (event) => {
      const text = event.results[0]?.[0]?.transcript?.trim()
      if (text?.length >= 2) { receivedResult = true; onResult(text) }
      else { failed = true; onError('No city name was recognized. Please try again.') }
    }
    recognition.onerror = (event) => {
      failed = true
      if (event.error === 'aborted') return
      const messages = {
        'not-allowed': 'Microphone access was denied. Allow it in your browser settings or type the city.',
        'service-not-allowed': 'The browser could not access its speech recognition service.',
        'audio-capture': 'No working microphone was found.',
        'no-speech': 'No speech was detected. Please try again.',
        network: 'Speech recognition needs a connection. Try again or type the city.',
      }
      onError(messages[event.error] || 'Voice search failed. Please try again or type the city.')
    }
    recognition.onend = () => {
      setIsListening(false)
      onBusyChange(false)
      if (!receivedResult && !failed) onError('No city name was recognized. Please try again.')
      recognitionRef.current = null
    }
    try {
      setIsListening(true)
      onBusyChange(true)
      recognition.start()
    } catch {
      setIsListening(false)
      onBusyChange(false)
      onError('Could not start the microphone. Please try again.')
    }
  }

  return (
    <button type="button" onClick={startListening} disabled={disabled && !isListening}
      aria-label={isListening ? 'Stop voice search' : 'Search by voice'} aria-pressed={isListening}
      title={isListening ? 'Stop listening' : 'Search by voice · Browser language'}
      className={'absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-sky-400 disabled:opacity-40 ' + (isListening ? 'bg-red-400/15 text-red-300' : 'text-slate-400 hover:bg-sky-300/10 hover:text-sky-300')}
    >
      <Mic aria-hidden="true" className={'h-5 w-5 ' + (isListening ? 'animate-pulse motion-reduce:animate-none' : '')} />
    </button>
  )
}

export default VoiceSearchButton
