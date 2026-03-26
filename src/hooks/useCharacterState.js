import { useState, useCallback, useEffect, useRef } from 'react'

const DEFAULT_SKILLS = [
  // Page 1 - Column 1
  { name: 'Accounting', base: 10, subtype: '' },
  { name: 'Alertness', base: 20, subtype: '' },
  { name: 'Anthropology', base: 0, subtype: '' },
  { name: 'Archeology', base: 0, subtype: '' },
  { name: 'Art', base: 0, subtype: '', hasSubtype: true },
  { name: 'Artillery', base: 0, subtype: '' },
  { name: 'Athletics', base: 30, subtype: '' },
  { name: 'Bureaucracy', base: 10, subtype: '' },
  { name: 'Computer Science', base: 0, subtype: '' },
  { name: 'Craft', base: 0, subtype: '', hasSubtype: true },
  { name: 'Criminology', base: 10, subtype: '' },
  { name: 'Demolitions', base: 0, subtype: '' },
  { name: 'Disguise', base: 10, subtype: '' },
  { name: 'Dodge', base: 30, subtype: '' },
  { name: 'Drive', base: 20, subtype: '' },
  { name: 'Firearms', base: 20, subtype: '' },
  // Page 1 - Column 2
  { name: 'First Aid', base: 10, subtype: '' },
  { name: 'Forensics', base: 0, subtype: '' },
  { name: 'Heavy Machinery', base: 10, subtype: '' },
  { name: 'Heavy Weapons', base: 0, subtype: '' },
  { name: 'History', base: 10, subtype: '' },
  { name: 'HUMINT', base: 10, subtype: '' },
  { name: 'Law', base: 0, subtype: '' },
  { name: 'Medicine', base: 0, subtype: '' },
  { name: 'Melee Weapons', base: 30, subtype: '' },
  { name: 'Military Science', base: 0, subtype: '', hasSubtype: true },
  { name: 'Navigate', base: 10, subtype: '' },
  { name: 'Occult', base: 10, subtype: '' },
  { name: 'Persuade', base: 20, subtype: '' },
  { name: 'Pharmacy', base: 0, subtype: '' },
  { name: 'Pilot', base: 0, subtype: '', hasSubtype: true },
  { name: 'Psychotherapy', base: 10, subtype: '' },
  // Page 1 - Column 3
  { name: 'Ride', base: 10, subtype: '' },
  { name: 'Science', base: 0, subtype: '', hasSubtype: true },
  { name: 'Search', base: 20, subtype: '' },
  { name: 'SIGINT', base: 0, subtype: '' },
  { name: 'Stealth', base: 10, subtype: '' },
  { name: 'Surgery', base: 0, subtype: '' },
  { name: 'Survival', base: 10, subtype: '' },
  { name: 'Swim', base: 20, subtype: '' },
  { name: 'Unarmed Combat', base: 40, subtype: '' },
  { name: 'Unnatural', base: 0, subtype: '' },
]

const UNNATURAL_INDEX = DEFAULT_SKILLS.findIndex(s => s.name === 'Unnatural')

const EMPTY_WEAPON = {
  name: '', skill: '', baseRange: '', damage: '',
  armorPiercing: '', lethality: '', killRadius: '', ammo: ''
}

export function createInitialState() {
  return {
    // Personal Data
    fullName: '',
    profession: '',
    employer: '',
    nationality: '',
    sex: '',
    age: '',
    dob: '',
    education: '',

    // Statistics
    stats: {
      str: { score: '', x5: 0, feature: '' },
      con: { score: '', x5: 0, feature: '' },
      dex: { score: '', x5: 0, feature: '' },
      int: { score: '', x5: 0, feature: '' },
      pow: { score: '', x5: 0, feature: '' },
      cha: { score: '', x5: 0, feature: '' },
    },

    // Derived Attributes
    hp: { max: '', current: '' },
    wp: { max: '', current: '' },
    san: { max: 99, current: '' },
    bp: { value: '' },

    // Physical Description
    physicalDescription: '',

    // Bonds
    bonds: [
      { name: '', score: '' },
      { name: '', score: '' },
      { name: '', score: '' },
      { name: '', score: '' },
      { name: '', score: '' },
    ],

    // Motivations and Mental Disorders
    motivations: '',

    // SAN loss incidents
    violence: [false, false, false],
    violenceAdapted: false,
    helplessness: [false, false, false],
    helplessnessAdapted: false,

    // Skills
    skills: DEFAULT_SKILLS.map(s => ({
      ...s,
      value: s.base,
      failed: false,
    })),

    // Foreign Languages and Other Skills
    otherSkills: [
      { name: '', value: '', failed: false },
      { name: '', value: '', failed: false },
      { name: '', value: '', failed: false },
      { name: '', value: '', failed: false },
      { name: '', value: '', failed: false },
      { name: '', value: '', failed: false },
    ],

    // Injuries
    wounds: '',
    firstAidAttempted: false,

    // Equipment
    armorAndGear: '',

    // Weapons
    weapons: Array(7).fill(null).map(() => ({ ...EMPTY_WEAPON })),

    // Remarks
    personalDetails: '',
    developments: '',
    specialTraining: [
      { description: '', skillOrStat: '' },
      { description: '', skillOrStat: '' },
      { description: '', skillOrStat: '' },
    ],

    // Footer
    authorizingOfficer: '',
    agentSignature: '',
  }
}

export default function useCharacterState() {
  const [character, setCharacter] = useState(() => {
    try {
      const saved = localStorage.getItem('dg-default-character')
      if (saved) {
        return { ...createInitialState(), ...JSON.parse(saved) }
      }
    } catch {
      // Corrupt localStorage — ignore
    }
    return createInitialState()
  })

  const [autoSave, setAutoSave] = useState(() => {
    return localStorage.getItem('dg-auto-save') === 'true'
  })

  // Persist auto-save preference
  useEffect(() => {
    localStorage.setItem('dg-auto-save', String(autoSave))
  }, [autoSave])

  // Auto-save character with debounce
  const saveTimeoutRef = useRef(null)
  useEffect(() => {
    if (!autoSave) return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem('dg-default-character', JSON.stringify(character))
    }, 500)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [character, autoSave])

  const update = useCallback((path, value) => {
    setCharacter(prev => {
      const next = { ...prev }
      const keys = path.split('.')
      let obj = next

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]
        if (Array.isArray(obj[key])) {
          obj[key] = [...obj[key]]
        } else {
          obj[key] = { ...obj[key] }
        }
        obj = obj[key]
      }

      obj[keys[keys.length - 1]] = value
      return next
    })
  }, [])

  const updateStat = useCallback((stat, value) => {
    setCharacter(prev => {
      const score = value === '' ? '' : parseInt(value, 10) || 0
      const next = { ...prev }
      next.stats = { ...next.stats }
      next.stats[stat] = {
        ...next.stats[stat],
        score,
        x5: score === '' ? 0 : score * 5,
      }

      // Recalculate derived attributes
      const str = next.stats.str.score || 0
      const con = next.stats.con.score || 0
      const pow = next.stats.pow.score || 0
      const san = parseInt(next.san.current, 10)

      next.hp = { ...next.hp, max: str && con ? Math.ceil((str + con) / 2) : '' }
      next.wp = { ...next.wp, max: pow || '' }
      next.bp = { value: pow ? pow * 4 : '' }

      return next
    })
  }, [])

  const updateSkill = useCallback((index, field, value) => {
    setCharacter(prev => {
      const next = { ...prev }
      next.skills = [...next.skills]
      next.skills[index] = { ...next.skills[index], [field]: value }

      // Auto-calculate SAN max when Unnatural skill changes (SAN max = 99 - Unnatural)
      if (index === UNNATURAL_INDEX && field === 'value') {
        const unnaturalValue = parseInt(value, 10) || 0
        next.san = { ...next.san, max: 99 - unnaturalValue }
      }

      return next
    })
  }, [])

  const updateOtherSkill = useCallback((index, field, value) => {
    setCharacter(prev => {
      const next = { ...prev }
      next.otherSkills = [...next.otherSkills]
      next.otherSkills[index] = { ...next.otherSkills[index], [field]: value }
      return next
    })
  }, [])

  const updateBond = useCallback((index, field, value) => {
    setCharacter(prev => {
      const next = { ...prev }
      next.bonds = [...next.bonds]
      next.bonds[index] = { ...next.bonds[index], [field]: value }
      return next
    })
  }, [])

  const updateWeapon = useCallback((index, field, value) => {
    setCharacter(prev => {
      const next = { ...prev }
      next.weapons = [...next.weapons]
      next.weapons[index] = { ...next.weapons[index], [field]: value }
      return next
    })
  }, [])

  const updateSpecialTraining = useCallback((index, field, value) => {
    setCharacter(prev => {
      const next = { ...prev }
      next.specialTraining = [...next.specialTraining]
      next.specialTraining[index] = { ...next.specialTraining[index], [field]: value }
      return next
    })
  }, [])

  const updateViolence = useCallback((index, value) => {
    setCharacter(prev => {
      const next = { ...prev }
      next.violence = [...next.violence]
      next.violence[index] = value
      return next
    })
  }, [])

  const updateHelplessness = useCallback((index, value) => {
    setCharacter(prev => {
      const next = { ...prev }
      next.helplessness = [...next.helplessness]
      next.helplessness[index] = value
      return next
    })
  }, [])

  const loadCharacter = useCallback((data) => {
    setCharacter({ ...createInitialState(), ...data })
  }, [])

  const resetCharacter = useCallback(() => {
    setCharacter(createInitialState())
  }, [])

  return {
    character,
    update,
    updateStat,
    updateSkill,
    updateOtherSkill,
    updateBond,
    updateWeapon,
    updateSpecialTraining,
    updateViolence,
    updateHelplessness,
    loadCharacter,
    resetCharacter,
    autoSave,
    setAutoSave,
  }
}
