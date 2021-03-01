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
  const highLights = '#f7bf2c'
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
    buttonSecondaryBorder: modalBG,
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
    layerBG: 'transparent no-repeat 2% 80% url("../images/themes/88mph/88mph_logo.png")',
    layerBGTablet: 'transparent no-repeat 2% 80% url("../images/themes/88mph/88mph_logo_tablet.png")',
    layerBGMobile: transparent,
    bodyBGColor: bodyBGColor,
    linkColor: mainColor,
    linkColorHover: mainColor,
    lineColor: mainColor,
    logo:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAeCAYAAACmPacqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA2IDc5LjE2NDY0OCwgMjAyMS8wMS8xMi0xNTo1MjoyOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjIgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjI1QTYwQkQwNkM0RTExRUJBRDc5OUFENDA4NTg2NzEyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjI1QTYwQkQxNkM0RTExRUJBRDc5OUFENDA4NTg2NzEyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjVBNjBCQ0U2QzRFMTFFQkFENzk5QUQ0MDg1ODY3MTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjVBNjBCQ0Y2QzRFMTFFQkFENzk5QUQ0MDg1ODY3MTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4VzG5sAAAH+0lEQVR42sRXfVBU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',

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
