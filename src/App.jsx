import { useState } from 'react'
import CharacterSheet from './components/CharacterSheet'
import CharacterGenerator from './components/CharacterGenerator'
import './App.css'

function App() {
  const [view, setView] = useState('generator') // 'generator' or 'sheet'
  const [generatedCharacter, setGeneratedCharacter] = useState(null)

  function handleGeneratorComplete(character) {
    setGeneratedCharacter(character)
    setView('sheet')
  }

  function handleBackToGenerator() {
    setView('generator')
  }

  if (view === 'generator') {
    return (
      <>
        <CharacterGenerator onComplete={handleGeneratorComplete} />
        <div style={{ textAlign: 'center', padding: '10px' }}>
          <button
            onClick={() => setView('sheet')}
            style={{
              background: 'none', border: 'none', color: '#888',
              cursor: 'pointer', fontSize: '12px', textDecoration: 'underline',
            }}
          >
            Skip to blank character sheet
          </button>
        </div>
      </>
    )
  }

  return <CharacterSheet initialCharacter={generatedCharacter} onBackToGenerator={handleBackToGenerator} />
}

export default App
