import * as React from 'react'
import { Errors, InterfaceFormContext, FormContext, Values } from '../Form'
import styled from 'styled-components'
import { MouseoverTooltip } from '../Tooltip'
import { useTranslation } from 'react-i18next'

type Editor = 'textbox' | 'multilinetextbox' | 'dropdown' | 'email' | 'hidden'

export interface Validation {
  rule: (values: Values, fieldName: string, args: any) => string
  args?: any
}

export interface FieldProps {
  id: string
  label?: string
  editor?: Editor
  autocomplete?: string
  options?: string[]
  value?: any
  style?: React.CSSProperties
  validation?: Validation
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
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.appCurrencyInputTextColor};
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.appCurrencyInputBG};
  background: ${({ theme }) => theme.appCurrencyInputBG};
  -webkit-appearance: none;

  font-size: 18px;

  ::placeholder {
    color: ${({ theme }) => theme.textTertiary};
  }
  transition: border 100ms;
  :focus {
    border: 1px solid ${({ theme }) => theme.modalInputBorderFocus} !important;
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

  :-webkit-autofill {
    background: ${({ theme }) => theme.appCurrencyInputBG};
  }
`

const FormGroup = styled.div`
  padding: 0 0 12px;
  display: flex;
  flex: 1;
`

export const Field: React.FunctionComponent<FieldProps> = ({
  id,
  label,
  editor,
  autocomplete,
  options,
  value,
  style
}) => {
  const getError = (errors: Errors): string => (errors ? errors[id] : '')
  const getEditorStyle = (errors: Errors): any => (getError(errors) ? { borderColor: 'red' } : {})
  const { t } = useTranslation()
  return (
    <FormContext.Consumer>
      {(context: InterfaceFormContext) => (
        <FormGroup style={style}>
          <MouseoverTooltip text={t(getError(context.errors))}>
            {editor!.toLowerCase() === 'textbox' && (
              <StyledInput
                id={id}
                name={id}
                type="text"
                value={value}
                placeholder={label}
                onChange={(e: React.FormEvent<HTMLInputElement>) => context.setValues({ [id]: e.currentTarget.value })}
                onBlur={() => context.validate(id)}
                autoComplete={autocomplete}
                style={getEditorStyle(context.errors)}
              />
            )}

            {editor!.toLowerCase() === 'email' && (
              <StyledInput
                id={id}
                name={id}
                type="email"
                value={value}
                placeholder={label}
                onChange={(e: React.FormEvent<HTMLInputElement>) => context.setValues({ [id]: e.currentTarget.value })}
                onBlur={() => context.validate(id)}
                autoComplete={autocomplete}
                style={getEditorStyle(context.errors)}
              />
            )}

            {editor!.toLowerCase() === 'hidden' && (
              <input
                id={id}
                name={id}
                type="hidden"
                value={value}
                onChange={(e: React.FormEvent<HTMLInputElement>) => context.setValues({ [id]: e.currentTarget.value })}
              />
            )}

            {editor!.toLowerCase() === 'multilinetextbox' && (
              <textarea
                id={id}
                name={id}
                value={value}
                onChange={(e: React.FormEvent<HTMLTextAreaElement>) =>
                  context.setValues({ [id]: e.currentTarget.value })
                }
                onBlur={() => context.validate(id)}
                autoComplete={autocomplete}
                style={getEditorStyle(context.errors)}
              />
            )}

            {editor!.toLowerCase() === 'dropdown' && (
              <select
                id={id}
                name={id}
                value={value}
                onChange={(e: React.FormEvent<HTMLSelectElement>) => context.setValues({ [id]: e.currentTarget.value })}
                onBlur={() => context.validate(id)}
                autoComplete={autocomplete}
                style={getEditorStyle(context.errors)}
              >
                {options &&
                  options.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            )}
          </MouseoverTooltip>
        </FormGroup>
      )}
    </FormContext.Consumer>
  )
}
Field.defaultProps = {
  editor: 'textbox'
}
