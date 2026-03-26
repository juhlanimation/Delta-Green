// Delta Green Need to Know - 6 Core Professions
// Each profession defines:
//   - name: display name
//   - bonds: number of bonds
//   - skills: fixed professional skills { skill, value, subtype? }
//   - chooseFrom: optional picks { count, options: [{ skill, value, subtype? }] }

const PROFESSIONS = [
  {
    name: 'Anthropologist or Historian',
    bonds: 4,
    skills: [
      { skill: 'Anthropology', value: 50 },
      { skill: 'Bureaucracy', value: 40 },
      { skill: 'History', value: 60 },
      { skill: 'Occult', value: 40 },
      { skill: 'Persuade', value: 40 },
    ],
    otherSkills: [
      { name: 'Foreign Language', value: 50 },
      { name: 'Foreign Language', value: 40 },
    ],
    chooseFrom: {
      count: 2,
      options: [
        { skill: 'Anthropology', value: 40 },
        { skill: 'Archeology', value: 40 },
        { skill: 'HUMINT', value: 50 },
        { skill: 'Navigate', value: 50 },
        { skill: 'Ride', value: 50 },
        { skill: 'Search', value: 60 },
        { skill: 'Survival', value: 50 },
      ],
    },
  },
  {
    name: 'Computer Scientist or Engineer',
    bonds: 3,
    skills: [
      { skill: 'Computer Science', value: 60 },
      { skill: 'Craft', value: 30, subtype: 'Electrician' },
      { skill: 'Craft', value: 30, subtype: 'Mechanic' },
      { skill: 'Craft', value: 40, subtype: 'Microelectronics' },
      { skill: 'Science', value: 40, subtype: 'Mathematics' },
      { skill: 'SIGINT', value: 40 },
    ],
    otherSkills: [],
    chooseFrom: {
      count: 4,
      options: [
        { skill: 'Accounting', value: 50 },
        { skill: 'Bureaucracy', value: 50 },
        { skill: 'Craft', value: 40, subtype: '(specify)' },
        { skill: 'Heavy Machinery', value: 50 },
        { skill: 'Law', value: 40 },
        { skill: 'Science', value: 40, subtype: '(specify)' },
      ],
    },
    chooseFromOther: {
      count: 0,
      options: [
        { name: 'Foreign Language', value: 40 },
      ],
      note: 'Foreign Language 40% is one of the choose-4 options',
    },
  },
  {
    name: 'Federal Agent',
    bonds: 3,
    skills: [
      { skill: 'Alertness', value: 50 },
      { skill: 'Bureaucracy', value: 40 },
      { skill: 'Criminology', value: 50 },
      { skill: 'Drive', value: 50 },
      { skill: 'Firearms', value: 50 },
      { skill: 'Forensics', value: 30 },
      { skill: 'HUMINT', value: 60 },
      { skill: 'Law', value: 30 },
      { skill: 'Persuade', value: 50 },
      { skill: 'Search', value: 50 },
      { skill: 'Unarmed Combat', value: 60 },
    ],
    otherSkills: [],
    chooseFrom: {
      count: 1,
      options: [
        { skill: 'Accounting', value: 60 },
        { skill: 'Computer Science', value: 50 },
        { skill: 'Heavy Weapons', value: 50 },
        { skill: 'Pharmacy', value: 50 },
      ],
      optionsOther: [
        { name: 'Foreign Language', value: 50 },
      ],
    },
  },
  {
    name: 'Physician',
    bonds: 3,
    skills: [
      { skill: 'Bureaucracy', value: 50 },
      { skill: 'First Aid', value: 60 },
      { skill: 'Medicine', value: 60 },
      { skill: 'Persuade', value: 40 },
      { skill: 'Pharmacy', value: 50 },
      { skill: 'Science', value: 60, subtype: 'Biology' },
      { skill: 'Search', value: 40 },
    ],
    otherSkills: [],
    chooseFrom: {
      count: 2,
      options: [
        { skill: 'Forensics', value: 50 },
        { skill: 'Psychotherapy', value: 60 },
        { skill: 'Science', value: 50, subtype: '(specify)' },
        { skill: 'Surgery', value: 50 },
      ],
    },
  },
  {
    name: 'Scientist',
    bonds: 4,
    skills: [
      { skill: 'Bureaucracy', value: 40 },
      { skill: 'Computer Science', value: 40 },
      { skill: 'Science', value: 60, subtype: '(primary)' },
      { skill: 'Science', value: 50, subtype: '(secondary)' },
      { skill: 'Science', value: 50, subtype: '(tertiary)' },
    ],
    otherSkills: [],
    chooseFrom: {
      count: 3,
      options: [
        { skill: 'Accounting', value: 50 },
        { skill: 'Craft', value: 40, subtype: '(specify)' },
        { skill: 'Forensics', value: 40 },
        { skill: 'Law', value: 40 },
        { skill: 'Pharmacy', value: 40 },
      ],
      optionsOther: [
        { name: 'Foreign Language', value: 40 },
      ],
    },
  },
  {
    name: 'Special Operator',
    bonds: 2,
    skills: [
      { skill: 'Alertness', value: 60 },
      { skill: 'Athletics', value: 60 },
      { skill: 'Demolitions', value: 40 },
      { skill: 'Firearms', value: 60 },
      { skill: 'Heavy Weapons', value: 50 },
      { skill: 'Melee Weapons', value: 50 },
      { skill: 'Military Science', value: 60, subtype: 'Land' },
      { skill: 'Navigate', value: 50 },
      { skill: 'Stealth', value: 50 },
      { skill: 'Survival', value: 50 },
      { skill: 'Swim', value: 50 },
      { skill: 'Unarmed Combat', value: 60 },
    ],
    otherSkills: [],
    chooseFrom: null,
  },
  // --- Additional Professions (Agent's Handbook) ---
  {
    name: 'Police Officer',
    bonds: 3,
    skills: [
      { skill: 'Alertness', value: 50 },
      { skill: 'Bureaucracy', value: 40 },
      { skill: 'Criminology', value: 40 },
      { skill: 'Drive', value: 50 },
      { skill: 'Firearms', value: 40 },
      { skill: 'First Aid', value: 30 },
      { skill: 'HUMINT', value: 50 },
      { skill: 'Law', value: 30 },
      { skill: 'Melee Weapons', value: 50 },
      { skill: 'Navigate', value: 40 },
      { skill: 'Persuade', value: 40 },
      { skill: 'Search', value: 40 },
      { skill: 'Unarmed Combat', value: 60 },
    ],
    otherSkills: [],
    chooseFrom: {
      count: 1,
      options: [
        { skill: 'Forensics', value: 50 },
        { skill: 'Heavy Weapons', value: 50 },
        { skill: 'Ride', value: 60 },
      ],
    },
  },
]

export const STAT_ARRAYS = {
  'Well Rounded': [13, 13, 12, 12, 11, 11],
  'Focused': [15, 14, 12, 11, 10, 10],
  'Highly Focused': [17, 14, 13, 10, 10, 8],
}

export default PROFESSIONS
