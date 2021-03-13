export function dogeTheme() {
  const mainColor = '#45339d'
  const mainColorHover = '#3e377e'
  const mainButtonColor = '#281f4f'
  const mainButtonColorHover = '#190d32'
  const appBG = '#22212d'
  const bodyBGColor = '#080817'
  const inputBGColor = '#3a3367'
  const mainTextColor = '#f9f8fa'
  const mainTextColorHover = '#FFF'
  const transparent = 'transparent'
  const buttonBG = '#212039'
  const buttonBGHover = '#323357'
  const buttonSecondaryBG = '#2a244f'
  const modalBG = '#2a244f'
  const infoText = '#fff'
  const highLights = '#e5cb7a'
  const disabledBG = '#2f2f39'

  return {
    //App
    appBGColor: appBG,
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
    buttonBG: mainColor,
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
    bodyBG: '#080817 url("../images/themes/doge/background_large.png") center center / cover no-repeat',
    bodyBGTablet: '#080817 url("../images/themes/doge/background_tablet.png") center center / cover no-repeat',
    bodyBGMobile: '#080817 url("../images/themes/doge/background_mobile.png") center center / cover no-repeat',
    layerBG: 'transparent url("../images/themes/doge/doge_large.png") left bottom / auto 45vw no-repeat',
    layerBGTablet: 'transparent url("../images/themes/doge/doge.png") left bottom / auto 500px  no-repeat',
    layerBGMobile: transparent,
    bodyBGColor: bodyBGColor,
    borderRadius: '6px',
    linkColor: mainColor,
    linkColorHover: mainColor,
    lineColor: mainColor,
    logo: '',

    //Header
    headerBG: transparent,
    headerTextColor: highLights,
    headerButtonBG: appBG,
    headerButtonBGHover: inputBGColor,
    headerButtonIconColor: highLights,
    headerModalTextColor: mainTextColor,
    headerModalTextHighlight: mainColor,

    //Modal
    modalBG: appBG,
    modalBorder: modalBG,
    modalSecondaryBG: modalBG,
    modalLines: highLights,
    modalButtonBG: mainButtonColor,
    modalButtonText: mainTextColor,
    modalShadow: 'rgba(0,0,0,.425)',
    modalInputBG: transparent,
    modalInputBorder: highLights,
    modalInputBorderFocus: highLights,
    modalFooterBG: appBG,

    //Navigation
    navigationBG: appBG,
    navigationTabBG: transparent,
    navigationTabIconColor: highLights,
    navigationTabBGHover: buttonBG,
    navigationTabIconColorHover: mainTextColor,
    navigationTabBGActive: inputBGColor,
    navigationTabIconColorActive: mainTextColor,
    navigationTabModalBG: modalBG,
    navigationTabModalText: mainTextColor,
    navigationTabModalHover: mainColor,

    //Text
    textHighlight: highLights,
    textPrimary: mainTextColor,
    textSecondary: highLights,
    textTertiary: '#e8e3de',
    textDisabled: '#AAA',

    //States
    red1: '#FF6871',
    red2: '#F82D3A',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E'
  }
}
