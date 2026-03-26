export default function Remarks({ character, update, updateSpecialTraining }) {
  return (
    <div className="section">
      <div className="section-label-left">REMARKS</div>
      <div className="section-content">
        <div className="remarks-grid">
          <div className="remarks-left">
            <label className="field-label">17. PERSONAL DETAILS AND NOTES</label>
            <textarea
              className="description-textarea tall"
              value={character.personalDetails}
              onChange={e => update('personalDetails', e.target.value)}
              rows={8}
            />
            <p className="remarks-recruitment">
              Please indicate why this agent was recruited and why the agent agreed to be recruited.
            </p>
          </div>
          <div className="remarks-right">
            <label className="field-label">18. DEVELOPMENTS WHICH AFFECT HOME AND FAMILY</label>
            <textarea
              className="description-textarea"
              value={character.developments}
              onChange={e => update('developments', e.target.value)}
              rows={4}
            />

            <div className="special-training">
              <div className="training-header">
                <span className="field-label">19. SPECIAL TRAINING</span>
                <span className="training-col-header">SKILL OR STAT USED</span>
              </div>
              {character.specialTraining.map((t, i) => (
                <div key={i} className="training-row">
                  <input
                    type="text"
                    className="training-desc"
                    value={t.description}
                    onChange={e => updateSpecialTraining(i, 'description', e.target.value)}
                  />
                  <input
                    type="text"
                    className="training-skill"
                    value={t.skillOrStat}
                    onChange={e => updateSpecialTraining(i, 'skillOrStat', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
