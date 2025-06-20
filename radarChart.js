// radarChart.js
let radarChart;
const skillStates = {};  // skillId: { level: 0, category: 'Design' }
// const overlayColors = ['hsla(210, 80%, 50%, 0.8)', 'hsla(300, 80%, 50%, 0.8)', 'hsla(120, 80%, 50%, 0.8)'];
export const overlayColors = [
  'rgba(100, 150, 250, 0.9)',
  'hsla(300, 80%, 50%, 0.9)',
  'hsla(120, 80%, 50%, 0.9)',
  'hsla(30,  90%, 60%, 0.9)',
  'hsla(0,   80%, 60%, 0.9)'
];
let overlayIndex = 0;

export function initRadarChart(categories) {
  const ctx = document.getElementById('radarChart').getContext('2d');

  radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: categories,
      datasets: [{
        label: 'Skill Level by Category',
        data: [],
        backgroundColor: 'rgba(100, 150, 250, 0.2)',
        borderColor: 'rgba(100, 150, 250, 1)',
        pointBackgroundColor: 'rgba(100, 150, 250, 1)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // important for full viewport fit
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 2,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}


export function registerSkill(id, category) {
  skillStates[id] = { level: 0, category };
}

export function cycleSkillLevel(skillEl) {
  const id = skillEl.id;
  const currentClass = [...skillEl.classList].find(cls => cls.startsWith('level-'));
  let level = 0;

  if (currentClass) {
    level = parseInt(currentClass.split('-')[1], 10);
    skillEl.classList.remove(currentClass);
  }

  const nextLevel = (level + 1) % 4;
  skillEl.classList.add(`level-${nextLevel}`);

  if (skillStates[id]) {
    skillStates[id].level = nextLevel;
  }

  updateRadarChart();
}

function updateRadarChart() {
  const categoryScores = {};

  for (const [id, { level, category }] of Object.entries(skillStates)) {
    if (!categoryScores[category]) categoryScores[category] = [];
    categoryScores[category].push(level);
  }

  const categories = radarChart.data.labels;
  const scores = categories.map(cat => {
    const levels = categoryScores[cat] || [];
    return levels.length ? levels.reduce((a, b) => a + b, 0) / levels.length : 0;
  });

  radarChart.data.datasets[0].data = scores;
  radarChart.update();
}

export function exportSkillData() {
  const result = {};

  for (const [id, { level, category }] of Object.entries(skillStates)) {
    if (!result[category]) result[category] = {};
    result[category][id] = level;
  }

  return result;
}

export function setSkillLevelsFromData(data, color = '#999') {
  for (const [category, skills] of Object.entries(data)) {
    for (const [skillId, level] of Object.entries(skills)) {
      const el = document.getElementById(skillId);
      if (el) {
        el.classList.remove('level-0', 'level-1', 'level-2', 'level-3');
        el.classList.add(`level-${level}`);
        el.style.setProperty('--circle-color', color);
        if (skillStates[skillId]) {
          skillStates[skillId].level = level;
        }
      }
    }
  }
}

export function overlayRadarDataset(data, label = `Imported ${overlayIndex + 1}`) {
  const categories = radarChart.data.labels;

  const scores = categories.map(cat => {
    const skills = data[cat] || {};
    const levels = Object.values(skills);
    return levels.length ? levels.reduce((a, b) => a + b, 0) / levels.length : 0;
  });

  radarChart.data.datasets.push({
    label,
    data: scores,
    backgroundColor: overlayColors[overlayIndex % overlayColors.length].replace('0.9', '0.15'),
    borderColor: overlayColors[overlayIndex % overlayColors.length],
    borderWidth: 2,
    pointRadius: 3
  });

  overlayIndex++;
  radarChart.update();
}

export function getCurrentSkillDataByCategory() {
  const result = {};

  for (const [id, { level, category }] of Object.entries(skillStates)) {
    if (!result[category]) result[category] = {};
    result[category][id] = level;
  }

  return result;
}