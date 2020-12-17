export function cyberFiTheme() {
  const mainColor = '#f5e933'
  const mainColorHover = '#00f0ff'
  const secondaryColor = '#ff284c'
  const appBG = '#000'
  const bodyBGColor = '#f5e933'
  const white = '#FFF'
  const transparent = 'transparent'
  const buttonBG = '#40444f'
  const buttonBGHover = '#60656d'
  const buttonSecondaryBG = '#212328'
  const modalBG = '#222a35'

  return {
    //App
    appBGColor: appBG,
    appInfoBoxBG: '#202f46',
    appInfoBoxTextColor: '#87a9ff',
    appBoxBG: '#373f49',
    appBoxBorder: '#373f49',
    appBoxHoverBG: '#373f49',
    appBoxHoverBorder: '#5e6373',
    appBoxTextColor: white,
    appBoxSecondaryBG: '#3f4e5c',
    appBoxSecondaryTextColor: white,
    appBoxSecondaryInnerBG: '#53606c',
    appBoxSecondaryInnerTextColor: '#c3c5cb',
    appCurrencyInputBG: '#383f49',
    appCurrencyInputTextColor: white,
    appCurrencyInputBGHover: '#383f49',
    appCurrencyInputTextColorHover: white,
    appCurrencyInputBGActive: secondaryColor,
    appCurrencyInputTextColorActive: white,
    appCurrencyInputBGActiveHover: mainColorHover,
    appCurrencyInputTextColorActiveHover: white,

    //Buttons
    buttonBG: secondaryColor,
    buttonTextColor: white,
    buttonBGHover: mainColorHover,
    buttonTextColorHover: white,
    buttonBGActive: secondaryColor,
    buttonTextColorActive: white,
    buttonBGActiveHover: secondaryColor,
    buttonTextColorActiveHover: white,
    buttonBGDisabled: buttonBG,
    buttonTextColorDisabled: white,
    buttonNavigationBG: buttonBG,
    buttonNavigationTextColor: '#c3c5cb',
    buttonNavigationBGHover: modalBG,
    buttonNavigationTextColorHover: '#c3c5cb',
    buttonSelectBG: buttonSecondaryBG,
    buttonSelectTextColor: white,
    buttonSelectBGHover: buttonBGHover,
    buttonSelectTextColorHover: white,
    buttonSelectBGActive: secondaryColor,
    buttonSelectTextColorActive: white,
    buttonSelectBGActiveHover: secondaryColor,
    buttonSelectTextColorActiveHover: white,
    buttonSecondaryBG: '#202f46',
    buttonSecondaryBorder: transparent,
    buttonSecondaryTextColor: '#87a9ff',
    buttonSecondaryBGActive: '#202f46',
    buttonSecondaryBorderActive: secondaryColor,
    buttonSecondaryTextColorActive: '#87a9ff',
    buttonSecondaryBGHover: '#1b283c',
    buttonSecondaryBorderHover: secondaryColor,
    buttonSecondaryTextColorHover: '#87a9ff',
    buttonOutlinedBorder: '#2c2f36',
    buttonOutlinedTextColor: white,
    buttonOutlinedBorderHover: '#5g656d',
    buttonOutlinedTextColorHover: white,

    //Footer
    footerBG: appBG,
    footerTextColor: white,

    //Global
    bodyBG: '#f5e933 url("../images/themes/cyberfi/bg.png") top left / cover no-repeat',
    bodyBGColor: bodyBGColor,
    linkColor: mainColor,
    linkColorHover: mainColor,
    lineColor: '#5F656D',

    //Header
    headerBG: transparent,
    headerTextColor: '#000',
    headerButtonBG: buttonBG,
    headerButtonBGHover: buttonBGHover,
    headerButtonIconColor: mainColor,
    headerModalTextColor: white,
    headerModalTextHighlight: secondaryColor,

    //Modal
    modalBG: modalBG,
    modalBorder: modalBG,
    modalSecondaryBG: '#2c2f36',
    modalLines: buttonBG,
    modalButtonBG: '#2c2f36',
    modalButtonText: white,
    modalShadow: 'ba(0,0,0,.425)',
    modalInputBG: transparent,
    modalInputBorder: buttonBG,
    modalInputBorderFocus: mainColor,
    modalFooterBG: 'ba(0,0,0,0.1)',

    //Navigation
    navigationBG: appBG,
    navigationTabBG: transparent,
    navigationTabIconColor: white,
    navigationTabBGHover: transparent,
    navigationTabIconColorHover: white,
    navigationTabBGActive: secondaryColor,
    navigationTabIconColorActive: white,
    navigationTabModalBG: modalBG,
    navigationTabModalText: white,
    navigationTabModalHover: '#2c2f36',

    //Text
    textHighlight: mainColor,
    textPrimary: white,
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
