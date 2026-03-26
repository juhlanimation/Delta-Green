export default function PsychologicalData({
  character, update, updateBond, updateViolence, updateHelplessness
}) {
  return (
    <div className="section psych-section">
      <div className="section-label-left">PSYCHOLOGICAL DATA</div>
      <div className="section-content">
        {/* Bonds */}
        <div className="subsection">
          <div className="bonds-header">
            <span className="field-label">11. BONDS</span>
            <span className="bonds-score-header">SCORE</span>
          </div>
          {character.bonds.map((bond, i) => (
            <div key={i} className="bond-row">
              <input
                type="text"
                className="bond-name"
                value={bond.name}
                onChange={e => updateBond(i, 'name', e.target.value)}
              />
              <input
                type="number"
                className="bond-score"
                value={bond.score}
                onChange={e => updateBond(i, 'score', e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Motivations and Mental Disorders */}
        <div className="subsection">
          <label className="field-label">12. MOTIVATIONS AND MENTAL DISORDERS</label>
          <textarea
            className="description-textarea"
            value={character.motivations}
            onChange={e => update('motivations', e.target.value)}
            rows={4}
          />
        </div>

        {/* SAN Loss Incidents */}
        <div className="subsection san-incidents">
          <label className="field-label">13. INCIDENTS OF SAN LOSS WITHOUT GOING INSANE</label>
          <div className="san-row">
            <span className="san-label">Violence</span>
            {character.violence.map((v, i) => (
              <label key={i} className="san-check">
                <input
                  type="checkbox"
                  checked={v}
                  onChange={e => updateViolence(i, e.target.checked)}
                />
              </label>
            ))}
            <label className="adapted-label">
              <input
                type="checkbox"
                checked={character.violenceAdapted}
                onChange={e => update('violenceAdapted', e.target.checked)}
              />
              <em>adapted</em>
            </label>
          </div>
          <div className="san-row">
            <span className="san-label">Helplessness</span>
            {character.helplessness.map((v, i) => (
              <label key={i} className="san-check">
                <input
                  type="checkbox"
                  checked={v}
                  onChange={e => updateHelplessness(i, e.target.checked)}
                />
              </label>
            ))}
            <label className="adapted-label">
              <input
                type="checkbox"
                checked={character.helplessnessAdapted}
                onChange={e => update('helplessnessAdapted', e.target.checked)}
              />
              <em>adapted</em>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
