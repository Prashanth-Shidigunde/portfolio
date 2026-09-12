import React, { useState, useEffect } from 'react';
import storageService from '../../services/storageService';
import './BookingFilesViewer.css';

export function BookingFilesViewer({ files = [], title = 'CLIENT ATTACHED FILES' }) {
  const [resolvedFiles, setResolvedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSignedUrls() {
      if (!files || files.length === 0) {
        if (isMounted) {
          setResolvedFiles([]);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      const signedList = await storageService.getSignedUrlsForFiles(files, 3600);
      if (isMounted) {
        setResolvedFiles(signedList);
        setIsLoading(false);
      }
    }

    loadSignedUrls();

    return () => {
      isMounted = false;
    };
  }, [files]);

  if (!files || files.length === 0) {
    return (
      <div className="booking-files-container empty-state">
        <p className="empty-files-text">No reference files uploaded for this booking.</p>
      </div>
    );
  }

  const isImage = (type, name = '') => {
    const ext = name.split('.').pop()?.toLowerCase();
    return (
      type?.startsWith('image/') ||
      ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)
    );
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="booking-files-wrapper">
      <div className="files-section-header">
        <h4 className="files-title">{title} ({files.length})</h4>
        <span className="files-security-tag">🔒 Private Storage Access</span>
      </div>

      {isLoading ? (
        <div className="files-loading-state">
          <span className="loading-spinner"></span>
          <p>Generating secure access links...</p>
        </div>
      ) : (
        <div className="files-grid">
          {resolvedFiles.map((file, idx) => {
            const hasSignedUrl = Boolean(file.signedUrl);
            const imageFile = isImage(file.type, file.name);

            return (
              <div key={idx} className="file-card glass-panel">
                <div className="file-card-preview">
                  {imageFile && hasSignedUrl ? (
                    <div
                      className="image-thumbnail-wrapper"
                      onClick={() => setPreviewFile(file)}
                      title="Click to view image"
                    >
                      <img src={file.signedUrl} alt={file.name} className="image-thumbnail" />
                      <div className="thumbnail-overlay">
                        <span>🔍 View</span>
                      </div>
                    </div>
                  ) : (
                    <div className="generic-file-icon">
                      {file.type?.includes('pdf') ? '📑' : file.type?.includes('video') ? '🎥' : '📄'}
                    </div>
                  )}
                </div>

                <div className="file-card-details">
                  <span className="file-name" title={file.name}>
                    {file.name}
                  </span>
                  <span className="file-size">{formatFileSize(file.size)}</span>
                </div>

                <div className="file-card-actions">
                  {hasSignedUrl ? (
                    <a
                      href={file.signedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={file.name}
                      className="btn-file-download"
                    >
                      DOWNLOAD 📥
                    </a>
                  ) : (
                    <span className="btn-file-disabled">PREVIEW ONLY</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Image Lightbox Preview Modal */}
      {previewFile && (
        <div className="file-lightbox-overlay" onClick={() => setPreviewFile(null)}>
          <div className="file-lightbox-modal glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={() => setPreviewFile(null)}>
              &times;
            </button>
            <h3 className="lightbox-title">{previewFile.name}</h3>
            <div className="lightbox-image-container">
              <img src={previewFile.signedUrl} alt={previewFile.name} className="lightbox-image" />
            </div>
            <div className="lightbox-actions">
              <a
                href={previewFile.signedUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={previewFile.name}
                className="btn-lightbox-download"
              >
                DOWNLOAD ORIGINAL 📥
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingFilesViewer;
