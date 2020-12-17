import { FlattenSimpleInterpolation, ThemedCssFunction } from 'styled-components'

export type Color = string
export interface Colors {
  appBG: string
  appInfoBoxBG: Color
  appInfoBoxTextColor: Color
  appBoxBG: Color
  appBoxBorder: Color
  appBoxHoverBG: Color
  appBoxHoverBorder: Color
  appBoxTextColor: Color
  appBoxSecondaryBG: Color
  appBoxSecondaryTextColor: Color
  appBoxSecondaryInnerBG: Color
  appBoxSecondaryInnerTextColor: Color
  appCurrencyInputBG: Color
  appCurrencyInputTextColor: Color
  appCurrencyInputBGHover: Color
  appCurrencyInputTextColorHover: Color
  appCurrencyInputBGActive: Color
  appCurrencyInputTextColorActive: Color

  //Buttons
  buttonBG: Color
  buttonTextColor: Color
  buttonBGHover: Color
  buttonTextColorHover: Color
  buttonBGActive: Color
  buttonTextColorActive: Color
  buttonBGActiveHover: Color
  buttonTextColorActiveHover: Color
  buttonBGDisabled: Color
  buttonTextColorDisabled: Color
  buttonNavigationBG: Color
  buttonNavigationTextColor: Color
  buttonNavigationBGHover: Color
  buttonNavigationTextColorHover: Color
  buttonSelectBG: Color
  buttonSelectTextColor: Color
  buttonSelectBGHover: Color
  buttonSelectTextColorHover: Color
  buttonSelectBGActive: Color
  buttonSelectTextColorActive: Color
  buttonSelectBGActiveHover: Color
  buttonSelectTextColorActiveHover: Color
  buttonSecondaryBG: Color
  buttonSecondaryBorder: Color
  buttonSecondaryTextColor: Color
  buttonSecondaryBGActive: Color
  buttonSecondaryBorderActive: Color
  buttonSecondaryTextColorActive: Color
  buttonSecondaryBGHover: Color
  buttonSecondaryBorderHover: Color
  buttonSecondaryTextColorHover: Color
  buttonOutlinedBorder: Color
  buttonOutlinedTextColor: Color
  buttonOutlinedBorderHover: Color
  buttonOutlinedTextColorHover: Color

  //Footer
  footerBG: Color
  footerTextColor: Color

  //Global
  bodyBG: Color
  linkColor: Color
  linkColorHover: Color

  //Header
  headerBG: Color
  headerTextColor: Color
  headerButtonBG: Color
  headerButtonBGHover: Color
  headerButtonIconColor: Color

  //Modal
  modalBG: Color
  modalBorder: Color
  modalSecondaryBG: Color
  modalLines: Color
  modalButtonBG: Color
  modalButtonText: Color
  modalShadow: Color
  modalInputBG: Color
  modalInputBorder: Color
  modalInputBorderFocus: Color
  modalFooterBG: Color

  //Navigation
  navigationBG: Color
  navigationTabBG: Color
  navigationTabIconColor: Color
  navigationTabBGHover: Color
  navigationTabIconColorHover: Color
  navigationTabBGActive: Color
  navigationTabIconColorActive: Color
  navigationTabModalBG: Color
  navigationTabModalText: Color
  navigationTabModalHover: Color

  //Text
  textHighlight: Color
  textPrimary: Color
  textSecondary: Color
  textTertiary: Color
  textDisabled: Color

  //States
  red1: Color
  red2: Color
  green1: Color
  yellow1: Color
  yellow2: Color
}

export interface Grids {
  sm: number
  md: number
  lg: number
}

declare module 'styled-components' {
  export interface DefaultTheme extends Colors {
    grids: Grids

    // shadows
    shadow1: string

    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>
      upToSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
    }

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation
    flexRowNoWrap: FlattenSimpleInterpolation
  }
}
