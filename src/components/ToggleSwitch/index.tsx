import React from 'react'
import './index.css'

/*
Toggle Switch Component
Note: id, isActive and onChange are required for ToggleSwitch component to function.
The props name, small, disabled and optionLabels are optional.
Usage: <ToggleSwitch id={id} isActive={value} onChange={isActive => setValue(isActive)}} />
*/

export interface ToggleProps {
  id?: string
  isActive: boolean
  toggle: any
  disabled?: boolean
  small?: boolean
}

export default function ToggleSwitch({ id, isActive, toggle, disabled, small }: ToggleProps) {
  return (
    <div className={'toggle-switch' + (small ? ' small-switch' : '')}>
      <input
        type="checkbox"
        className="toggle-switch-checkbox"
        id={id}
        checked={isActive}
        onChange={e => toggle(e.target.checked)}
        disabled={disabled}
      />
      {id ? (
        <label className="toggle-switch-label" htmlFor={id} tabIndex={disabled ? -1 : 1}>
          <span
            className={disabled ? 'toggle-switch-inner toggle-switch-disabled' : 'toggle-switch-inner'}
            tabIndex={-1}
          />
          <span
            className={disabled ? 'toggle-switch-switch toggle-switch-disabled' : 'toggle-switch-switch'}
            tabIndex={-1}
          />
        </label>
      ) : null}
    </div>
  )
}

// Set optionLabels for rendering.
ToggleSwitch.defaultProps = {
  optionLabels: ['Yes', 'No']
}
