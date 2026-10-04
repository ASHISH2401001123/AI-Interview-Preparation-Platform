const axios = require('axios');

/**
 * AI Service Module
 * Handles answer evaluation using Gemini API or fallback intelligent evaluator.
 */

async function evaluateInterviewAnswer(questionText, answerText, category = 'General', type = 'Technical') {
  const apiKey = process.env.AI_API_KEY;

  if (apiKey && apiKey.trim() !== '') {
    try {
      const response = await callGeminiAPI(questionText, answerText, category, type, apiKey);
      if (response) return response;
    } catch (err) {
      console.warn('AI API call failed, falling back to mock evaluator:', err.message);
    }
  }

  // Fallback Intelligent Mock Evaluator
  return generateMockAnswerEvaluation(questionText, answerText, category, type);
}

async function evaluateFullInterview(interviewData) {
  const apiKey = process.env.AI_API_KEY;

  if (apiKey && apiKey.trim() !== '') {
    try {
      const response = await callGeminiFullInterview(interviewData, apiKey);
      if (response) return response;
    } catch (err) {
      console.warn('AI Full Interview API call failed, falling back to mock evaluator:', err.message);
    }
  }

  return generateMockFullInterviewEvaluation(interviewData);
}

/**
 * Gemini API call for individual answer evaluation
 */
async function callGeminiAPI(questionText, answerText, category, type, apiKey) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `
You are an expert technical & HR interviewer. Evaluate the candidate's answer to the following interview question.

Category: ${category}
Type: ${type}
Question: "${questionText}"
Candidate Answer: "${answerText}"

Provide your response strictly in raw JSON format matching this schema without markdown code blocks:
{
  "score": <number 0-100>,
  "technicalScore": <number 0-100>,
  "communicationScore": <number 0-100>,
  "relevanceScore": <number 0-100>,
  "confidenceScore": <number 0-100>,
  "strengths": [<string>, <string>],
  "weaknesses": [<string>, <string>],
  "suggestions": [<string>, <string>],
  "improvedAnswer": "<detailed exemplary model answer>",
  "topicsToRevise": [<string>]
}
`;

  const response = await axios.post(endpoint, {
    contents: [{ parts: [{ text: prompt }] }]
  }, { headers: { 'Content-Type': 'application/json' }, timeout: 15000 });

  const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Gemini API call for full interview summary
 */
async function callGeminiFullInterview(interviewData, apiKey) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const answersFormatted = interviewData.answers.map((a, i) => 
    `Q${i+1}: ${a.questionText}\nCandidate Answer: ${a.answer}\nScore: ${a.score}`
  ).join('\n\n');

  const prompt = `
Analyze the candidate's overall performance in a ${interviewData.difficulty} ${interviewData.type} interview.

QA Breakdown:
${answersFormatted}

Provide final overall evaluation strictly in JSON format without markdown wrappers:
{
  "score": <overall score 0-100>,
  "technicalScore": <number 0-100>,
  "communicationScore": <number 0-100>,
  "relevanceScore": <number 0-100>,
  "confidenceScore": <number 0-100>,
  "strengths": [<string>, <string>, <string>],
  "weaknesses": [<string>, <string>, <string>],
  "suggestions": [<string>, <string>, <string>],
  "topicsToRevise": [<string>, <string>]
}
`;

  const response = await axios.post(endpoint, {
    contents: [{ parts: [{ text: prompt }] }]
  }, { headers: { 'Content-Type': 'application/json' }, timeout: 20000 });

  const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Intelligent Fallback Mock Evaluation Engine
 */
function generateMockAnswerEvaluation(questionText, answerText, category, type) {
  const text = (answerText || '').trim();
  const wordCount = text ? text.split(/\s+/).length : 0;

  if (wordCount < 5) {
    return {
      score: 30,
      technicalScore: 25,
      communicationScore: 35,
      relevanceScore: 30,
      confidenceScore: 30,
      strengths: ["Attempted to answer"],
      weaknesses: ["Answer is extremely brief", "Lacks depth, technical detail, and context"],
      suggestions: ["Elaborate on core concepts using the STAR method (Situation, Task, Action, Result)", "Provide explicit code snippets or real-world examples"],
      improvedAnswer: `A comprehensive answer for "${questionText}" should detail key concepts, practical implementation steps, trade-offs, and clear domain terminology.`,
      topicsToRevise: [category, "Core Fundamentals"]
    };
  }

  // Key domain keywords check
  const domainKeywords = ['object', 'class', 'complexity', 'database', 'process', 'thread', 'memory', 'index', 'function', 'api', 'state', 'component', 'async', 'promise', 'structure', 'query', 'network', 'protocol', 'pattern', 'algorithm', 'time', 'space', 'lead', 'team', 'challenge', 'solution', 'experience', 'goal'];
  const matchedKeywords = domainKeywords.filter(kw => text.toLowerCase().includes(kw));

  let score = Math.min(95, Math.max(50, Math.floor(60 + wordCount * 0.4 + matchedKeywords.length * 4)));
  let technicalScore = type === 'HR' ? Math.min(95, score + 2) : Math.min(98, score + matchedKeywords.length * 3);
  let communicationScore = Math.min(95, Math.floor(65 + wordCount * 0.35));
  let relevanceScore = Math.min(95, Math.floor(70 + matchedKeywords.length * 3.5));
  let confidenceScore = Math.floor((communicationScore + relevanceScore) / 2);

  const strengths = [];
  if (wordCount > 30) strengths.push("Good depth and detail in response");
  if (matchedKeywords.length > 2) strengths.push(`Used relevant domain vocabulary (${matchedKeywords.slice(0, 3).join(', ')})`);
  strengths.push("Clear structure and logical flow");

  const weaknesses = [];
  if (wordCount < 25) weaknesses.push("Response could benefit from deeper technical illustration");
  if (matchedKeywords.length < 2) weaknesses.push("Could incorporate more industry-standard technical terminology");
  if (weaknesses.length === 0) weaknesses.push("Could include trade-offs or alternative edge cases");

  const suggestions = [
    "Structure your response using structured frameworks (e.g., STAR for HR, Problem-Approach-Complexity for Technical)",
    "Mention performance implications, time/space complexity, or scalability where applicable"
  ];

  return {
    score,
    technicalScore,
    communicationScore,
    relevanceScore,
    confidenceScore,
    strengths,
    weaknesses,
    suggestions,
    improvedAnswer: `To answer "${questionText}" effectively:\n1. State the core concept clearly.\n2. Detail the underlying mechanism and key components.\n3. Mention real-world applications or performance considerations.\nFor example: "${text.substring(0, 150)}..." can be enhanced by discussing trade-offs and concrete architectural decisions.`,
    topicsToRevise: [category, type === 'Technical' ? 'System Design & Optimization' : 'Behavioral Frameworks']
  };
}

function generateMockFullInterviewEvaluation(interviewData) {
  const answers = interviewData.answers || [];
  if (answers.length === 0) {
    return {
      score: 0,
      technicalScore: 0,
      communicationScore: 0,
      relevanceScore: 0,
      confidenceScore: 0,
      strengths: [],
      weaknesses: ["No answers submitted"],
      suggestions: ["Complete all interview questions for evaluation"],
      topicsToRevise: interviewData.topics || ['General']
    };
  }

  const avg = (arr) => Math.round(arr.reduce((acc, curr) => acc + curr, 0) / arr.length);

  const scores = answers.map(a => a.score || 65);
  const avgScore = avg(scores);

  const technicalScore = Math.min(98, Math.round(avgScore * 1.02));
  const communicationScore = Math.min(95, Math.round(avgScore * 0.98));
  const relevanceScore = Math.min(95, Math.round(avgScore * 1.01));
  const confidenceScore = Math.min(95, Math.round((communicationScore + relevanceScore) / 2));

  return {
    score: avgScore,
    technicalScore,
    communicationScore,
    relevanceScore,
    confidenceScore,
    strengths: [
      "Consistent communication across interview questions",
      "Solid foundational understanding of core topics",
      "Structured thought process during responses"
    ],
    weaknesses: [
      "Could elaborate more on system trade-offs and edge cases",
      "Opportunity to use more precise domain-specific terminology"
    ],
    suggestions: [
      "Practice answering using the STAR method for behavioral questions",
      "Review core data structures and algorithmic complexity for technical questions",
      "Take mock practice interviews regularly to build time management and confidence"
    ],
    topicsToRevise: Array.from(new Set([...(interviewData.topics || []), 'Data Structures', 'OOP Principles']))
  };
}

module.exports = {
  evaluateInterviewAnswer,
  evaluateFullInterview
};
