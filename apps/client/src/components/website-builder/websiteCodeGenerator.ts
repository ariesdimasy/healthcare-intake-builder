import type { WebsiteInfo, WebsiteSettings, DroppedForm } from "@/types";

function generateFormHtml(form: DroppedForm): string {
  const formId = `form_${form.uid}`;
  return `
    <section class="intake-section" id="${formId}">
      <div class="section-header">
        <h2 class="section-title">${escapeHtml(form.title_text || form.label)}</h2>
        ${form.description_text ? `<p class="section-desc">${escapeHtml(form.description_text)}</p>` : ""}
      </div>
      <div class="form-fields">
        ${generateFieldsForForm(form.formId)}
      </div>
    </section>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateFieldsForForm(formId: string): string {
  const fieldMap: Record<string, string> = {
    new_patient: `
      <div class="field-row">
        <div class="field-group"><label>Full Name *</label><input type="text" name="full_name" placeholder="Enter full name" required/></div>
        <div class="field-group"><label>Date of Birth *</label><input type="date" name="dob" required/></div>
      </div>
      <div class="field-row">
        <div class="field-group"><label>National ID (NIK/KTP) *</label><input type="text" name="nik" placeholder="Enter ID number" required/></div>
        <div class="field-group"><label>Phone Number</label><input type="tel" name="phone" placeholder="+62 812 ..."/></div>
      </div>
      <div class="field-group full"><label>Home Address</label><textarea name="address" rows="2" placeholder="Enter home address"></textarea></div>`,

    insurance: `
      <div class="field-row">
        <div class="field-group"><label>Insurance Provider</label>
          <select name="insurance_provider">
            <option value="">Select provider...</option>
            <option>BPJS Kesehatan</option><option>Prudential</option><option>AXA Mandiri</option><option>Allianz</option><option>Other</option>
          </select>
        </div>
        <div class="field-group"><label>Card / Policy Number</label><input type="text" name="policy_no" placeholder="Policy number"/></div>
      </div>
      <div class="field-group full"><label>Upload Insurance Card (Front/Back)</label><input type="file" name="insurance_card" accept="image/*" multiple/></div>`,

    emergency_contact: `
      <div class="field-row">
        <div class="field-group"><label>Emergency Contact Name</label><input type="text" name="ec_name" placeholder="Full name"/></div>
        <div class="field-group"><label>Relationship</label>
          <select name="ec_relation">
            <option>Parent</option><option>Spouse</option><option>Child</option><option>Sibling</option><option>Other</option>
          </select>
        </div>
      </div>
      <div class="field-group"><label>Emergency Phone</label><input type="tel" name="ec_phone" placeholder="+62 812 ..."/></div>`,

    billing_policy: `
      <div class="policy-box"><p>By checking the box below, you agree to the payment policy including cancellation penalties for appointments cancelled less than 24 hours in advance.</p></div>
      <div class="checkbox-group"><input type="checkbox" id="billing_agree" name="billing_agree" required/><label for="billing_agree">I agree to the payment policy *</label></div>`,

    patient_referral: `
      <div class="field-row">
        <div class="field-group"><label>Referring Doctor's Name</label><input type="text" name="ref_doctor" placeholder="Dr. ..."/></div>
        <div class="field-group"><label>Originating Clinic / Hospital</label><input type="text" name="ref_clinic" placeholder="Institution name"/></div>
      </div>
      <div class="field-group full"><label>Upload Referral Document (.pdf/.jpg)</label><input type="file" name="referral_doc" accept=".pdf,.jpg,.jpeg"/></div>`,

    medical_history: `
      <p class="field-label">Do you have a history of:</p>
      <div class="checkbox-grid">
        ${["Diabetes","Hypertension","Heart Disease","Asthma","Stroke","Cancer","Kidney Disease","Thyroid Disorder"].map(d => `<div class="checkbox-group"><input type="checkbox" id="mh_${d.replace(/\s/g,"_")}" name="medical_hx" value="${d}"/><label for="mh_${d.replace(/\s/g,"_")}">${d}</label></div>`).join("")}
        <div class="checkbox-group"><input type="checkbox" id="mh_other" name="medical_hx" value="Other"/><label for="mh_other">Other</label></div>
      </div>
      <div class="field-group full"><label>If Other, please specify</label><input type="text" name="medical_hx_other" placeholder="Describe..."/></div>`,

    family_history: `
      <p class="field-label">Hereditary diseases in the family:</p>
      <div class="checkbox-grid">
        ${["Cancer","Stroke","Blood Disorders","Diabetes","Heart Disease","Hypertension"].map(d => `<div class="checkbox-group"><input type="checkbox" id="fh_${d.replace(/\s/g,"_")}" name="family_hx" value="${d}"/><label for="fh_${d.replace(/\s/g,"_")}">${d}</label></div>`).join("")}
      </div>
      <div class="field-group full"><label>Relationship to patient</label><input type="text" name="family_hx_relation" placeholder="e.g. Father, Mother, Sibling"/></div>`,

    medications: `
      <div id="med_list">
        <div class="med-item field-row">
          <div class="field-group"><label>Medication / Supplement</label><input type="text" name="med_name[]" placeholder="e.g. Metformin"/></div>
          <div class="field-group"><label>Dose (mg)</label><input type="text" name="med_dose[]" placeholder="e.g. 500"/></div>
          <div class="field-group"><label>Frequency</label><input type="text" name="med_freq[]" placeholder="e.g. 2x/day"/></div>
        </div>
      </div>
      <button type="button" onclick="addMedRow()" class="btn-add">+ Add Another Medication</button>`,

    allergy: `
      <div class="field-row">
        <div class="field-group"><label>Drug Allergies</label><input type="text" name="drug_allergy" placeholder="e.g. Penicillin, Aspirin"/></div>
        <div class="field-group"><label>Food / Other Allergies</label><input type="text" name="food_allergy" placeholder="e.g. Peanuts, Shellfish"/></div>
      </div>
      <div class="field-group"><label>Reaction Type</label>
        <select name="allergy_reaction" multiple>
          <option>Rash</option><option>Shortness of Breath</option><option>Swelling</option><option>Anaphylaxis</option><option>Nausea</option>
        </select>
      </div>`,

    social_history: `
      <div class="field-row">
        <div class="field-group"><label>Smoking</label>
          <div class="radio-group"><label><input type="radio" name="smoking" value="yes"/> Yes</label><label><input type="radio" name="smoking" value="no"/> No</label></div>
        </div>
        <div class="field-group"><label>Alcohol Use</label>
          <div class="radio-group"><label><input type="radio" name="alcohol" value="never"/> Never</label><label><input type="radio" name="alcohol" value="rarely"/> Rarely</label><label><input type="radio" name="alcohol" value="often"/> Often</label></div>
        </div>
      </div>
      <div class="field-group"><label>Occupation</label><input type="text" name="occupation" placeholder="Your profession"/></div>`,

    chief_complaint: `
      <div class="field-group full"><label>Describe your current complaint *</label><textarea name="complaint" rows="4" placeholder="Please describe your symptoms..." required></textarea></div>
      <div class="field-group"><label>Pain Scale (1–10)</label>
        <div class="pain-scale">
          ${[1,2,3,4,5,6,7,8,9,10].map(n=>`<label class="pain-btn"><input type="radio" name="pain_scale" value="${n}"/><span>${n}</span></label>`).join("")}
        </div>
      </div>`,

    data_privacy: `
      <div class="policy-box"><p>Your medical data will be kept strictly confidential in accordance with HIPAA 1996 and applicable data protection regulations. Your information will not be shared without your explicit consent.</p></div>
      <div class="field-group full"><label>Patient Digital Signature *</label><canvas id="sig_canvas" class="sig-canvas" width="400" height="120"></canvas><button type="button" onclick="clearSig()" class="btn-clear">Clear Signature</button><input type="hidden" name="signature"/></div>
      <div class="checkbox-group"><input type="checkbox" id="privacy_agree" name="privacy_agree" required/><label for="privacy_agree">I acknowledge the data privacy policy *</label></div>`,

    informed_consent: `
      <div class="field-group"><label>Procedure / Treatment</label><input type="text" name="procedure" placeholder="e.g. Blood draw, Physical therapy session"/></div>
      <div class="policy-box"><p>The risks and benefits of the above procedure have been explained to me by my healthcare provider. I understand and agree to proceed.</p></div>
      <div class="checkbox-group"><input type="checkbox" id="consent_agree" name="consent_agree" required/><label for="consent_agree">I have been informed of the risks and I consent *</label></div>`,

    release_of_info: `
      <div class="field-row">
        <div class="field-group"><label>Destination Hospital / Institution</label><input type="text" name="dest_hospital" placeholder="Hospital name"/></div>
        <div class="field-group"><label>Purpose</label>
          <select name="release_purpose">
            <option>Referral</option><option>Insurance Claim</option><option>Second Opinion</option><option>Research</option>
          </select>
        </div>
      </div>
      <div class="checkbox-group"><input type="checkbox" id="release_agree" name="release_agree" required/><label for="release_agree">I authorize the release of my medical records *</label></div>`,

    advance_directives: `
      <div class="policy-box"><p>In the event of a critical or life-threatening condition, please indicate your preference regarding resuscitation (CPR):</p></div>
      <div class="radio-group vertical">
        <label><input type="radio" name="dnr" value="perform"/> Perform CPR / Resuscitation</label>
        <label><input type="radio" name="dnr" value="dnr"/> Do Not Resuscitate (DNR)</label>
      </div>`,

    mental_health: `
      <p class="field-label">In the past 2 weeks, how often have you felt the following?</p>
      <div class="mental-table">
        ${["Feeling anxious or worried","Feeling depressed or hopeless","Difficulty sleeping","Low energy or fatigue","Difficulty concentrating"].map(q=>`
        <div class="mental-row">
          <span>${q}</span>
          <div class="radio-group">${["Not at all","Some days","More than half","Nearly every day"].map(o=>`<label><input type="radio" name="mh_${q.replace(/\s/g,"_").substring(0,15)}" value="${o}"/><span>${o}</span></label>`).join("")}</div>
        </div>`).join("")}
      </div>`,

    pediatric: `
      <div class="field-row">
        <div class="field-group"><label>Parent / Guardian Name *</label><input type="text" name="guardian_name" required/></div>
        <div class="field-group"><label>Relationship</label><select name="guardian_relation"><option>Parent</option><option>Legal Guardian</option><option>Grandparent</option></select></div>
      </div>
      <div class="field-group"><label>Development History</label>
        <div class="radio-group"><label><input type="radio" name="dev_history" value="normal"/> Normal</label><label><input type="radio" name="dev_history" value="delayed"/> Delayed</label></div>
      </div>
      <div class="checkbox-group"><input type="checkbox" id="immunization_complete" name="immunization"/><label for="immunization_complete">Immunization history is complete</label></div>`,

    obgyn: `
      <div class="field-row">
        <div class="field-group"><label>First Day of Last Menstrual Period (LMP)</label><input type="date" name="lmp"/></div>
        <div class="field-group"><label>Cycle Length (days)</label><input type="number" name="cycle_length" min="21" max="45" placeholder="e.g. 28"/></div>
      </div>
      <div class="field-row">
        <div class="field-group"><label>Number of Pregnancies (G)</label><input type="number" name="gravida" min="0"/></div>
        <div class="field-group"><label>Number of Deliveries (P)</label><input type="number" name="para" min="0"/></div>
      </div>`,

    dental: `
      <p class="field-label">Dental Complaint (check all that apply):</p>
      <div class="checkbox-grid">
        ${["Bleeding Gums","Sensitive Teeth","Toothache","Tooth Decay","Bad Breath","Jaw Pain"].map(d=>`<div class="checkbox-group"><input type="checkbox" id="dc_${d.replace(/\s/g,"_")}" name="dental_complaint" value="${d}"/><label for="dc_${d.replace(/\s/g,"_")}">${d}</label></div>`).join("")}
      </div>
      <div class="field-group"><label>Last dentist visit</label><input type="date" name="last_dentist"/></div>`,

    physiotherapy: `
      <div class="field-group full"><label>Indicate the area of pain (click on body diagram)</label>
        <div class="body-diagram">
          <svg viewBox="0 0 100 200" class="body-svg" onclick="markPain(event, this)">
            <ellipse cx="50" cy="18" rx="14" ry="16" fill="#e2e8f0" stroke="#94a3b8"/>
            <rect x="32" y="35" width="36" height="50" rx="4" fill="#e2e8f0" stroke="#94a3b8"/>
            <rect x="14" y="36" width="16" height="44" rx="6" fill="#e2e8f0" stroke="#94a3b8"/>
            <rect x="70" y="36" width="16" height="44" rx="6" fill="#e2e8f0" stroke="#94a3b8"/>
            <rect x="34" y="87" width="14" height="60" rx="6" fill="#e2e8f0" stroke="#94a3b8"/>
            <rect x="52" y="87" width="14" height="60" rx="6" fill="#e2e8f0" stroke="#94a3b8"/>
          </svg>
          <p style="font-size:0.75rem;color:#94a3b8;margin-top:4px;">Click to mark painful areas</p>
        </div>
      </div>
      <div class="field-group"><label>Type of Pain</label>
        <div class="radio-group"><label><input type="radio" name="pain_type" value="dull"/> Dull</label><label><input type="radio" name="pain_type" value="sharp"/> Sharp</label><label><input type="radio" name="pain_type" value="burning"/> Burning</label><label><input type="radio" name="pain_type" value="throbbing"/> Throbbing</label></div>
      </div>`,

    nutrition: `
      <div class="field-row">
        <div class="field-group"><label>Weight (kg)</label><input type="number" name="weight" min="1" max="500" placeholder="e.g. 65"/></div>
        <div class="field-group"><label>Height (cm)</label><input type="number" name="height" min="50" max="250" placeholder="e.g. 170"/></div>
      </div>
      <div class="field-group"><label>Primary Health Goal</label>
        <div class="radio-group vertical">
          <label><input type="radio" name="nutrition_goal" value="lose"/> Lose Weight</label>
          <label><input type="radio" name="nutrition_goal" value="gain"/> Gain Weight</label>
          <label><input type="radio" name="nutrition_goal" value="disease"/> Disease Management</label>
          <label><input type="radio" name="nutrition_goal" value="maintain"/> Maintain Weight</label>
        </div>
      </div>`,

    skincare: `
      <div class="field-group"><label>Skin Type</label>
        <div class="radio-group"><label><input type="radio" name="skin_type" value="oily"/> Oily</label><label><input type="radio" name="skin_type" value="dry"/> Dry</label><label><input type="radio" name="skin_type" value="combination"/> Combination</label><label><input type="radio" name="skin_type" value="sensitive"/> Sensitive</label><label><input type="radio" name="skin_type" value="normal"/> Normal</label></div>
      </div>
      <div class="field-group full"><label>Active Products Currently in Use</label>
        <div class="checkbox-grid">
          ${["Retinol","AHA","BHA","Niacinamide","Vitamin C","SPF Sunscreen","None"].map(p=>`<div class="checkbox-group"><input type="checkbox" id="sk_${p.replace(/\s/g,"_")}" name="skincare_products" value="${p}"/><label for="sk_${p.replace(/\s/g,"_")}">${p}</label></div>`).join("")}
        </div>
      </div>`,

    infectious_screening: `
      <div class="field-group"><label>Have you had fever or cough in the past 3 days?</label>
        <div class="radio-group"><label><input type="radio" name="fever_cough" value="yes"/> Yes</label><label><input type="radio" name="fever_cough" value="no"/> No</label></div>
      </div>
      <div class="field-group"><label>History of close contact with confirmed COVID-19 / infectious case?</label>
        <div class="radio-group"><label><input type="radio" name="close_contact" value="yes"/> Yes</label><label><input type="radio" name="close_contact" value="no"/> No</label></div>
      </div>
      <div class="field-group"><label>Current body temperature (°C, if available)</label><input type="number" name="temperature" step="0.1" placeholder="e.g. 36.8"/></div>`,

    telehealth: `
      <div class="policy-box"><p>This consultation will be conducted remotely via video call. By proceeding, you acknowledge the limitations of telemedicine including that a physical examination cannot be performed. In case of emergency, please call your local emergency services.</p></div>
      <div class="checkbox-group"><input type="checkbox" id="telehealth_agree" name="telehealth_agree" required/><label for="telehealth_agree">I agree to the terms of the telehealth consultation *</label></div>
      <div class="field-group"><label>Preferred Video Platform</label><select name="video_platform"><option>Zoom</option><option>Google Meet</option><option>WhatsApp Video</option><option>Other</option></select></div>`,

    satisfaction: `
      <p class="field-label">How would you rate today's service?</p>
      <div class="star-rating" id="star_rating">
        ${[1,2,3,4,5].map(n=>`<span class="star" data-value="${n}" onclick="setRating(${n})">★</span>`).join("")}
      </div>
      <input type="hidden" name="rating" id="rating_val"/>
      <div class="field-group full" style="margin-top:16px"><label>Comments (optional)</label><textarea name="satisfaction_comment" rows="3" placeholder="Tell us about your experience..."></textarea></div>`,

    waitlist: `
      <div class="field-row">
        <div class="field-group"><label>Preferred Alternative Day</label>
          <select name="preferred_day"><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option></select>
        </div>
        <div class="field-group"><label>Preferred Time</label>
          <select name="preferred_time"><option>Morning (08:00–12:00)</option><option>Afternoon (12:00–16:00)</option><option>Evening (16:00–20:00)</option></select>
        </div>
      </div>
      <div class="field-group"><label>Contact me via</label>
        <div class="radio-group"><label><input type="radio" name="waitlist_contact" value="whatsapp"/> WhatsApp</label><label><input type="radio" name="waitlist_contact" value="email"/> Email</label></div>
      </div>`,

    refund: `
      <div class="field-group"><label>Invoice Number *</label><input type="text" name="invoice_no" placeholder="e.g. INV-2024-001" required/></div>
      <div class="field-group full"><label>Reason for Refund *</label><textarea name="refund_reason" rows="3" placeholder="Describe the reason for your refund request..." required></textarea></div>
      <div class="field-row">
        <div class="field-group"><label>Bank Name</label><input type="text" name="bank_name" placeholder="e.g. BCA, Mandiri"/></div>
        <div class="field-group"><label>Account Number</label><input type="text" name="account_no" placeholder="Account number"/></div>
      </div>
      <div class="field-group"><label>Account Holder Name</label><input type="text" name="account_holder" placeholder="As registered in bank"/></div>`,
  };

  return fieldMap[formId] ?? `<div class="field-group full"><label>Form content</label><input type="text" placeholder="${formId}"/></div>`;
}

export function generateWebsiteCode(
  info: WebsiteInfo,
  settings: WebsiteSettings,
  forms: DroppedForm[]
): string {
  const sectionsHtml = forms.map(generateFormHtml).join("\n");
  const logoHtml = info.logoPreview
    ? `<img src="${info.logoPreview}" alt="Logo" class="site-logo"/>`
    : `<div class="site-logo-placeholder">🏥</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="keywords" content="${escapeHtml(info.meta_content)}"/>
  <meta name="description" content="${escapeHtml(info.meta_description)}"/>
  <title>${escapeHtml(info.title)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; color: #0f172a; }

    /* ── Header ── */
    .site-header { background: #1e3a5f; color: white; padding: 16px 32px; display: flex; align-items: center; gap: 16px; position: sticky; top: 0; z-index: 10; box-shadow: 0 2px 8px rgba(0,0,0,.2); }
    .site-logo { height: 48px; border-radius: 8px; }
    .site-logo-placeholder { font-size: 2rem; }
    .site-title { font-size: 1.4rem; font-weight: 700; }

    /* ── Progress ── */
    .progress-bar { background: #e2e8f0; height: 4px; }
    .progress-fill { background: linear-gradient(90deg, #2563eb, #06b6d4); height: 4px; width: 0%; transition: width .4s ease; }

    /* ── Layout ── */
    .site-wrapper { max-width: 800px; margin: 0 auto; padding: 32px 16px 64px; }
    .intake-section { background: white; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; margin-bottom: 24px; box-shadow: 0 1px 4px rgba(0,0,0,.06); }
    .section-header { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #f1f5f9; }
    .section-title { font-size: 1.25rem; font-weight: 700; color: #1e3a5f; }
    .section-desc { font-size: 0.9rem; color: #64748b; margin-top: 6px; }

    /* ── Fields ── */
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    .field-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
    .field-group.full { grid-column: 1 / -1; }
    .field-group label, .field-label { font-size: 0.8rem; font-weight: 600; color: #374151; text-transform: uppercase; letter-spacing: .04em; }
    input[type=text], input[type=email], input[type=tel], input[type=number], input[type=date], select, textarea {
      width: 100%; padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.875rem;
      color: #0f172a; background: white; outline: none; font-family: inherit; transition: border-color .15s;
    }
    input:focus, select:focus, textarea:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.1); }
    input[type=file] { padding: 8px; }
    textarea { resize: vertical; }

    /* ── Checkboxes & Radios ── */
    .checkbox-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px,1fr)); gap: 10px; margin: 12px 0; }
    .checkbox-group { display: flex; align-items: center; gap: 8px; }
    .checkbox-group input { width: 16px; height: 16px; cursor: pointer; }
    .checkbox-group label { font-size: 0.875rem; font-weight: 400; text-transform: none; letter-spacing: 0; cursor: pointer; }
    .radio-group { display: flex; flex-wrap: wrap; gap: 16px; }
    .radio-group label { display: flex; align-items: center; gap: 6px; font-size: 0.875rem; font-weight: 400; text-transform: none; letter-spacing: 0; cursor: pointer; }
    .radio-group.vertical { flex-direction: column; gap: 10px; }

    /* ── Pain Scale ── */
    .pain-scale { display: flex; gap: 6px; flex-wrap: wrap; }
    .pain-btn { cursor: pointer; }
    .pain-btn input { display: none; }
    .pain-btn span { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 50%; border: 2px solid #e2e8f0; font-weight: 600; font-size: 0.9rem; transition: all .15s; }
    .pain-btn input:checked + span { background: #2563eb; color: white; border-color: #2563eb; }

    /* ── Stars ── */
    .star-rating { display: flex; gap: 8px; font-size: 2.5rem; cursor: pointer; }
    .star { color: #e2e8f0; transition: color .15s; }
    .star.active { color: #f59e0b; }

    /* ── Policy Box ── */
    .policy-box { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 14px 16px; margin-bottom: 16px; }
    .policy-box p { font-size: 0.875rem; color: #0369a1; line-height: 1.6; }

    /* ── Signature ── */
    .sig-canvas { border: 2px dashed #cbd5e1; border-radius: 8px; width: 100%; max-width: 400px; cursor: crosshair; display: block; background: #fafafa; }
    .btn-clear, .btn-add { margin-top: 8px; padding: 6px 14px; background: white; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.8rem; cursor: pointer; color: #64748b; }
    .btn-clear:hover, .btn-add:hover { background: #f8fafc; }

    /* ── Body Diagram ── */
    .body-diagram { display: inline-block; }
    .body-svg { width: 120px; cursor: crosshair; }

    /* ── Mental Health Table ── */
    .mental-table { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
    .mental-row { padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; border-bottom: 1px solid #f1f5f9; }
    .mental-row:last-child { border-bottom: none; }
    .mental-row span { font-size: 0.875rem; flex: 1; min-width: 160px; }
    .mental-row .radio-group label span { font-size: 0.78rem; }

    /* ── Submit ── */
    .submit-section { text-align: center; margin-top: 32px; }
    .btn-submit { padding: 14px 48px; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; border-radius: 12px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: all .2s; box-shadow: 0 4px 14px rgba(37,99,235,.4); }
    .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(37,99,235,.5); }
    .success-msg { display: none; background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 24px; text-align: center; }
    .success-msg h3 { color: #15803d; font-size: 1.25rem; }

    @media (max-width: 640px) { .field-row { grid-template-columns: 1fr; } }
  </style>
</head>
<body>

<header class="site-header">
  ${logoHtml}
  <span class="site-title">${escapeHtml(info.title)}</span>
</header>
<div class="progress-bar"><div class="progress-fill" id="progress"></div></div>

<main class="site-wrapper">
  <form id="intake_form" onsubmit="handleSubmit(event)">
${sectionsHtml}
    <div class="submit-section">
      <button type="submit" class="btn-submit">Submit Form</button>
    </div>
  </form>
  <div class="success-msg" id="success_msg">
    <h3>✅ Form submitted successfully!</h3>
    <p style="color:#64748b;margin-top:8px">Thank you. Your healthcare provider will review your information.</p>
  </div>
</main>

<script>
  /* ── Progress tracking ─────────────────────────── */
  function updateProgress() {
    const form = document.getElementById('intake_form');
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let filled = 0;
    inputs.forEach(el => { if (el.value.trim()) filled++; });
    const pct = inputs.length ? Math.round((filled / inputs.length) * 100) : 0;
    document.getElementById('progress').style.width = pct + '%';
  }
  document.getElementById('intake_form').addEventListener('input', updateProgress);

  /* ── Signature pad ─────────────────────────────── */
  const canvas = document.getElementById('sig_canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let drawing = false;
    canvas.addEventListener('mousedown', e => { drawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); });
    canvas.addEventListener('mousemove', e => { if (!drawing) return; ctx.lineTo(e.offsetX, e.offsetY); ctx.strokeStyle = '#1e3a5f'; ctx.lineWidth = 2; ctx.stroke(); });
    canvas.addEventListener('mouseup', () => { drawing = false; document.querySelector('[name=signature]').value = canvas.toDataURL(); });
    canvas.addEventListener('touchstart', e => { e.preventDefault(); drawing = true; const r = canvas.getBoundingClientRect(); ctx.beginPath(); ctx.moveTo(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top); }, { passive: false });
    canvas.addEventListener('touchmove', e => { e.preventDefault(); if (!drawing) return; const r = canvas.getBoundingClientRect(); ctx.lineTo(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top); ctx.strokeStyle = '#1e3a5f'; ctx.lineWidth = 2; ctx.stroke(); }, { passive: false });
    canvas.addEventListener('touchend', () => { drawing = false; document.querySelector('[name=signature]').value = canvas.toDataURL(); });
  }
  function clearSig() { const c = document.getElementById('sig_canvas'); if(c) { c.getContext('2d').clearRect(0,0,c.width,c.height); document.querySelector('[name=signature]').value=''; } }

  /* ── Add medication row ─────────────────────────── */
  function addMedRow() {
    const list = document.getElementById('med_list');
    if (!list) return;
    const div = document.createElement('div');
    div.className = 'med-item field-row';
    div.innerHTML = '<div class="field-group"><label>Medication / Supplement</label><input type="text" name="med_name[]" placeholder="e.g. Metformin"/></div><div class="field-group"><label>Dose (mg)</label><input type="text" name="med_dose[]" placeholder="e.g. 500"/></div><div class="field-group"><label>Frequency</label><input type="text" name="med_freq[]" placeholder="e.g. 2x/day"/></div>';
    list.appendChild(div);
  }

  /* ── Star rating ────────────────────────────────── */
  function setRating(val) {
    document.querySelectorAll('.star').forEach((s, i) => s.classList.toggle('active', i < val));
    const inp = document.getElementById('rating_val'); if(inp) inp.value = val;
  }

  /* ── Body diagram ────────────────────────────────── */
  function markPain(event, svg) {
    const r = svg.getBoundingClientRect();
    const x = ((event.clientX - r.left) / r.width * 100).toFixed(1);
    const y = ((event.clientY - r.top) / r.height * 100).toFixed(1);
    const dot = document.createElementNS('http://www.w3.org/2000/svg','circle');
    dot.setAttribute('cx', x); dot.setAttribute('cy', y); dot.setAttribute('r','4');
    dot.setAttribute('fill','rgba(239,68,68,0.8)'); dot.setAttribute('stroke','#ef4444');
    svg.appendChild(dot);
  }

  /* ── Submit ─────────────────────────────────────── */
  function handleSubmit(e) {
    e.preventDefault();
    document.getElementById('intake_form').style.display = 'none';
    document.getElementById('success_msg').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>
</body>
</html>`;
}
