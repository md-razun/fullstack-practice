-- Create content_type enum
CREATE TYPE content_type_enum AS ENUM ('post', 'comment');

-- Create vote_type enum
CREATE TYPE vote_type_enum AS ENUM ('like', 'dislike');

-- Create likes_dislikes table
CREATE TABLE likes_dislikes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_type content_type_enum NOT NULL,
    content_id INTEGER NOT NULL,
    vote_type vote_type_enum NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_content_vote UNIQUE (user_id, content_type, content_id)
);

-- Create indexes for likes_dislikes table
CREATE INDEX idx_likes_dislikes_user_id ON likes_dislikes(user_id);
CREATE INDEX idx_likes_dislikes_content_type_content_id ON likes_dislikes(content_type, content_id);

-- Add foreign key constraints for content_id based on content_type
-- This requires a trigger because native foreign keys cannot be conditional.

CREATE OR REPLACE FUNCTION check_content_exists()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.content_type = 'post' THEN
        IF NOT EXISTS (SELECT 1 FROM posts WHERE id = NEW.content_id) THEN
            RAISE EXCEPTION 'Content post not found: %', NEW.content_id;
        END IF;
    ELSIF NEW.content_type = 'comment' THEN
        IF NOT EXISTS (SELECT 1 FROM comments WHERE id = NEW.content_id) THEN
            RAISE EXCEPTION 'Content comment not found: %', NEW.content_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_content_exists
BEFORE INSERT OR UPDATE ON likes_dislikes
FOR EACH ROW EXECUTE FUNCTION check_content_exists();
