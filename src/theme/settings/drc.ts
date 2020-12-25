export function drcTheme() {
  const mainColor = '#683232'
  const mainColorHover = '#3d2d2f'
  const mainButtonColor = '#f74a68'
  const mainButtonColorHover = '#d84762'
  const appBG = '#1a1d24'
  const bodyBGColor = '#07050a'
  const inputBGColor = '#07050a'
  const mainTextColor = '#e0effe'
  const mainTextColorHover = '#FFF'
  const transparent = 'transparent'
  const buttonBG = '#181323'
  const buttonBGHover = '#221b24'
  const buttonSecondaryBG = '#221b24'
  const modalBG = '#0f1418'
  const infoText = '#0b090f'
  const infoBGHover = '#221b24'
  const highLights = '#f74a68'

  return {
    //App
    appBGColor: appBG,
    appInfoBoxBG: mainColor,
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
    footerTextColor: mainButtonColor,

    //Global
    bodyBG: '#07050a',
    bodyBGTablet: '#07050a',
    bodyBGMobile: '#07050a',
    layerBG: transparent,
    layerBGTablet: transparent,
    layerBGMobile: transparent,
    bodyBGColor: bodyBGColor,
    linkColor: mainColor,
    linkColorHover: mainColor,
    lineColor: '#5F656D',
    logo:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAzIDc5LjE2NDUyNywgMjAyMC8xMC8xNS0xNzo0ODozMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjEgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJBNjcxRDVENDYxRTExRUI4QjBEQjM3RTgwNkY0RDhDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJBNjcxRDVFNDYxRTExRUI4QjBEQjM3RTgwNkY0RDhDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkE2NzFENUI0NjFFMTFFQjhCMERCMzdFODA2RjREOEMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkE2NzFENUM0NjFFMTFFQjhCMERCMzdFODA2RjREOEMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz50oH+yAAAI4klEQVR42nxXaXBT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',

    //Header
    headerBG: transparent,
    headerTextColor: mainButtonColor,
    headerButtonBG: infoText,
    headerButtonBGHover: infoBGHover,
    headerButtonIconColor: mainButtonColor,
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
