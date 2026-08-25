'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, Image, File, Trash2, Download, Eye } from 'lucide-react'

type Document = {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: Date
  content?: string
}

export function DocumentsView() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return
    
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newDoc: Document = {
          id: `doc_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date(),
          content: e.target?.result as string,
        }
        setDocuments((prev) => [newDoc, ...prev])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="size-5" />
    if (type.includes('pdf') || type.includes('text')) return <FileText className="size-5" />
    return <File className="size-5" />
  }

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
    if (selectedDoc?.id === id) setSelectedDoc(null)
  }

  const handleDownload = (doc: Document) => {
    const link = document.createElement('a')
    link.href = doc.content || ''
    link.download = doc.name
    link.click()
  }

  return (
    <div className="flex h-full w-full gap-4 overflow-hidden px-4 py-6 sm:px-6">
      {/* Documents List */}
      <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-heading text-2xl font-medium">Documents</h2>
            <p className="text-xs text-muted-foreground">Upload and manage your files</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Upload className="size-4" />
            <span className="hidden sm:inline">Upload</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="sr-only"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
        >
          <Upload className="mx-auto size-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Drag and drop files here, or click Upload
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Supports PDFs, images, and text files
          </p>
        </div>

        {/* Documents List */}
        <div className="space-y-2">
          {documents.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">No documents yet. Upload one to get started.</p>
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                  selectedDoc?.id === doc.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  {getFileIcon(doc.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(doc.size)} • {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDownload(doc) }}
                    className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    title="Download"
                  >
                    <Download className="size-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(doc.id) }}
                    className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    title="Delete"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Document Preview */}
      {selectedDoc && (
        <div className="hidden min-w-0 flex-1 flex-col gap-4 overflow-hidden rounded-lg border border-border bg-muted/30 p-4 lg:flex">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold truncate">{selectedDoc.name}</h3>
            <button
              onClick={() => setSelectedDoc(null)}
              className="rounded p-1 text-muted-foreground hover:bg-muted"
            >
              <Eye className="size-4" />
            </button>
          </div>
          <div className="flex-1 overflow-auto rounded bg-background p-4">
            {selectedDoc.type.startsWith('image/') && selectedDoc.content ? (
              <img src={selectedDoc.content} alt={selectedDoc.name} className="max-w-full h-auto" />
            ) : selectedDoc.type.includes('text') && selectedDoc.content ? (
              <pre className="text-xs whitespace-pre-wrap font-mono">{atob(selectedDoc.content.split(',')[1] || '')}</pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <File className="size-12 mb-2" />
                <p className="text-sm">Preview not available for this file type</p>
                <p className="text-xs">{selectedDoc.type}</p>
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Uploaded {new Date(selectedDoc.uploadedAt).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  )
}
