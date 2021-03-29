export function cyberFiTheme() {
  const mainColor = '#f5e933'
  const mainColorHover = '#00f0ff'
  const secondaryColor = '#ff284c'
  const appBG = '#000'
  const bodyBGColor = '#f5e933'
  const mainTextColor = '#FFF'
  const transparent = 'transparent'
  const buttonBG = '#390f25'
  const buttonBGHover = '#1a0c19'
  const buttonSecondaryBG = '#071e16'
  const modalBG = '#390f25'
  const infoText = '#d81d62'
  const infoBG = '#390f25'

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
    appBoxSecondaryBG: buttonSecondaryBG,
    appBoxSecondaryTextColor: mainTextColor,
    appBoxSecondaryInnerBG: '#383f49',
    appBoxSecondaryInnerTextColor: mainTextColor,
    appCurrencyInputBG: '#383f49',
    appCurrencyInputTextColor: mainTextColor,
    appCurrencyInputBGHover: '#383f49',
    appCurrencyInputTextColorHover: mainTextColor,
    appCurrencyInputBGActive: secondaryColor,
    appCurrencyInputTextColorActive: mainTextColor,
    appCurrencyInputBGActiveHover: mainColorHover,
    appCurrencyInputTextColorActiveHover: mainTextColor,

    //Buttons
    buttonBG: secondaryColor,
    buttonTextColor: mainTextColor,
    buttonBGHover: mainColorHover,
    buttonTextColorHover: mainTextColor,
    buttonBGActive: secondaryColor,
    buttonTextColorActive: mainTextColor,
    buttonBGActiveHover: secondaryColor,
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
    buttonSelectBGActive: secondaryColor,
    buttonSelectTextColorActive: mainTextColor,
    buttonSelectBGActiveHover: secondaryColor,
    buttonSelectTextColorActiveHover: mainTextColor,
    buttonSecondaryBG: infoBG,
    buttonSecondaryBorder: transparent,
    buttonSecondaryTextColor: infoText,
    buttonSecondaryBGActive: infoBG,
    buttonSecondaryBorderActive: secondaryColor,
    buttonSecondaryTextColorActive: infoText,
    buttonSecondaryBGHover: '#1b283c',
    buttonSecondaryBorderHover: secondaryColor,
    buttonSecondaryTextColorHover: infoText,
    buttonOutlinedBorder: '#2c2f36',
    buttonOutlinedTextColor: mainTextColor,
    buttonOutlinedBorderHover: '#5g656d',
    buttonOutlinedTextColorHover: mainTextColor,

    //Footer
    footerBG: appBG,
    footerTextColor: mainTextColor,

    //Global
    bodyBG: '#f5e933 url("../images/themes/cyberfi/background_large.jpg") center center / cover no-repeat',
    bodyBGTablet: '#f5e933 url("../images/themes/cyberfi/background_tablet.jpg") center center / cover no-repeat',
    bodyBGMobile: '#f5e933 url("../images/themes/cyberfi/background_mobile.jpg") center center / cover no-repeat',
    layerBG: 'transparent url("../images/themes/cyberfi/background-layer_large.png") top right / cover no-repeat',
    layerBGTablet:
      'transparent url("../images/themes/cyberfi/background-layer_tablet.png") top right / cover no-repeat',
    layerBGMobile:
      'transparent url("../images/themes/cyberfi/background-layer_mobile.png") top right / cover no-repeat',
    bodyBGColor: bodyBGColor,
    borderRadius: '2px',
    linkColor: mainColor,
    linkColorHover: mainColor,
    lineColor: '#5F656D',
    logo:
      'data:image/png;base64,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',

    //Header
    headerBG: transparent,
    headerTextColor: '#000',
    headerButtonBG: buttonBG,
    headerButtonBGHover: buttonBGHover,
    headerButtonIconColor: mainColor,
    headerModalTextColor: mainTextColor,
    headerModalTextHighlight: secondaryColor,

    //Modal
    modalBG: modalBG,
    modalBorder: modalBG,
    modalSecondaryBG: buttonBGHover,
    modalLines: buttonBGHover,
    modalButtonBG: buttonBGHover,
    modalButtonText: mainTextColor,
    modalShadow: 'rgba(0,0,0,.425)',
    modalInputBG: transparent,
    modalInputBorder: buttonBGHover,
    modalInputBorderFocus: secondaryColor,
    modalFooterBG: 'rgba(0, 0, 0, 0.8)',

    //Navigation
    navigationBG: appBG,
    navigationTabBG: transparent,
    navigationTabIconColor: mainTextColor,
    navigationTabBGHover: transparent,
    navigationTabIconColorHover: mainTextColor,
    navigationTabBGActive: secondaryColor,
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
