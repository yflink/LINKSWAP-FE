export function masqTheme() {
  const mainColor = '#bc8004'
  const mainColorHover = '#97661b'
  const mainButtonColor = '#6526c1'
  const mainButtonColorHover = '#4f3a87'
  const appBG = '#0c0812'
  const bodyBGColor = '#120e1b'
  const inputBGColor = '#181323'
  const mainTextColor = '#b2b2b2'
  const mainTextColorHover = '#c2bebc'
  const transparent = 'transparent'
  const buttonBG = '#181323'
  const buttonBGHover = '#6526c1'
  const buttonSecondaryBG = '#260e4e'
  const modalBG = '#191426'
  const infoText = '#0b090f'
  const infoBGHover = '#1b0a38'
  const highLights = '#d68e20'

  return {
    //App
    appBGColor: appBG,
    appInfoBoxBG: mainColor,
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
    buttonTextColorHover: mainTextColorHover,
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
    bodyBG: '#07050a url("../images/themes/masq/background_large.png") center center / cover no-repeat',
    bodyBGTablet: '#07050a url("../images/themes/masq/background_tablet.png") center center / cover no-repeat',
    bodyBGMobile: '#07050a url("../images/themes/masq/background_mobile.png") center center / cover no-repeat',
    layerBG: transparent,
    layerBGTablet: transparent,
    layerBGMobile: transparent,
    bodyBGColor: bodyBGColor,
    linkColor: mainColor,
    linkColorHover: mainColor,
    lineColor: '#5F656D',
    logo:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHIAAAAeCAYAAADw60pcAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAzIDc5LjE2NDUyNywgMjAyMC8xMC8xNS0xNzo0ODozMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjEgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkM3QzE0MEZENDE3QTExRUI5ODdERTcyMDAwMkFGOUYzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM3QzE0MEZFNDE3QTExRUI5ODdERTcyMDAwMkFGOUYzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzdDMTQwRkI0MTdBMTFFQjk4N0RFNzIwMDAyQUY5RjMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzdDMTQwRkM0MTdBMTFFQjk4N0RFNzIwMDAyQUY5RjMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5WQfxDAAALZUlEQVR42uxaC3QU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',

    //Header
    headerBG: transparent,
    headerTextColor: mainColor,
    headerButtonBG: infoText,
    headerButtonBGHover: infoBGHover,
    headerButtonIconColor: mainColor,
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
    textSecondary: 'rgba(178,178,178,0.5)',
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
