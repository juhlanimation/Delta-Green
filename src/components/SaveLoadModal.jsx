import { useState, useRef, useEffect } from 'react'
import { createInitialState } from '../hooks/useCharacterState'
import './SaveLoadModal.css'

export default function SaveLoadModal({ character, loadCharacter, resetCharacter, isOpen, onClose }) {
  const [filename, setFilename] = useState('')
  const [hasDefault, setHasDefault] = useState(() => !!localStorage.getItem('dg-default-character'))
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Refresh default status when modal opens
  useEffect(() => {
    if (isOpen) {
      setHasDefault(!!localStorage.getItem('dg-default-character'))
    }
  }, [isOpen])

  if (!isOpen) return null

  const suggestedName = character.fullName
    ? character.fullName.replace(/[^a-zA-Z0-9_-]/g, '_')
    : 'unnamed_agent'

  function handleSave() {
    const name = filename.trim() || suggestedName
    const json = JSON.stringify(character, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name.endsWith('.json') ? name : `${name}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleLoad(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        loadCharacter(data)
      } catch {
        alert('Failed to load character file. Invalid JSON.')
      }
      fileInputRef.current.value = ''
    }
    reader.readAsText(file)
  }

  function handleSetDefault() {
    localStorage.setItem('dg-default-character', JSON.stringify(character))
    setHasDefault(true)
  }

  function handleClearDefault() {
    localStorage.removeItem('dg-default-character')
    setHasDefault(false)
  }

  function handleNewCharacter() {
    if (confirm('Start a new blank character? Unsaved changes will be lost.')) {
      resetCharacter()
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Character File Management</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        {/* Save */}
        <div className="modal-section">
          <label className="modal-label">Filename</label>
          <input
            type="text"
            className="modal-input"
            value={filename}
            onChange={e => setFilename(e.target.value)}
            placeholder={suggestedName}
          />
          <button className="modal-btn" onClick={handleSave}>Save to File</button>
        </div>

        {/* Load */}
        <div className="modal-section">
          <button className="modal-btn" onClick={() => fileInputRef.current.click()}>
            Load from File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleLoad}
          />
        </div>

        {/* Default Auto-Load */}
        <div className="modal-section">
          <label className="modal-label">Default Auto-Load</label>
          <p className="modal-status">
            {hasDefault
              ? 'A default character will auto-load on startup.'
              : 'No default character set.'}
          </p>
          <div className="modal-btn-row">
            <button className="modal-btn" onClick={handleSetDefault}>Set Current as Default</button>
            <button
              className="modal-btn modal-btn-secondary"
              onClick={handleClearDefault}
              disabled={!hasDefault}
            >
              Clear Default
            </button>
          </div>
        </div>

        {/* New Character */}
        <div className="modal-section">
          <button className="modal-btn modal-btn-danger" onClick={handleNewCharacter}>
            New Blank Character
          </button>
        </div>
      </div>
    </div>
  )
}
