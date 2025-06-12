import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { useAccessStore } from '@/store/useAccessStore'

interface ScanPassWithCameraModalProps {
  title: string
  children: React.ReactNode
}

export const ScanPassWithCameraModal: React.FC<
  ScanPassWithCameraModalProps
> = ({ title, children }: ScanPassWithCameraModalProps) => {
  const [open, setOpen] = useState(false)
  const { setPassCode } = useAccessStore()
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const cameraContainerId = 'qr-reader'

  const handleSetPassCode = useCallback(
    (newPassCode: string) => {
      setPassCode(newPassCode)
      setOpen(false)
    },
    [setPassCode]
  )

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null
    let html5QrCode: Html5Qrcode | null = null

    if (open) {
      timeout = setTimeout(() => {
        const element = document.getElementById(cameraContainerId)
        if (element) {
          html5QrCode = new Html5Qrcode(cameraContainerId)
          scannerRef.current = html5QrCode

          Html5Qrcode.getCameras()
            .then((devices) => {
              if (devices && devices.length > 0) {
                const cameraId = devices[0].id
                html5QrCode!.start(
                  cameraId,
                  {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                  },
                  (decodedText) => {
                    handleSetPassCode(decodedText)
                  },
                  (errorMessage) => {
                    if (!errorMessage.includes('NotFoundException')) {
                      console.error('QR scanner error:', errorMessage)
                    }
                  }
                )
              }
            })
            .catch((err) => {
              console.error('Error getting cameras:', err)
            })
        }
      }, 300) // 300ms suele ser suficiente

      return () => {
        if (timeout) clearTimeout(timeout)
        if (scannerRef.current) {
          scannerRef.current
            .stop()
            .then(() => scannerRef.current?.clear())
            .catch((err) => {
              // Solo loguea si el error no es "scanner is not running"
              if (!String(err).includes('scanner is not running')) {
                console.error('Error stopping scanner:', err)
              }
            })
        }
      }
    }
  }, [open, handleSetPassCode])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className='max-w-xl'
        aria-describedby='add-note-description'>
        <DialogHeader>
          <DialogTitle className='text-2xl text-center font-bold my-5'>
            {title}
          </DialogTitle>
          <DialogDescription id='add-note-description' className='text-center'>
            Muestra el código QR del pase a escanear.
          </DialogDescription>
        </DialogHeader>

        <div
          id={cameraContainerId}
          style={{
            width: '100%',
            maxWidth: '400px',
            height: '300px',
            margin: '20px auto',
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
