export default function Injuries({ character, update }) {
  return (
    <div className="section">
      <div className="section-label-left">INJURIES</div>
      <div className="section-content">
        <label className="field-label">14. WOUNDS AND AILMENTS</label>
        <textarea
          className="description-textarea"
          value={character.wounds}
          onChange={e => update('wounds', e.target.value)}
          rows={4}
        />
        <div className="first-aid-row">
          <span>Has First Aid been attempted since the last injury?</span>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={character.firstAidAttempted}
              onChange={e => update('firstAidAttempted', e.target.checked)}
            />
            yes: only Medicine, Surgery, or long-term rest can help further
          </label>
        </div>
      </div>
    </div>
  )
}
