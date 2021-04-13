export function masqTheme() {
  const mainColor = '#00B2FF'
  const mainColorHover = '#00A3FF'
  const mainButtonColor = '#00B2FF'
  const mainButtonColorHover = '#00A3FF'
  const appBG = '#00334D'
  const bodyBGColor = '#000b11'
  const inputBGColor = '#000b11'
  const mainTextColor = '#FAFAFA'
  const mainTextColorHover = '#c2bebc'
  const transparent = 'transparent'
  const buttonBG = '#00B2FF'
  const buttonBGHover = '#00A3FF'
  const buttonSecondaryBG = mainColorHover
  const modalBG = bodyBGColor
  const infoText = mainButtonColor
  const infoBGHover = '#8fb8ca'
  const highLights = '#00E0FF'

  return {
    //App
    appBGColor: appBG,
    appInfoBoxBG: buttonSecondaryBG,
    appInfoBoxTextColor: mainTextColor,
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
    appCurrencyInputBGHover: inputBGColor,
    appCurrencyInputTextColorHover: mainTextColor,
    appCurrencyInputBGActive: mainButtonColor,
    appCurrencyInputTextColorActive: mainTextColor,
    appCurrencyInputBGActiveHover: mainButtonColorHover,
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
    buttonSecondaryBG: appBG,
    buttonSecondaryBorder: mainColor,
    buttonSecondaryTextColor: mainColor,
    buttonSecondaryBGActive: appBG,
    buttonSecondaryBorderActive: appBG,
    buttonSecondaryTextColorActive: mainColor,
    buttonSecondaryBGHover: appBG,
    buttonSecondaryBorderHover: mainColorHover,
    buttonSecondaryTextColorHover: mainColorHover,
    buttonOutlinedBorder: mainColor,
    buttonOutlinedTextColor: mainTextColor,
    buttonOutlinedBorderHover: mainColorHover,
    buttonOutlinedTextColorHover: mainTextColor,

    //Footer
    footerBG: bodyBGColor,
    footerTextColor: mainTextColor,

    //Global
    bodyBG: '#07050a url("../images/themes/masq/background_large.png") center center / cover no-repeat',
    bodyBGTablet: '#07050a url("../images/themes/masq/background_tablet.png") center center / cover no-repeat',
    bodyBGMobile: '#07050a url("../images/themes/masq/background_mobile.png") center center / cover no-repeat',
    layerBG: transparent,
    layerBGTablet: transparent,
    layerBGMobile: transparent,
    bodyBGColor: bodyBGColor,
    borderRadius: '6px',
    linkColor: mainColor,
    linkColorHover: mainColor,
    lineColor: '#5F656D',
    logo:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAAAeCAYAAADXRcu0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA2IDc5LjE2NDc1MywgMjAyMS8wMi8xNS0xMTo1MjoxMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjMgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE2MjdERTRDOUMzODExRUI5NDEyOUI2MjlBODAxOTU3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE2MjdERTREOUMzODExRUI5NDEyOUI2MjlBODAxOTU3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTYyN0RFNEE5QzM4MTFFQjk0MTI5QjYyOUE4MDE5NTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTYyN0RFNEI5QzM4MTFFQjk0MTI5QjYyOUE4MDE5NTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5qMLN/AAANuUlEQVR42uxaZ1RU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',

    //Header
    headerBG: transparent,
    headerTextColor: mainColor,
    headerButtonBG: infoText,
    headerButtonBGHover: infoBGHover,
    headerButtonIconColor: mainTextColor,
    headerModalTextColor: mainTextColor,
    headerModalTextHighlight: mainColor,

    //Modal
    modalBG: modalBG,
    modalBorder: appBG,
    modalSecondaryBG: appBG,
    modalLines: mainButtonColor,
    modalButtonBG: mainButtonColor,
    modalButtonText: mainTextColor,
    modalShadow: 'rgba(0,0,0,.425)',
    modalInputBG: transparent,
    modalInputBorder: mainButtonColor,
    modalInputBorderFocus: mainButtonColorHover,
    modalFooterBG: 'rgba(0, 0, 0, 0.2)',

    //Navigation
    navigationBG: appBG,
    navigationTabBG: transparent,
    navigationTabIconColor: mainTextColor,
    navigationTabBGHover: transparent,
    navigationTabIconColorHover: mainTextColor,
    navigationTabBGActive: mainButtonColor,
    navigationTabIconColorActive: mainTextColor,
    navigationTabModalBG: modalBG,
    navigationTabModalText: mainTextColor,
    navigationTabModalHover: mainColor,

    //Text
    textHighlight: highLights,
    textPrimary: mainTextColor,
    textSecondary: '#8fb8ca',
    textTertiary: '#bfbfbf',
    textDisabled: '#565A69',

    //States
    red1: '#FF6871',
    red2: '#F82D3A',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E'
  }
}
