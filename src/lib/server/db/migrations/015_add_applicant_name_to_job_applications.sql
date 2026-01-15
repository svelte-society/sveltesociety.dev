-- Migration: Add applicant_name to job_applications
-- Allows applicants to provide a contact name that may differ from their profile name

ALTER TABLE job_applications ADD COLUMN applicant_name TEXT;
