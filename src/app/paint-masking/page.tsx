'use client';

import { useState } from "react";
import styles from './paint-masking.module.css';
import Spinner from "../components/spinner/page";
export default function PaintMasking() {

    const [prompt, setPrompt] = useState('')
    const [baseImage, setBaseImage] = useState<string | null>(null);
    const [maskImage, setMaskImage] = useState<string | null>(null)
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleUploadBaseImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => setBaseImage(reader.result as string);
        reader.readAsDataURL(file);
    }

    const handleUploadMask = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => setMaskImage(reader.result as string);
        reader.readAsDataURL(file);
    }
  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setImageUrl('');

        if(prompt.trim()==='') return;
        try {
        const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            throw new Error('Error generating image');
        }

        const data = await response.json();
        setImageUrl(data.imageUrl);
        } catch (err) {
        console.error(err);
        setError('Error generating image');
        } finally {
        setLoading(false);
        }
    }

    return (
        <main className={styles.container}>
        <h1 className={styles.title}>Mixed image generator!</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
            type="text"
            className={styles.input}
            placeholder="Describe la imagen..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            />

            <div className={styles.fileUploadWrapper}>
            <label htmlFor="fileUpload" className={styles.uploadLabel}>
                {
                    baseImage ? (
                        <span className={styles.uploadedText}>Upload a new image to paint him with the mask</span>
                    ) : (
                        <span className={styles.uploadText}>Upload the image to paint him with the mask!</span>  
                    )
                }
            </label>
            <input
                id="fileUpload"
                type="file"
                accept="image/*"
                onChange={handleUploadBaseImage}
                className={styles.hiddenInput}
                required
            />
            {baseImage && (
                <span className={styles.fileName}>Image successfully uploaded✅</span>
            )}
        </div>
        {
            baseImage && (
                <div className={styles.imagePreview}>
                    <img src={baseImage} alt="Base" className={styles.image} />
                </div>
            )
        }

        <div className={styles.fileUploadWrapper}>
            <label htmlFor="maskUpload" className={styles.uploadLabel}>
                {
                    maskImage ? (
                        <span className={styles.uploadedText}>Upload a new image mask</span>
                    ) : (
                        <span className={styles.uploadText}>Upload an image mask</span>  
                    )
                }
            </label>
            <input
                id="maskUpload"
                type="file"
                accept="image/*"
                onChange={handleUploadMask}
                className={styles.hiddenInput}
                required
            />
            {maskImage && (
                <span className={styles.fileName}>Image successfully uploaded✅</span>
            )}
        </div>

        {
            maskImage && (
                <div className={styles.imagePreview}>
                    <img src={maskImage} alt="Base" className={styles.image} />
                </div>
            )
        }
            
            <button type="submit" disabled={loading}  className={styles.button}>
            {loading ? 'Generando...' : 'Generar Imagen'}
            </button>
        </form>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {loading && 
        <div className={styles.loading}>
            <p>Generating image, please wait....</p>
            <Spinner />
        </div>
        }

        {imageUrl && (
            <div style={{ marginTop: '2rem' }}>
            <img src={imageUrl} alt="Generada" className={styles.generatedImage} />
            </div>
        )}
        </main>
  );
}
