export function renTheme() {
  const white = '#FFF'
  const black = '#000'
  const grey50 = '#fafafa'
  //const grey100 = '#f5f5f5'
  const grey200 = '#eeeeee'
  const grey300 = '#e0e0e0'
  const grey400 = '#bdbdbd'
  const grey500 = '#9e9e9e'
  const grey600 = '#757575'
  const grey700 = '#616161'
  const grey800 = '#424242'
  const grey900 = '#212121'
  const transparent = 'transparent'

  return {
    //App
    appBGColor: black,
    appInfoBoxBG: grey500,
    appInfoBoxTextColor: white,
    appBoxBG: grey800,
    appBoxBorder: grey800,
    appBoxHoverBG: grey700,
    appBoxHoverBorder: grey700,
    appBoxTextColor: white,
    appBoxSecondaryBG: grey400,
    appBoxSecondaryTextColor: white,
    appBoxSecondaryInnerBG: grey800,
    appBoxSecondaryInnerTextColor: white,
    appCurrencyInputBG: grey900,
    appCurrencyInputTextColor: white,
    appCurrencyInputBGHover: grey800,
    appCurrencyInputTextColorHover: white,
    appCurrencyInputBGActive: grey500,
    appCurrencyInputTextColorActive: white,
    appCurrencyInputBGActiveHover: grey800,
    appCurrencyInputTextColorActiveHover: white,

    //Buttons
    buttonBG: grey50,
    buttonTextColor: black,
    buttonBGHover: grey200,
    buttonTextColorHover: grey800,
    buttonBGActive: grey200,
    buttonTextColorActive: grey800,
    buttonBGActiveHover: grey50,
    buttonTextColorActiveHover: black,
    buttonBGDisabled: grey700,
    buttonTextColorDisabled: grey500,
    buttonNavigationBG: black,
    buttonNavigationTextColor: white,
    buttonNavigationBGHover: grey900,
    buttonNavigationTextColorHover: white,
    buttonSelectBG: grey400,
    buttonSelectTextColor: white,
    buttonSelectBGHover: grey500,
    buttonSelectTextColorHover: white,
    buttonSelectBGActive: grey400,
    buttonSelectTextColorActive: white,
    buttonSelectBGActiveHover: grey400,
    buttonSelectTextColorActiveHover: white,
    buttonSecondaryBG: grey500,
    buttonSecondaryBorder: grey500,
    buttonSecondaryTextColor: white,
    buttonSecondaryBGActive: grey200,
    buttonSecondaryBorderActive: grey400,
    buttonSecondaryTextColorActive: grey800,
    buttonSecondaryBGHover: grey200,
    buttonSecondaryBorderHover: grey400,
    buttonSecondaryTextColorHover: grey800,
    buttonOutlinedBorder: grey50,
    buttonOutlinedTextColor: white,
    buttonOutlinedBorderHover: grey600,
    buttonOutlinedTextColorHover: white,

    //Footer
    footerBG: grey300,
    footerTextColor: black,

    //Global
    bodyBG: '#e0e0e0 no-repeat 10% 60% url("../images/themes/ren/background_large.png")',
    bodyBGTablet: '#e0e0e0 no-repeat 5% 60% url("../images/themes/ren/background_tablet.png")',
    bodyBGMobile: grey300,
    layerBG: transparent,
    layerBGTablet: transparent,
    layerBGMobile: transparent,
    bodyBGColor: grey300,
    linkColor: grey50,
    linkColorHover: grey50,
    lineColor: '#5F656D',
    logo:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAAAeCAYAAADAZ1t9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA1IDc5LjE2NDU5MCwgMjAyMC8xMi8wOS0xMTo1Nzo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjEgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjkwQkU2RUFDNjE0NTExRUJBQjU3RTg3OUQxOTc0NEJBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjkwQkU2RUFENjE0NTExRUJBQjU3RTg3OUQxOTc0NEJBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTBCRTZFQUE2MTQ1MTFFQkFCNTdFODc5RDE5NzQ0QkEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTBCRTZFQUI2MTQ1MTFFQkFCNTdFODc5RDE5NzQ0QkEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz63Zf5UAAAJQElEQVR42uyaeZRW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',

    //Header
    headerBG: transparent,
    headerTextColor: black,
    headerButtonBG: black,
    headerButtonBGHover: grey900,
    headerButtonIconColor: white,
    headerModalTextColor: white,
    headerModalTextHighlight: grey50,

    //Modal
    modalBG: grey900,
    modalBorder: black,
    modalSecondaryBG: grey600,
    modalLines: black,
    modalButtonBG: black,
    modalButtonText: white,
    modalShadow: 'rgba(0, 0, 0, 0.4)',
    modalInputBG: transparent,
    modalInputBorder: black,
    modalInputBorderFocus: grey600,
    modalFooterBG: 'rgba(0, 0, 0, 0.4)',

    //Navigation
    navigationBG: black,
    navigationTabBG: transparent,
    navigationTabIconColor: white,
    navigationTabBGHover: grey900,
    navigationTabIconColorHover: white,
    navigationTabBGActive: grey800,
    navigationTabIconColorActive: white,
    navigationTabModalBG: grey900,
    navigationTabModalText: white,
    navigationTabModalHover: grey50,

    //Text
    textHighlight: grey400,
    textPrimary: white,
    textSecondary: white,
    textTertiary: grey200,
    textDisabled: grey300,

    //States
    red1: '#FF6871',
    red2: '#F82D3A',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E'
  }
}
