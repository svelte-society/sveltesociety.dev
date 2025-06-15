-- Create placement_locations table for dynamic placement definitions
CREATE TABLE IF NOT EXISTS placement_locations (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default placement locations
INSERT INTO placement_locations (key, name, description) VALUES
    ('header', 'Header', 'Displays at the top of the page header'),
    ('footer', 'Footer', 'Displays in the page footer'),
    ('sidebar', 'Sidebar', 'Displays in the sidebar'),
    ('modal', 'Modal', 'Displays as a modal popup'),
    ('banner', 'Banner', 'Displays as a full-width banner');

-- Create announcement_placements table
CREATE TABLE IF NOT EXISTS announcement_placements (
    id TEXT PRIMARY KEY DEFAULT (hex(randomblob(8))),
    content_id TEXT NOT NULL,
    placement_location_id TEXT NOT NULL,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
    FOREIGN KEY (placement_location_id) REFERENCES placement_locations(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for efficient queries
CREATE INDEX idx_announcement_placements_active ON announcement_placements(placement_location_id, is_active, start_date, end_date);
CREATE INDEX idx_announcement_placements_content ON announcement_placements(content_id);

-- Create trigger to update updated_at timestamp for placement_locations
CREATE TRIGGER update_placement_locations_timestamp 
AFTER UPDATE ON placement_locations
BEGIN
    UPDATE placement_locations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Create trigger to update updated_at timestamp for announcement_placements
CREATE TRIGGER update_announcement_placements_timestamp 
AFTER UPDATE ON announcement_placements
BEGIN
    UPDATE announcement_placements SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;