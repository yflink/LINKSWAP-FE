export function defaultTheme() {
  const mainColor = '#295BDB'
  const mainColorHover = '#2251c9'
  const appBG = '#232a35'
  const bodyBGColor = '#2b3a4a'
  const mainTextColor = '#FFF'
  const transparent = 'transparent'
  const buttonBG = '#40444f'
  const buttonBGHover = '#60656d'
  const buttonSecondaryBG = '#212328'
  const modalBG = '#222a35'
  const infoText = '#87a9ff'
  const infoBG = '#202f46'

  return {
    //App
    appBGColor: appBG,
    appInfoBoxBG: infoBG,
    appInfoBoxTextColor: infoText,
    appBoxBG: '#373f49',
    appBoxBorder: '#373f49',
    appBoxHoverBG: '#373f49',
    appBoxHoverBorder: '#5e6373',
    appBoxTextColor: mainTextColor,
    appBoxSecondaryBG: '#3f4e5c',
    appBoxSecondaryTextColor: mainTextColor,
    appBoxSecondaryInnerBG: '#53606c',
    appBoxSecondaryInnerTextColor: '#c3c5cb',
    appCurrencyInputBG: '#383f49',
    appCurrencyInputTextColor: mainTextColor,
    appCurrencyInputBGHover: '#383f49',
    appCurrencyInputTextColorHover: mainTextColor,
    appCurrencyInputBGActive: mainColor,
    appCurrencyInputTextColorActive: mainTextColor,
    appCurrencyInputBGActiveHover: mainColorHover,
    appCurrencyInputTextColorActiveHover: mainTextColor,

    //Buttons
    buttonBG: mainColor,
    buttonTextColor: mainTextColor,
    buttonBGHover: mainColorHover,
    buttonTextColorHover: mainTextColor,
    buttonBGActive: mainColorHover,
    buttonTextColorActive: mainTextColor,
    buttonBGActiveHover: mainColorHover,
    buttonTextColorActiveHover: mainTextColor,
    buttonBGDisabled: buttonBG,
    buttonTextColorDisabled: mainTextColor,
    buttonNavigationBG: buttonBG,
    buttonNavigationTextColor: '#c3c5cb',
    buttonNavigationBGHover: modalBG,
    buttonNavigationTextColorHover: '#c3c5cb',
    buttonSelectBG: buttonSecondaryBG,
    buttonSelectTextColor: mainTextColor,
    buttonSelectBGHover: buttonBGHover,
    buttonSelectTextColorHover: mainTextColor,
    buttonSelectBGActive: mainColor,
    buttonSelectTextColorActive: mainTextColor,
    buttonSelectBGActiveHover: mainColor,
    buttonSelectTextColorActiveHover: mainTextColor,
    buttonSecondaryBG: infoBG,
    buttonSecondaryBorder: transparent,
    buttonSecondaryTextColor: infoText,
    buttonSecondaryBGActive: infoBG,
    buttonSecondaryBorderActive: mainColor,
    buttonSecondaryTextColorActive: infoText,
    buttonSecondaryBGHover: 'rgba(55, 107, 173, 0.44)',
    buttonSecondaryBorderHover: mainColor,
    buttonSecondaryTextColorHover: infoText,
    buttonOutlinedBorder: '#2c2f36',
    buttonOutlinedTextColor: mainTextColor,
    buttonOutlinedBorderHover: '#5g656d',
    buttonOutlinedTextColorHover: mainTextColor,

    //Footer
    footerBG: bodyBGColor,
    footerTextColor: mainTextColor,

    //Global
    bodyBG: '#2b3a4a no-repeat 0 10vh url("../images/themes/default/bg.svg")',
    bodyBGTablet: '#2b3a4a no-repeat 0 10vh url("../images/themes/default/bg.svg")',
    bodyBGMobile: '#2b3a4a no-repeat 0 10vh url("../images/themes/default/bg.svg")',
    layerBG: transparent,
    layerBGTablet: transparent,
    layerBGMobile: transparent,
    bodyBGColor: bodyBGColor,
    linkColor: mainColor,
    linkColorHover: mainColor,
    lineColor: '#5F656D',
    logo: '',

    //Header
    headerBG: transparent,
    headerTextColor: mainTextColor,
    headerButtonBG: buttonBG,
    headerButtonBGHover: buttonBGHover,
    headerButtonIconColor: mainTextColor,
    headerModalTextColor: mainTextColor,
    headerModalTextHighlight: mainColor,

    //Modal
    modalBG: modalBG,
    modalBorder: modalBG,
    modalSecondaryBG: '#2c2f36',
    modalLines: buttonBG,
    modalButtonBG: '#2c2f36',
    modalButtonText: mainTextColor,
    modalShadow: 'rgba(0,0,0,.425)',
    modalInputBG: transparent,
    modalInputBorder: buttonBG,
    modalInputBorderFocus: mainColor,
    modalFooterBG: 'rgba(0, 0, 0, 0.1)',

    //Navigation
    navigationBG: appBG,
    navigationTabBG: transparent,
    navigationTabIconColor: mainTextColor,
    navigationTabBGHover: 'rgba(41, 91, 219, .5)',
    navigationTabIconColorHover: mainTextColor,
    navigationTabBGActive: mainColor,
    navigationTabIconColorActive: mainTextColor,
    navigationTabModalBG: modalBG,
    navigationTabModalText: mainTextColor,
    navigationTabModalHover: '#2c2f36',

    //Text
    textHighlight: mainColor,
    textPrimary: mainTextColor,
    textSecondary: '#c3c5cb',
    textTertiary: '#6C7284',
    textDisabled: '#565A69',

    //States
    red1: '#FF6871',
    red2: '#F82D3A',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E'
  }
}
