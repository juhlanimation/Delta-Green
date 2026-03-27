import { useState, useCallback } from 'react'
import PROFESSIONS, { STAT_ARRAYS } from '../data/professions'
import { createInitialState } from '../hooks/useCharacterState'
import './CharacterGenerator.css'

const STAT_KEYS = ['str', 'con', 'dex', 'int', 'pow', 'cha']
const STAT_LABELS = {
  str: 'Strength (STR)',
  con: 'Constitution (CON)',
  dex: 'Dexterity (DEX)',
  int: 'Intelligence (INT)',
  pow: 'Power (POW)',
  cha: 'Charisma (CHA)',
}

const STEPS = [
  'Personal Data',
  'Statistics',
  'Profession',
  'Profession Skills',
  'Bonus Skills',
  'Bonds & Details',
  'Review',
]

function roll4d6DropLowest() {
  const dice = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1)
  dice.sort((a, b) => a - b)
  return dice[1] + dice[2] + dice[3]
}

export default function CharacterGenerator({ onComplete }) {
  const [step, setStep] = useState(0)
  const [char, setChar] = useState(() => createInitialState())

  // Step 2: stat generation
  const [statMethod, setStatMethod] = useState(null) // 'roll', 'pointbuy', 'array'
  const [selectedArray, setSelectedArray] = useState(null)
  const [rolledValues, setRolledValues] = useState(null)
  const [statAssignment, setStatAssignment] = useState({}) // { str: index, ... }
  const [pointBuyValues, setPointBuyValues] = useState({ str: 10, con: 10, dex: 10, int: 10, pow: 10, cha: 10 })

  // Step 3: profession
  const [selectedProfession, setSelectedProfession] = useState(null)

  // Step 4: profession choices
  const [profChoices, setProfChoices] = useState([])
  const [profOtherLanguages, setProfOtherLanguages] = useState([])

  // Step 5: bonus skills
  const [bonusSkills, setBonusSkills] = useState([]) // array of { skillIndex, isOther, otherIndex }

  const update = useCallback((path, value) => {
    setChar(prev => {
      const next = { ...prev }
      const keys = path.split('.')
      let obj = next
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        obj[key] = Array.isArray(obj[key]) ? [...obj[key]] : { ...obj[key] }
        obj = obj[key]
      }
      obj[keys[keys.length - 1]] = value
      return next
    })
  }, [])

  // ===== STEP NAVIGATION =====
  const canNext = () => {
    switch (step) {
      case 0: return char.fullName.trim() !== ''
      case 1: return areStatsComplete()
      case 2: return selectedProfession !== null
      case 3: return areProfChoicesComplete()
      case 4: return bonusSkills.length === 8
      case 5: return true
      default: return true
    }
  }

  function areStatsComplete() {
    if (!statMethod) return false
    if (statMethod === 'roll') {
      if (!rolledValues) return false
      const assigned = Object.values(statAssignment)
      return assigned.length === 6 && new Set(assigned).size === 6
    }
    if (statMethod === 'pointbuy') {
      const total = Object.values(pointBuyValues).reduce((a, b) => a + b, 0)
      return total === 72
    }
    if (statMethod === 'array') {
      if (!selectedArray) return false
      const assigned = Object.values(statAssignment)
      return assigned.length === 6 && new Set(assigned).size === 6
    }
    return false
  }

  function areProfChoicesComplete() {
    if (!selectedProfession) return false
    const prof = PROFESSIONS[selectedProfession]
    if (!prof.chooseFrom) return true
    return profChoices.length === prof.chooseFrom.count
  }

  function handleNext() {
    if (step === 1) applyStats()
    if (step === 3) applyProfessionSkills()
    if (step === 4) applyBonusSkills()
    if (step === 5) applyBondsAndDerived()
    if (step === 6) {
      onComplete(char)
      return
    }
    setStep(s => s + 1)
  }

  function handleBack() {
    setStep(s => Math.max(0, s - 1))
  }

  // ===== STAT APPLICATION =====
  function applyStats() {
    let values = {}
    if (statMethod === 'roll' || statMethod === 'array') {
      const pool = statMethod === 'roll' ? rolledValues : STAT_ARRAYS[selectedArray]
      STAT_KEYS.forEach(key => {
        values[key] = pool[statAssignment[key]]
      })
    } else if (statMethod === 'pointbuy') {
      values = { ...pointBuyValues }
    }

    setChar(prev => {
      const next = { ...prev }
      next.stats = {}
      STAT_KEYS.forEach(key => {
        next.stats[key] = {
          score: values[key],
          x5: values[key] * 5,
          feature: '',
        }
      })
      return next
    })
  }

  // ===== PROFESSION SKILL APPLICATION =====
  function applyProfessionSkills() {
    if (selectedProfession === null) return
    const prof = PROFESSIONS[selectedProfession]

    setChar(prev => {
      const next = { ...prev }
      next.profession = prof.name
      next.skills = prev.skills.map(s => ({ ...s }))
      next.otherSkills = prev.otherSkills.map(s => ({ ...s }))

      // Apply fixed profession skills
      const applySkill = (skillName, value, subtype) => {
        // For skills with subtypes that create new entries (Craft, Science, etc.)
        if (subtype && subtype !== '') {
          const idx = next.skills.findIndex(s => s.name === skillName && (s.subtype === '' || s.subtype === subtype))
          if (idx !== -1) {
            next.skills[idx] = { ...next.skills[idx], value: Math.max(next.skills[idx].value, value), subtype }
          }
        } else {
          const idx = next.skills.findIndex(s => s.name === skillName)
          if (idx !== -1) {
            next.skills[idx] = { ...next.skills[idx], value: Math.max(next.skills[idx].value, value) }
          }
        }
      }

      // Fixed skills
      prof.skills.forEach(s => applySkill(s.skill, s.value, s.subtype))

      // Other skills (foreign languages)
      let otherIdx = 0
      if (prof.otherSkills) {
        prof.otherSkills.forEach(s => {
          if (otherIdx < next.otherSkills.length) {
            next.otherSkills[otherIdx] = { ...next.otherSkills[otherIdx], name: s.name, value: s.value }
            otherIdx++
          }
        })
      }

      // Chosen skills
      if (prof.chooseFrom && profChoices.length > 0) {
        const allOptions = [...(prof.chooseFrom.options || []), ...(prof.chooseFrom.optionsOther || [])]
        profChoices.forEach(choiceIdx => {
          const choice = allOptions[choiceIdx]
          if (!choice) return
          if (choice.skill) {
            applySkill(choice.skill, choice.value, choice.subtype)
          } else if (choice.name) {
            // It's an "other" skill (foreign language)
            if (otherIdx < next.otherSkills.length) {
              next.otherSkills[otherIdx] = { ...next.otherSkills[otherIdx], name: choice.name, value: choice.value }
              otherIdx++
            }
          }
        })
      }

      // Also apply other language choices from profOtherLanguages
      profOtherLanguages.forEach(lang => {
        if (otherIdx < next.otherSkills.length && lang.name) {
          next.otherSkills[otherIdx] = { ...next.otherSkills[otherIdx], name: lang.name, value: lang.value }
          otherIdx++
        }
      })

      return next
    })
  }

  // ===== BONUS SKILLS =====
  function applyBonusSkills() {
    setChar(prev => {
      const next = { ...prev }
      next.skills = prev.skills.map(s => ({ ...s }))
      next.otherSkills = prev.otherSkills.map(s => ({ ...s }))

      bonusSkills.forEach(b => {
        if (b.isOther) {
          const s = next.otherSkills[b.otherIndex]
          if (s) {
            const current = parseInt(s.value, 10) || 0
            next.otherSkills[b.otherIndex] = { ...s, value: Math.min(80, current + 20) }
          }
        } else {
          const s = next.skills[b.skillIndex]
          if (s) {
            next.skills[b.skillIndex] = { ...s, value: Math.min(80, s.value + 20) }
          }
        }
      })

      return next
    })
  }

  // ===== BONDS & DERIVED =====
  function applyBondsAndDerived() {
    setChar(prev => {
      const next = { ...prev }
      const str = next.stats.str.score || 0
      const con = next.stats.con.score || 0
      const pow = next.stats.pow.score || 0
      const cha = next.stats.cha.score || 0

      next.hp = { max: Math.ceil((str + con) / 2), current: Math.ceil((str + con) / 2) }
      next.wp = { max: pow, current: pow }
      next.san = { max: 99, current: pow * 5 }
      next.bp = { value: pow * 4 }

      // Set bond scores to CHA
      const prof = selectedProfession !== null ? PROFESSIONS[selectedProfession] : null
      const bondCount = prof ? prof.bonds : 4
      next.bonds = next.bonds.map((b, i) => ({
        ...b,
        score: i < bondCount ? (b.score || cha) : b.score,
      }))

      return next
    })
  }

  // ===== RENDER STEPS =====

  function renderStep0() {
    return (
      <div className="gen-step">
        <h2>Step 1: Personal Data</h2>
        <p className="gen-hint">Start by filling in your agent's basic information. Only the name is required to proceed.</p>

        <div className="gen-field">
          <label>Full Name *</label>
          <input type="text" value={char.fullName} onChange={e => update('fullName', e.target.value)} placeholder="Lastname, Firstname M." />
        </div>
        <div className="gen-field-row">
          <div className="gen-field">
            <label>Nationality</label>
            <input type="text" value={char.nationality} onChange={e => update('nationality', e.target.value)} placeholder="e.g. Danish" />
          </div>
          <div className="gen-field">
            <label>Sex</label>
            <div className="gen-radio-row">
              <label><input type="radio" name="gen-sex" value="M" checked={char.sex === 'M'} onChange={e => update('sex', e.target.value)} /> M</label>
              <label><input type="radio" name="gen-sex" value="F" checked={char.sex === 'F'} onChange={e => update('sex', e.target.value)} /> F</label>
            </div>
          </div>
        </div>
        <div className="gen-field-row">
          <div className="gen-field">
            <label>Age</label>
            <input type="text" value={char.age} onChange={e => update('age', e.target.value)} placeholder="e.g. 38" />
          </div>
          <div className="gen-field">
            <label>Date of Birth</label>
            <input type="text" value={char.dob} onChange={e => update('dob', e.target.value)} placeholder="e.g. 12 Mar 1968" />
          </div>
        </div>
        <div className="gen-field">
          <label>Education & Occupational History</label>
          <input type="text" value={char.education} onChange={e => update('education', e.target.value)} placeholder="e.g. MSc Computer Science, Copenhagen University" />
        </div>
        <div className="gen-field">
          <label>Employer</label>
          <input type="text" value={char.employer} onChange={e => update('employer', e.target.value)} placeholder="e.g. Danish National Police" />
        </div>
      </div>
    )
  }

  function renderStep1() {
    return (
      <div className="gen-step">
        <h2>Step 2: Statistics</h2>
        <p className="gen-hint">Choose a method to generate your six stats (STR, CON, DEX, INT, POW, CHA). Each stat ranges from 3-18.</p>

        <div className="gen-method-buttons">
          <button className={`gen-method-btn ${statMethod === 'roll' ? 'active' : ''}`} onClick={() => { setStatMethod('roll'); setStatAssignment({}) }}>
            Roll 4d6 Drop Lowest
          </button>
          <button className={`gen-method-btn ${statMethod === 'pointbuy' ? 'active' : ''}`} onClick={() => { setStatMethod('pointbuy'); setStatAssignment({}) }}>
            Point Buy (72 pts)
          </button>
          <button className={`gen-method-btn ${statMethod === 'array' ? 'active' : ''}`} onClick={() => { setStatMethod('array'); setStatAssignment({}) }}>
            Pre-set Array
          </button>
        </div>

        {statMethod === 'roll' && renderRollMethod()}
        {statMethod === 'pointbuy' && renderPointBuy()}
        {statMethod === 'array' && renderArrayMethod()}
      </div>
    )
  }

  function renderRollMethod() {
    return (
      <div className="gen-stat-method">
        <button className="gen-btn" onClick={() => {
          const vals = Array.from({ length: 6 }, roll4d6DropLowest)
          setRolledValues(vals)
          setStatAssignment({})
        }}>
          {rolledValues ? 'Re-Roll All' : 'Roll 6 Stats'}
        </button>

        {rolledValues && (
          <div className="gen-stat-assign">
            <p className="gen-hint">Rolled values: <strong>{rolledValues.join(', ')}</strong> - Assign each to a stat:</p>
            {STAT_KEYS.map(key => (
              <div key={key} className="gen-stat-row">
                <span className="gen-stat-label">{STAT_LABELS[key]}</span>
                <select
                  value={statAssignment[key] ?? ''}
                  onChange={e => {
                    const val = e.target.value
                    setStatAssignment(prev => {
                      const next = { ...prev }
                      if (val === '') {
                        delete next[key]
                      } else {
                        next[key] = parseInt(val, 10)
                      }
                      return next
                    })
                  }}
                >
                  <option value="">--</option>
                  {rolledValues.map((v, i) => {
                    const usedBy = Object.entries(statAssignment).find(([k, idx]) => idx === i && k !== key)
                    return (
                      <option key={i} value={i} disabled={!!usedBy}>
                        {v}{usedBy ? ` (used)` : ''}
                      </option>
                    )
                  })}
                </select>
                {statAssignment[key] !== undefined && (
                  <span className="gen-stat-assigned">{rolledValues[statAssignment[key]]}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  function renderPointBuy() {
    const total = Object.values(pointBuyValues).reduce((a, b) => a + b, 0)
    const remaining = 72 - total
    return (
      <div className="gen-stat-method">
        <p className="gen-hint">
          Distribute 72 points among six stats (each 3-18).
          Remaining: <strong className={remaining === 0 ? 'gen-ok' : remaining < 0 ? 'gen-over' : ''}>{remaining}</strong>
        </p>
        {STAT_KEYS.map(key => (
          <div key={key} className="gen-stat-row">
            <span className="gen-stat-label">{STAT_LABELS[key]}</span>
            <input
              type="number"
              min="3"
              max="18"
              value={pointBuyValues[key]}
              onChange={e => {
                const v = Math.max(3, Math.min(18, parseInt(e.target.value, 10) || 3))
                setPointBuyValues(prev => ({ ...prev, [key]: v }))
              }}
              className="gen-stat-input"
            />
            <span className="gen-stat-x5">{pointBuyValues[key] * 5}%</span>
          </div>
        ))}
      </div>
    )
  }

  function renderArrayMethod() {
    return (
      <div className="gen-stat-method">
        <p className="gen-hint">Choose a pre-set array and assign values to stats:</p>
        <div className="gen-array-buttons">
          {Object.entries(STAT_ARRAYS).map(([name, arr]) => (
            <button
              key={name}
              className={`gen-array-btn ${selectedArray === name ? 'active' : ''}`}
              onClick={() => { setSelectedArray(name); setStatAssignment({}) }}
            >
              <strong>{name}</strong>
              <span>{arr.join(', ')}</span>
            </button>
          ))}
        </div>

        {selectedArray && (
          <div className="gen-stat-assign">
            <p className="gen-hint">Assign each value to a stat:</p>
            {STAT_KEYS.map(key => (
              <div key={key} className="gen-stat-row">
                <span className="gen-stat-label">{STAT_LABELS[key]}</span>
                <select
                  value={statAssignment[key] ?? ''}
                  onChange={e => {
                    const val = e.target.value
                    setStatAssignment(prev => {
                      const next = { ...prev }
                      if (val === '') {
                        delete next[key]
                      } else {
                        next[key] = parseInt(val, 10)
                      }
                      return next
                    })
                  }}
                >
                  <option value="">--</option>
                  {STAT_ARRAYS[selectedArray].map((v, i) => {
                    const usedBy = Object.entries(statAssignment).find(([k, idx]) => idx === i && k !== key)
                    return (
                      <option key={i} value={i} disabled={!!usedBy}>
                        {v}{usedBy ? ` (used)` : ''}
                      </option>
                    )
                  })}
                </select>
                {statAssignment[key] !== undefined && (
                  <span className="gen-stat-assigned">{STAT_ARRAYS[selectedArray][statAssignment[key]]}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  function renderStep2() {
    return (
      <div className="gen-step">
        <h2>Step 3: Choose Profession</h2>
        <p className="gen-hint">Your profession determines your starting skills and number of bonds.</p>

        <div className="gen-professions">
          {PROFESSIONS.map((prof, i) => (
            <button
              key={i}
              className={`gen-prof-btn ${selectedProfession === i ? 'active' : ''}`}
              onClick={() => { setSelectedProfession(i); setProfChoices([]); setProfOtherLanguages([]) }}
            >
              <strong>{prof.name}</strong>
              <span>{prof.bonds} bonds</span>
              <span className="gen-prof-skills">
                {prof.skills.map(s => `${s.skill}${s.subtype ? ` (${s.subtype})` : ''} ${s.value}%`).join(', ')}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  function renderStep3() {
    if (selectedProfession === null) return null
    const prof = PROFESSIONS[selectedProfession]

    return (
      <div className="gen-step">
        <h2>Step 4: Profession Skill Choices</h2>
        <p className="gen-hint"><strong>{prof.name}</strong> - {prof.bonds} bonds</p>

        <div className="gen-subsection">
          <h3>Fixed Skills</h3>
          <div className="gen-skill-list">
            {prof.skills.map((s, i) => (
              <div key={i} className="gen-skill-tag">
                {s.skill}{s.subtype ? ` (${s.subtype})` : ''}: {s.value}%
              </div>
            ))}
            {prof.otherSkills?.map((s, i) => (
              <div key={`other-${i}`} className="gen-skill-tag other">
                {s.name}: {s.value}%
              </div>
            ))}
          </div>
        </div>

        {prof.chooseFrom && (
          <div className="gen-subsection">
            <h3>Choose {prof.chooseFrom.count} additional skill{prof.chooseFrom.count > 1 ? 's' : ''}:</h3>
            <div className="gen-choose-grid">
              {[...(prof.chooseFrom.options || []), ...(prof.chooseFrom.optionsOther || [])].map((opt, i) => {
                const isSelected = profChoices.includes(i)
                const name = opt.skill || opt.name
                return (
                  <button
                    key={i}
                    className={`gen-choose-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setProfChoices(prev => {
                        if (isSelected) return prev.filter(x => x !== i)
                        if (prev.length >= prof.chooseFrom.count) return prev
                        return [...prev, i]
                      })
                    }}
                  >
                    {name}{opt.subtype ? ` (${opt.subtype})` : ''}: {opt.value}%
                  </button>
                )
              })}
            </div>
            <p className="gen-hint">Selected: {profChoices.length}/{prof.chooseFrom.count}</p>
          </div>
        )}

        {!prof.chooseFrom && (
          <p className="gen-hint">No additional choices needed for this profession. All skills are fixed.</p>
        )}
      </div>
    )
  }

  function renderStep4() {
    // Build the current skill list for bonus selection
    // We need to show the skills as they would be after profession application
    // For simplicity, we re-apply profession skills to a temp copy
    const skillList = char.skills.map(s => ({ ...s }))
    const otherList = char.otherSkills.map(s => ({ ...s }))

    if (selectedProfession !== null) {
      const prof = PROFESSIONS[selectedProfession]
      const applyToList = (list, skillName, value, subtype) => {
        if (subtype) {
          const idx = list.findIndex(s => s.name === skillName && (s.subtype === '' || s.subtype === subtype))
          if (idx !== -1) list[idx] = { ...list[idx], value: Math.max(list[idx].value, value), subtype }
        } else {
          const idx = list.findIndex(s => s.name === skillName)
          if (idx !== -1) list[idx] = { ...list[idx], value: Math.max(list[idx].value, value) }
        }
      }
      prof.skills.forEach(s => applyToList(skillList, s.skill, s.value, s.subtype))
      let oi = 0
      prof.otherSkills?.forEach(s => {
        if (oi < otherList.length) { otherList[oi] = { ...otherList[oi], name: s.name, value: s.value }; oi++ }
      })
      if (prof.chooseFrom) {
        const allOpts = [...(prof.chooseFrom.options || []), ...(prof.chooseFrom.optionsOther || [])]
        profChoices.forEach(ci => {
          const c = allOpts[ci]
          if (c?.skill) applyToList(skillList, c.skill, c.value, c.subtype)
          else if (c?.name && oi < otherList.length) { otherList[oi] = { ...otherList[oi], name: c.name, value: c.value }; oi++ }
        })
      }
    }

    const bonusCounts = {}
    bonusSkills.forEach(b => {
      const key = b.isOther ? `other-${b.otherIndex}` : `skill-${b.skillIndex}`
      bonusCounts[key] = (bonusCounts[key] || 0) + 1
    })

    function toggleBonus(skillIndex, isOther, otherIndex) {
      setBonusSkills(prev => {
        const key = isOther ? `other-${otherIndex}` : `skill-${skillIndex}`
        const existing = prev.filter(b => {
          const bKey = b.isOther ? `other-${b.otherIndex}` : `skill-${b.skillIndex}`
          return bKey === key
        })

        if (existing.length > 0 && prev.length === 8) {
          // Remove one instance
          const idx = prev.findIndex(b => {
            const bKey = b.isOther ? `other-${b.otherIndex}` : `skill-${b.skillIndex}`
            return bKey === key
          })
          return [...prev.slice(0, idx), ...prev.slice(idx + 1)]
        }
        if (prev.length >= 8) return prev

        // Check 80% cap
        const currentValue = isOther
          ? (parseInt(otherList[otherIndex]?.value, 10) || 0)
          : (skillList[skillIndex]?.value || 0)
        const currentBonuses = (bonusCounts[key] || 0) * 20
        if (currentValue + currentBonuses + 20 > 80) return prev

        return [...prev, { skillIndex, isOther, otherIndex }]
      })
    }

    return (
      <div className="gen-step">
        <h2>Step 5: Bonus Skills</h2>
        <p className="gen-hint">
          Choose 8 bonus skill allocations (+20% each). You can pick the same skill multiple times.
          No skill can exceed 80%. Selected: <strong>{bonusSkills.length}/8</strong>
        </p>

        <div className="gen-bonus-grid">
          {skillList.map((skill, i) => {
            if (skill.name === 'Unnatural') return null
            const key = `skill-${i}`
            const count = bonusCounts[key] || 0
            const total = skill.value + count * 20
            return (
              <button
                key={i}
                className={`gen-bonus-btn ${count > 0 ? 'active' : ''} ${total >= 80 ? 'maxed' : ''}`}
                onClick={() => toggleBonus(i, false)}
                disabled={total >= 80 && count === 0}
              >
                <span>{skill.name}{skill.subtype ? ` (${skill.subtype})` : ''}</span>
                <span>{skill.value}%{count > 0 ? ` +${count * 20}` : ''}</span>
              </button>
            )
          })}
          {otherList.filter(s => s.name).map((skill, i) => {
            const key = `other-${i}`
            const count = bonusCounts[key] || 0
            const val = parseInt(skill.value, 10) || 0
            const total = val + count * 20
            return (
              <button
                key={`other-${i}`}
                className={`gen-bonus-btn other ${count > 0 ? 'active' : ''} ${total >= 80 ? 'maxed' : ''}`}
                onClick={() => toggleBonus(null, true, i)}
                disabled={total >= 80 && count === 0}
              >
                <span>{skill.name}</span>
                <span>{val}%{count > 0 ? ` +${count * 20}` : ''}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  function renderStep5() {
    const prof = selectedProfession !== null ? PROFESSIONS[selectedProfession] : null
    const bondCount = prof ? prof.bonds : 4
    const cha = char.stats.cha?.score || 10

    return (
      <div className="gen-step">
        <h2>Step 6: Bonds & Final Details</h2>
        <p className="gen-hint">
          You have <strong>{bondCount}</strong> bonds. Each starts at your CHA score ({cha}).
          Name the most important people or groups in your agent's life.
        </p>

        <div className="gen-subsection">
          <h3>Bonds</h3>
          {char.bonds.slice(0, bondCount).map((bond, i) => (
            <div key={i} className="gen-bond-row">
              <input
                type="text"
                value={bond.name}
                onChange={e => {
                  setChar(prev => {
                    const next = { ...prev }
                    next.bonds = [...next.bonds]
                    next.bonds[i] = { ...next.bonds[i], name: e.target.value, score: cha }
                    return next
                  })
                }}
                placeholder={`Bond ${i + 1} (e.g. spouse, child, partner)`}
                className="gen-bond-input"
              />
              <span className="gen-bond-score">{cha}</span>
            </div>
          ))}
        </div>

        <div className="gen-subsection">
          <h3>Physical Description</h3>
          <textarea
            value={char.physicalDescription}
            onChange={e => update('physicalDescription', e.target.value)}
            placeholder="Height, weight, hair, eyes, build, distinguishing features..."
            rows={3}
            className="gen-textarea"
          />
        </div>

        <div className="gen-subsection">
          <h3>Motivations & Mental Disorders</h3>
          <textarea
            value={char.motivations}
            onChange={e => update('motivations', e.target.value)}
            placeholder="What drives your agent? Why did they agree to work with Delta Green?"
            rows={3}
            className="gen-textarea"
          />
        </div>

        <div className="gen-subsection">
          <h3>Personal Details & Notes</h3>
          <textarea
            value={char.personalDetails}
            onChange={e => update('personalDetails', e.target.value)}
            placeholder="Background, personality, recruitment story, why Delta Green noticed them..."
            rows={4}
            className="gen-textarea"
          />
        </div>
      </div>
    )
  }

  function renderStep6() {
    const prof = selectedProfession !== null ? PROFESSIONS[selectedProfession] : null
    const str = char.stats.str?.score || 0
    const con = char.stats.con?.score || 0
    const pow = char.stats.pow?.score || 0
    const cha = char.stats.cha?.score || 0
    const hp = Math.ceil((str + con) / 2)
    const wp = pow
    const san = pow * 5
    const bp = pow * 4

    return (
      <div className="gen-step">
        <h2>Review Your Agent</h2>

        <div className="gen-review">
          <div className="gen-review-section">
            <h3>{char.fullName || 'Unnamed Agent'}</h3>
            <div className="gen-review-grid">
              <div><strong>Profession:</strong> {prof?.name}</div>
              <div><strong>Nationality:</strong> {char.nationality}</div>
              <div><strong>Sex:</strong> {char.sex}</div>
              <div><strong>Age:</strong> {char.age}</div>
              <div><strong>Employer:</strong> {char.employer}</div>
              <div><strong>Education:</strong> {char.education}</div>
            </div>
          </div>

          <div className="gen-review-section">
            <h3>Statistics</h3>
            <div className="gen-review-stats">
              {STAT_KEYS.map(key => (
                <div key={key} className="gen-review-stat">
                  <span>{key.toUpperCase()}</span>
                  <strong>{char.stats[key]?.score}</strong>
                  <span className="gen-x5">{(char.stats[key]?.score || 0) * 5}%</span>
                </div>
              ))}
            </div>
            <div className="gen-review-derived">
              <span>HP: {hp}</span>
              <span>WP: {wp}</span>
              <span>SAN: {san}</span>
              <span>BP: {bp}</span>
            </div>
          </div>

          <div className="gen-review-section">
            <h3>Bonds ({prof?.bonds})</h3>
            {char.bonds.slice(0, prof?.bonds || 4).map((b, i) => (
              b.name ? <div key={i}>{b.name} (Score: {cha})</div> : null
            ))}
          </div>

          <div className="gen-review-section">
            <h3>Key Skills</h3>
            <div className="gen-review-skills">
              {char.skills.filter(s => s.value > s.base).map((s, i) => (
                <span key={i} className="gen-skill-badge">
                  {s.name}{s.subtype ? ` (${s.subtype})` : ''}: {s.value}%
                </span>
              ))}
              {char.otherSkills.filter(s => s.name && s.value).map((s, i) => (
                <span key={`o-${i}`} className="gen-skill-badge other">
                  {s.name}: {s.value}%
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="gen-hint">Click "Complete" to load this agent into the full character sheet where you can fine-tune all details.</p>
      </div>
    )
  }

  const stepRenderers = [renderStep0, renderStep1, renderStep2, renderStep3, renderStep4, renderStep5, renderStep6]

  return (
    <div className="generator">
      <div className="gen-header">
        <h1>DELTA GREEN</h1>
        <span className="gen-subtitle">Agent Generator</span>
      </div>

      {/* Progress bar */}
      <div className="gen-progress">
        {STEPS.map((s, i) => (
          <div key={i} className={`gen-progress-step ${i === step ? 'current' : i < step ? 'done' : ''}`}>
            <div className="gen-progress-dot">{i < step ? '\u2713' : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="gen-body">
        {stepRenderers[step]()}
      </div>

      <div className="gen-nav">
        <button className="gen-nav-btn" onClick={handleBack} disabled={step === 0}>
          Back
        </button>
        <span className="gen-step-indicator">Step {step + 1} of {STEPS.length}</span>
        <button
          className="gen-nav-btn primary"
          onClick={handleNext}
          disabled={!canNext()}
        >
          {step === STEPS.length - 1 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  )
}
