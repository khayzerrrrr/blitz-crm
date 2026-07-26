import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>404</h2>
      <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Halaman tidak ditemukan</p>
      <Link href="/" style={{ marginTop: '1rem', color: '#F89029' }}>Kembali ke Dashboard</Link>
    </div>
  );
}
