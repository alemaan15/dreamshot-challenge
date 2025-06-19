'use client';

import { useRef, useState } from 'react';

import styles from './masking.module.css';
export default function MaskingPage() {
  const [image, setImage] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleMouseDown = () => setIsDrawing(true);
  const handleMouseUp = () => setIsDrawing(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fill();
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'mask.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <main className={styles.container}>
        <h1 className={styles.title}>Image Masking Tool</h1>

        <div className={styles.fileUploadWrapper}>
            <label htmlFor="fileUpload" className={styles.uploadLabel}>
                {
                    image ? (
                        <span className={styles.uploadedText}>Upload a new image</span>
                    ) : (
                        <span className={styles.uploadText}>Upload an image</span>  
                    )
                }
            </label>
            <input
                id="fileUpload"
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className={styles.hiddenInput}
            />
            {image && (
                <span className={styles.fileName}> Image successfully uploaded✅</span>
            )}
        </div>

      {image && (
        <div className={styles.canvasWrapper}>
          <img
            src={image}
            alt="Uploaded"
            ref={imageRef}
            className={styles.image}
            onLoad={() => {
              const canvas = canvasRef.current;
              if (canvas && imageRef.current) {
                canvas.width = imageRef.current.width;
                canvas.height = imageRef.current.height;
              }
            }}
          />
          <canvas
            ref={canvasRef}
            className={styles.canvas}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          />
        </div>
      )}

      {image && (
        <button onClick={handleDownload} className={styles.button}>
          Download mask
        </button>
      )}
    </main>
  );
}
