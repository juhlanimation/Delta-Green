export default function Equipment({ character, update }) {
  return (
    <div className="section">
      <div className="section-label-left">EQUIPMENT</div>
      <div className="section-content">
        <label className="field-label">15. ARMOR AND GEAR</label>
        <textarea
          className="description-textarea"
          value={character.armorAndGear}
          onChange={e => update('armorAndGear', e.target.value)}
          rows={5}
        />
        <p className="equipment-note">
          Body armor reduces the damage of all attacks except Called Shots and successful Lethality rolls.
        </p>
      </div>
    </div>
  )
}
