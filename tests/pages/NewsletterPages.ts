import type { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * NewsletterSubscribePage - Page Object for the newsletter subscribe form
 *
 * Represents the newsletter subscription form in the sidebar.
 */
export class NewsletterSubscribePage extends BasePage {
	/**
	 * Navigate to a page with the newsletter subscribe form visible
	 */
	async goto(): Promise<void> {
		await super.goto('/')
	}

	// Selectors

	/**
	 * Newsletter subscribe container
	 */
	get subscribeContainer(): Locator {
		return this.page.getByTestId('newsletter-subscribe')
	}

	/**
	 * Email input field
	 */
	get emailInput(): Locator {
		return this.page.getByTestId('newsletter-email-input')
	}

	/**
	 * Submit button
	 */
	get submitButton(): Locator {
		return this.page.getByTestId('newsletter-submit')
	}

	/**
	 * Success message element
	 */
	get successMessage(): Locator {
		return this.page.getByTestId('newsletter-success')
	}

	/**
	 * Error message element
	 */
	get errorMessage(): Locator {
		return this.page.getByTestId('newsletter-error')
	}

	// Actions

	/**
	 * Subscribe with an email address
	 * @param email - Email address to subscribe
	 */
	async subscribe(email: string): Promise<void> {
		await this.emailInput.fill(email)
		await this.submitButton.click()
	}

	/**
	 * Submit the form without entering an email
	 */
	async submitEmpty(): Promise<void> {
		await this.submitButton.click()
	}

	// Assertions

	/**
	 * Verify the subscribe form is visible
	 */
	async expectFormVisible(): Promise<void> {
		await this.subscribeContainer.waitFor({ state: 'visible' })
		await this.emailInput.waitFor({ state: 'visible' })
	}

	/**
	 * Verify success state is shown
	 */
	async expectSuccess(): Promise<void> {
		await this.successMessage.waitFor({ state: 'visible' })
	}

	/**
	 * Verify error state is shown
	 */
	async expectError(): Promise<void> {
		await this.errorMessage.waitFor({ state: 'visible' })
	}

	/**
	 * Check if loading state is active
	 */
	async isLoading(): Promise<boolean> {
		const buttonText = await this.submitButton.textContent()
		return buttonText?.includes('Subscribing') ?? false
	}
}

/**
 * NewsletterConfirmPage - Page Object for the newsletter confirmation page
 *
 * Handles the email confirmation flow for double opt-in subscriptions.
 */
export class NewsletterConfirmPage extends BasePage {
	/**
	 * Navigate to confirmation page with a specific token
	 * @param token - Confirmation token
	 */
	async goto(token: string): Promise<void> {
		await super.goto(`/newsletter/confirm/${token}`)
	}

	// Selectors

	/**
	 * Confirmation page container
	 */
	get pageContainer(): Locator {
		return this.page.getByTestId('newsletter-confirm-page')
	}

	/**
	 * Page title
	 */
	get title(): Locator {
		return this.page.getByTestId('confirm-title')
	}

	/**
	 * Page message
	 */
	get message(): Locator {
		return this.page.getByTestId('confirm-message')
	}

	/**
	 * Hidden status element (for checking exact status)
	 */
	get statusElement(): Locator {
		return this.page.getByTestId('confirm-status')
	}

	/**
	 * Browse content button
	 */
	get browseButton(): Locator {
		return this.page.getByTestId('browse-button')
	}

	/**
	 * Try again button (only visible on error states)
	 */
	get tryAgainButton(): Locator {
		return this.page.getByTestId('try-again-button')
	}

	// Assertions

	/**
	 * Verify page is loaded
	 */
	async expectPageLoaded(): Promise<void> {
		await this.pageContainer.waitFor({ state: 'visible' })
	}

	/**
	 * Get the current status
	 */
	async getStatus(): Promise<string> {
		const status = await this.statusElement.getAttribute('data-status')
		return status ?? ''
	}

	/**
	 * Verify success state
	 */
	async expectSuccess(): Promise<void> {
		await this.title.waitFor({ state: 'visible' })
		await expect(this.title).toHaveText('Subscription Confirmed!')
	}

	/**
	 * Verify invalid token state
	 */
	async expectInvalid(): Promise<void> {
		await this.title.waitFor({ state: 'visible' })
		await expect(this.title).toHaveText('Invalid Link')
		await expect(this.tryAgainButton).toBeVisible()
	}

	/**
	 * Verify error state
	 */
	async expectError(): Promise<void> {
		await this.title.waitFor({ state: 'visible' })
		await expect(this.title).toHaveText('Something Went Wrong')
		await expect(this.tryAgainButton).toBeVisible()
	}
}

/**
 * AdminCampaignListPage - Page Object for admin newsletter campaign list
 */
export class AdminCampaignListPage extends BasePage {
	/**
	 * Navigate to the campaign list page
	 */
	async goto(): Promise<void> {
		await super.goto('/admin/newsletter')
	}

	// Selectors

	/**
	 * New campaign button
	 */
	get newCampaignButton(): Locator {
		return this.page.getByTestId('new-campaign-button')
	}

	/**
	 * Campaigns table
	 */
	get campaignsTable(): Locator {
		return this.page.getByTestId('campaigns-table')
	}

	/**
	 * Page heading
	 */
	get heading(): Locator {
		return this.page.getByRole('heading', { name: 'Newsletter Campaigns' })
	}

	// Actions

	/**
	 * Click the new campaign button
	 */
	async clickNewCampaign(): Promise<void> {
		await this.newCampaignButton.click()
	}

	/**
	 * Get the number of campaigns in the table
	 */
	async getCampaignCount(): Promise<number> {
		const rows = this.campaignsTable.locator('tbody tr')
		return await rows.count()
	}

	/**
	 * Click edit for a specific campaign by title
	 * @param title - Campaign title to find
	 */
	async clickEditByTitle(title: string): Promise<void> {
		const row = this.campaignsTable.locator('tbody tr', { hasText: title })
		await row.getByRole('link', { name: /edit/i }).click()
	}

	/**
	 * Click delete for a specific campaign by title
	 * @param title - Campaign title to find
	 */
	async clickDeleteByTitle(title: string): Promise<void> {
		const row = this.campaignsTable.locator('tbody tr', { hasText: title })
		await row.getByRole('button', { name: /delete/i }).click()
	}

	// Assertions

	/**
	 * Verify the campaigns list page is loaded
	 */
	async expectPageLoaded(): Promise<void> {
		await this.heading.waitFor({ state: 'visible' })
		await this.newCampaignButton.waitFor({ state: 'visible' })
	}

	/**
	 * Verify a campaign is in the list by title
	 * @param title - Campaign title to check
	 */
	async expectCampaignInList(title: string): Promise<void> {
		const row = this.campaignsTable.locator('tbody tr', { hasText: title })
		await row.waitFor({ state: 'visible' })
	}

	/**
	 * Verify the table is empty (no campaigns)
	 */
	async expectEmptyTable(): Promise<boolean> {
		const count = await this.getCampaignCount()
		return count === 0
	}
}

/**
 * UserNewsletterPage - Page Object for user newsletter subscription modal/page
 *
 * Handles both the standalone page at /newsletter/subscribe and the modal
 * that appears for logged-in users who haven't been asked about newsletter yet.
 */
export class UserNewsletterPage extends BasePage {
	/**
	 * Navigate to the standalone newsletter subscribe page
	 */
	async goto(): Promise<void> {
		await super.goto('/newsletter/subscribe')
	}

	// Selectors

	/**
	 * Newsletter subscribe page container
	 */
	get pageContainer(): Locator {
		return this.page.getByTestId('newsletter-subscribe-page')
	}

	/**
	 * Newsletter modal dialog (open state)
	 * Using [open] attribute to detect when dialog is actually shown via showModal()
	 */
	get modal(): Locator {
		return this.page.locator('#newsletter-modal[open]')
	}

	/**
	 * Newsletter modal dialog (any state)
	 */
	get modalElement(): Locator {
		return this.page.locator('#newsletter-modal')
	}

	/**
	 * Subscribe button
	 */
	get subscribeButton(): Locator {
		return this.page.getByTestId('newsletter-subscribe-btn')
	}

	/**
	 * Decline button
	 */
	get declineButton(): Locator {
		return this.page.getByTestId('newsletter-decline-btn')
	}

	/**
	 * Success message element
	 */
	get successMessage(): Locator {
		return this.page.getByTestId('newsletter-success')
	}

	/**
	 * User menu trigger button
	 */
	get userMenuTrigger(): Locator {
		return this.page.getByTestId('user-menu-trigger')
	}

	/**
	 * Newsletter subscribe menu item in user menu
	 */
	get subscribeMenuItem(): Locator {
		return this.page.getByTestId('newsletter-subscribe-menu-item')
	}

	/**
	 * Newsletter preferences menu item in user menu (for subscribed users)
	 */
	get preferencesMenuItem(): Locator {
		return this.page.getByTestId('newsletter-preferences-menu-item')
	}

	/**
	 * Sidebar newsletter subscribe component
	 */
	get sidebarNewsletter(): Locator {
		return this.page.getByTestId('newsletter-subscribe')
	}

	// Actions

	/**
	 * Click subscribe button in modal
	 */
	async clickSubscribe(): Promise<void> {
		await this.subscribeButton.click()
	}

	/**
	 * Click decline button in modal
	 */
	async clickDecline(): Promise<void> {
		await this.declineButton.click()
	}

	/**
	 * Open user menu and click subscribe to newsletter
	 */
	async openNewsletterFromMenu(): Promise<void> {
		await this.userMenuTrigger.click()
		await this.subscribeMenuItem.waitFor({ state: 'visible' })
		await this.subscribeMenuItem.click()
	}

	/**
	 * Open user menu
	 */
	async openUserMenu(): Promise<void> {
		await this.userMenuTrigger.click()
	}

	// Assertions

	/**
	 * Verify modal is visible (dialog is open)
	 * Native dialog elements need special handling - check for [open] attribute
	 */
	async expectModalVisible(): Promise<void> {
		// Wait for the dialog with [open] attribute to appear
		await this.modal.waitFor({ state: 'attached', timeout: 15000 })
		await expect(this.subscribeButton).toBeVisible()
	}

	/**
	 * Verify modal is not visible (dialog is closed)
	 * Check that the dialog doesn't have the [open] attribute
	 */
	async expectModalNotVisible(): Promise<void> {
		// Wait for the dialog to not have [open] attribute (or not exist)
		await expect(this.modal).toHaveCount(0, { timeout: 15000 })
	}

	/**
	 * Verify success message is shown
	 */
	async expectSuccess(): Promise<void> {
		await this.successMessage.waitFor({ state: 'visible' })
	}

	/**
	 * Verify sidebar newsletter is visible
	 */
	async expectSidebarNewsletterVisible(): Promise<void> {
		await this.sidebarNewsletter.waitFor({ state: 'visible' })
	}

	/**
	 * Verify sidebar newsletter is not visible
	 */
	async expectSidebarNewsletterNotVisible(): Promise<void> {
		await expect(this.sidebarNewsletter).not.toBeVisible()
	}

	/**
	 * Verify subscribe menu item is visible in user menu
	 */
	async expectSubscribeMenuItemVisible(): Promise<void> {
		await this.subscribeMenuItem.waitFor({ state: 'visible' })
	}

	/**
	 * Verify preferences menu item is visible in user menu
	 */
	async expectPreferencesMenuItemVisible(): Promise<void> {
		await this.preferencesMenuItem.waitFor({ state: 'visible' })
	}
}

/**
 * AdminCampaignEditorPage - Page Object for admin campaign editor (new and edit)
 */
export class AdminCampaignEditorPage extends BasePage {
	/**
	 * Navigate to the new campaign page
	 */
	async gotoNew(): Promise<void> {
		await super.goto('/admin/newsletter/new')
	}

	/**
	 * Navigate to edit a specific campaign
	 * @param id - Campaign ID to edit
	 */
	async gotoEdit(id: string): Promise<void> {
		await super.goto(`/admin/newsletter/${id}`)
	}

	// Selectors

	/**
	 * Campaign type selector buttons
	 */
	get contentHighlightsTypeButton(): Locator {
		return this.page.getByTestId('campaign-type-content_highlights')
	}

	get announcementTypeButton(): Locator {
		return this.page.getByTestId('campaign-type-announcement')
	}

	get jobsRoundupTypeButton(): Locator {
		return this.page.getByTestId('campaign-type-jobs_roundup')
	}

	/**
	 * Campaign title input
	 */
	get titleInput(): Locator {
		return this.page.getByTestId('input-title')
	}

	/**
	 * Email subject input
	 */
	get subjectInput(): Locator {
		return this.page.getByTestId('input-subject')
	}

	/**
	 * Introduction text textarea (for content_highlights type)
	 */
	get introTextarea(): Locator {
		return this.page.getByTestId('textarea-intro-text')
	}

	/**
	 * Announcement body textarea (for announcement type)
	 */
	get announcementBodyTextarea(): Locator {
		return this.page.getByTestId('textarea-announcement-body')
	}

	/**
	 * CTA text input (for announcement type)
	 */
	get ctaTextInput(): Locator {
		return this.page.getByTestId('input-cta-text')
	}

	/**
	 * CTA URL input (for announcement type)
	 */
	get ctaUrlInput(): Locator {
		return this.page.getByTestId('input-cta-url')
	}

	/**
	 * Jobs intro textarea (for jobs_roundup type)
	 */
	get jobsIntroTextarea(): Locator {
		return this.page.getByTestId('textarea-jobs-intro')
	}

	/**
	 * Submit button
	 */
	get submitButton(): Locator {
		return this.page.getByRole('button', { name: /create campaign|update campaign/i })
	}

	/**
	 * Cancel button
	 */
	get cancelButton(): Locator {
		return this.page.getByRole('link', { name: /cancel/i })
	}

	/**
	 * New Campaign heading
	 */
	get newCampaignHeading(): Locator {
		return this.page.getByRole('heading', { name: 'New Campaign' })
	}

	/**
	 * Edit Campaign heading
	 */
	get editCampaignHeading(): Locator {
		return this.page.getByRole('heading', { name: 'Edit Campaign' })
	}

	// Actions

	/**
	 * Select a campaign type
	 */
	async selectCampaignType(
		type: 'content_highlights' | 'announcement' | 'jobs_roundup'
	): Promise<void> {
		switch (type) {
			case 'content_highlights':
				await this.contentHighlightsTypeButton.click()
				break
			case 'announcement':
				await this.announcementTypeButton.click()
				break
			case 'jobs_roundup':
				await this.jobsRoundupTypeButton.click()
				break
		}
	}

	/**
	 * Fill in campaign details
	 * @param title - Campaign title
	 * @param subject - Email subject
	 * @param introText - Optional introduction text
	 */
	async fillCampaignDetails(title: string, subject: string, introText?: string): Promise<void> {
		await this.titleInput.fill(title)
		await this.subjectInput.fill(subject)
		if (introText) {
			await this.introTextarea.fill(introText)
		}
	}

	/**
	 * Fill in announcement-specific fields
	 */
	async fillAnnouncementFields(bodyHtml: string, ctaText?: string, ctaUrl?: string): Promise<void> {
		await this.announcementBodyTextarea.fill(bodyHtml)
		if (ctaText) {
			await this.ctaTextInput.fill(ctaText)
		}
		if (ctaUrl) {
			await this.ctaUrlInput.fill(ctaUrl)
		}
	}

	/**
	 * Fill in jobs roundup intro
	 */
	async fillJobsIntro(introText: string): Promise<void> {
		await this.jobsIntroTextarea.fill(introText)
	}

	/**
	 * Submit the campaign form
	 */
	async submit(): Promise<void> {
		await this.submitButton.click()
	}

	/**
	 * Create a new campaign with the given details
	 * @param title - Campaign title
	 * @param subject - Email subject
	 * @param introText - Optional introduction text
	 */
	async createCampaign(title: string, subject: string, introText?: string): Promise<void> {
		await this.fillCampaignDetails(title, subject, introText)
		await this.submit()
	}

	/**
	 * Click cancel button
	 */
	async cancel(): Promise<void> {
		await this.cancelButton.click()
	}

	// Assertions

	/**
	 * Verify the new campaign page is loaded
	 */
	async expectNewPageLoaded(): Promise<void> {
		await this.newCampaignHeading.waitFor({ state: 'visible' })
		await this.titleInput.waitFor({ state: 'visible' })
	}

	/**
	 * Verify the edit campaign page is loaded
	 */
	async expectEditPageLoaded(): Promise<void> {
		await this.editCampaignHeading.waitFor({ state: 'visible' })
		await this.titleInput.waitFor({ state: 'visible' })
	}

	/**
	 * Verify form has expected values
	 * @param title - Expected title value
	 * @param subject - Expected subject value
	 */
	async expectFormValues(title: string, subject: string): Promise<void> {
		await this.titleInput.waitFor({ state: 'visible' })
	}
}
