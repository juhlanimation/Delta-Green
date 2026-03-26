const WEAPON_COLS = [
  { key: 'name', label: 'WEAPONS', width: '18%' },
  { key: 'skill', label: 'SKILL %', width: '9%' },
  { key: 'baseRange', label: 'BASE RANGE', width: '11%' },
  { key: 'damage', label: 'DAMAGE', width: '12%' },
  { key: 'armorPiercing', label: 'ARMOR PIERCING', width: '12%' },
  { key: 'lethality', label: 'LETHALITY', width: '11%' },
  { key: 'killRadius', label: 'KILL RADIUS', width: '12%' },
  { key: 'ammo', label: 'AMMO', width: '9%' },
]

const ROW_LABELS = ['(a)', '(b)', '(c)', '(d)', '(e)', '(f)', '(g)']

export default function Weapons({ character, updateWeapon }) {
  return (
    <div className="section">
      <div className="section-label-left">EQUIPMENT</div>
      <div className="section-content">
        <div className="weapons-table">
          <div className="weapons-header">
            <span className="weapon-row-label">16.</span>
            {WEAPON_COLS.map(col => (
              <span key={col.key} className="weapon-col-header" style={{ width: col.width }}>
                {col.label}
              </span>
            ))}
          </div>
          {character.weapons.map((weapon, i) => (
            <div key={i} className="weapon-row">
              <span className="weapon-row-label">{ROW_LABELS[i]}</span>
              {WEAPON_COLS.map(col => (
                <input
                  key={col.key}
                  type="text"
                  className="weapon-input"
                  style={{ width: col.width }}
                  value={weapon[col.key]}
                  onChange={e => updateWeapon(i, col.key, e.target.value)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
