# LaunchForm — Forms, Validation & Real User Feedback

LaunchForm is a full-stack project submission portal built for NeuroFive Solutions Week 3, Task 1.

## Assignment coverage

- Nine form fields: name, email, phone, title, category dropdown, date, project URL, technology stack, description, and image
- Field-specific client-side validation
- Matching server-side validation for every field
- Secure multipart image upload with JPG, PNG, and WebP allowlist and 3 MB limit
- Success and error toasts
- Disabled submit button and loading indicator during requests
- Persistent JSON submission data and uploaded image storage
- Live submission gallery with loading, error, retry, and empty states
- Backend-only duplicate detection for demonstrating server feedback

## Run locally

```bash
npm install
npm start
```

Open only `http://localhost:5173`.

## Automated validation

```bash
npm test
npm run build
```

## Video demo flow

1. Submit the empty form to show field-specific client validation.
2. Correct every field and select a valid project image.
3. Submit successfully and show the new gallery card.
4. Submit the same email and project title again to show backend duplicate validation.
5. Optionally upload a non-image or image above 3 MB to show server file validation.

## Production

```bash
npm run build
npm run start:production
```