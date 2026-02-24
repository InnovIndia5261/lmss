-- LMS Production PostgreSQL Schema
-- Multi-tenant, UUID primary keys, soft delete, indexed

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations (white-label)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(100) UNIQUE,
  logo_url TEXT,
  primary_color VARCHAR(7),
  secondary_color VARCHAR(7),
  custom_domain VARCHAR(255),
  theme_settings JSONB DEFAULT '{}',
  feature_flags JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_orgs_subdomain ON organizations(subdomain) WHERE deleted_at IS NULL;

-- Plans
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  price_monthly DECIMAL(10,2) DEFAULT 0,
  price_yearly DECIMAL(10,2) DEFAULT 0,
  max_users INT DEFAULT -1,
  max_courses INT DEFAULT -1,
  max_storage_mb INT DEFAULT 0,
  features JSONB DEFAULT '[]',
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization Subscriptions
CREATE TABLE organization_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  status VARCHAR(20) NOT NULL CHECK (status IN ('Active','Trial','Expired','Cancelled')),
  started_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ,
  payment_provider VARCHAR(50),
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_subs_org ON organization_subscriptions(organization_id);

-- Usage Tracking
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  metric VARCHAR(50) NOT NULL,
  current_value INT DEFAULT 0,
  limit_value INT DEFAULT -1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, metric)
);
CREATE INDEX idx_usage_org ON usage_tracking(organization_id);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_users_org ON users(organization_id) WHERE deleted_at IS NULL;

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES users(id),
  category VARCHAR(100),
  level VARCHAR(50),
  status VARCHAR(20) DEFAULT 'Draft',
  enrollment_limit INT DEFAULT -1,
  has_certificate BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_courses_org ON courses(organization_id) WHERE deleted_at IS NULL;

-- Lessons
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  video_url TEXT,
  attachments JSONB DEFAULT '[]',
  "order" INT DEFAULT 0,
  release_date TIMESTAMPTZ,
  is_preview BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_lessons_course ON lessons(course_id);

-- Enrollments
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  progress_percent INT DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, student_id)
);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);

-- Assignments
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  max_marks INT DEFAULT 100,
  allow_late_submission BOOLEAN DEFAULT TRUE,
  late_penalty_percent INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_assignments_course ON assignments(course_id);

-- Submissions
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_url TEXT,
  text_answer TEXT,
  submitted_at TIMESTAMPTZ,
  marks INT,
  feedback TEXT,
  graded_by UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'Pending',
  is_late BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);

-- Exams
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  duration_minutes INT,
  total_marks INT DEFAULT 100,
  passing_marks INT,
  randomize_questions BOOLEAN DEFAULT TRUE,
  show_results_immediately BOOLEAN DEFAULT TRUE,
  allow_multiple_attempts BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_exams_course ON exams(course_id);

-- Questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB DEFAULT '[]',
  correct_answer VARCHAR(255),
  marks INT DEFAULT 10,
  difficulty VARCHAR(20),
  topic_tag VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_questions_exam ON questions(exam_id);

-- Exam Attempts
CREATE TABLE exam_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  answers JSONB DEFAULT '{}',
  score INT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'InProgress',
  passed BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_attempts_exam ON exam_attempts(exam_id);

-- XP Transactions
CREATE TABLE xp_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source VARCHAR(50) NOT NULL,
  points INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_xp_student ON xp_transactions(student_id);

-- Badges
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  condition_type VARCHAR(50),
  condition_value INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Badges
CREATE TABLE student_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(badge_id, student_id)
);
CREATE INDEX idx_student_badges_student ON student_badges(student_id);

-- Skill Nodes
CREATE TABLE skill_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  parent_skill_id UUID REFERENCES skill_nodes(id) ON DELETE SET NULL,
  required_course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  unlock_condition VARCHAR(50),
  unlock_value INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Skill Progress
CREATE TABLE student_skill_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_node_id UUID NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMPTZ,
  UNIQUE(student_id, skill_node_id)
);
CREATE INDEX idx_skill_progress_student ON student_skill_progress(student_id);

-- Live Sessions
CREATE TABLE live_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  scheduled_at TIMESTAMPTZ,
  duration_minutes INT,
  meeting_link TEXT,
  recording_link TEXT,
  status VARCHAR(20) DEFAULT 'Scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_live_org ON live_sessions(organization_id);

-- Plagiarism Reports
CREATE TABLE plagiarism_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  similarity_score INT,
  matched_submission_ids UUID[],
  flagged BOOLEAN DEFAULT FALSE,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_plagiarism_submission ON plagiarism_reports(submission_id);

-- Certificates
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  certificate_number VARCHAR(100) UNIQUE NOT NULL,
  verification_code VARCHAR(50) UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_certs_org ON certificates(organization_id);

-- Flashcards
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  difficulty INT DEFAULT 1,
  next_review_date TIMESTAMPTZ,
  interval_days INT DEFAULT 1,
  repetition_count INT DEFAULT 0,
  easiness_factor DECIMAL(4,2) DEFAULT 2.5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_flashcards_course ON flashcards(course_id);

-- Spaced Repetition Logs
CREATE TABLE spaced_repetition_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  flashcard_id UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
  result VARCHAR(20) NOT NULL,
  reviewed_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_srl_student ON spaced_repetition_logs(student_id);

-- Coding Problems
CREATE TABLE coding_problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty VARCHAR(20),
  input_format TEXT,
  output_format TEXT,
  sample_input TEXT,
  sample_output TEXT,
  constraints TEXT,
  test_cases JSONB DEFAULT '[]',
  time_limit_ms INT DEFAULT 1000,
  memory_limit_mb INT DEFAULT 128,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_coding_org ON coding_problems(organization_id);

-- Code Submissions
CREATE TABLE code_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID NOT NULL REFERENCES coding_problems(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language VARCHAR(50),
  code TEXT,
  status VARCHAR(20) DEFAULT 'Pending',
  score INT,
  execution_time INT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_code_sub_problem ON code_submissions(problem_id);

-- Contests
CREATE TABLE contests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  problems UUID[],
  leaderboard_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_contests_org ON contests(organization_id);

-- Analytics Snapshots
CREATE TABLE analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  metric_type VARCHAR(100) NOT NULL,
  data_json JSONB NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_analytics_org ON analytics_snapshots(organization_id);

-- Performance Profiles
CREATE TABLE performance_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  overall_score INT,
  strengths TEXT[],
  weaknesses TEXT[],
  learning_speed_score INT,
  consistency_score INT,
  risk_level VARCHAR(20),
  last_analyzed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_perf_org ON performance_profiles(organization_id);

-- Lesson Completions
CREATE TABLE lesson_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lesson_id, student_id)
);
CREATE INDEX idx_lc_student ON lesson_completions(student_id);
