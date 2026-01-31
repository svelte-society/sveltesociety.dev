<script lang="ts">
	let { data } = $props()
</script>

<div class="container mx-auto max-w-4xl px-4">
	<h1 class="text-svelte-900 mb-8 text-3xl font-bold">Terms of Service</h1>

	<div class="prose prose-slate max-w-none">
		<p class="mb-6 text-slate-600">
			Svelte Society is operated by Svelte School AB, a Swedish company (org. nr 559260-8987). By
			using our services or making purchases, you are entering into an agreement with Svelte School
			AB.
		</p>

		<h2 class="text-svelte-900 mt-6 mb-3 text-xl font-semibold">1. Acceptance of Terms</h2>
		<p>
			By accessing or using Svelte Society's website, services, or content, you agree to be bound by
			these Terms of Service. If you do not agree to these terms, please do not use our services.
		</p>

		<h2 class="text-svelte-900 mt-6 mb-3 text-xl font-semibold">2. Description of Service</h2>
		<p>
			Svelte Society provides resources, information, and community support for the Svelte
			framework. Our services include documentation, tutorials, community forums, events
			information, and other related content.
		</p>

		<h2 class="text-svelte-900 mt-6 mb-3 text-xl font-semibold">3. User Conduct</h2>
		<p>
			You agree to use our services only for lawful purposes and in a way that does not infringe
			upon the rights of others. Prohibited conduct includes but is not limited to:
		</p>
		<ul class="mt-2 mb-4 list-disc pl-6">
			<li>Violating any applicable laws or regulations</li>
			<li>Sharing malicious software or content</li>
			<li>Impersonating others or providing false information</li>
			<li>Interfering with the proper functioning of the services</li>
			<li>Engaging in harassment or abusive behavior</li>
		</ul>

		<h2 class="text-svelte-900 mt-6 mb-3 text-xl font-semibold">4. Intellectual Property</h2>
		<p>
			All content, trademarks, logos, and service marks displayed on the Svelte Society website are
			the property of their respective owners. You agree not to reproduce, duplicate, copy, sell, or
			exploit any portion of our services without express written permission.
		</p>

		<h2 class="text-svelte-900 mt-6 mb-3 text-xl font-semibold">5. User Accounts</h2>
		<p>
			If you create an account on our website, you are responsible for maintaining the security of
			your account and the activities that occur under your account. We reserve the right to
			terminate accounts that violate our terms.
		</p>

		<h2 class="text-svelte-900 mt-6 mb-3 text-xl font-semibold">6. Paid Services</h2>
		<p>
			Svelte School AB offers paid services through Svelte Society, including sponsor placements and
			job postings. By purchasing any paid service, you are entering into an agreement with Svelte
			School AB and agree to the following:
		</p>
		<ul class="mt-2 mb-4 list-disc pl-6">
			<li>All sales are final. No refunds or cancellations will be provided.</li>
			<li>Pricing is as displayed at the time of purchase.</li>
			<li>
				Sponsor placements and job postings are subject to approval and may be rejected if they
				violate our content guidelines.
			</li>
			<li>
				Duration of placements (e.g., 30 days for job postings, monthly/yearly for sponsorships) is
				as specified at checkout.
			</li>
		</ul>

		<h2 class="text-svelte-900 mt-6 mb-3 text-xl font-semibold">7. VAT and Tax Information</h2>
		<p>
			If you are purchasing as a business, you are responsible for entering your correct VAT number
			during checkout. Svelte School AB is not responsible for incorrect tax calculations resulting
			from missing or incorrect VAT information. Applicable taxes will be calculated and collected
			automatically based on your location and VAT status.
		</p>

		<h2 class="text-svelte-900 mt-6 mb-3 text-xl font-semibold">8. Payment Processing</h2>
		<p>
			All payments are processed securely by Stripe. Invoices for your purchases will be sent via
			Stripe to the email address provided during checkout. By making a purchase, you also agree to
			Stripe's terms of service and privacy policy.
		</p>

		<h2 class="text-svelte-900 mt-6 mb-3 text-xl font-semibold">
			9. Content Moderation for Paid Placements
		</h2>
		<p>
			Svelte Society reserves the right to reject, remove, or modify any paid content (including
			sponsor placements and job postings) that violates our guidelines or is deemed inappropriate.
			No refunds will be provided for content that is rejected or removed due to guideline
			violations.
		</p>

		<h2 class="text-svelte-900 mt-6 mb-3 text-xl font-semibold">10. Limitation of Liability</h2>
		<p>
			Svelte Society provides resources on an "as is" and "as available" basis. We make no
			warranties, expressed or implied, regarding the reliability, accuracy, or availability of our
			services.
		</p>

		<h2 class="text-svelte-900 mt-6 mb-3 text-xl font-semibold">11. Changes to Terms</h2>
		<p>
			We reserve the right to modify these terms at any time. Changes will be effective immediately
			upon posting. Your continued use of our services after changes indicates your acceptance of
			the updated terms.
		</p>

		<h2 class="text-svelte-900 mt-6 mb-3 text-xl font-semibold">12. Contact Information</h2>
		<p>
			If you have any questions about these Terms of Service, please contact us through our website
			or community channels.

			<a href="mailto:hello@sveltesociety.com">hello@sveltesociety.com</a>
		</p>

		<div class="mt-8 text-sm text-slate-600">
			<p>Last updated: January 2026</p>
		</div>
	</div>

	<div class="mt-10 border-t border-slate-200 pt-6">
		<a href="/" class="text-svelte-900 hover:text-svelte-500 font-medium">Back to Home</a>
	</div>
</div>
