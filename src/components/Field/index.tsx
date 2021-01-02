import * as React from 'react'
import { Errors } from '../Form'
import styled from 'styled-components'

type Editor = 'textbox' | 'multilinetextbox' | 'dropdown' | 'email'

export interface FieldProps {
  id: string
  label?: string
  editor?: Editor
  options?: string[]
  value?: any
  style?: React.CSSProperties
}

const StyledInput = styled.input<{ error?: boolean }>`
  color: ${({ error, theme }) => (error ? theme.red1 : theme.textPrimary)};
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  flex: 0 0 100%;
  white-space: nowrap;
  background: transparent;
  border: none;
  outline: none;
  border-radius: 6px;
  color: ${({ theme }) => theme.appCurrencyInputTextColor};
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.modalInputBorder};
  background-color: ${({ theme }) => theme.appCurrencyInputBG};
  -webkit-appearance: none;

  font-size: 18px;

  ::placeholder {
    color: ${({ theme }) => theme.textTertiary};
  }
  transition: border 100ms;
  :focus {
    border: 1px solid ${({ theme }) => theme.modalInputBorderFocus};
    outline: none;
  }

  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.textTertiary};
  }
`

const FormGroup = styled.div`
  padding: 0 0 12px;
  display: flex;
  flex: 1;
`

export const Field: React.FunctionComponent<FieldProps> = ({ id, label, editor, options, value, style }) => {
  return (
    <FormGroup style={style}>
      {editor!.toLowerCase() === 'textbox' && (
        <StyledInput
          id={id}
          type="text"
          value={value}
          placeholder={label}
          onChange={(e: React.FormEvent<HTMLInputElement>) => console.log(e) /* TODO: push change to form values */}
          onBlur={(e: React.FormEvent<HTMLInputElement>) => console.log(e) /* TODO: validate field value */}
          className="form-control"
        />
      )}

      {editor!.toLowerCase() === 'email' && (
        <StyledInput
          id={id}
          type="email"
          value={value}
          placeholder={label}
          onChange={(e: React.FormEvent<HTMLInputElement>) => console.log(e) /* TODO: push change to form values */}
          onBlur={(e: React.FormEvent<HTMLInputElement>) => console.log(e) /* TODO: validate field value */}
          className="form-control"
        />
      )}

      {editor!.toLowerCase() === 'multilinetextbox' && (
        <textarea
          id={id}
          value={value}
          onChange={(e: React.FormEvent<HTMLTextAreaElement>) => console.log(e) /* TODO: push change to form values */}
          onBlur={(e: React.FormEvent<HTMLTextAreaElement>) => console.log(e) /* TODO: validate field value */}
          className="form-control"
        />
      )}

      {editor!.toLowerCase() === 'dropdown' && (
        <select
          id={id}
          name={id}
          value={value}
          onChange={(e: React.FormEvent<HTMLSelectElement>) => console.log(e) /* TODO: push change to form values */}
          onBlur={(e: React.FormEvent<HTMLSelectElement>) => console.log(e) /* TODO: validate field value */}
          className="form-control"
        >
          {options &&
            options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
        </select>
      )}

      {/* TODO - display validation error */}
    </FormGroup>
  )
}
Field.defaultProps = {
  editor: 'textbox'
}
