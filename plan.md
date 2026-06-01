# Heathcare intake Builder 

## Folder Project 
Di project ini saya ingin membuat healthcare intake builder dimana ada 3 folder 
- admin , adalah tempat administrasi untuk mengolah akun - akun yang memiliki akses layanan ke healthcare intake builder. ini adalah frontend project. Layoutnya sama seperti admin dashboard pada umumnya menggunakan sidebar + header + main content. 
fitur - fitur di folder project ini : 
1. Admin Dashboard
2. Client Management
    - Create Client
    - Edit Client
    - Delete Client
    - View Client Details
3. Component Management
    - Create Component
    - Edit Component
    - Delete Component
    - View Component Details
4. Theme Management
    - Create Theme  
    - Edit Theme
    - Delete Theme
    - View Theme Details
5. Form Response Management
    - Create Form Response
    - Edit Form Response
    - Delete Form Response
    - View Form Response Details
6. Authentication , hanya halaman login , tidak ada halaman register

- backend , adalah tempat mengolah logic utama dari healthcare intake builder. ini adalah backend project
- client , adalah tempat user dengan role client bisa membuat website builder untuk intake form lalu pasien bisa mengisi form tersebut dan data bisa dikirim ke client. ini adalah frontend project. layoutnya juga sama seperti admin dashboard pada umumnya menggunakan sidebar + header + main content. namun ada satu menu dimana kita bisa drag and drop component untuk membuat form kedalam sebuah halaman website. component nya apa saja di jelaskan pada bagian flow. 
fitur - fitur di folder project ini : 
1. Client Dashboard
2. Website Management
    - Create Website , kamu bisa memilih theme
    - Edit Website
    - Delete Website
    - View Website Details
4. Component Management
    - Create Component
    - Edit Component
    - Delete Component
    - View Component Details
5. Theme Management
    - View Theme Details
6. Form Response Management
    - Create Form Response
    - Edit Form Response
    - Delete Form Response
    - View Form Response Details
7. Authentication , hanya halaman login , tidak ada halaman register

## Role
Role yang ada di project ini adalah 
1. client , disebut dengan admin healthcare , seseorang yang memiliki bisnis healthcare , entah itu rumah sakit atau apotik. tugasnya bisa mengenerate website yang telah kita generate 

2. patient , bisa disebut dengan visitor , pasien yang akan mengisi form di website yang telah dibuat oleh client. 
3. doctor , bisa disebut dengan healthcare provider , 
4. admin , bisa disebut dengan system administrator , seseorang yang memiliki akses ke seluruh fitur yang ada di project ini , bisa mengatur akun user lain yang memiliki role client , provider , patient , doctor 


## Flow 
seorang admin mendaftarkan client untuk bisa mengakses fitur-fitur yang nantinya berada di folder client. jika akun client sudah aktif maka client bisa mendaftarkan akun - akun yang bisa mengakses fitur-fitur di folder client. 
Fitur - fiturnya yaitu `website`, jadi nantinya client untuk sekarang hanya bisa membuat satu website. dimana satu website memiliki beragam pilihan `component` seperti `patient_form` , `intake_form` , `consent_form` , `vital_sign_form` , `referral_form` , `history_form` , `medical_hx_form` , `surgical_hx_form` , `family_hx_form` , `social_hx_form` , `medication_hx_form` , `allergy_hx_form` , `review_of_system_form` , `lifestyle_form` , `nutrition_form` , `exercise_form` , `stress_management_form` , `sleep_hx_form` , `smoking_hx_form` , `alcohol_hx_form` , `substance_hx_form` , `mental_health_hx_form` , `sexual_health_hx_form` , `reproductive_health_hx_form` , `travel_hx_form` , `vaccination_hx_form` , `screening_form`, dan lain - lain. 

demikian detail component form builder yang harus ada :

### 27 Form Intake Builder

Kategori 1: Pendaftaran & Administrasi Dasar

1. Form Pasien Baru (New Patient):[Nama Lengkap]* [Tanggal Lahir]* [NIK/No. KTP]* [Alamat Domisili] [No. HP]
2. Form Informasi Asuransi (Insurance):[Pilih Provider Asuransi ▾] [Nomor Kartu/Polis] [Unggah Foto Kartu Asuransi (Depan/Belakang)]
3. Form Kontak Darurat (Emergency Contact):[Nama Kontak Darurat] [Hubungan (Orang Tua/Pasangan/Anak) ▾] [No. HP Darurat]
4. Form Kebijakan Finansial (Billing Policy):[Text: Penjelasan biaya & denda pembatalan <24 jam] [ ] Saya setuju dengan kebijakan pembayaran*
5. Form Rujukan (Patient Referral):[Nama Dokter Perujuk] [Nama Instansi/Klinik Asal] [Unggah Dokumen Surat Rujukan (.pdf/.jpg)]

Kategori 2: Riwayat Medis & Klinis Umum

6. Form Riwayat Kesehatan Umum (Medical History):Apakah Anda memiliki riwayat: [ ] Diabetes [ ] Hipertensi [ ] Jantung [ ] Asma [ ] Lainnya
7. Form Riwayat Keluarga (Family History):Penyakit turunan di keluarga: [ ] Kanker [ ] Stroke [ ] Gangguan Darah Hubungan: [.....]
8. Form Rekonsiliasi Obat (Current Medications):[Nama Obat/Suplemen 1] [Dosis: ... mg] [Frekuensi: ... x sehari] (+ Tambah Obat Lain)
9. Form Pencatatan Alergi (Allergy Intake):Alergi Obat: [ Tulis di sini ] Alergi Makanan/Lainnya: [ Tulis di sini ] Reaksi: [ Rash / Sesak / dll ]
10. Form Riwayat Sosial (Social History):Merokok: [ ] Ya [ ] Tidak Alkohol: [ ] Jarang [ ] Sering [ ] Tidak Pernah Pekerjaan: [.....]
11. Form Keluhan Utama (Chief Complaint):Keluhan yang dirasakan saat ini: [ Area Teks Luas ] Skala Nyeri (1-10): [ Pilihan Angka ▾ ]

Kategori 3: Persetujuan & Hukum (Legalitas)

12. Form Privasi Data (Sesuai SATUSEHAT/HIPAA):[Text: Pernyataan kerahasiaan data medis] Tanda tangan digital pasien: [ Kolom Coretan TTD ]
13. Form Persetujuan Tindakan (Informed Consent):Prosedur: [Perawatan X] [ ] Saya telah dijelaskan risiko tindakan dan menyetujuinya*
14. Form Pelepasan Informasi (Release of Information):Izinkan rekam medis dikirim ke: [Nama Rumah Sakit Tujuan] Tujuan: [Rujukan / Klaim]
15. Form Arahan Medis (Advance Directives):Jika kondisi darurat/kritis, tindakan resusitasi (RJP): [ ] Lakukan [ ] Jangan Lakukan (DNR)

Kategori 4: Spesialisasi Khusus (Specialty-Specific)

16. Form Intake Kesehatan Mental (Mental Health):Dalam 2 minggu terakhir, seberapa sering merasa cemas? [ ] Tidak pernah [ ] Beberapa hari [ ] Tiap hari
17. Form Intake Pediatri (Anak):[Nama Orang Tua/Wali] Riwayat Tumbuh Kembang: [ Normal / Terlambat ] Riwayat Imunisasi: [ ] Lengkap
18. Form Kesehatan Wanita (Obgyn):[Hari Pertama Haid Terakhir (HPHT)] Jumlah Kehamilan (G): [ ] Jumlah Persalinan (P): [ ]
19. Form Intake Gigi (Dental Intake):Keluhan Gigi: [ ] Gusi Berdarah [ ] Gigi Sensitif Kapan terakhir kali ke dokter gigi? [.....]
20. Form Fisioterapi / Kiropraktik:[Gambar Anatomi Tubuh untuk diklik/ditandai pasien bagian mana yang sakit] Jenis Nyeri: [ ] Tumpul [ ] Tajam
21. Form Konsultasi Nutrisi (Ahli Gizi):Berat Badan: [... kg] Tinggi Badan: [... cm] Target Utama: [ ] Turun BB [ ] Naik BB [ ] Manajemen Penyakit
22. Form Skincare & Estetika:Tipe Kulit: [ ] Berminyak [ ] Kering [ ] Sensitif Produk aktif yang dipakai: [Retinol/AHA/BHA/Tidak ada]

Kategori 5: Operasional Tambahan & Evaluasi

23. Form Skrining Penyakit Menular:Apakah mengalami demam/batuk dalam 3 hari terakhir? [ ] Ya [ ] Tidak Riwayat kontak erat: [ ] Ya [ ] Tidak
24. Form Intake Telemedisin (Telehealth):[ ] Saya setuju melakukan konsultasi jarak jauh via video call dan memahami batasannya*
25. Form Survei Kepuasan (Patient Satisfaction):Bagaimana pelayanan dokter/perawat hari ini? ⭐ ⭐ ⭐ ⭐ ⭐ (Sistem Rating Bintang)
26. Form Daftar Tunggu (Waitlist):Hari/Jam Alternatif yang diinginkan: [ Pilihan Hari ] Hubungi saya jika ada jadwal kosong via: [ ] WhatsApp [ ] Email
27. Form Klaim Pengembalian Dana (Refund):Nomor Invoice: [.....] Alasan Refund: [.....] Detail Rekening Bank (Nama Bank, No Rekening, Nama Pemilik): [.....]

### Logika Form Intake Builder

Berikut adalah pemetaan keterkaitan (logika bersyarat) yang paling ideal dari 27 form yang Anda susun:

**1. Keterkaitan Berdasarkan Data Demografi Dasar**
Form ini saling terhubung berdasarkan input awal di **Form Pasien Baru**.
- **Trigger usia:** 
JIKA [Tanggal Lahir] menunjukkan pasien berusia < 18 tahun (atau sesuai kebijakan klinik) → MAKA muncul **Form Intake Pediatri (Anak)**.  
Jika dewasa, form ini disembunyikan.
- **Trigger jenis kelamin:** 
JIKA [Jenis Kelamin] (biasanya ditambahkan di Form Pasien Baru) adalah Wanita →MAKA muncul **Form Kesehatan Wanita (Obgyn)**.

**2. Keterkaitan Berdasarkan Administrasi & Jalur Kedatangan**
Form ini muncul tergantung dari bagaimana cara pasien mendaftar dan membayar.
- **Trigger asuransi:** JIKA pada pendaftaran ditanya "Metode Pembayaran: [Asuransi]" → MAKA muncul **Form Informasi Asuransi**. Jika memilih pasien umum/mandiri (*self-pay*), form ini diabaikan.
- **Trigger rujukan:** JIKA pada pendaftaran ditanya "Apakah Anda pasien rujukan? [Ya]" → MAKA muncul **Form Rujukan**.
- **Trigger telemedisin:** JIKA pasien mendaftar untuk layanan konsultasi online →MAKA muncul **Form Intake Telemedisin (Telehealth)** dan **Form Kebijakan Finansial** (untuk pembayaran di muka).

**3. Keterkaitan Berdasarkan Keluhan Utama (Triage)**
Jawaban pada **Form Keluhan Utama** atau pilihan Poliklinik saat pendaftaran akan memicu Kategori 4 (Spesialisasi Khusus).
- JIKA Poli/Keluhan = "Gigi/Mulut" → MAKA muncul **Form Intake Gigi**.
- JIKA Poli/Keluhan = "Otot/Sendi/Nyeri Punggung" → MAKA muncul **Form Fisioterapi / Kiropraktik**.
- JIKA Poli/Keluhan = "Kecemasan/Depresi/Psikologis" → MAKA muncul **Form Intake Kesehatan Mental**.
- JIKA Poli/Keluhan = "Diet/Berat Badan" → MAKA muncul **Form Konsultasi Nutrisi (Ahli Gizi)**.
- JIKA Poli/Keluhan = "Jerawat/Perawatan Wajah" → MAKA muncul **Form Skincare & Estetika**.
****

**4. Keterkaitan Internal dalam Riwayat Medis (*Drill-Down*)**
Ini adalah contoh di mana satu bagian dari sebuah form memicu pertanyaan lanjutan.
- **Trigger Penyakit Tambahan:** Pada **Form Riwayat Kesehatan Umum**, JIKA pasien menceklis kotak "[ ] Lainnya" →MAKA muncul kotak teks (Text Box) wajib isi untuk menjelaskan penyakit tersebut.
- **Trigger Alergi:** Pada **Form Pencatatan Alergi**, JIKA pasien mengisi nama obat/makanan →MAKA *dropdown* "Reaksi" (Rash/Sesak/dll) otomatis wajib diisi (*required*).

**5. Keterkaitan Dokumen Legal & Situasional (Hukum)**

Form di Kategori 3 biasanya dipicu oleh tindakan atau permintaan spesifik, bukan diisi di awal oleh semua orang.
- **Trigger Tindakan Medis:** JIKA dokter memutuskan pasien harus menjalani operasi kecil atau perawatan khusus →MAKA petugas memicu pengiriman **Form Persetujuan Tindakan (Informed Consent)** ke perangkat/HP pasien.
- **Trigger Transfer Data:** JIKA pasien meminta dirujuk keluar atau mengklaim asuransi pribadi →MAKA muncul **Form Pelepasan Informasi (Release of Information)**.

Selain component form builder juga nanti ada pilihan layanan telemedicine dimana seorang patient bisa berkomunikasi langsung dengan doctor. Tentunya semua fitur - fitur yang tersedia dibawah regulasi HIPAA compliance 1996 regulation act

Jika client sudah membuat website maka client bisa membuat website tersebut bisa diakses oleh `patient`, pasien bisa mengakses website tersebut dengan menggunakan unique link yang diberikan oleh client,  lalu mengisi form - form yang tersedia. untuk hasil response nya akan bisa diakses oleh client dan doctor. jika patient memilih telemedicine maka patient akan masuk ke halaman telemedicine dimana halaman tersebut akan ada pilihan doctor yang tersedia. 

yang saat ini terpikirkan adalah bagaimana menyimpan data - data response hasil isian dari patient berbentuk json yang tersimpan dalam suatu table yaitu `form_response`. kenapa json ? karena website 1 dan website 2 pasti bentuk form nya berbeda, tergantung bagaimana client mendesign nya 

## Table di Database
saat ini yang terpikirkan dari table nya adalah : 
1. users -> untuk menyimpan akun user. 
field : id, name, email, password, created_at, updated_at 
2. websites -> untuk menyimpan website yang dibuat oleh client 
field : id, name, website_url, user_id, logo, favicon, theme_id, created_at, updated_at 
3. components -> untuk menyimpan component yang digunakan di website. 
field : id, name, type, position, created_at, updated_at 
4. form_response -> untuk menyimpan response hasil isian dari patient
field: id, website_id, component_id, patient_id, response, created_at, updated_at
5. themes -> untuk menyimpan theme yang digunakan di website
field : id, name, colors, created_at, updated_at. 

## Teknis
1. untuk backend menggunakan Fast API Python , ORM SQLAlchemy + Postgresql + Authentication menggunakan JWT + Validation using Pydantic, + Background Tasks using Celery + Redis. jadi saya ingin backend ini menggunakan multitenancy dimana ada database terpisah antara client dan tenant. untuk autentikasi menggunakan JWT dan session ( cookie ) , untuk JWT di backend saya akan menggunakan PyJWT, jadi saya ingin di backend membuat 2 level authentication , level 1 adalah authentication untuk client ( mengakses fitur-fitur di folder client ) dan level 2 adalah authentication untuk tenant ( mengakses fitur-fitur di folder tenant ), untuk level 1 akan menggunakan JWT dan session ( cookie ) , next-auth juga sudah menangani autentikasi menggunakan jwt dan session ( cookie ), untuk JWT di backend saya akan menggunakan PyJWT. untuk tenant menggunakan JWT. 
2. untuk frontend menggunakan next.js 16 + daisy ui + TailwindCss , state management menggunakan Zustand + Tanstack Query, dan untuk auth menggunakan JWT dan untuk validate schema menggunakan zod , Authentication menggunakan next-auth , JWT, dan session ( cookie ) , Next-auth sudah menangani autentikasi menggunakan jwt dan session ( cookie )
3. untuk database menggunakan postgresql