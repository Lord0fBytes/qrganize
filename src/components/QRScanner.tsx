'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { useRouter } from 'next/navigation'

interface QRScannerProps {
  legacyDomain?: string | null
}

export function QRScanner({ legacyDomain }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastScanned, setLastScanned] = useState<string | null>(null)

  // Detect iOS Safari and default to file mode
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
  }

  const [scanMode, setScanMode] = useState<'camera' | 'file'>(
    isIOS() ? 'file' : 'camera'
  )
  const router = useRouter()

  useEffect(() => {
    // Only try camera if not iOS
    if (!isIOS()) {
      startScanner()
    }

    return () => {
      stopScanner()
    }
  }, [])

  const startScanner = async () => {
    try {
      setError(null)
      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' }, // Use back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        onScanSuccess,
        onScanFailure
      )

      setIsScanning(true)
      setScanMode('camera')
    } catch (err) {
      console.error('Error starting scanner:', err)
      // Switch to file mode if camera fails
      setScanMode('file')
      setError('Camera not available. Please upload a QR code image instead.')
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop()
        scannerRef.current.clear()
      } catch (err) {
        console.error('Error stopping scanner:', err)
      }
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setError(null)
      setLastScanned(null)

      // Create scanner instance
      const scanner = new Html5Qrcode('qr-reader-file')

      // Scan with show image enabled to help with debugging
      const result = await scanner.scanFile(file, true)
      onScanSuccess(result)
    } catch (err) {
      console.error('Error scanning file:', err)
      setError('Could not read QR code from image. Please try:\n• Taking photo in better lighting\n• Getting closer to the QR code\n• Ensuring the QR code is in focus\n• Using a QRganize-generated code')
    }
  }

  const onScanSuccess = (decodedText: string) => {
    setLastScanned(decodedText)

    // Check if the scanned text is a URL from this app
    try {
      const url = new URL(decodedText)
      const currentOrigin = window.location.origin

      // Check if it's from current origin OR legacy domain
      const isCurrentDomain = url.origin === currentOrigin
      const isLegacyDomain = legacyDomain && url.origin === legacyDomain

      if (isCurrentDomain || isLegacyDomain) {
        // It's a QRganize URL - navigate to it
        const path = url.pathname
        stopScanner().then(() => {
          router.push(path)
        })
      } else {
        // External URL - show warning
        setError(`This QR code points to an external URL: ${decodedText}`)
      }
    } catch (err) {
      // Not a valid URL
      setError(`Invalid QR code format: ${decodedText}`)
    }
  }

  const onScanFailure = (errorMessage: string) => {
    // Ignore scan failures - they happen constantly while scanning
    // Only log actual errors, not "No QR code found"
    if (!errorMessage.includes('NotFoundException')) {
      console.log('Scan error:', errorMessage)
    }
  }

  const handleRetry = () => {
    setError(null)
    setLastScanned(null)
    if (scanMode === 'camera') {
      startScanner()
    }
  }

  const handleSwitchMode = () => {
    if (scanMode === 'camera') {
      stopScanner()
      setScanMode('file')
      setError(null)
    } else {
      setScanMode('camera')
      startScanner()
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-md">
        {/* Mode switcher */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => handleSwitchMode()}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              scanMode === 'camera'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            📷 Camera
          </button>
          <button
            onClick={() => handleSwitchMode()}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              scanMode === 'file'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            🖼️ Upload Image
          </button>
        </div>

        {/* Scanner container - Camera mode */}
        {scanMode === 'camera' && (
          <div className="relative bg-black rounded-lg overflow-hidden">
            <div id="qr-reader" className="w-full" />

            {!isScanning && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p>Starting camera...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* File upload mode */}
        {scanMode === 'file' && (
          <div className="bg-slate-800 rounded-lg p-8 text-center border-2 border-dashed border-slate-600">
            <div id="qr-reader-file" className="hidden" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
              id="qr-file-input"
            />
            <label
              htmlFor="qr-file-input"
              className="cursor-pointer flex flex-col items-center"
            >
              <div className="text-6xl mb-4">📸</div>
              <p className="text-slate-200 font-medium mb-2">
                Tap to select QR code image
              </p>
              <p className="text-sm text-slate-400">
                Choose from camera roll or take a photo
              </p>
            </label>
          </div>
        )}

        {/* Status messages */}
        {isScanning && scanMode === 'camera' && !error && (
          <div className="mt-4 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg text-center">
            <p className="text-blue-300 font-medium">📷 Camera active</p>
            <p className="text-blue-400 text-sm mt-1">
              Point your camera at a QR code to scan
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg">
            <p className="text-red-300 font-medium mb-2">⚠️ Error</p>
            <p className="text-red-400 text-sm mb-3">{error}</p>
            {scanMode === 'camera' && (
              <button
                onClick={handleRetry}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {lastScanned && !error && (
          <div className="mt-4 p-4 bg-emerald-900/30 border border-emerald-700/50 rounded-lg">
            <p className="text-emerald-300 font-medium mb-2">✓ Scanned successfully</p>
            <p className="text-emerald-400 text-sm break-all">{lastScanned}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-slate-800 border border-slate-700 rounded-lg">
          <h3 className="font-medium text-slate-200 mb-2">Tips:</h3>
          {scanMode === 'camera' ? (
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Hold your device steady</li>
              <li>• Ensure good lighting</li>
              <li>• Keep the QR code within the frame</li>
              <li>• Only QRganize codes will work</li>
            </ul>
          ) : (
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Take a clear photo of the QR code</li>
              <li>• Ensure good lighting and focus</li>
              <li>• Avoid glare or shadows</li>
              <li>• Only QRganize codes will work</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
