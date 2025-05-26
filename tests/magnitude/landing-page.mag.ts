import { test } from 'magnitude-test'

test('displays posts by most likes', { url: 'http://localhost:5173' })
	.step('Change sort to most likes')
	.check('should see posts sorted by most likes')
