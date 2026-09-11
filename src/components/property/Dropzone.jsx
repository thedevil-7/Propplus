import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Star, CheckCircle } from 'lucide-react';

export const Dropzone = ({ images = [], setImages, primaryIdx = 0, setPrimaryIdx }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter((file) =>
      ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)
    );

    if (!validFiles.length) return;

    setUploadProgress(20);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setUploadProgress(null), 400);
          return 100;
        }
        return prev + 25;
      });
    }, 120);

    const newUrls = validFiles.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newUrls]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (indexToRemove, e) => {
    e.stopPropagation();
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    if (primaryIdx === indexToRemove) {
      setPrimaryIdx(0);
    } else if (primaryIdx > indexToRemove) {
      setPrimaryIdx(primaryIdx - 1);
    }
  };

  const handleSetPrimary = (index, e) => {
    e.stopPropagation();
    setPrimaryIdx(index);
  };

  return (
    <div>
      <div
        className={`dropzone-container ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          multiple
          accept=".jpg,.jpeg,.png,.webp"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
          }}
        />

        <div className="dropzone-icon-box">
          <UploadCloud size={28} />
        </div>
        <h4 className="dropzone-title">Upload Property Photos</h4>
        <p className="dropzone-subtitle">Drag and drop images here or browse files</p>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Supported: JPG, JPEG, PNG, WEBP (Multiple uploads enabled)
        </span>

        {uploadProgress !== null && (
          <div style={{ marginTop: '1rem', width: '100%', maxWidth: '240px', margin: '1rem auto 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Thumbnails Strip */}
      {images.length > 0 && (
        <div className="upload-thumbnails-strip">
          {images.map((imgUrl, idx) => (
            <div
              key={idx}
              className={`thumbnail-item ${primaryIdx === idx ? 'is-primary' : ''}`}
              onClick={() => setPrimaryIdx(idx)}
              title="Click to set as primary image"
            >
              <img src={imgUrl} alt={`Property thumbnail ${idx + 1}`} />
              {primaryIdx === idx && (
                <span className="thumbnail-primary-tag">Primary</span>
              )}
              <div className="thumbnail-actions">
                <button
                  className="thumbnail-btn"
                  onClick={(e) => handleSetPrimary(idx, e)}
                  title="Make Primary"
                >
                  <Star size={12} fill={primaryIdx === idx ? '#F59E0B' : 'none'} color="#F59E0B" />
                </button>
                <button
                  className="thumbnail-btn"
                  onClick={(e) => handleRemoveImage(idx, e)}
                  title="Remove Image"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
