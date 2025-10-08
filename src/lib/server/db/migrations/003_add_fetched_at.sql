alter table content add column fetched_at text;

update content set fetched_at = created_at;