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

      // Add 4 rings for 5 levels (outer ring is .skill itself)
      for (let i = 4; i >= 1; i--) {
        const ring = document.createElement('div');
        ring.className = `inner-ring ring-${i}`;
        skillEl.appendChild(ring);
      }

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
