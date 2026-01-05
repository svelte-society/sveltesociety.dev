export interface PaymentConfirmationTemplateParams {
	jobTitle: string
	tierName: string
	amountPaid: string
	receiptSection: string
}

export function paymentConfirmationTemplate(params: PaymentConfirmationTemplateParams): string {
	const { jobTitle, tierName, amountPaid, receiptSection } = params

	return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #28a745; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px; }
    .info-box { background: white; padding: 16px; border-radius: 6px; margin: 16px 0; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">Payment Confirmed</h1>
    </div>
    <div class="content">
      <p>Thank you for your payment! Here are the details:</p>

      <div class="info-box">
        <p><strong>Job Posting:</strong> ${jobTitle}</p>
        <p><strong>Plan:</strong> ${tierName}</p>
        <p><strong>Amount Paid:</strong> ${amountPaid}</p>
      </div>

      ${receiptSection}

      <p>You'll receive another email once your job posting is live.</p>

      <div class="footer">
        <p>This is a receipt for your payment to <a href="https://sveltesociety.dev">Svelte Society</a>.</p>
      </div>
    </div>
  </div>
</body>
</html>`
}

export function formatReceiptLink(receiptUrl?: string): string {
	if (!receiptUrl) return ''
	return `<p><a href="${receiptUrl}">View your receipt →</a></p>`
}
