import React from 'react'
import styled from 'styled-components'

const FormBody = styled.form`
  width: 100%;
  margin: 0;
  padding: 0;
`

const FormContainer = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex: 0 0 100%;
  flex-wrap: wrap;
`

interface FormProps {
  action: string
  render: () => React.ReactNode
}

export interface Values {
  [key: string]: any
}

export interface Errors {
  [key: string]: string
}

export interface FormState {
  values: Values
  errors: Errors
  submitSuccess?: boolean
}

export class Form extends React.Component<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props)

    const errors: Errors = {}
    const values: Values = {}
    this.state = {
      errors,
      values
    }
  }

  /**
   * Returns whether there are any errors in the errors object that is passed in
   * @param {Errors} errors - The field errors
   */
  private haveErrors(errors: Errors) {
    let haveError = false
    Object.keys(errors).map((key: string) => {
      if (errors[key].length > 0) {
        haveError = true
      }
    })
    return haveError
  }

  /**
   * Handles form submission
   * @param {React.FormEvent<HTMLFormElement>} e - The form event
   */
  private handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (this.validateForm()) {
      const submitSuccess: boolean = await this.submitForm()
      this.setState({ submitSuccess })
    }
  }

  /**
   * Executes the validation rules for all the fields on the form and sets the error state
   * @returns {boolean} - Whether the form is valid or not
   */
  private validateForm(): boolean {
    // TODO - validate form
    return true
  }

  /**
   * Submits the form to the http api
   * @returns {boolean} - Whether the form submission was successful or not
   */
  private async submitForm(): Promise<boolean> {
    // TODO - submit the form
    return true
  }

  public render() {
    const { submitSuccess, errors } = this.state

    return (
      <FormBody onSubmit={this.handleSubmit} noValidate={true}>
        <FormContainer>
          {this.props.render()}
          {submitSuccess && (
            <div className="alert alert-info" role="alert">
              The form was successfully submitted!
            </div>
          )}
          {submitSuccess === false && !this.haveErrors(errors) && (
            <div className="alert alert-danger" role="alert">
              Sorry, an unexpected error has occurred
            </div>
          )}
          {submitSuccess === false && this.haveErrors(errors) && (
            <div className="alert alert-danger" role="alert">
              Sorry, the form is invalid. Please review, adjust and try again
            </div>
          )}
        </FormContainer>
      </FormBody>
    )
  }
}
