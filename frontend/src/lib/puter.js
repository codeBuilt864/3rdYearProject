// Resume analyzer with 5-dimensional scoring (ATS, Tone, Content, Structure, Skills)
// Matches source file structure and features
export async function analyzeResume(text, jobDescription = null) {
  await new Promise((r) => setTimeout(r, 1000));

  const normalized = (text || "").replace(/\s+/g, " ").trim();
  const wordCount = normalized ? normalized.split(" ").length : 0;
  const lines = text ? text.split('\n') : [];

  // Contact info extraction
  const emailMatch = text && text.match(/[\w.-]+@[\w.-]+\.[A-Za-z]{2,6}/);
  const phoneMatch = text && text.match(/\+?\d[\d\s()-]{6,}\d/);
  const nameMatch = text && text.match(/(?:^|\n)([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/m);

  // Skills detection - comprehensive list
  const skillsList = ["javascript", "react", "node", "nodejs", "python", "java", "c#", "csharp", "sql", "mongodb", "postgresql", "aws", "gcp", "azure", "docker", "kubernetes", "git", "html", "css", "typescript", "rust", "golang", "php", "ruby", "swift", "kotlin"];
  const foundSkills = [];
  const lowercase = (text || "").toLowerCase();
  for (const s of skillsList) {
    if (lowercase.includes(s) && !foundSkills.includes(s)) foundSkills.push(s);
  }

  // Experience section detection
  const hasExperience = lowercase.includes('experience') || lowercase.includes('worked') || lowercase.includes('project');
  const hasEducation = lowercase.includes('education') || lowercase.includes('degree') || lowercase.includes('university');
  const hasCertifications = lowercase.includes('certification') || lowercase.includes('certified');

  // 5-Dimensional Scoring
  
  // 1. ATS Score (80-100: excellent, 50-79: good, <50: poor)
  let atsScore = 60;
  if (emailMatch) atsScore += 10;
  if (phoneMatch) atsScore += 10;
  if (hasEducation) atsScore += 10;
  if (foundSkills.length >= 3) atsScore += 10;
  if (wordCount > 300) atsScore += 5;
  atsScore = Math.min(atsScore, 100);

  // 2. Tone Score (professionalism, formality)
  let toneScore = 65;
  const professionalWords = ['demonstrated', 'implemented', 'developed', 'managed', 'led', 'designed', 'architected'];
  let proCount = 0;
  for (const w of professionalWords) if (lowercase.includes(w)) proCount++;
  toneScore += proCount * 5;
  if (wordCount < 100) toneScore -= 10; // too short
  toneScore = Math.min(Math.max(toneScore, 30), 100);

  // 3. Content Score (depth, completeness, detail)
  let contentScore = 50;
  if (wordCount > 500) contentScore += 20;
  else if (wordCount > 250) contentScore += 10;
  if (hasExperience) contentScore += 15;
  if (hasEducation) contentScore += 10;
  if (hasCertifications) contentScore += 5;
  contentScore = Math.min(contentScore, 100);

  // 4. Structure Score (organization, sections, formatting)
  let structureScore = 50;
  const sections = ['experience', 'education', 'skills', 'projects', 'summary', 'objective'];
  let sectionCount = 0;
  for (const sec of sections) if (lowercase.includes(sec)) sectionCount++;
  structureScore += sectionCount * 8;
  if (lines.length > 5) structureScore += 10; // has multiple lines/sections
  structureScore = Math.min(structureScore, 100);

  // 5. Skills Score (relevance, count, breadth)
  let skillsScore = Math.min(foundSkills.length * 10 + 30, 100);
  if (jobDescription) {
    // bonus if skills match job description
    const jobLower = jobDescription.toLowerCase();
    let matches = 0;
    for (const skill of foundSkills) if (jobLower.includes(skill)) matches++;
    skillsScore = Math.min(skillsScore + (matches * 5), 100);
  }

  // Overall score (average of 5 dimensions)
  const overallScore = Math.round((atsScore + toneScore + contentScore + structureScore + skillsScore) / 5);

  // Suggestions based on low scores
  const suggestions = [];
  if (atsScore < 70) {
    if (!emailMatch) suggestions.push('✉️ Add a professional email address.');
    if (!phoneMatch) suggestions.push('📞 Include a contact phone number.');
    if (!hasEducation) suggestions.push('🎓 Add education/degree information.');
  }
  if (contentScore < 70) {
    if (wordCount < 200) suggestions.push('📝 Expand your resume — aim for 300–500 words.');
    if (!hasExperience) suggestions.push('💼 Highlight your work experience with specific achievements.');
    suggestions.push('📊 Use metrics and quantifiable results (e.g., "improved by 40%").');
  }
  if (structureScore < 70) {
    suggestions.push('🏗️ Organize your resume with clear sections (Experience, Education, Skills).');
    suggestions.push('📋 Use bullet points and consistent formatting.');
  }
  if (skillsScore < 70) {
    suggestions.push('🛠️ Add more relevant technical skills (you have ' + foundSkills.length + ' detected).');
    if (jobDescription) suggestions.push('🎯 Include skills mentioned in the job description.');
  }
  if (toneScore < 70) {
    suggestions.push('💬 Use action verbs: "Implemented", "Designed", "Led" instead of passive language.');
  }

  const parsed = {
    name: nameMatch ? nameMatch[1] : 'Unknown',
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
  };

  return {
    overallScore,
    scores: {
      ats: atsScore,
      tone: toneScore,
      content: contentScore,
      structure: structureScore,
      skills: skillsScore,
    },
    wordCount,
    skills: foundSkills,
    sections: {
      hasExperience,
      hasEducation,
      hasCertifications,
    },
    suggestions,
    parsed,
    rawText: text,
  };
}

export default { analyzeResume };
