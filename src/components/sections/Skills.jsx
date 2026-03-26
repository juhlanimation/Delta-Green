export default function Skills({ character, updateSkill, updateOtherSkill }) {
  const skills = character.skills
  const col1 = skills.slice(0, 16)
  const col2 = skills.slice(16, 32)
  const col3 = skills.slice(32)

  return (
    <div className="section skills-section">
      <div className="section-label-left">APPLICABLE SKILL SETS</div>
      <div className="section-content">
        <div className="skills-grid">
          <div className="skill-column">
            {col1.map((skill, i) => (
              <SkillRow key={i} skill={skill} index={i} onChange={updateSkill} />
            ))}
          </div>
          <div className="skill-column">
            {col2.map((skill, i) => (
              <SkillRow key={i + 16} skill={skill} index={i + 16} onChange={updateSkill} />
            ))}
          </div>
          <div className="skill-column">
            {col3.map((skill, i) => (
              <SkillRow key={i + 32} skill={skill} index={i + 32} onChange={updateSkill} />
            ))}
            <div className="other-skills-label">Foreign Languages and Other Skills:</div>
            {character.otherSkills.map((skill, i) => (
              <div key={`other-${i}`} className="skill-row">
                <label className="skill-check">
                  <input
                    type="checkbox"
                    checked={skill.failed}
                    onChange={e => updateOtherSkill(i, 'failed', e.target.checked)}
                  />
                </label>
                <input
                  type="text"
                  className="other-skill-name"
                  value={skill.name}
                  onChange={e => updateOtherSkill(i, 'name', e.target.value)}
                  placeholder="Skill name"
                />
                <input
                  type="number"
                  className="skill-value"
                  value={skill.value}
                  onChange={e => updateOtherSkill(i, 'value', e.target.value)}
                  min="0"
                  max="99"
                />
                <span className="skill-pct">%</span>
              </div>
            ))}
          </div>
        </div>
        <p className="skills-note">
          Check a box when you attempt to use a skill and fail. After the session, add 1D4-1 to each checked skill and erase all checks.
        </p>
      </div>
    </div>
  )
}

function SkillRow({ skill, index, onChange }) {
  const label = skill.hasSubtype
    ? `${skill.name} (${skill.base}%):`
    : `${skill.name} (${skill.base}%)`

  return (
    <div className="skill-row">
      <label className="skill-check">
        <input
          type="checkbox"
          checked={skill.failed}
          onChange={e => onChange(index, 'failed', e.target.checked)}
        />
      </label>
      <span className="skill-name-label">{label}</span>
      {skill.hasSubtype && (
        <input
          type="text"
          className="skill-subtype"
          value={skill.subtype}
          onChange={e => onChange(index, 'subtype', e.target.value)}
          placeholder="type"
        />
      )}
      <input
        type="number"
        className="skill-value"
        value={skill.value}
        onChange={e => onChange(index, 'value', e.target.value === '' ? '' : parseInt(e.target.value, 10))}
        min="0"
        max="99"
      />
      <span className="skill-pct">%</span>
    </div>
  )
}
