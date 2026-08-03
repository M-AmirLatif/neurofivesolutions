# LaunchForm — Global State, Data Fetching & UI Polish

Week 3 Task 2 refactors the Week 3 Task 1 submission portal into a scalable Context API architecture while preserving its full-stack validation and upload workflow.

## Assignment coverage

- `SubmissionContext` owns submission data, API fetching, loading, errors, retries, counts, and list updates
- `FormContext` owns all form fields, validation errors, file preview, submit status, server errors, and toast feedback
- Submission form and gallery consume global state directly without prop-drilling
- Animated skeleton cards appear during every submissions fetch
- Purpose-built empty state when no records exist
- Retryable API error state instead of a blank screen
- Disabled submission controls and spinner while writes are in progress
- Shared toast component for successful and failed submissions
- Professional responsive UI retained and polished

## Component architecture

```text
client/src/
├── context/
│   ├── FormContext.jsx
│   └── SubmissionContext.jsx
├── components/
│   ├── DataStates.jsx
│   ├── Layout.jsx
│   ├── SubmissionForm.jsx
│   ├── SubmissionGallery.jsx
│   └── Toast.jsx
├── validation.js
├── App.jsx
└── main.jsx
```

## Run locally

```bash
npm install
npm start
```

Open only `http://localhost:5173`.

## Verify

```bash
npm test
npm run build
```

## Video walkthrough

1. Explain the two Context providers in `main.jsx`.
2. Show the form component reading shared state with `useFormState()`.
3. Show the gallery reading shared data with `useSubmissions()`.
4. Refresh to demonstrate skeleton loaders.
5. Submit valid data to show synchronized gallery and toast updates.
6. Demonstrate the empty or retry state if needed.