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
Fitur - fiturnya yaitu `website`, jadi nantinya client untuk sekarang hanya bisa membuat satu website. dimana satu website memiliki beragam pilihan `component` seperti `patient_form` , `intake_form` , `consent_form` , `vital_sign_form` , `referral_form` , `history_form` , `medical_hx_form` , `surgical_hx_form` , `family_hx_form` , `social_hx_form` , `medication_hx_form` , `allergy_hx_form` , `review_of_system_form` , `lifestyle_form` , `nutrition_form` , `exercise_form` , `stress_management_form` , `sleep_hx_form` , `smoking_hx_form` , `alcohol_hx_form` , `substance_hx_form` , `mental_health_hx_form` , `sexual_health_hx_form` , `reproductive_health_hx_form` , `travel_hx_form` , `vaccination_hx_form` , `screening_form`, dan lain - lain. Selain component form builder juga nanti ada pilihan layanan telemedicine dimana seorang patient bisa berkomunikasi langsung dengan doctor. Tentunya semua fitur - fitur yang tersedia dibawah regulasi HIPAA compliance 1996 regulation act

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