ALTER TABLE questions
    ADD COLUMN IF NOT EXISTS difficulty VARCHAR(10) NOT NULL DEFAULT 'medium';

ALTER TABLE questions
    DROP CONSTRAINT IF EXISTS chk_question_difficulty;

ALTER TABLE questions
    ADD CONSTRAINT chk_question_difficulty
    CHECK (difficulty IN ('simple', 'medium', 'hard'));
