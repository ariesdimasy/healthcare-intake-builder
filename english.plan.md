# Healthcare Intake Builder

## Project Folder Structure
In this project, I want to build a healthcare intake builder with 3 main folders:

- **admin** — the administration area for managing accounts that have access to the healthcare intake builder service. This is a frontend project. The layout follows a typical admin dashboard pattern using sidebar + header + main content.
  Features in this folder:
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

- **backend** — the area for handling the core logic of the healthcare intake builder. This is a backend project. REST API project.

- **client** — the area where users with the client role can build a website for intake forms, allowing patients to fill out those forms and send data back to the client. This is a frontend project. The layout also follows a typical admin dashboard pattern using sidebar + header + main content. However, there is one menu where the user can drag and drop components to build forms into a website page. The available components are described in the Flow section.
  Features in this folder:
  1. Client Dashboard
  2. Website Management
      - Create Website (you can choose a theme)
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

## Roles
The roles in this project are:
1. **client** — also referred to as the *healthcare admin*; a person who owns a healthcare business, whether a hospital or a pharmacy. Their responsibility is to generate and manage the website we provide.

2. **patient** — also referred to as a *visitor*; a patient who fills out forms on the website created by the client.

3. **doctor** — also referred to as a *healthcare provider*.

4. **admin** — also referred to as the *system administrator*; a person who has access to all features in this project, and can manage other user accounts with the roles of client, provider, patient, or doctor.

## Flow
An admin registers a client so they can access the features available in the client folder. Once the client account is active, the client can register other accounts that can access the features in the client folder.

The features include a `website` — for now, a client can only create one website. A website can contain various `components` such as:
`patient_form`, `intake_form`, `consent_form`, `vital_sign_form`, `referral_form`, `history_form`, `medical_hx_form`, `surgical_hx_form`, `family_hx_form`, `social_hx_form`, `medication_hx_form`, `allergy_hx_form`, `review_of_system_form`, `lifestyle_form`, `nutrition_form`, `exercise_form`, `stress_management_form`, `sleep_hx_form`, `smoking_hx_form`, `alcohol_hx_form`, `substance_hx_form`, `mental_health_hx_form`, `sexual_health_hx_form`, `reproductive_health_hx_form`, `travel_hx_form`, `vaccination_hx_form`, `screening_form`, and more.

In addition to the form builder components, there will also be a telemedicine service option where a patient can communicate directly with a doctor. All available features will be built under **HIPAA Compliance 1996 Regulation Act**.

Once a client has created a website, they can make it accessible to `patients`. Patients can access the website using a unique link provided by the client, then fill out the available forms. The response results will be accessible to both the client and the doctor. If a patient chooses telemedicine, they will be directed to a telemedicine page where they can choose from available doctors.

One current consideration is how to store patient form response data as JSON in a table called `form_response`. The reason for using JSON is that website 1 and website 2 will inevitably have different form structures, depending on how each client designs them.

## Database Tables
The currently planned tables are:
1. **users** — for storing user accounts.
   Fields: `id`, `name`, `email`, `password`, `created_at`, `updated_at`

2. **websites** — for storing websites created by the client.
   Fields: `id`, `name`, `website_url`, `user_id`, `logo`, `favicon`, `theme_id`, `created_at`, `updated_at`

3. **components** — for storing components used on a website.
   Fields: `id`, `name`, `type`, `position`, `created_at`, `updated_at`

4. **form_response** — for storing patient form response data.
   Fields: `id`, `website_id`, `component_id`, `patient_id`, `response`, `created_at`, `updated_at`

5. **themes** — for storing themes used on a website.
   Fields: `id`, `name`, `colors`, `created_at`, `updated_at`

## Technical Stack
1. **Backend**: FastAPI (Python) + SQLAlchemy ORM + PostgreSQL + JWT Authentication + Pydantic Validation + Celery background tasks + Redis.
   - The backend will use a **multitenancy** architecture with separate databases for client and tenant.
   - Authentication uses **JWT + session (cookie)**. For JWT on the backend, **PyJWT** will be used.
   - Two levels of authentication will be implemented:
     - **Level 1**: Authentication for the client (accessing features in the client folder) — uses JWT + session (cookie). Next-Auth also handles JWT + session (cookie) authentication.
     - **Level 2**: Authentication for the tenant (accessing tenant features) — uses JWT.

2. **Frontend**: Next.js 16 + DaisyUI + TailwindCSS, state management using **Zustand** + **TanStack Query**, form schema validation using **Zod**, and authentication using **Next-Auth**, JWT, and session (cookie). Next-Auth already handles JWT and session (cookie) authentication.

3. **Database**: PostgreSQL
