import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
const SubmissionContext = createContext(null);
export function SubmissionProvider({ children }) {
  const [submissions, setSubmissions] = useState([]); const [loading, setLoading] = useState(true); const [loadError, setLoadError] = useState('');
  const loadSubmissions = useCallback(async () => { setLoading(true); setLoadError(''); try { const response = await fetch('/api/submissions'); const data = await response.json(); if (!response.ok) throw new Error(data.message); setSubmissions(data); } catch (error) { setLoadError(error.message || 'Could not load submissions.'); } finally { setLoading(false); } }, []);
  useEffect(() => { loadSubmissions(); }, [loadSubmissions]);
  const addSubmission = useCallback((submission) => setSubmissions((current) => [submission, ...current]), []);
  const value = useMemo(() => ({ submissions, loading, loadError, loadSubmissions, addSubmission, count: submissions.length }), [submissions, loading, loadError, loadSubmissions, addSubmission]);
  return <SubmissionContext.Provider value={value}>{children}</SubmissionContext.Provider>;
}
export function useSubmissions() { const value = useContext(SubmissionContext); if (!value) throw new Error('useSubmissions must be used within SubmissionProvider.'); return value; }