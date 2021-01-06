export function dokiDokiTheme() {
  const mainColor = '#f993c2'
  const mainColorHover = '#ff54a3'
  const mainButtonColor = '#ec66ec'
  const mainButtonColorHover = '#ec45ec'
  const appBG = '#604c8b'
  const bodyBGColor = '#f1f3e3'
  const inputBGColor = '#3a3367'
  const mainTextColor = '#f9f8fa'
  const mainTextColorHover = '#FFF'
  const transparent = 'transparent'
  const buttonBG = '#4becf3'
  const buttonBGHover = '#6526c1'
  const buttonSecondaryBG = '#2a244f'
  const modalBG = '#2a244f'
  const infoText = '#fff'
  const highLights = '#f993c2'

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
    buttonTextColorDisabled: inputBGColor,
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
    footerBG: appBG,
    footerTextColor: mainTextColor,

    //Global
    bodyBG: '#c0aff5 url("../images/themes/dokidoki/background_large.png") center center / cover no-repeat',
    bodyBGTablet: '#c0aff5 url("../images/themes/dokidoki/background_tablet.png") center center / cover no-repeat',
    bodyBGMobile: '#c0aff5 url("../images/themes/dokidoki/background_mobile.png") center center / cover no-repeat',
    layerBG: 'transparent url("../images/themes/dokidoki/background_large.gif") center center / cover no-repeat',
    layerBGTablet: 'transparent url("../images/themes/dokidoki/background_large.gif") center center / cover no-repeat',
    layerBGMobile: transparent,
    bodyBGColor: bodyBGColor,
    linkColor: mainColor,
    linkColorHover: mainColor,
    lineColor: mainColor,
    logo:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZUAAABCCAYAAACfF0sYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAzIDc5LjE2NDUyNywgMjAyMC8xMC8xNS0xNzo0ODozMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjVDRTQwMjg0REQ0MTFFQkIwQjZGODc5RUNCRkQ4OTQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjVDRTQwMjc0REQ0MTFFQkIwQjZGODc5RUNCRkQ4OTQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjEgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzNCOUNDQzU0N0M1MTFFQjk3N0JBQTFBNjM4NTVGREYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzNCOUNDQzY0N0M1MTFFQjk3N0JBQTFBNjM4NTVGREYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4C0YgbAAAhjklEQVR42uxdB5xU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',

    //Header
    headerBG: transparent,
    headerTextColor: inputBGColor,
    headerButtonBG: appBG,
    headerButtonBGHover: inputBGColor,
    headerButtonIconColor: highLights,
    headerModalTextColor: mainTextColor,
    headerModalTextHighlight: mainColor,

    //Modal
    modalBG: modalBG,
    modalBorder: mainButtonColorHover,
    modalSecondaryBG: appBG,
    modalLines: mainButtonColor,
    modalButtonBG: mainButtonColor,
    modalButtonText: mainTextColor,
    modalShadow: 'rgba(0,0,0,.425)',
    modalInputBG: transparent,
    modalInputBorder: mainButtonColor,
    modalInputBorderFocus: mainButtonColorHover,
    modalFooterBG: appBG,

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
    textSecondary: bodyBGColor,
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
