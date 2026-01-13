export const positionTypes = [
	{ value: 'full-time', label: 'Full-Time' },
	{ value: 'part-time', label: 'Part-Time' },
	{ value: 'contract', label: 'Contract' },
	{ value: 'internship', label: 'Internship' }
] as const

export const seniorityLevels = [
	{ value: 'entry', label: 'Entry Level' },
	{ value: 'junior', label: 'Junior' },
	{ value: 'mid', label: 'Mid-Level' },
	{ value: 'senior', label: 'Senior' },
	{ value: 'principal', label: 'Principal / Staff' }
] as const

export const remoteOptions = [
	{ value: 'remote', label: 'Remote' },
	{ value: 'hybrid', label: 'Hybrid' },
	{ value: 'on-site', label: 'On-Site' }
] as const

export const currencyOptions = [
	{ value: 'USD', label: 'USD ($)' },
	{ value: 'EUR', label: 'EUR (€)' },
	{ value: 'GBP', label: 'GBP (£)' }
] as const

// Helper to create label -> value lookup maps
type Option = { value: string; label: string }
function toLabelValueMap<T extends readonly Option[]>(options: T): Record<string, string> {
	return Object.fromEntries(options.map((o) => [o.label, o.value]))
}

// Label -> value mappings for search/filter redirects
export const positionTypeLabelMap = toLabelValueMap(positionTypes)
export const seniorityLevelLabelMap = toLabelValueMap(seniorityLevels)
export const remoteOptionsLabelMap = toLabelValueMap(remoteOptions)
