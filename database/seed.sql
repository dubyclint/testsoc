-- Seed data for development
INSERT INTO profiles (id, email, username, role, is_verified) 
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@socialverse.com', 'admin', 'admin', true),
  ('00000000-0000-0000-0000-000000000002', 'user@socialverse.com', 'testuser', 'user', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO posts (content, author, user_id)
VALUES 
  ('Welcome to Socialverse! 🎉', 'admin', '00000000-0000-0000-0000-000000000001'),
  ('This is a test post with **markdown** support!', 'testuser', '00000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;
