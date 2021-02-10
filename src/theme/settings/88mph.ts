export function mphTheme() {
  const mainColor = '#4932eb'
  const mainColorHover = '#3e377e'
  const mainButtonColor = '#131415'
  const mainButtonColorHover = '#190d32'
  const appBG = '#4932eb'
  const bodyBGColor = '#080817'
  const inputBGColor = '#282828'
  const mainTextColor = '#f9f8fa'
  const mainTextColorHover = '#FFF'
  const transparent = 'transparent'
  const buttonBG = '#212039'
  const buttonBGHover = '#323357'
  const buttonSecondaryBG = '#2a244f'
  const modalBG = '#2a244f'
  const infoText = '#fff'
  const highLights = '#080817'
  const disabledBG = '#747474'

  return {
    //App
    appBGColor: 'linear-gradient(0deg, rgba(237,35,147,1) 0%, rgba(73,50,235,1) 100%)',
    appInfoBoxBG: buttonBGHover,
    appInfoBoxTextColor: infoText,
    appBoxBG: inputBGColor,
    appBoxBorder: '#373f49',
    appBoxHoverBG: '#373f49',
    appBoxHoverBorder: '#5e6373',
    appBoxTextColor: mainTextColor,
    appBoxSecondaryBG: buttonSecondaryBG,
    appBoxSecondaryTextColor: mainTextColor,
    appBoxSecondaryInnerBG: inputBGColor,
    appBoxSecondaryInnerTextColor: mainTextColor,
    appCurrencyInputBG: inputBGColor,
    appCurrencyInputTextColor: mainTextColor,
    appCurrencyInputBGHover: buttonBGHover,
    appCurrencyInputTextColorHover: mainTextColor,
    appCurrencyInputBGActive: mainButtonColor,
    appCurrencyInputTextColorActive: mainTextColor,
    appCurrencyInputBGActiveHover: mainButtonColorHover,
    appCurrencyInputTextColorActiveHover: mainTextColor,

    //Buttons
    buttonBG: mainButtonColor,
    buttonTextColor: mainTextColor,
    buttonBGHover: mainColorHover,
    buttonTextColorHover: mainTextColorHover,
    buttonBGActive: mainColor,
    buttonTextColorActive: mainTextColor,
    buttonBGActiveHover: mainColor,
    buttonTextColorActiveHover: mainTextColor,
    buttonBGDisabled: disabledBG,
    buttonTextColorDisabled: mainTextColor,
    buttonNavigationBG: buttonBG,
    buttonNavigationTextColor: inputBGColor,
    buttonNavigationBGHover: modalBG,
    buttonNavigationTextColorHover: mainButtonColor,
    buttonSelectBG: buttonSecondaryBG,
    buttonSelectTextColor: mainTextColor,
    buttonSelectBGHover: buttonBGHover,
    buttonSelectTextColorHover: mainTextColor,
    buttonSelectBGActive: mainColor,
    buttonSelectTextColorActive: mainTextColor,
    buttonSelectBGActiveHover: mainColor,
    buttonSelectTextColorActiveHover: mainTextColor,
    buttonSecondaryBG: mainColor,
    buttonSecondaryBorder: transparent,
    buttonSecondaryTextColor: infoText,
    buttonSecondaryBGActive: mainColor,
    buttonSecondaryBorderActive: mainColor,
    buttonSecondaryTextColorActive: infoText,
    buttonSecondaryBGHover: mainColorHover,
    buttonSecondaryBorderHover: mainColorHover,
    buttonSecondaryTextColorHover: infoText,
    buttonOutlinedBorder: mainColor,
    buttonOutlinedTextColor: mainTextColor,
    buttonOutlinedBorderHover: mainColorHover,
    buttonOutlinedTextColorHover: mainTextColor,

    //Footer
    footerBG: bodyBGColor,
    footerTextColor: mainTextColor,

    //Global
    bodyBG: '#4932eb url("../images/themes/88mph/background_large.jpg") center center / cover no-repeat',
    bodyBGTablet: '#4932eb url("../images/themes/88mph/background_tablet.png") center center / cover no-repeat',
    bodyBGMobile: '#4932eb url("../images/themes/88mph/background_mobile.png") center center / cover no-repeat',
    layerBG: transparent,
    layerBGTablet: transparent,
    layerBGMobile: transparent,
    bodyBGColor: bodyBGColor,
    linkColor: mainColor,
    linkColorHover: mainColor,
    lineColor: mainColor,
    logo: '',

    //Header
    headerBG: transparent,
    headerTextColor: mainTextColor,
    headerButtonBG: inputBGColor,
    headerButtonBGHover: appBG,
    headerButtonIconColor: mainTextColor,
    headerModalTextColor: mainTextColor,
    headerModalTextHighlight: mainColor,

    //Modal
    modalBG: inputBGColor,
    modalBorder: modalBG,
    modalSecondaryBG: modalBG,
    modalLines: mainTextColor,
    modalButtonBG: mainButtonColor,
    modalButtonText: mainTextColor,
    modalShadow: 'rgba(0,0,0,.425)',
    modalInputBG: transparent,
    modalInputBorder: appBG,
    modalInputBorderFocus: appBG,
    modalFooterBG: 'rgba(0, 0, 0, 0.4)',

    //Navigation
    navigationBG: appBG,
    navigationTabBG: transparent,
    navigationTabIconColor: mainTextColor,
    navigationTabBGHover: mainColorHover,
    navigationTabIconColorHover: mainTextColor,
    navigationTabBGActive: mainButtonColor,
    navigationTabIconColorActive: mainTextColor,
    navigationTabModalBG: modalBG,
    navigationTabModalText: mainTextColor,
    navigationTabModalHover: mainColor,

    //Text
    textHighlight: highLights,
    textPrimary: mainTextColor,
    textSecondary: mainTextColor,
    textTertiary: '#e8e3de',
    textDisabled: '#747474',

    //States
    red1: '#FF6871',
    red2: '#F82D3A',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E'
  }
}
