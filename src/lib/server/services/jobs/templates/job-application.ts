export interface JobApplicationTemplateParams {
	greeting: string
	jobTitle: string
	applicantName: string
	applicantEmail: string
	applicantProfileUrl: string
	messageSection: string
}

export function jobApplicationTemplate(params: JobApplicationTemplateParams): string {
	const { greeting, jobTitle, applicantName, applicantEmail, applicantProfileUrl, messageSection } = params

	return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ff3e00; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #ff3e00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">New Job Application</h1>
    </div>
    <div class="content">
      <p>${greeting},</p>
      <p>Great news! You have received a new application for your job posting:</p>
      <h2 style="color: #ff3e00;">${jobTitle}</h2>

      <h3>Applicant Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${applicantName}</li>
        <li><strong>Email:</strong> <a href="mailto:${applicantEmail}">${applicantEmail}</a></li>
      </ul>
      ${messageSection}

      <a href="${applicantProfileUrl}" class="button">View Applicant Profile</a>

      <p>You can respond directly to the applicant by replying to their email address above.</p>

      <div class="footer">
        <p>This notification was sent via <a href="https://sveltesociety.dev">Svelte Society</a> Job Board.</p>
      </div>
    </div>
  </div>
</body>
</html>`
}

export function formatApplicationMessage(message?: string): string {
	if (!message) return ''
	return `
<h3>Message from applicant:</h3>
<blockquote style="border-left: 3px solid #ff3e00; padding-left: 16px; margin: 16px 0; color: #555;">
${message}
</blockquote>`
}
