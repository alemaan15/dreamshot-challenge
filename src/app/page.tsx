'use client';

import { useState } from "react";
import styles from './page.module.css';
import Spinner from "./components/spinner/page";
export default function Home() {

  const [prompt, setPrompt] = useState('')
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  
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
      <h1 className={styles.title}>Image generator</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          className={styles.input}
          placeholder="Describe la imagen..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}  className={styles.button}>
          {loading ? 'Generating...' : 'Generate Image'}
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
