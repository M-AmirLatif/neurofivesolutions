import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { FormProvider } from './context/FormContext';
import { SubmissionProvider } from './context/SubmissionContext';
import './styles.css';
createRoot(document.getElementById('root')).render(<StrictMode><SubmissionProvider><FormProvider><App/></FormProvider></SubmissionProvider></StrictMode>);