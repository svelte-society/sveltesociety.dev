-- Migration: Update tier features
-- Removes "Homepage spotlight" from premium job tier
-- Updates sponsor premium tier to mention 20,000+ followers

UPDATE job_tiers
SET features = '["60-day listing", "Premium badge", "Top search ranking", "Social media promotion", "Newsletter feature"]'
WHERE name = 'premium';

UPDATE sponsor_tiers
SET features = '["2x larger logo", "Logo in feed cards", "Logo in sidebar", "Extended tagline (200 chars)", "Website link", "Optional discount code", "Monthly promotion to 20,000+ followers"]'
WHERE name = 'premium';
