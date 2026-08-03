export const categories = ['Web Application', 'Mobile App', 'UI/UX Design', 'AI / Machine Learning', 'Other'];

export function validateSubmission(body) {
  const value = {
    fullName: typeof body.fullName === 'string' ? body.fullName.trim() : '',
    email: typeof body.email === 'string' ? body.email.trim().toLowerCase() : '',
    phone: typeof body.phone === 'string' ? body.phone.trim() : '',
    projectTitle: typeof body.projectTitle === 'string' ? body.projectTitle.trim() : '',
    category: typeof body.category === 'string' ? body.category : '',
    submissionDate: typeof body.submissionDate === 'string' ? body.submissionDate : '',
    projectUrl: typeof body.projectUrl === 'string' ? body.projectUrl.trim() : '',
    techStack: typeof body.techStack === 'string' ? body.techStack.trim() : '',
    description: typeof body.description === 'string' ? body.description.trim() : ''
  };
  const errors = {};
  if (value.fullName.length < 2) errors.fullName = 'Enter your full name using at least 2 characters.';
  else if (value.fullName.length > 70) errors.fullName = 'Keep your name under 70 characters.';
  if (!/^\S+@\S+\.\S+$/.test(value.email)) errors.email = 'Enter a valid email such as name@example.com.';
  if (!/^\+?[0-9][0-9\s-]{7,16}$/.test(value.phone)) errors.phone = 'Enter a valid phone number with 8 to 17 digits.';
  if (value.projectTitle.length < 3) errors.projectTitle = 'Use at least 3 characters for the project title.';
  else if (value.projectTitle.length > 90) errors.projectTitle = 'Keep the project title under 90 characters.';
  if (!categories.includes(value.category)) errors.category = 'Choose a category from the available options.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.submissionDate)) errors.submissionDate = 'Select a valid submission date.';
  else if (new Date(`${value.submissionDate}T00:00:00`) > new Date()) errors.submissionDate = 'Submission date cannot be in the future.';
  try { const url = new URL(value.projectUrl); if (!['http:', 'https:'].includes(url.protocol)) throw new Error(); }
  catch { errors.projectUrl = 'Enter a complete URL beginning with http:// or https://.'; }
  if (value.techStack.length < 2) errors.techStack = 'List at least one technology used in your project.';
  else if (value.techStack.length > 120) errors.techStack = 'Keep the technology list under 120 characters.';
  if (value.description.length < 30) errors.description = 'Describe your project in at least 30 characters.';
  else if (value.description.length > 600) errors.description = 'Keep the description under 600 characters.';
  return { errors, value };
}
