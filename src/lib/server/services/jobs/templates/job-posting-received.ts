export interface JobPostingReceivedTemplateParams {
	jobTitle: string
	tierName: string
	expiresAt: string
}

export function jobPostingReceivedTemplate(params: JobPostingReceivedTemplateParams): string {
	const { jobTitle, tierName, expiresAt } = params

	return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ff3e00; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #ff3e00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 8px 8px 8px 0; }
    .button-secondary { background: #666; }
    .info-box { background: white; padding: 16px; border-radius: 6px; margin: 16px 0; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Job Posting Received</h1>
    </div>
    <div class="content">
      <p>Thank you for submitting your job posting! Your listing is currently being reviewed and will go live once it has been accepted.</p>

      <div class="info-box">
        <h2 style="margin-top: 0; color: #ff3e00;">${jobTitle}</h2>
        <p><strong>Plan:</strong> ${tierName}</p>
        <p><strong>Expires:</strong> ${expiresAt} (once live)</p>
      </div>

      <p>When candidates apply, you'll receive an email notification with their profile information.</p>

      <p><strong>Need to update your listing?</strong> Simply reply to this email with your changes and we'll take care of it.</p>

      <div class="footer">
        <p>Thank you for posting on <a href="https://sveltesociety.dev">Svelte Society</a>!</p>
      </div>
    </div>
  </div>
</body>
</html>`
}
