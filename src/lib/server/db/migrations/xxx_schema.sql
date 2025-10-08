create table users (
    id         text primary key default (lower(hex(randomblob(8)))),
    email      text unique,
    username   text unique,
    name       text,
    avatar_url text,
    bio        text,
    location   text,
    twitter    text,
    role       integer,
    created_at text default (datetime()),

    foreign key (role) references roles(id)
) strict;

create table oauth_providers (
    id          integer primary key,
    name        text    not null unique,
    description text,
    is_enabled  integer not null check (is_enabled in (0, 1)) default 1, -- previously `active`
    created_at  text default (datetime())
) strict;

create table user_oauth (
    id               text primary key default (lower(hex(randomblob(8)))),
    user_id          text    not null,
    provider_id      integer not null,
    provider_user_id text    not null,
    access_token     text,
    refresh_token    text,
    token_expires_at text,
    profile_data     text check (json_valid(profile_data)),
    created_at       text default (datetime()),
    updated_at       text default (datetime()),

    unique(provider_id, provider_user_id),

    foreign key (user_id)     references users(id) on delete cascade,
    foreign key (provider_id) references oauth_providers(id)
) strict;

create index idx___user_oauth_user_id  on user_oauth(user_id);
create index idx___user_oauth_provider on user_oauth(provider_id, provider_user_id);

create table sessions (
    id            integer primary key,
    user_id       text not null,
    session_token text not null,
    expires_at    text not null,
    created_at    text default (datetime()),

    foreign key (user_id) references users(id) on delete cascade
) strict;

create index idx___user_id_idx on sessions(user_id);

create table roles (
    id          integer primary key autoincrement,
    name        text    not null unique,
    value       text    not null unique,
    description text    not null,
    is_enabled  integer not null check (is_enabled in (0, 1)) default 0, -- previously `active`
    created_at  text default (datetime())
    updated_at  text,
) strict;

create table content_to_users (
    content_id text not null,
    user_id    text not null,

    primary key (content_id, user_id),

    foreign key (content_id) references content(id) on delete cascade,
    foreign key (user_id)    references users(id)   on delete cascade
) strict;

create table tags (
    id         text primary key default (lower(hex(randomblob(8)))),
    name       text not null,
    slug       text not null unique,
    color      text,
    created_at text default (datetime()),
    updated_at text default (datetime())
) strict;

create table content_to_tags (
    content_id text not null,
    tag_id     text not null,

    primary key (content_id, tag_id),

    foreign key (content_id) references content(id) on delete cascade,
    foreign key (tag_id)     references tags(id)    on delete cascade
) strict;

create index idx___tag_id_idx on content_to_tags(tag_id);

create table likes (
    id         text primary key default (lower(hex(randomblob(8)))),
    user_id    text not null,
    target_id  text not null,
    created_at text default (datetime()),

    unique(user_id, target_id),

    foreign key (user_id)   references users(id)   on delete cascade,
    foreign key (target_id) references content(id) on delete cascade
) strict;

create table saves (
    id         text primary key default (lower(hex(randomblob(8)))),
    user_id    text not null,
    target_id  text not null,
    created_at text default (datetime()),

    unique(user_id, target_id),

    foreign key (user_id)   references users(id)   on delete cascade,
    foreign key (target_id) references content(id) on delete cascade
) strict;

create table moderation_queue (
    id    text primary key default (lower(hex(randomblob(8)))),

    title text generated always as (
        coalesce(json_extract(data, '$.title'), '<no title>')
    ) virtual,

    type         text not null,
    status       text not null default 'pending' check(status in ('pending', 'approved', 'rejected')),
    data         text not null check (json_valid(data)),
    submitted_by text not null,
    submitted_at text default (datetime()),
    moderated_by text,
    moderated_at text,

    foreign key (submitted_by) references users(id) on delete cascade,
    foreign key (moderated_by) references users(id) on delete set null
) strict;

create table cache (
    key        text primary key,
    value      text    not null,
    metadata   text,
    created_at integer not null,
    ttl        integer
) strict;

create index idx___cache_created_at on cache(created_at);

create table migrations (
    version    integer primary key,
    name       text not null,
    applied_at text default (datetime())
) strict;

--

create table content (
	id            text primary key default (lower(hex(randomblob(8)))),
	title         text not null unique,
	type          text not null check (type in ('recipe', 'video', 'library', 'announcement', 'link', 'blog', 'collection', 'event')),
	status        text not null default 'draft' check(status in ('draft', 'published', 'archived', 'pending_review')),
	body          text,
	rendered_body text,
	slug          text not null unique,
	description   text,
	metadata      text,
	children      text,
	fetched_at    text,
	created_at    text default (datetime()),
	updated_at    text default (datetime()),
	published_at  text,
	likes         integer not null check (likes >= 0) default 0,
	saves         integer not null check (saves >= 0) default 0
) strict;

create index idx___content_status on new_content (status);

insert into new_content
	id,
	title,
	type,
	status,
	body,
	rendered_body,
	slug,
	description,
	metadata,
	children,
	fetched_at,
	created_at,
	updated_at,
	published_at,
	likes,
	saves
select
	id,
	title,
	type,
	status,
	body,
	rendered_body,
	slug,
	description,
	metadata,
	children,
	created_at,
	created_at,
	updated_at,
	published_at,
	likes,
	saves
from
	content;

drop table table content;