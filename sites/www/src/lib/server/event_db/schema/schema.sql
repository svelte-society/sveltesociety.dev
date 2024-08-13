CREATE TABLE user_events (
    timestamp TIMESTAMP,
    user_id INTEGER,
    event_type VARCHAR,  -- 'signup', 'like', 'save', 'page_visit'
    content_id INTEGER,  -- NULL for signups, relevant for likes, saves, visits
    additional_info JSON -- For any extra information we might want to store
);