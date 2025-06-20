// skills.js
import { registerSkill, cycleSkillLevel } from './radarChart.js';

export async function fetchData(sheetUrl) {
  const res = await fetch(sheetUrl);
  if (!res.ok) throw new Error('Failed to fetch data from Google Sheets');
  return await res.json();
}

export function groupSkills(data) {
  const skillMap = {};

  data.forEach(row => {
    const { category, skillId, skillTitle } = row;

    if (!skillMap[category]) {
      skillMap[category] = [];
    }

    if (!skillMap[category].some(skill => skill.id === skillId)) {
      skillMap[category].push({
        id: skillId,
        title: skillTitle
      });
    }
  });

  return skillMap;
}

export function renderSkills(skillData, containerId = 'skills-container') {
  const skillsContainer = document.getElementById(containerId);
  skillsContainer.innerHTML = '';

  for (const [category, skills] of Object.entries(skillData)) {
    const column = document.createElement('div');
    column.className = 'category-column';

    const heading = document.createElement('h2');
    heading.textContent = category;
    column.appendChild(heading);

    for (const skill of skills) {
      const skillWrapper = document.createElement('div');
      skillWrapper.className = 'skill-wrapper';

      const skillEl = document.createElement('div');
      skillEl.id = skill.id;
      skillEl.className = 'skill level-0';
      skillEl.addEventListener('click', () => cycleSkillLevel(skillEl));

      const ring2 = document.createElement('div');
      ring2.className = 'inner-ring ring-2';
      skillEl.appendChild(ring2);

      const ring1 = document.createElement('div');
      ring1.className = 'inner-ring ring-1';
      skillEl.appendChild(ring1);

      const label = document.createElement('div');
      label.className = 'skill-label';
      label.textContent = skill.title;

      skillWrapper.appendChild(skillEl);
      skillWrapper.appendChild(label);
      column.appendChild(skillWrapper);

      registerSkill(skill.id, category);
    }

    skillsContainer.appendChild(column);
  }
}
