-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Planeamento', 'Em Curso', 'Concluído')),
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  media_url TEXT NOT NULL,
  media_desc TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create volunteers table
CREATE TABLE volunteers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Aprovado', 'Recusado')),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

-- Public read access for projects
CREATE POLICY "Public read access for projects" ON projects
  FOR SELECT USING (true);

-- Admin write access for projects (simplified for this demo, usually requires auth.uid check)
CREATE POLICY "Admin write access for projects" ON projects
  FOR ALL USING (true); -- In production, restrict this to authenticated admins

-- Public insert access for volunteers
CREATE POLICY "Public insert access for volunteers" ON volunteers
  FOR INSERT WITH CHECK (true);

-- Admin write access for volunteers
CREATE POLICY "Admin write access for volunteers" ON volunteers
  FOR ALL USING (true); -- In production, restrict this to authenticated admins
