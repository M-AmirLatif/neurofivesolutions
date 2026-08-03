export const categories = ['Web Application', 'Mobile App', 'UI/UX Design', 'AI / Machine Learning', 'Other'];
export const initialForm = { fullName: '', email: '', phone: '', projectTitle: '', category: '', submissionDate: '', projectUrl: '', techStack: '', description: '' };
export function validateForm(form, file) {
  const errors = {};
  if (form.fullName.trim().length < 2) errors.fullName = 'Enter your full name using at least 2 characters.';
  if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errors.email = 'Enter a valid email such as name@example.com.';
  if (!/^\+?[0-9][0-9\s-]{7,16}$/.test(form.phone.trim())) errors.phone = 'Enter a valid phone number with 8 to 17 digits.';
  if (form.projectTitle.trim().length < 3) errors.projectTitle = 'Use at least 3 characters for the project title.';
  if (!categories.includes(form.category)) errors.category = 'Choose your project category.';
  if (!form.submissionDate) errors.submissionDate = 'Select the project submission date.';
  else if (new Date(`${form.submissionDate}T00:00:00`) > new Date()) errors.submissionDate = 'Submission date cannot be in the future.';
  try { const url = new URL(form.projectUrl); if (!['http:', 'https:'].includes(url.protocol)) throw new Error(); } catch { errors.projectUrl = 'Enter a complete link beginning with http:// or https://.'; }
  if (form.techStack.trim().length < 2) errors.techStack = 'List at least one technology used.';
  if (form.description.trim().length < 30) errors.description = 'Write at least 30 characters about your project.';
  if (!file) errors.coverImage = 'Choose a project image before submitting.';
  else if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) errors.coverImage = 'Choose a JPG, PNG, or WebP image.';
  else if (file.size > 3 * 1024 * 1024) errors.coverImage = 'Image must be smaller than 3 MB.';
  return errors;
}