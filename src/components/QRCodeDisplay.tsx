'use client'

import { useState } from 'react'
import QRCode from 'qrcode'

interface QRCodeDisplayProps {
  path: string
  label?: string
}

export function QRCodeDisplay({ path, label = 'QR Code' }: QRCodeDisplayProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const [isVisible, setIsVisible] = useState(false)

  const generateQRCode = async () => {
    try {
      // Get the full URL (window.location.origin + path)
      const fullUrl = `${window.location.origin}${path}`

      // Generate QR code as data URL (base64 PNG)
      const dataUrl = await QRCode.toDataURL(fullUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      })

      setQrCodeDataUrl(dataUrl)
      setIsVisible(true)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const handleGenerateClick = () => {
    if (!qrCodeDataUrl) {
      generateQRCode()
    } else {
      setIsVisible(true)
    }
  }

  const handleDownload = () => {
    if (!qrCodeDataUrl) return

    // Create a temporary link element
    const link = document.createElement('a')
    link.href = qrCodeDataUrl

    // Extract type and id from path (e.g., /location/123 -> location-123)
    const fileName = `qrcode-${path.replace(/\//g, '-').substring(1)}.png`
    link.download = fileName

    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopyToClipboard = async () => {
    if (!qrCodeDataUrl) return

    try {
      // Convert data URL to blob
      const response = await fetch(qrCodeDataUrl)
      const blob = await response.blob()

      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])

      setCopyStatus('copied')
      setTimeout(() => setCopyStatus('idle'), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      setCopyStatus('error')
      setTimeout(() => setCopyStatus('idle'), 2000)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">{label}</h3>

      {!isVisible ? (
        /* Show Generate Button */
        <div className="flex flex-col items-center gap-3 py-8">
          <p className="text-gray-600 text-sm mb-2">
            Generate a QR code for quick access to this {path.startsWith('/location') ? 'location' : 'item'}
          </p>
          <button
            onClick={handleGenerateClick}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
          >
            Generate QR Code
          </button>
        </div>
      ) : (
        /* QR Code Display */
        <div className="flex flex-col items-center gap-4">
          {qrCodeDataUrl ? (
            <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
              <img
                src={qrCodeDataUrl}
                alt="QR Code"
                className="w-64 h-64"
              />
            </div>
          ) : (
            <div className="w-64 h-64 border-2 border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
              <p className="text-gray-400">Generating QR code...</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 w-full max-w-md">
            <button
              onClick={handleDownload}
              disabled={!qrCodeDataUrl}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Download PNG
            </button>

            <button
              onClick={handleCopyToClipboard}
              disabled={!qrCodeDataUrl}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {copyStatus === 'copied' ? 'Copied!' : copyStatus === 'error' ? 'Error' : 'Copy to Clipboard'}
            </button>
          </div>

          {/* Helper Text */}
          <p className="text-sm text-gray-500 text-center">
            Scan this QR code to quickly navigate to this {path.startsWith('/location') ? 'location' : 'item'}
          </p>

          {/* Hide Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Hide QR Code
          </button>
        </div>
      )}
    </div>
  )
}
