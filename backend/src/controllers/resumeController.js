import fetch from 'node-fetch';
import { ENV } from '../lib/env.js';

function heuristicAnalyze(text, jobDescription = null) {
  const normalized = (text || '').replace(/\s+/g, ' ').trim();
  const wordCount = normalized ? normalized.split(' ').length : 0;
  const lowercase = (text || '').toLowerCase();

  const emailMatch = text && text.match(/[\w.-]+@[\w.-]+\.[A-Za-z]{2,6}/);
  const phoneMatch = text && text.match(/\+?\d[\d\s()-]{6,}\d/);
  const nameMatch = text && text.match(/(?:^|\n)([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/m);

  const skillsList = ["javascript","react","node","python","java","sql","aws","docker","kubernetes","html","css","typescript","golang","rust","c#","php","ruby"];
  const foundSkills = [];
  for (const s of skillsList) if (lowercase.includes(s) && !foundSkills.includes(s)) foundSkills.push(s);

  const hasExperience = lowercase.includes('experience') || lowercase.includes('worked') || lowercase.includes('project');
  const hasEducation = lowercase.includes('education') || lowercase.includes('degree') || lowercase.includes('university');
  const hasCertifications = lowercase.includes('certification') || lowercase.includes('certified');

  let atsScore = 60;
  if (emailMatch) atsScore += 10;
  if (phoneMatch) atsScore += 10;
  if (hasEducation) atsScore += 10;
  if (foundSkills.length >= 3) atsScore += 10;
  if (wordCount > 300) atsScore += 5;
  atsScore = Math.min(atsScore, 100);

  let toneScore = 65;
  const professionalWords = ['demonstrated','implemented','developed','managed','led','designed','architected'];
  let proCount = 0; for (const w of professionalWords) if (lowercase.includes(w)) proCount++;
  toneScore += proCount*5; if (wordCount < 100) toneScore -= 10; toneScore = Math.min(Math.max(toneScore,30),100);

  let contentScore = 50; if (wordCount>500) contentScore+=20; else if (wordCount>250) contentScore+=10; if (hasExperience) contentScore+=15; if (hasEducation) contentScore+=10; if (hasCertifications) contentScore+=5; contentScore=Math.min(contentScore,100);

  let structureScore = 50; const sections=['experience','education','skills','projects','summary','objective']; let sectionCount=0; for(const sec of sections) if (lowercase.includes(sec)) sectionCount++; structureScore += sectionCount*8; if ((text||'').split('\n').length>5) structureScore+=10; structureScore=Math.min(structureScore,100);

  let skillsScore = Math.min(foundSkills.length*10+30,100);
  if (jobDescription) {
    const jobLower = jobDescription.toLowerCase(); let matches=0; for(const skill of foundSkills) if (jobLower.includes(skill)) matches++; skillsScore=Math.min(skillsScore+(matches*5),100);
  }

  const overallScore = Math.round((atsScore + toneScore + contentScore + structureScore + skillsScore)/5);

  const suggestions = [];
  if (atsScore<70) { if (!emailMatch) suggestions.push('Add a professional email address.'); if (!phoneMatch) suggestions.push('Include a contact phone number.'); if (!hasEducation) suggestions.push('Add education/degree details.'); }
  if (contentScore<70) { if (wordCount<200) suggestions.push('Expand experience details (aim 300-500 words).'); if (!hasExperience) suggestions.push('Add work experience with achievements.'); suggestions.push('Use quantifiable metrics.'); }
  if (structureScore<70) { suggestions.push('Organize resume with clear sections (Experience, Education, Skills).'); suggestions.push('Use bullet points and consistent formatting.'); }
  if (skillsScore<70) { suggestions.push('Add more relevant technical skills and tools.'); if (jobDescription) suggestions.push('Match skills in job description.'); }
  if (toneScore<70) { suggestions.push('Use stronger action verbs (Implemented, Led, Designed).'); }

  return {
    overallScore,
    scores: { ats: atsScore, tone: toneScore, content: contentScore, structure: structureScore, skills: skillsScore },
    wordCount,
    skills: foundSkills,
    sections: { hasExperience, hasEducation, hasCertifications },
    suggestions,
    parsed: { name: nameMatch?nameMatch[1]:null, email: emailMatch?emailMatch[0]:null, phone: phoneMatch?phoneMatch[0]:null },
    rawText: text
  };
}

export async function analyzeResumeHandler(req, res) {
  try {
    const { text, jobDescription } = req.body;
    if (!text) return res.status(400).json({ error: 'Missing text in request body' });

    // If OpenAI API key available, call AI for more accurate analysis
    if (ENV.OPENAI_API_KEY) {
      try {
        const systemPrompt = `You are an expert resume analyst. Given a resume text and optional job description, return a JSON object exactly with these fields: overallScore (0-100), scores (object with ats,tone,content,structure,skills values 0-100), suggestions (array of strings), parsed (object with name,email,phone), skills (array of detected skills), wordCount (int), sections (object with booleans hasExperience,hasEducation,hasCertifications). Use concise suggestions and no extra text.`;

        const userPrompt = `Resume:\n"""${text.replace(/"""/g,'') }"""\n\nJobDescription:\n"""${(jobDescription||'').replace(/"""/g,'')}"""`;

        const body = {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 1200,
          temperature: 0.1
        };

        const r = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${ENV.OPENAI_API_KEY}` },
          body: JSON.stringify(body)
        });
        const data = await r.json();
        const content = data?.choices?.[0]?.message?.content;
        if (!content) throw new Error('No content from AI');

        // Expect JSON — try parse
        let parsed = null;
        try { parsed = JSON.parse(content); }
        catch (e) {
          // attempt to extract JSON substring
          const m = content.match(/\{[\s\S]*\}/);
          if (m) parsed = JSON.parse(m[0]);
        }

        if (parsed) return res.json(parsed);
        // fallback to heuristic if parsing failed
      } catch (aiErr) {
        console.warn('AI analysis failed, falling back to heuristic', aiErr.message);
      }
    }

    // fallback heuristic
    const result = heuristicAnalyze(text, jobDescription);
    return res.json(result);
  } catch (err) {
    console.error('analyzeResumeHandler error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
