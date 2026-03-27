import { useState, useEffect, useRef } from 'react'
import useCharacterState from '../hooks/useCharacterState'
import SaveLoadModal from './SaveLoadModal'
import PersonalData from './sections/PersonalData'
import StatisticalData from './sections/StatisticalData'
import PsychologicalData from './sections/PsychologicalData'
import Skills from './sections/Skills'
import Injuries from './sections/Injuries'
import Equipment from './sections/Equipment'
import Weapons from './sections/Weapons'
import Remarks from './sections/Remarks'
import Footer from './sections/Footer'
import './CharacterSheet.css'

export default function CharacterSheet({ initialCharacter, onBackToGenerator }) {
  const state = useCharacterState()
  const [modalOpen, setModalOpen] = useState(false)
  const initialLoaded = useRef(false)

  // Load generated character on first mount
  useEffect(() => {
    if (initialCharacter && !initialLoaded.current) {
      state.loadCharacter(initialCharacter)
      initialLoaded.current = true
    }
  }, [initialCharacter]) // eslint-disable-line react-hooks/exhaustive-deps

  function handlePrint() {
    window.print()
  }

  return (
    <div className="sheet">
      {/* Header */}
      <div className="sheet-header">
        <button className="file-mgmt-btn" onClick={() => setModalOpen(true)}>
          &#9776;
        </button>
        {onBackToGenerator && (
          <button className="generator-btn" onClick={onBackToGenerator} title="Back to Generator">
            &#9998;
          </button>
        )}
        <label className="auto-save-toggle">
          <span className="auto-save-label">Auto Save</span>
          <span className="toggle-switch">
            <input
              type="checkbox"
              checked={state.autoSave}
              onChange={e => state.setAutoSave(e.target.checked)}
            />
            <span className="toggle-slider" />
          </span>
        </label>
        <h1 className="sheet-title">DELTA GREEN</h1>
        <button className="print-btn" onClick={handlePrint} title="Print Character Sheet">
          &#128438; Print
        </button>
      </div>

      <SaveLoadModal
        character={state.character}
        loadCharacter={state.loadCharacter}
        resetCharacter={state.resetCharacter}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {/* Page 1 */}
      <div className="sheet-page page-1">
        <PersonalData {...state} />

        <div className="sheet-row stat-psych-row">
          <StatisticalData {...state} />
          <PsychologicalData {...state} />
        </div>

        <Skills {...state} />
      </div>

      {/* Page 2 */}
      <div className="sheet-page page-2">
        <Injuries {...state} />
        <Equipment {...state} />
        <Weapons {...state} />
        <Remarks {...state} />
        <Footer {...state} />
      </div>

      {/* Form footer */}
      <div className="form-stamp">
        <div className="stamp-left">
          <span className="stamp-dd">DD</span>
          <span className="stamp-form">UNITED STATES<br />FORM</span>
          <span className="stamp-number">315</span>
        </div>
        <div className="stamp-center">
          TOP SECRET//ORCON//SPECIAL ACCESS REQUIRED-DELTA GREEN<br />
          AGENT DOCUMENTATION SHEET
        </div>
        <div className="stamp-right">112382</div>
      </div>
    </div>
  )
}
