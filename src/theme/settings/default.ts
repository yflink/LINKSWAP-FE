export function defaultTheme() {
  const mainColor = '#295BDB'
  const mainColorHover = '#2251c9'
  const mainBG = '#2b3a4a'
  const appBG = '#232a35'
  const white = '#FFF'
  const transparent = 'transparent'
  const buttonBG = '#40444f'
  const buttonBGHover = '#60656d'
  const buttonSecondaryBG = '#212328'
  const modalBG = '#222a35'

  return {
    //App
    appBG: '#2b3a4a no-repeat 0 10vh url("../images/themes/default/bg.svg")',
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
    appCurrencyInputBGActive: mainColor,
    appCurrencyInputTextColorActive: white,

    //Buttons
    buttonBG: mainColor,
    buttonTextColor: white,
    buttonBGHover: mainColorHover,
    buttonTextColorHover: white,
    buttonBGActive: mainColor,
    buttonTextColorActive: white,
    buttonBGActiveHover: mainColor,
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
    buttonSelectBGActive: mainColor,
    buttonSelectTextColorActive: white,
    buttonSelectBGActiveHover: mainColor,
    buttonSelectTextColorActiveHover: white,
    buttonSecondaryBG: '#202f46',
    buttonSecondaryBorder: transparent,
    buttonSecondaryTextColor: '#87a9ff',
    buttonSecondaryBGActive: '#202f46',
    buttonSecondaryBorderActive: mainColor,
    buttonSecondaryTextColorActive: '#87a9ff',
    buttonSecondaryBGHover: '#1b283c',
    buttonSecondaryBorderHover: mainColor,
    buttonSecondaryTextColorHover: '#87a9ff',
    buttonOutlinedBorder: '#2c2f36',
    buttonOutlinedTextColor: white,
    buttonOutlinedBorderHover: '#5g656d',
    buttonOutlinedTextColorHover: white,

    //Footer
    footerBG: mainBG,
    footerTextColor: white,

    //Global
    bodyBG: mainBG,
    linkColor: mainColor,
    linkColorHover: mainColor,

    //Header
    headerBG: transparent,
    headerTextColor: white,
    headerButtonBG: buttonBG,
    headerButtonBGHover: buttonBGHover,
    headerButtonIconColor: white,

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
    navigationTabBGActive: mainColor,
    navigationTabIconColorActive: white,
    navigationTabModalBG: modalBG,
    navigationTabModalText: white,
    navigationTabModalHover: '#2c2f36',

    //Text
    textHighlight: mainColor,
    textPrimary: white,
    textSecondary: '#c3c5cb',
    textTertiary: '#6C7284',
    textDisabled: '565A69',

    //States
    red1: '#FF6871',
    red2: '#F82D3A',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E'
  }
}
