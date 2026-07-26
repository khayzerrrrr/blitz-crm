'use client';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'system-ui' }}>
          <h2>Terjadi Kesalahan</h2>
          <button onClick={() => reset()} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
            Coba Lagi
          </button>
        </div>
      </body>
    </html>
  );
}
