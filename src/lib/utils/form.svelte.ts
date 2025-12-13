import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit'

/**
 * Initialize a remote form with values from a getter function.
 * This properly hydrates the form while keeping it reactive.
 * It will NOT run extraneously on hydration, but will be reactive to updates.
 *
 * @param form The remote form to initialize
 * @param getter A function that returns the initial values
 */
export function initForm<T extends RemoteFormInput, R = unknown>(
	form: RemoteForm<T, R>,
	getter: () => Parameters<typeof form.fields.set>[0]
) {
	let hydrated = false

	form.fields.set(getter())

	$effect(() => {
		const values = getter()

		if (!hydrated) {
			hydrated = true
			return
		}

		form.fields.set(values)
	})
}
