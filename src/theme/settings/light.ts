export function lightTheme() {
  const mainColor = '#295BDB'
  const mainColorHover = '#354776'
  const appBG = '#333'
  const bodyBGColor = '#f7f7f7'
  const mainTextColor = '#FFF'
  const transparent = 'transparent'
  const buttonBG = '#666'
  const buttonBGHover = '#60656d'
  const buttonSecondaryBG = '#AAA'
  const modalBG = '#2a3759'
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
    buttonBGActive: mainColor,
    buttonTextColorActive: mainTextColor,
    buttonBGActiveHover: mainColor,
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
    footerBG: modalBG,
    footerTextColor: mainTextColor,

    //Global
    bodyBG: '#f7f7f7 no-repeat 0 5vh url("../images/themes/light/background_large.png")',
    bodyBGTablet: '#f7f7f7 no-repeat 0 10vh url("../images/themes/light/background_tablet.png")',
    bodyBGMobile: '#f7f7f7',
    layerBG: transparent,
    layerBGTablet: transparent,
    layerBGMobile: transparent,
    bodyBGColor: bodyBGColor,
    borderRadius: '6px',
    linkColor: mainColor,
    linkColorHover: mainColor,
    lineColor: buttonBG,
    logo: '',

    //Header
    headerBG: transparent,
    headerTextColor: '#000',
    headerButtonBG: buttonBG,
    headerButtonBGHover: mainColor,
    headerButtonIconColor: mainTextColor,
    headerModalTextColor: mainTextColor,
    headerModalTextHighlight: infoText,

    //Modal
    modalBG: modalBG,
    modalBorder: mainColor,
    modalSecondaryBG: mainColorHover,
    modalLines: buttonBG,
    modalButtonBG: modalBG,
    modalButtonText: mainTextColor,
    modalShadow: 'rgba(0,0,0,.425)',
    modalInputBG: transparent,
    modalInputBorder: mainColor,
    modalInputBorderFocus: mainColor,
    modalFooterBG: 'rgba(0, 0, 0, 0.8)',

    //Navigation
    navigationBG: appBG,
    navigationTabBG: transparent,
    navigationTabIconColor: mainTextColor,
    navigationTabBGHover: transparent,
    navigationTabIconColorHover: mainTextColor,
    navigationTabBGActive: mainColor,
    navigationTabIconColorActive: mainTextColor,
    navigationTabModalBG: modalBG,
    navigationTabModalText: mainTextColor,
    navigationTabModalHover: '#2c2f36',

    //Text
    textHighlight: infoText,
    textPrimary: mainTextColor,
    textSecondary: '#EEE',
    textTertiary: '#CCC',
    textDisabled: buttonBG,

    //States
    red1: '#FF6871',
    red2: '#F82D3A',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E'
  }
}
