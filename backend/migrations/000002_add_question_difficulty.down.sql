ALTER TABLE questions
    DROP CONSTRAINT IF EXISTS chk_question_difficulty;

ALTER TABLE questions
    DROP COLUMN IF EXISTS difficulty;
