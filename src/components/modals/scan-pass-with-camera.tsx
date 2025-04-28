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
    if (open) {
      const interval = setInterval(() => {
        const element = document.getElementById(cameraContainerId)
        if (element) {
          clearInterval(interval)

          const html5QrCode = new Html5Qrcode(cameraContainerId)
          scannerRef.current = html5QrCode

          Html5Qrcode.getCameras()
            .then((devices) => {
              if (devices && devices.length > 0) {
                const cameraId = devices[0].id
                html5QrCode.start(
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
      }, 100)

      return () => {
        clearInterval(interval)
        if (scannerRef.current) {
          scannerRef.current
            .stop()
            .then(() => scannerRef.current?.clear())
            .catch((err) => console.error('Error stopping scanner:', err))
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
