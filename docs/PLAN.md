# Rencana Portfolio: Gigih Satriono

Status: dibangun (29 Okt 2026). Keputusan final ada di bagian 9.

## 1. Subjek, audiens, tugas utama

- **Subjek**: software engineer dengan ~5 tahun pengalaman (perbankan, telko, pemerintahan, enterprise), sekarang Senior Software Engineer di Bank Mandiri. Kekuatan utama di Angular, tapi juga full stack dan DevOps.
- **Audiens**: recruiter dan engineering manager (lokal maupun remote) yang menyaring kandidat dalam 30–60 detik, plus calon klien freelance.
- **Tugas utama halaman**: dalam satu layar orang harus tahu *siapa, mengerjakan apa, di mana sekarang*, lalu bisa langsung buka proyek, unduh CV, atau menghubungi.

**Cerita yang membedakan**: karier Gigih dimulai sebagai operator mesin curing ban di Gajah Tunggal (2016–2021) sambil kuliah informatika, lalu pindah ke software. Dari mencetak ban pakai cetakan, sekarang mencetak UI dari komponen yang bisa dipakai ulang. Ini jadi dasar visual 3D-nya, bukan laptop melayang atau blob gradien yang muncul di semua portfolio.

## 2. Arah visual

### Konsep 3D: "The Component Press"

Diorama 3D bergaya render *clay* Blender (material matte, bayangan lembut, cahaya studio): sebuah mesin press industri kecil berwarna kuning mesin. Saat halaman dimuat, press turun **sekali** lalu mengeluarkan "komponen" (kartu UI kecil berbentuk tombol, input, chart) ke atas conveyor pendek. Setelah itu scene diam, hanya bergeser pelan mengikuti pointer.

- Dibangun dari primitif di React Three Fiber (rounded box, silinder), jadi tidak butuh file model dulu.
- Jalur upgrade: kalau nanti Gigih memodelkan versi sendiri di Blender, ekspor ke `.glb` dan ganti lewat `useGLTF` tanpa mengubah komponen lain.

### Warna (terang, tidak ada mode gelap)

Diambil dari foto profil (latar abu-biru studio, jas navy) ditambah kuning mesin pabrik.

| Token | Hex | Peran |
|---|---|---|
| `--porcelain` | `#EEF1F5` | latar halaman, abu-biru dingin |
| `--white` | `#FFFFFF` | permukaan kartu dan panel |
| `--ink` | `#1D2433` | teks utama, navy dari jas |
| `--slate` | `#5B6578` | teks sekunder |
| `--steel` | `#C9D2DE` | garis, border, material 3D sekunder |
| `--press` | `#F2B705` | aksen: badan mesin 3D, tombol utama (teks navy di atasnya), penanda aktif |

Aturan: kuning tidak pernah dipakai sebagai warna teks di atas putih (kontrasnya kurang). Dipakai sebagai bidang, dengan teks `--ink`.

### Tipografi

Satu keluarga: **Archivo** (variable, punya sumbu lebar).

- Judul: Archivo Expanded (width 125), weight 700–800, rapat (letter-spacing −0.02em). Kesannya plat nama mesin industri.
- Body: Archivo width 100, weight 400, ukuran 17–18px, line-height 1.6, maksimal ~68 karakter per baris.
- Skala (rasio 1.25): 14 / 17 / 21 / 27 / 33 / 42 / 52 / 66px, mengecil lewat `clamp()` di mobile.
- Tidak ada label huruf kapital semua, tidak ada eyebrow di atas setiap judul, tidak ada font monospace untuk label.

### Layout

Rata kiri di semua section. Grid 12 kolom di desktop, 8 di tablet, 4 di mobile, gutter samping 16px di mobile.

```
DESKTOP (≥1024)
┌──────────────────────────────────────────────────────┐
│ Gigih Satriono          Work  Projects  Skills  Contact│
├───────────────────────────┬──────────────────────────┤
│ Gigih Satriono            │                          │
│ Software engineer.        │     [ 3D PRESS SCENE ]   │
│ Angular, full stack,      │                          │
│ CI/CD. Sekarang di        │                          │
│ Bank Mandiri.             │                          │
│ [Lihat proyek] [Unduh CV] │                          │
└───────────────────────────┴──────────────────────────┘

MOBILE (<640)
┌──────────────────┐
│ GS          ≡    │
│ [ 3D, tinggi 45vh]│
│ Gigih Satriono   │
│ Software engineer│
│ [Lihat proyek]   │
│ [Unduh CV]       │
└──────────────────┘
```

Urutan section:

1. **Hero**: nama, satu kalimat peran, dua tombol, scene 3D.
2. **About**: foto (crop bahu ke atas, latar abu-biru menyatu dengan `--porcelain`) dan ringkasan singkat, termasuk cerita pabrik → software.
3. **Experience**: timeline vertikal. Ini memang urutan waktu, jadi penanda tahun dipakai. Garis timeline berwarna `--steel`, titik role saat ini berwarna `--press`.
4. **Projects**: bukan grid kartu identik. Dua proyek unggulan (Livin' Merchant Laporan, CMS iapays) tampil lebar dengan deskripsi lebih panjang. Sisanya daftar rapat yang bisa difilter per stack (Angular / Vue / Laravel / Golang).
5. **Skills**: dikelompokkan per kategori sesuai CV, berbentuk daftar tag sederhana.
6. **Education & Certifications**: blok ringkas dua kolom.
7. **Contact**: email, LinkedIn, WhatsApp, tombol unduh CV. Footer satu baris.

### Prinsip

1. **Satu hal yang berani**: scene press 3D. Semua di sekitarnya tenang: banyak ruang kosong, satu aksen warna, tidak ada gradien dekoratif.
2. **Satu momen gerak**: press turun sekali saat load. Tidak ada animasi fade-up di tiap section, tidak ada hover yang melompat di setiap kartu. Gerak lain hanya sebagai respons aksi (buka menu, ganti filter).
3. **Konten nyata dari CV**: tidak ada lorem ipsum dan tidak ada klaim yang tidak ada di CV.
4. **Copy manusiawi**: orang pertama, kalimat pendek, kata kerja biasa. Tanpa "passionate", "crafting digital experiences", "leveraging", "seamless".

## 3. Review rencana terhadap pola default

| Draf pertama | Kenapa generik | Revisi |
|---|---|---|
| Laptop/monitor 3D melayang dengan blob gradien | Muncul di hampir semua portfolio 3D | Mesin press dari cerita karier Gigih sendiri |
| Aksen biru kobalt | Biru SaaS standar, dan terlalu mirip warna brand bank | Kuning mesin `#F2B705`, ada kaitannya dengan latar pabrik |
| Latar krem hangat + serif | Pola default AI yang paling umum | Abu-biru dingin, diambil dari latar foto profil |
| Grid kartu proyek identik, radius dan shadow sama | "SaaS card kit" | 2 proyek unggulan lebar + daftar rapat yang bisa difilter |
| Penomoran 01/02/03 di setiap section | Section bukan urutan | Nomor/tahun hanya di timeline Experience |

## 4. Stack teknis

| Kebutuhan | Pilihan | Alasan |
|---|---|---|
| Framework | **Vite + React 19 + TypeScript** | Halaman statis, tidak butuh SSR. Ekosistem 3D terbaik ada di React |
| 3D | `three`, `@react-three/fiber`, `@react-three/drei` | Rounded box, contact shadow, environment light sudah tersedia |
| Styling | CSS biasa + CSS custom properties (`tokens.css`), CSS Modules per komponen | Tidak perlu Tailwind untuk satu halaman; token tetap terpusat |
| Font | Archivo via Google Fonts | |
| Deploy | Static build (`dist/`), bisa ke Vercel / Netlify / GitHub Pages | |

Tidak dipakai (YAGNI): state manager, router (satu halaman), library animasi tambahan (animasi press cukup `useFrame`), i18n (kecuali diminta).

## 5. Arsitektur folder

```
src/
├── main.tsx
├── App.tsx                  # merangkai section dari data
├── types/
│   └── portfolio.ts         # semua interface konten
├── data/                    # SATU-SATUNYA tempat mengubah isi
│   ├── profile.ts           # nama, peran, ringkasan, kontak
│   ├── experience.ts
│   ├── projects.ts
│   ├── skills.ts
│   └── credentials.ts       # pendidikan + sertifikasi
├── hooks/
│   ├── useReducedMotion.ts  # matchMedia prefers-reduced-motion
│   ├── useMediaQuery.ts     # breakpoint untuk kualitas 3D
│   └── useActiveSection.ts  # IntersectionObserver untuk nav aktif
├── components/
│   ├── layout/   Navbar, Footer, Section
│   ├── ui/       Button, Tag, ProjectFilter
│   └── sections/ Hero, About, Experience, Projects, Skills, Credentials, Contact
├── scene/
│   ├── PressScene.tsx       # Canvas, kamera, cahaya, lazy-loaded
│   ├── Press.tsx            # mesin + animasi stamp sekali jalan
│   ├── ComponentCards.tsx   # kartu UI yang keluar
│   ├── materials.ts         # material clay dari token warna
│   └── ScenePoster.tsx      # fallback gambar statis
└── styles/
    ├── tokens.css
    └── global.css
public/
├── gigih.jpg
└── Gigih_Satriono_CV.pdf
```

### Interface konten (rancangan)

```ts
export interface Profile {
  name: string
  role: string
  location: string
  summary: string[]
  email: string
  phone: string
  linkedin: string
  cvUrl: string
  photo: string
}

export interface Experience {
  id: string
  role: string
  company: string
  employment: 'Full-time' | 'Contract' | 'Freelance'
  start: string          // 'YYYY-MM'
  end: string | null     // null = sekarang
  highlights: string[]
}

export type Stack = 'Angular' | 'Vue' | 'React' | 'Laravel' | 'Golang' | 'DevOps'

export interface Project {
  id: string
  title: string
  client?: string
  year: number
  tech: string[]
  stacks: Stack[]        // untuk filter
  description: string
  featured?: boolean
  url?: string
}

export interface SkillGroup {
  label: string
  items: string[]
}

export interface Credential {
  title: string
  issuer: string
  date: string
  detail?: string
}
```

Alur datanya satu arah: `data/*.ts` → `App.tsx` → props section → komponen UI. Section tidak mengimpor data sendiri, jadi mudah dites dan isinya dibaca di satu tempat.

## 6. Responsive dan performa 3D

| Breakpoint | Layout hero | 3D |
|---|---|---|
| Mobile < 640 | Bertumpuk, scene di atas (45vh) | DPR maks 1.5, bayangan lebih ringan, tanpa parallax pointer |
| Tablet 640–1023 | Bertumpuk, scene lebih tinggi (55vh) | DPR maks 1.75 |
| Desktop ≥ 1024 | Dua kolom 5/7 | DPR maks 2, parallax pointer |

- Canvas di-*lazy load* (`React.lazy` + `Suspense`), teks hero tampil duluan.
- `prefers-reduced-motion` → press langsung di posisi akhir, tanpa animasi.
- WebGL tidak tersedia → `ScenePoster` (PNG hasil render scene).
- `frameloop="demand"` setelah animasi selesai, supaya tidak membakar baterai.
- Target: Lighthouse Performance ≥ 85 mobile, Accessibility ≥ 95.

## 7. Aksesibilitas

- Fokus keyboard terlihat (outline 2px `--ink`, offset 3px).
- Canvas diberi `aria-hidden`, isinya dijelaskan lewat teks.
- Kontras teks ≥ 4.5:1 (`--ink` di atas `--porcelain` ≈ 13:1, `--slate` ≈ 5.3:1).
- Skip link ke konten utama, satu `h1`, hierarki heading berurutan.

## 8. Tahapan kerja

1. Scaffold Vite + TS, tokens, font, layout dasar.
2. Types + file data dari CV.
3. Section statis (tanpa 3D), responsive di 3 breakpoint.
4. Scene 3D: press, kartu, cahaya, animasi stamp.
5. Fallback, reduced motion, lazy loading.
6. Review copy (humanizer), screenshot di 375 / 768 / 1440px, perbaiki.
7. Build produksi + cek Lighthouse.

## 9. Keputusan final

| Topik | Keputusan |
|---|---|
| Bahasa | English |
| Stack | React 19 + Vite 8 + TypeScript, `@react-three/fiber@9`, `@react-three/drei@10` |
| Model 3D | Dibuat dari kode. Ukuran dan posisi ada di `src/scene/layout.json` |
| Data CV | Ditampilkan apa adanya. Pekerjaan BPH Migas dan Intishaka diberi catatan berjalan paralel dengan MNC |
| Kontak | Email + LinkedIn. Tanpa nomor telepon dan tanpa unduhan CV (PDF-nya memuat nomor telepon) |
| Proyek bank | Hanya deskripsi di level fitur, tanpa screenshot dan tanpa detail integrasi |

Hasil review yang sudah diterapkan:
- Parallax tetap jalan dalam mode `frameloop="demand"`, karena `pointermove` memanggil `invalidate()`.
- Border tombol filter memakai `--slate`. `--steel` hanya untuk garis dekorasi.
- URL Google Fonts memuat sumbu `wdth`, jadi judul tampil lebar.
- Fallback tanpa WebGL menampilkan foto. Tidak ada PNG render terpisah.
- ContactShadows diganti dengan shadow map dari lampu utama ke lantai `shadowMaterial`, karena posisi bayangannya meleset setelah digeser dan diputar.

---

# Revisi 2 (29 Okt 2026): tema sinematik ala Marvel, tetap terang

Masukan: desain kurang menarik, nama dobel (header dan hero), font perlu diganti dan ukurannya diatur ulang, hero perlu tema bergaya Marvel dengan video latar.

## Arah

- **Nama hanya di hero.** Brand di navbar dihapus. Navbar berisi link section di kiri dan tombol "Get in touch" di kanan.
- **Hero = title card film.** Video latar memenuhi layar. Nama tampil di pita merah besar. Saat dibuka, kata-kata stack (Angular, Laravel, Go, Docker, ...) berganti cepat di dalam pita seperti halaman komik yang dibalik di intro Marvel, lalu berhenti di nama. Ini satu-satunya momen gerak otomatis di halaman.
- **Videonya dirender dari scene 3D kita sendiri**, bukan stock footage: mesin press merah-emas (warna Iron Man, karakter insinyur) mencetak kartu UI terus-menerus, dengan kamera low-angle yang bergerak pelan. Loop-nya mulus (3 siklus = 7,2 detik). Latar video sama dengan warna halaman, jadi menyatu. Ada versi landscape dan portrait.
- **Tetap terang.** Tidak ada latar gelap. Merah dan emas dipakai sebagai aksen.

## Token

| Token | Hex | Peran |
|---|---|---|
| `--paper` | `#F4F5F7` | latar halaman dan latar video |
| `--white` | `#FFFFFF` | permukaan |
| `--ink` | `#1A1F2B` | teks (15.1:1) |
| `--slate` | `#5A6475` | teks sekunder (5.48:1) |
| `--line` | `#D5DAE1` | garis dekorasi |
| `--red` | `#D7262E` | pita nama, tombol utama, panel kontak (teks putih 4.99:1) |
| `--gold` | `#F2B705` | aksen mesin, penanda kecil |

Font: **Big Shoulders Display** (condensed, nuansa poster dan title card film) untuk judul, **Plus Jakarta Sans** (dirancang untuk identitas kota Jakarta, rapi dan mudah dibaca) untuk isi.

## Review terhadap pola default

| Draf | Masalah | Revisi |
|---|---|---|
| Video stock "coding" atau partikel abstrak | Generik, tidak ada hubungannya dengan Gigih | Render mesin press sendiri, sambungan langsung dengan cerita pabrik |
| Hero gelap ala poster Marvel | Melanggar brief (tidak boleh gelap) | Studio terang, merah hanya di pita nama |
| Logo kotak merah persis Marvel | Meniru merek | Pita merah selebar nama, condensed tapi bukan font Marvel |
| Animasi masuk di setiap section | Pola AI | Hanya intro balik-kata di hero |

## Teknis

- Canvas 3D langsung di halaman diganti `<video>`. three.js pindah ke devDependencies, karena hanya dipakai `film.html` untuk merender video. Bundle produksi turun sekitar 265 KB gzip.
- `npm run film` merender frame demi frame (deterministik) lewat Chrome headless, lalu ffmpeg menghasilkan mp4 (H.264) dan webm (VP9) plus poster.
- Video punya tombol jeda (WCAG 2.2.2). Dengan reduced motion, video tidak autoplay dan nama langsung tampil.

---

# Revisi 3 (29 Okt 2026): layout baru, meja kerja 3D realistis

Masukan: seluruh layout diganti; mesin press di kanan hero diganti objek 3D yang lebih nyata; unduh aset video; pasang library yang dibutuhkan; pastikan aman.

## Arah

- **Hero**: teks di kiri, scene 3D langsung di kanan: meja kayu terang, laptop modern (aluminium dan kaca, PBR) yang membuka layarnya saat halaman dimuat, layar berganti antara tiga dashboard proyek Gigih, tanaman sukulen (model CC0 Poly Haven) dan mug keramik. Pencahayaan dari HDRI studio CC0. Bisa diputar dengan drag, lalu kembali ke posisi semula.
- **About**: grid bento berisi foto, cerita, fakta singkat, dan video kerja (stock).
- **Work**: layout split dengan judul sticky di kiri dan timeline di kanan.
- **Projects**: tiga kartu unggulan dengan pratinjau layar yang digambar dari spesifikasi yang sama dengan layar laptop, lalu daftar yang bisa difilter.
- **Contact**: video kafe sebagai latar, ditutup lapisan terang.
- **Navbar**: pil mengambang di tengah atas.

## Aset (semua lokal di `public/`)

| Aset | Sumber | Lisensi |
|---|---|---|
| `models/plant.glb` | Poly Haven `potted_plant_04` | CC0 |
| `hdri/studio.hdr` | Poly Haven `studio_small_09` | CC0 |
| `video/stock/workspace` | Mixkit #242 | Mixkit Stock Video Free License |
| `video/stock/keyboard` | Mixkit #42749 | Mixkit Stock Video Free License |
| `video/stock/cafe` | Mixkit #206 | Mixkit Stock Video Free License |

## Keamanan

- Font di-self-host (`@fontsource-variable`), sehingga tidak ada request ke pihak ketiga.
- Content Security Policy ketat lewat `vercel.json` dan `public/_headers`, plus meta CSP di build produksi.
- Header `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, dan HSTS.
- Link eksternal memakai `rel="noopener noreferrer"`. `npm audit` dijalankan sebelum rilis.


---

## Revisi 4: "Satriono City" (kota miniatur 3D)

Permintaan: ganti seluruh layout dengan tema 3D yang interaktif. Tokoh Marvel tidak dipakai karena hak cipta dan merek dagang. Pilihan user: nomor 2, kota miniatur (diorama).

Konsep:
- Satu canvas 3D tetap di belakang seluruh halaman. Konten berupa panel putih di kolom kiri (desktop) atau di bawah kota (mobile).
- Setiap panel adalah "halte" (`data-stop`). Kamera terbang ke gedungnya, pin merah pindah, dan tokoh Gigih berjalan lewat jalan raya ke sana.
- Gedung: pabrik Gajah Tunggal (dengan tumpukan ban), MNC (antena dan parabola), BPH Migas (kolom dan tangki gas), Intishaka, Unictive, tower Bank Mandiri, rumah studio (About), tech park berisi 3 tower dengan billboard dashboard proyek, kampus, workshop (Skills), dan kantor pos (Contact).
- Interaksi: hover mengangkat gedung dan memunculkan label; klik membawa ke panelnya; klik tokoh membuatnya melompat dan menyapa; mobil berjalan di lajur kiri.
- Semua geometri ada di `src/scene/city.json`. Logika jalur dan loop ada di `geometry.ts` dan diuji dengan `npm test`.

Dihapus: scene meja/laptop, model tanaman, tiga video stok Mixkit, LoopVideo, `@gltf-transform/cli`. CSP diperketat: `wasm-unsafe-eval` dan `blob:` dihapus, media dan worker diset `'none'`.
