#!/bin/bash
# UserPromptSubmit hook that forces explicit skill evaluation
#
# This hook requires Claude to explicitly evaluate each available skill
# before proceeding with implementation.

cat <<'EOF'
INSTRUCTION: MANDATORY SKILL ACTIVATION SEQUENCE

Step 1 - EVALUATE (do this in your response):
For each skill below, state: [skill-name] - YES/NO - [reason]

Available skills for this project:
- component-builder: Creating/editing UI components in src/lib/ui/
- svelte-code-writer: Creating/editing .svelte or .svelte.ts/.svelte.js files
- using-remote-functions: Components that fetch data, submit forms, or run server commands
- admin-crud-page: Adding admin sections at /admin/[feature]
- page-builder: Building pages with forms, filters, pagination
- e2e-test-builder: Adding Playwright E2E tests for new features

Step 2 - ACTIVATE (do this immediately after Step 1):
IF any skills are YES → Use Skill(skill-name) tool for EACH relevant skill NOW
IF no skills are YES → State "No skills needed" and proceed

Step 3 - IMPLEMENT:
Only after Step 2 is complete, proceed with implementation.

CRITICAL: You MUST call Skill() tool in Step 2. Do NOT skip to implementation.
The evaluation (Step 1) is WORTHLESS unless you ACTIVATE (Step 2) the skills.

Example of correct sequence:
- component-builder: YES - creating a new UI component in src/lib/ui/
- svelte-code-writer: YES - writing a Svelte component
- using-remote-functions: YES - need to fetch data from server
- admin-crud-page: NO - not an admin page
- page-builder: NO - not building a list/detail page
- e2e-test-builder: YES - new feature needs tests

[Then IMMEDIATELY use Skill() tool:]
> Skill(component-builder)
> Skill(svelte-code-writer)
> Skill(using-remote-functions)
> Skill(e2e-test-builder)

[THEN and ONLY THEN start implementation]
EOF
