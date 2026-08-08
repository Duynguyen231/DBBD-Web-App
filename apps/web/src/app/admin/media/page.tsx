'use client'
import { useEffect, useState, useRef } from 'react'
import apiClient from '@/lib/api'
import { Upload, Trash2, Copy, Check, Image as ImageIcon, AlertCircle, X } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf']

export default function AdminMediaPage() {
  const [items, setItems] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = () => { apiClient.get('/media').then(r => setItems(r.data)).catch(()=>{}) }
  useEffect(() => { load() }, [])

  const upload = async (files: FileList | null) => {
    if(!files?.length) return
    
    // Validate files before upload
    const validationErrors: string[] = []
    const validFiles: File[] = []
    
    for (const file of Array.from(files)) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        validationErrors.push(`${file.name}: Kích thước vượt quá 10MB (${(file.size / 1024 / 1024).toFixed(1)}MB)`)
        continue
      }
      
      // Check file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        validationErrors.push(`${file.name}: Định dạng không được hỗ trợ (${file.type})`)
        continue
      }
      
      validFiles.push(file)
    }
    
    // Show validation errors
    if (validationErrors.length > 0) {
      setError(validationErrors.join('\n'))
      return
    }
    
    if (validFiles.length === 0) return
    
    setUploading(true)
    setError(null)
    let successCount = 0
    let failCount = 0
    
    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]
        setCurrentFile(`${file.name} (${i + 1}/${validFiles.length})`)
        setUploadProgress(0)
        
        try {
          const fd = new FormData()
          fd.append('file', file)
          
          await apiClient.post('/media/upload', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
              )
              setUploadProgress(percentCompleted)
            },
          })
          
          successCount++
        } catch (err: any) {
          failCount++
          console.error(`Failed to upload ${file.name}:`, err)
        }
      }
      
      // Show result
      if (failCount > 0) {
        setError(`Tải lên hoàn tất: ${successCount} thành công, ${failCount} thất bại`)
      }
      
      load()
      
      // Reset input
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    } finally {
      setUploading(false)
      setUploadProgress(0)
      setCurrentFile('')
    }
  }

  const del = async (id: number) => { if(confirm('Xóa file?')){ await apiClient.delete(`/media/${id}`); load() } }

  const copyUrl = (item: any) => {
    const url = getImageUrl(item.url)
    navigator.clipboard.writeText(url)
    setCopied(item.id)
    setTimeout(() => setCopied(null), 2000)
  }

  const isImage = (name: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name)

  return (
    <div>
      {/* Error Alert */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-red-900 mb-1">Lỗi tải lên</h3>
            <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý Media</h1>
        <div>
          <p className="text-xs text-gray-500 mb-2 text-right">
            Tối đa 10MB • JPG, PNG, GIF, WebP, SVG, PDF
          </p>
          <button onClick={() => inputRef.current?.click()} disabled={uploading}
            className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-[var(--primary-dark)] transition-colors">
            <Upload className="w-4 h-4" /> {uploading ? 'Đang tải...' : 'Tải lên'}
          </button>
        </div>
        <input ref={inputRef} type="file" multiple accept="image/*,.pdf" className="hidden" onChange={e => upload(e.target.files)} />
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map(i => (
          <div key={i.id} className="bg-white border rounded-xl overflow-hidden group hover:shadow-md transition-shadow">
            <div className="h-32 bg-gray-100 flex items-center justify-center">
              {isImage(i.filename) ? <img src={getImageUrl(i.url)} alt={i.filename} className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-gray-300" />}
            </div>
            <div className="p-3">
              <p className="text-xs font-medium truncate" title={i.filename}>{i.filename}</p>
              <p className="text-xs text-gray-400">{(i.size / 1024).toFixed(0)} KB</p>
              <div className="flex gap-1 mt-2">
                <button onClick={() => copyUrl(i)} className="p-1 text-gray-500 hover:bg-gray-100 rounded" title="Sao chép URL">
                  {copied === i.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => del(i.id)} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Xóa"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !uploading && (
        <div className="bg-white border rounded-xl p-12 text-center text-gray-400 mt-6">
          <Upload className="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <p>Chưa có file nào. Nhấn "Tải lên" để bắt đầu.</p>
        </div>
      )}

      {/* Upload Progress Modal */}
      {uploading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Upload className="w-5 h-5 text-blue-600 animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Đang tải lên</h3>
                <p className="text-sm text-gray-500 truncate">{currentFile}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Tiến độ</span>
                <span className="font-medium text-gray-900">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Vui lòng không đóng trang này...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
