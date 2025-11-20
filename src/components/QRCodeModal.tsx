'use client'

import { useState } from 'react'
import QRCode from 'qrcode'

interface QRCodeModalProps {
  path: string
  label?: string
}

export function QRCodeModal({ path, label = 'QR Code' }: QRCodeModalProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const [isOpen, setIsOpen] = useState(false)

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
      setIsOpen(true)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const handleButtonClick = () => {
    if (!qrCodeDataUrl) {
      generateQRCode()
    } else {
      setIsOpen(true)
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
    <>
      {/* QR Code Button */}
      <button
        onClick={handleButtonClick}
        className="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        title="Generate QR Code"
        aria-label="Generate QR Code"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{label}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* QR Code Display */}
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
              <div className="flex gap-3 w-full">
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
                  {copyStatus === 'copied' ? 'Copied!' : copyStatus === 'error' ? 'Error' : 'Copy'}
                </button>
              </div>

              {/* Helper Text */}
              <p className="text-sm text-gray-500 text-center">
                Scan this QR code to quickly navigate to this {path.startsWith('/location') ? 'location' : 'item'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
