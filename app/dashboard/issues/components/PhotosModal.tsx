'use client'

import { useState, useCallback, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface PhotosModalProps {
  isOpen: boolean
  onClose: () => void
  photos: string[]
  onUpdatePhotos: (updatedPhotos: string[]) => void
}

export default function PhotosModal({ isOpen, onClose, photos, onUpdatePhotos }: PhotosModalProps) {
  const [tempPhotos, setTempPhotos] = useState<string[]>(photos)
  const [isDragging, setIsDragging] = useState(false)

  const handleSave = () => {
    onUpdatePhotos(tempPhotos)
    onClose()
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newPhotos = acceptedFiles.map((file) => URL.createObjectURL(file))
      setTempPhotos((prevPhotos) => [...prevPhotos, ...newPhotos])
    },
    [setTempPhotos],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
    noClick: true,
  })

  const handleDeletePhoto = (index: number) => {
    setTempPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index))
  }

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const blob = items[i].getAsFile()
            if (blob) {
              const reader = new FileReader()
              reader.onload = (e) => {
                if (e.target?.result) {
                  setTempPhotos([...tempPhotos, e.target.result as string])
                }
              }
              reader.readAsDataURL(blob)
            }
          }
        }
      }
    }

    window.addEventListener("paste", handlePaste)
    return () => {
      window.removeEventListener("paste", handlePaste)
    }
  }, [tempPhotos, setTempPhotos])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Photos</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 my-4">
          {tempPhotos.map((photo, index) => (
            <div key={index} className="relative">
              <img
                src={photo || "/placeholder.svg"}
                alt={`Photo ${index + 1}`}
                className="w-full h-32 object-cover rounded"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1"
                onClick={() => handleDeletePhoto(index)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 transition-colors ${
            isDragging ? "border-primary bg-primary/10" : "border-gray-300"
          }`}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={() => setIsDragging(false)}
        >
          <input {...getInputProps()} id="fileInput" />
          <p className="text-sm text-gray-500 mb-2">Drag 'n' drop photos here, or click to select files</p>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              document.getElementById("fileInput")?.click()
            }}
            className="mb-2"
          >
            Select Files
          </Button>
          <p className="text-xs text-gray-400">You can also paste images directly</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

