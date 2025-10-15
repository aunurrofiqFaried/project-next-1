// app/api/dashboard/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Server-side Supabase client (gunakan service role key untuk full access)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // 1️⃣ Fetch semua data yang diperlukan
    const [siswasResult, kelasResult, pelanggaranResult] = await Promise.all([
      supabase.from('siswas').select('*, kelas(*)'),
      supabase.from('kelas').select('*'),
      supabase.from('pelanggarans').select('*, siswa:siswas(*, kelas(*))'),
    ]);

    if (siswasResult.error) throw siswasResult.error;
    if (kelasResult.error) throw kelasResult.error;
    if (pelanggaranResult.error) throw pelanggaranResult.error;

    const siswas = siswasResult.data || [];
    const kelas = kelasResult.data || [];
    const pelanggaran = pelanggaranResult.data || [];

    // 2️⃣ Data total siswa dan kelas
    const totalSiswa = siswas.length;
    const totalKelas = kelas.length;

    // 3️⃣ Pie Chart: Laki-laki & Perempuan
    const pie_data = [
      {
        name: 'Laki-laki',
        value: siswas.filter(s => s.jenis_kelamin === 'Laki-laki').length
      },
      {
        name: 'Perempuan',
        value: siswas.filter(s => s.jenis_kelamin === 'Perempuan').length
      },
    ];

    // 4️⃣ Bar Chart: Jumlah siswa per kelas & gender
    const kelasGrouped = siswas.reduce((acc, siswa) => {
      const namaKelas = siswa.kelas?.kelas || 'Tidak Diketahui';
      if (!acc[namaKelas]) {
        acc[namaKelas] = { 'Laki-Laki': 0, 'Perempuan': 0 };
      }
      if (siswa.jenis_kelamin === 'Laki-laki') {
        acc[namaKelas]['Laki-Laki']++;
      } else if (siswa.jenis_kelamin === 'Perempuan') {
        acc[namaKelas]['Perempuan']++;
      }
      return acc;
    }, {} as Record<string, { 'Laki-Laki': number; 'Perempuan': number }>);

    const bar_data = Object.entries(kelasGrouped).map(([nama_kelas, counts]) => ({
      nama_kelas,
      'Laki-Laki': (counts as { 'Laki-Laki': number; 'Perempuan': number })['Laki-Laki'],
      'Perempuan': (counts as { 'Laki-Laki': number; 'Perempuan': number })['Perempuan'],
    }));

    // 5️⃣ Bar Chart: Jumlah siswa per tahun lahir
    const birthYearGrouped = siswas.reduce((acc, siswa) => {
      const year = new Date(siswa.tanggal_lahir).getFullYear().toString();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const bar_data_birthyear = Object.entries(birthYearGrouped)
      .map(([year, count]) => ({ year, count: count as number }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));

    // 6️⃣ Total Pelanggaran
    const totalPelanggaran = pelanggaran.length;

    // 7️⃣ Tren Pelanggaran 6 Bulan Terakhir
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }).reverse();

    const pelanggaranTren = months.map(month => {
      const filtered = pelanggaran.filter(p => {
        const pMonth = p.tanggal.substring(0, 7); // "2025-01"
        return pMonth === month;
      });

      return {
        bulan: month,
        Aktif: filtered.filter(p => p.status === 'Aktif').length,
        Selesai: filtered.filter(p => p.status === 'Selesai').length,
      };
    });

    // 8️⃣ Pelanggaran per Jenis
    const jenisGrouped = pelanggaran.reduce((acc, p) => {
      acc[p.jenis_pelanggaran] = (acc[p.jenis_pelanggaran] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pelanggaranPerJenis = Object.entries(jenisGrouped).map(([jenis_pelanggaran, total]) => ({
      jenis_pelanggaran,
      total: total as number,
    }));

    // 9️⃣ Pelanggaran per Tingkat
    const tingkatGrouped = pelanggaran.reduce((acc, p) => {
      acc[p.tingkat] = (acc[p.tingkat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pelanggaranPerTingkat = Object.entries(tingkatGrouped).map(([tingkat, total]) => ({
      tingkat,
      total: total as number,
    }));

    // 🔟 Pelanggaran per Kelas (urut terbanyak)
    const kelasGroupedPelanggaran = pelanggaran.reduce((acc, p) => {
      const namaKelas = p.siswa?.kelas?.kelas || 'Tidak Diketahui';
      acc[namaKelas] = (acc[namaKelas] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pelanggaranPerKelas = Object.entries(kelasGroupedPelanggaran)
      .map(([kelas, total]) => ({ kelas, total: total as number }))
      .sort((a, b) => (b.total as number) - (a.total as number));

    // ✅ Return Response
    return NextResponse.json({
      // Data siswa
      totalSiswa,
      totalKelas,
      pie_data,
      bar_data,
      bar_data_birthyear,

      // Data pelanggaran
      totalPelanggaran,
      pelanggaranTren,
      pelanggaranPerJenis,
      pelanggaranPerTingkat,
      pelanggaranPerKelas,
    });
  } catch (error: any) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data', details: error.message },
      { status: 500 }
    );
  }
}