import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { initialForm, validateForm } from '../validation';
import { useSubmissions } from './SubmissionContext';
const FormContext = createContext(null);
export function FormProvider({ children }) {
  const { addSubmission } = useSubmissions(); const [form, setForm] = useState(initialForm); const [file, setFile] = useState(null); const [preview, setPreview] = useState(''); const [errors, setErrors] = useState({}); const [submitting, setSubmitting] = useState(false); const [toast, setToast] = useState(null); const fileInput = useRef(null); const maxDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  useEffect(() => { if (!toast) return undefined; const timer = setTimeout(() => setToast(null), 4200); return () => clearTimeout(timer); }, [toast]);
  function update(event) { const { name, value } = event.target; setForm((current) => ({ ...current, [name]: value })); setErrors((current) => ({ ...current, [name]: '' })); }
  function chooseFile(event) { const selected = event.target.files?.[0] || null; if (preview) URL.revokeObjectURL(preview); setFile(selected); setPreview(selected && selected.type.startsWith('image/') ? URL.createObjectURL(selected) : ''); setErrors((current) => ({ ...current, coverImage: '' })); }
  function clearFile() { if (preview) URL.revokeObjectURL(preview); setPreview(''); setFile(null); if (fileInput.current) fileInput.current.value = ''; }
  async function submit(event) {
    event.preventDefault(); const nextErrors = validateForm(form, file); setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { setToast({ type: 'error', text: 'Please correct the highlighted fields.' }); setTimeout(() => document.querySelector('.field-error')?.closest('label, .upload-field')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0); return; }
    setSubmitting(true);
    try { const body = new FormData(); Object.entries(form).forEach(([key, value]) => body.append(key, value)); body.append('coverImage', file); const response = await fetch('/api/submissions', { method: 'POST', body }); const data = await response.json(); if (!response.ok) { const error = new Error(data.message); error.fields = data.errors; throw error; } addSubmission(data.submission); setForm(initialForm); clearFile(); setErrors({}); setToast({ type: 'success', text: 'Project submitted successfully. Your entry is now live.' }); }
    catch (error) { if (error.fields) setErrors(error.fields); setToast({ type: 'error', text: error.message || 'Submission failed. Please try again.' }); }
    finally { setSubmitting(false); }
  }
  const value = useMemo(() => ({ form, file, preview, errors, submitting, toast, fileInput, maxDate, update, chooseFile, clearFile, submit, dismissToast: () => setToast(null) }), [form, file, preview, errors, submitting, toast, maxDate]);
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}
export function useFormState() { const value = useContext(FormContext); if (!value) throw new Error('useFormState must be used within FormProvider.'); return value; }