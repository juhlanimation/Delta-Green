export default function StatisticalData({ character, updateStat, update }) {
  const stats = [
    { key: 'str', label: 'Strength (STR)' },
    { key: 'con', label: 'Constitution (CON)' },
    { key: 'dex', label: 'Dexterity (DEX)' },
    { key: 'int', label: 'Intelligence (INT)' },
    { key: 'pow', label: 'Power (POW)' },
    { key: 'cha', label: 'Charisma (CHA)' },
  ]

  return (
    <div className="section stat-section">
      <div className="section-label-left">STATISTICAL DATA</div>
      <div className="section-content">
        {/* Statistics */}
        <div className="subsection">
          <div className="stat-header-row">
            <span className="stat-header-label">8. STATISTICS</span>
            <span className="stat-header-col">SCORE</span>
            <span className="stat-header-col">x5</span>
            <span className="stat-header-col wide">DISTINGUISHING FEATURES</span>
          </div>
          {stats.map(s => (
            <div key={s.key} className="stat-row">
              <span className="stat-name">{s.label}</span>
              <input
                type="number"
                className="stat-input"
                value={character.stats[s.key].score}
                onChange={e => updateStat(s.key, e.target.value)}
                min="0"
                max="20"
              />
              <span className="stat-x5">{character.stats[s.key].x5}%</span>
              <input
                type="text"
                className="stat-feature"
                value={character.stats[s.key].feature}
                onChange={e => {
                  const newStats = { ...character.stats }
                  newStats[s.key] = { ...newStats[s.key], feature: e.target.value }
                  update('stats', newStats)
                }}
              />
            </div>
          ))}
        </div>

        {/* Derived Attributes */}
        <div className="subsection">
          <div className="stat-header-row">
            <span className="stat-header-label">9. DERIVED ATTRIBUTES</span>
            <span className="stat-header-col">MAXIMUM</span>
            <span className="stat-header-col">CURRENT</span>
          </div>
          <div className="derived-row">
            <span className="stat-name">Hit Points (HP)</span>
            <input
              type="number"
              className="stat-input"
              value={character.hp.max}
              onChange={e => update('hp.max', e.target.value)}
            />
            <input
              type="number"
              className="stat-input"
              value={character.hp.current}
              onChange={e => update('hp.current', e.target.value)}
            />
          </div>
          <div className="derived-row">
            <span className="stat-name">Willpower Points (WP)</span>
            <input
              type="number"
              className="stat-input"
              value={character.wp.max}
              onChange={e => update('wp.max', e.target.value)}
            />
            <input
              type="number"
              className="stat-input"
              value={character.wp.current}
              onChange={e => update('wp.current', e.target.value)}
            />
          </div>
          <div className="derived-row">
            <span className="stat-name">Sanity Points (SAN)</span>
            <input
              type="number"
              className="stat-input"
              value={character.san.max}
              onChange={e => update('san.max', e.target.value)}
            />
            <input
              type="number"
              className="stat-input"
              value={character.san.current}
              onChange={e => update('san.current', e.target.value)}
            />
          </div>
          <div className="derived-row">
            <span className="stat-name">Breaking Point (BP)</span>
            <input
              type="number"
              className="stat-input"
              value={character.bp.value}
              onChange={e => update('bp.value', e.target.value)}
            />
          </div>
        </div>

        {/* Physical Description */}
        <div className="subsection">
          <label className="field-label">10. PHYSICAL DESCRIPTION</label>
          <textarea
            className="description-textarea"
            value={character.physicalDescription}
            onChange={e => update('physicalDescription', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </div>
  )
}
