export default function Footer({ character, update }) {
  return (
    <div className="footer-section">
      <div className="field-row">
        <div className="field" style={{ flex: 1 }}>
          <label className="field-label">20. AUTHORIZING OFFICER</label>
          <input
            type="text"
            value={character.authorizingOfficer}
            onChange={e => update('authorizingOfficer', e.target.value)}
          />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label className="field-label">21. AGENT SIGNATURE</label>
          <input
            type="text"
            value={character.agentSignature}
            onChange={e => update('agentSignature', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
