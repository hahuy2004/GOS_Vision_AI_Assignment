import { useState, useRef } from 'react'
import './App.css'

interface PredictionResult {
  class: string
  confidence: number
  raw_prediction: number
}

interface ApiResponse {
  success: boolean
  filename: string
  prediction: PredictionResult
}

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
      setPrediction(null)
      
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first')
      return
    }

    setIsLoading(true)
    setError(null)
    setPrediction(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

    // Chọn URL backend phù hợp
    const apiUrl = 'http://localhost:8000';
    // const apiUrl = 'https://gos-vision-be.onrender.com';
    const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to get prediction')
      }

      const data: ApiResponse = await response.json()
      setPrediction(data.prediction)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setPrediction(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#4CAF50' // Green
    if (confidence >= 0.6) return '#FF9800' // Orange
    return '#F44336' // Red
  }

  return (
    <div className="app">
      <div className="container">
        <h1>🐱 Dog & Cat Classifier 🐶</h1>
        <p className="subtitle">Tải ảnh lên để biết ảnh đó là chó hay mèo</p>
        
        <div className="upload-section">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="file-input"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="file-label">
            📁 Chọn ảnh
          </label>
          
          {selectedFile && (
            <div className="file-info">
              <span>Đã chọn: {selectedFile.name}</span>
              <button onClick={handleClear} className="clear-btn">✕</button>
            </div>
          )}
        </div>

        {previewUrl && (
          <div className="preview-section">
            <h3>Xem trước:</h3>
            <img src={previewUrl} alt="Xem trước" className="preview-image" />
          </div>
        )}

        <div className="action-section">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isLoading}
            className={`predict-btn ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? '🔄 Đang phân tích...' : '🔍 Dự đoán'}
          </button>
        </div>

        {error && (
          <div className="error-section">
            <h3>❌ Lỗi:</h3>
            <p>{error}</p>
          </div>
        )}

        {prediction && (
          <div className="result-section">
            <h3>🎯 Kết quả dự đoán:</h3>
            <div className="result-card">
              <div className="result-animal">
                <span className="animal-emoji">
                  {prediction.class === 'dog' ? '🐶' : '🐱'}
                </span>
                <span className="animal-name">
                  {prediction.class.toUpperCase()}
                </span>
              </div>
              <div className="confidence-bar">
                <div className="confidence-label">
                  Độ tin cậy: {(prediction.confidence * 100).toFixed(1)}%
                </div>
                <div className="confidence-progress">
                  <div
                    className="confidence-fill"
                    style={{
                      width: `${prediction.confidence * 100}%`,
                      backgroundColor: getConfidenceColor(prediction.confidence)
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
