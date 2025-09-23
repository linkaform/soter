import React, { useEffect, useRef, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { useAccessStore } from '@/store/useAccessStore'

interface ScanPassWithCameraModalProps {
  title: string
  open: boolean
  setOpen: (open: boolean) => void
}

export const ScanPassWithCameraModal: React.FC<ScanPassWithCameraModalProps> = ({
  title,
  open,
  setOpen,
}) => {
  const { setPassCode } = useAccessStore()
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scannerStartedRef = useRef(false)
  const cameraContainerId = 'qr-reader'
  const isMounted = useRef(true)

  const handleSetPassCode = useCallback(
    (newPassCode: string) => {
      setPassCode(newPassCode)
      setOpen(false)
    },
    [setPassCode, setOpen]
  )

  useEffect(() => {
    isMounted.current = true
    let timeout: NodeJS.Timeout | null = null
    let html5QrCode: Html5Qrcode | null = null

    if (open) {
      scannerStartedRef.current = false
      timeout = setTimeout(() => {
        if (!isMounted.current) return
        const element = document.getElementById(cameraContainerId)
        if (!element) return
        html5QrCode = new Html5Qrcode(cameraContainerId)
        scannerRef.current = html5QrCode

        Html5Qrcode.getCameras()
          .then((devices) => {
            if (devices && devices.length > 0) {
              html5QrCode!.start(
                { facingMode: 'environment' },
                {
                  fps: 10,
                  qrbox: { width: 250, height: 250 },
                },
                (decodedText) => {
                  handleSetPassCode(decodedText)
                },
                () => {}
              ).then(() => {
                scannerStartedRef.current = true
              })
            }
          })
          .catch((err) => {
            console.log('Error getting cameras:', err)
          })
      }, 300)

      return () => {
        isMounted.current = false
        if (timeout) clearTimeout(timeout)
        if (scannerRef.current && scannerStartedRef.current) {
          scannerRef.current
            .stop()
            .then(() => scannerRef.current?.clear())
            .catch((err) => {
              if (!String(err).includes('scanner is not running')) {
                console.error('Error stopping scanner:', err)
              }
            })
        } else if (scannerRef.current) {
          scannerRef.current.clear()
        }
      }
    }
  }, [open, handleSetPassCode])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='max-w-xl' aria-describedby='add-note-description'>
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
