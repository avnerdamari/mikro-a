const KEY = 'mikro-a-progress-v1'

export type ProgressData = {
  completedTopics: string[]
  mcqScores: Record<string, number>
  exerciseScores: Record<string, { easy: number; medium: number; hard: number }>
}

export function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { completedTopics: [], mcqScores: {}, exerciseScores: {} }
}

export function saveProgress(data: ProgressData) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch { /* ignore */ }
}

export function markTopicComplete(topicId: string) {
  const p = loadProgress()
  if (!p.completedTopics.includes(topicId)) {
    p.completedTopics.push(topicId)
    saveProgress(p)
  }
}

export function saveMcqScore(topicId: string, score: number) {
  const p = loadProgress()
  p.mcqScores[topicId] = Math.max(p.mcqScores[topicId] ?? 0, score)
  saveProgress(p)
}

export function saveExerciseScore(topicId: string, level: 'easy'|'medium'|'hard', score: number) {
  const p = loadProgress()
  if (!p.exerciseScores[topicId]) p.exerciseScores[topicId] = { easy: 0, medium: 0, hard: 0 }
  p.exerciseScores[topicId][level] = Math.max(p.exerciseScores[topicId][level], score)
  saveProgress(p)
}
