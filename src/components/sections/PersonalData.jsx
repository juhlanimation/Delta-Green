export default function PersonalData({ character, update }) {
  return (
    <div className="section">
      <div className="section-label-left">PERSONAL DATA</div>
      <div className="section-content">
        <div className="field-row">
          <div className="field" style={{ flex: 2 }}>
            <label className="field-label">1. LAST NAME, FIRST NAME, MIDDLE INITIAL</label>
            <input
              type="text"
              value={character.fullName}
              onChange={e => update('fullName', e.target.value)}
            />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label className="field-label">2. PROFESSION (RANK IF APPLICABLE)</label>
            <input
              type="text"
              value={character.profession}
              onChange={e => update('profession', e.target.value)}
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field" style={{ flex: 1 }}>
            <label className="field-label">3. EMPLOYER</label>
            <input
              type="text"
              value={character.employer}
              onChange={e => update('employer', e.target.value)}
            />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label className="field-label">4. NATIONALITY</label>
            <input
              type="text"
              value={character.nationality}
              onChange={e => update('nationality', e.target.value)}
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field sex-field">
            <label className="field-label">5. SEX</label>
            <div className="sex-options">
              <label className="checkbox-label">
                <input
                  type="radio"
                  name="sex"
                  value="F"
                  checked={character.sex === 'F'}
                  onChange={e => update('sex', e.target.value)}
                />
                F
              </label>
              <label className="checkbox-label">
                <input
                  type="radio"
                  name="sex"
                  value="M"
                  checked={character.sex === 'M'}
                  onChange={e => update('sex', e.target.value)}
                />
                M
              </label>
            </div>
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label className="field-label">6. AGE AND D.O.B.</label>
            <input
              type="text"
              value={character.age}
              onChange={e => update('age', e.target.value)}
              placeholder=""
            />
          </div>
          <div className="field" style={{ flex: 2 }}>
            <label className="field-label">7. EDUCATION AND OCCUPATIONAL HISTORY</label>
            <input
              type="text"
              value={character.education}
              onChange={e => update('education', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
