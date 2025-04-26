import { test } from 'magnitude-test';

test('view collections', { url: 'http://localhost:5173' })
    .step('Go to the collections page')
    .step('Click on the first post in a collection')
        .check('Should show the post')
