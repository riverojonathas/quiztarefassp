-- Add educational fields to user_profiles for school structure
ALTER TABLE user_profiles ADD COLUMN diretoria_ensino TEXT;
ALTER TABLE user_profiles ADD COLUMN escola TEXT;
ALTER TABLE user_profiles ADD COLUMN nivel_escolar TEXT;
ALTER TABLE user_profiles ADD COLUMN serie TEXT;
ALTER TABLE user_profiles ADD COLUMN turma TEXT;

-- Add comments for documentation
COMMENT ON COLUMN user_profiles.diretoria_ensino IS 'Diretoria de Ensino à qual o usuário pertence';
COMMENT ON COLUMN user_profiles.escola IS 'Escola à qual o usuário pertence';
COMMENT ON COLUMN user_profiles.nivel_escolar IS 'Nível escolar (ex.: Ensino Fundamental, Ensino Médio)';
COMMENT ON COLUMN user_profiles.serie IS 'Série/ano escolar (ex.: 1º ano, 2º ano)';
COMMENT ON COLUMN user_profiles.turma IS 'Turma do usuário (ex.: A, B, C)';