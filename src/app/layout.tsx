'use client';

import { usePathname } from 'next/navigation';
import './globals.css';
import styles from './layout.module.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <body>
        <nav className={styles.navbar}>
          <div className={styles.logo}>🧠 Image Tools</div>
          <ul className={styles.navLinks}>
            <li>
              <Link
                href="/"
                className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}
              >
                Generador
              </Link>
            </li>
            <li>
              <Link
                href="/masking"
                className={`${styles.link} ${pathname === '/masking' ? styles.active : ''}`}
              >
                Máscara
              </Link>
            </li>
            <li>
              <Link
                href="/paint-masking"
                className={`${styles.link} ${pathname === '/paint-masking' ? styles.active : ''}`}
              >
                Base + Mascara + Prompt
              </Link>
            </li>
          </ul>
        </nav>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
