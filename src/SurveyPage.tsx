import { FormEvent, useMemo, useState } from 'react';
import { countries, shoeSizeMap } from './constants';
import { detectCountry, type FormDataShape, validateForm } from './utils';
import type { SurveySubmission } from './types';

const initialData = (): FormDataShape => ({
  sizeSystem: '',
  shoeSize: '',
  shoeSizeOther: '',
  country: detectCountry(),
  countryOther: '',
  sailNumber: '',
  homeYachtClub: '',
  consent: false,
});

export default function SurveyPage() {
  const [formData, setFormData] = useState<FormDataShape>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const shoeSizeOptions = useMemo(() => {
    if (!formData.sizeSystem) return [];
    return [...shoeSizeMap[formData.sizeSystem], 'Other'];
  }, [formData.sizeSystem]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateForm(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const payload: SurveySubmission = {
      timestamp: new Date().toISOString(),
      sizeSystem: formData.sizeSystem!,
      shoeSize: formData.shoeSize === 'Other' ? formData.shoeSizeOther.trim() : formData.shoeSize,
      country: formData.country === 'Other' ? formData.countryOther.trim() : formData.country,
      sailNumber: formData.sailNumber.trim() || undefined,
      homeYachtClub: formData.homeYachtClub.trim() || undefined,
      consent: formData.consent,
    };

    try {
      setSubmitting(true);
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Failed to submit. Please try again.' }));
        setErrors({ submit: data.error ?? 'Failed to submit. Please try again.' });
        return;
      }

      setSubmitted(true);
      setFormData(initialData());
      setErrors({});
    } catch {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="container">
        <section className="card success-card">
          <h1>Shoe Survey</h1>
          <p>Thanks! Your response was recorded.</p>
          <button className="button" onClick={() => setSubmitted(false)}>
            Submit another response
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <section className="card">
        <h1>Shoe Survey</h1>
        <p className="subtitle">Sailing/Yacht Club Event Survey</p>
        <img src="/product.jpg" alt="Shoe product preview" className="product-image" />

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="sizeSystem">Sizing system *</label>
          <select
            id="sizeSystem"
            value={formData.sizeSystem}
            onChange={(e) => setFormData((prev) => ({ ...prev, sizeSystem: e.target.value as FormDataShape['sizeSystem'], shoeSize: '', shoeSizeOther: '' }))}
          >
            <option value="">Select a system</option>
            {Object.keys(shoeSizeMap).map((system) => (
              <option key={system} value={system}>{system}</option>
            ))}
          </select>
          {errors.sizeSystem && <p className="error">{errors.sizeSystem}</p>}

          {formData.sizeSystem && (
            <>
              <label htmlFor="shoeSize">Shoe size *</label>
              <select
                id="shoeSize"
                value={formData.shoeSize}
                onChange={(e) => setFormData((prev) => ({ ...prev, shoeSize: e.target.value }))}
              >
                <option value="">Select size</option>
                {shoeSizeOptions.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              {errors.shoeSize && <p className="error">{errors.shoeSize}</p>}
            </>
          )}

          {formData.shoeSize === 'Other' && (
            <>
              <label htmlFor="shoeSizeOther">Enter shoe size *</label>
              <input
                id="shoeSizeOther"
                type="text"
                value={formData.shoeSizeOther}
                onChange={(e) => setFormData((prev) => ({ ...prev, shoeSizeOther: e.target.value }))}
              />
              {errors.shoeSizeOther && <p className="error">{errors.shoeSizeOther}</p>}
            </>
          )}

          <label htmlFor="country">Country *</label>
          <select id="country" value={formData.country} onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}>
            <option value="">Select country</option>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
            <option value="Other">Other</option>
          </select>
          {errors.country && <p className="error">{errors.country}</p>}

          {formData.country === 'Other' && (
            <>
              <label htmlFor="countryOther">Enter country *</label>
              <input
                id="countryOther"
                type="text"
                value={formData.countryOther}
                onChange={(e) => setFormData((prev) => ({ ...prev, countryOther: e.target.value }))}
              />
              {errors.countryOther && <p className="error">{errors.countryOther}</p>}
            </>
          )}

          <label htmlFor="sailNumber">Sail number (optional)</label>
          <input
            id="sailNumber"
            type="text"
            value={formData.sailNumber}
            onChange={(e) => setFormData((prev) => ({ ...prev, sailNumber: e.target.value }))}
          />
          {errors.sailNumber && <p className="error">{errors.sailNumber}</p>}

          <label htmlFor="homeYachtClub">Home yacht club (optional)</label>
          <input
            id="homeYachtClub"
            type="text"
            value={formData.homeYachtClub}
            onChange={(e) => setFormData((prev) => ({ ...prev, homeYachtClub: e.target.value }))}
          />
          {errors.homeYachtClub && <p className="error">{errors.homeYachtClub}</p>}

          <label className="checkbox-label" htmlFor="consent">
            <input
              id="consent"
              type="checkbox"
              checked={formData.consent}
              onChange={(e) => setFormData((prev) => ({ ...prev, consent: e.target.checked }))}
            />
            I agree my info can be used for this event.
          </label>
          {errors.consent && <p className="error">{errors.consent}</p>}

          {errors.submit && <p className="error">{errors.submit}</p>}

          <button className="button" type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </section>
    </main>
  );
}
