export function cyberFiTheme() {
  const mainBlue = '#f5e933'
  const mainBlueHover = '#00f0ff'
  const mainBG = '#f5e933'
  const appBG = '#f5e933'
  const white = '#FFF'
  const transparent = 'transparent'
  const buttonBG = '#40444f'
  const buttonBGHover = '#60656d'
  const buttonSecondaryBG = '#212328'
  const modalBG = '#222a35'

  return {
    //App
    appBG: '#f5e933 url("../images/themes/cyberfi/bg.png") top left / cover no-repeat',
    appInfoBoxBG: '#202f46',
    appInfoBoxTextColor: '#87a9ff',
    appBoxBG: '#373f49',
    appBoxBorder: '#373f49',
    appBoxHoverBG: '#373f49',
    appBoxHoverBorder: '#5e6373',
    appBoxTextColor: white,
    appBoxSecondaryBG: '#3f4e5c',
    appBoxSecondaryTextColor: white,
    appBoxSecondaryInnerBG: '#53606c',
    appBoxSecondaryInnerTextColor: '#c3c5cb',

    //Buttons
    buttonBG: transparent,
    buttonTextColor: white,
    buttonBGHover: mainBlueHover,
    buttonTextColorHover: white,
    buttonBGActive: mainBlue,
    buttonTextColorActive: white,
    buttonBGActiveHover: mainBlue,
    buttonTextColorActiveHover: white,
    buttonBGDisabled: buttonBG,
    buttonTextColorDisabled: white,
    buttonNavigationBG: buttonBG,
    buttonNavigationTextColor: '#c3c5cb',
    buttonNavigationBGHover: '#212328',
    buttonNavigationTextColorHover: '#c3c5cb',
    buttonSelectBG: buttonSecondaryBG,
    buttonSelectTextColor: white,
    buttonSelectBGHover: buttonBGHover,
    buttonSelectTextColorHover: white,
    buttonSelectBGActive: mainBlue,
    buttonSelectTextColorActive: white,
    buttonSelectBGActiveHover: mainBlue,
    buttonSelectTextColorActiveHover: white,
    buttonSecondaryBG: '#202f46',
    buttonSecondaryBorder: transparent,
    buttonSecondaryTextColor: '#87a9ff',
    buttonSecondaryBGActive: '#202f46',
    buttonSecondaryBorderActive: mainBlue,
    buttonSecondaryTextColorActive: '#87a9ff',
    buttonSecondaryBGHover: '#1b283c',
    buttonSecondaryBorderHover: mainBlue,
    buttonSecondaryTextColorHover: '#87a9ff',

    //Footer
    footerBG: mainBG,
    footerTextColor: white,

    //Global
    bodyBG: mainBG,
    linkColor: mainBlue,
    linkColorHover: mainBlue,

    //Header
    headerBG: transparent,
    headerTextColor: white,
    headerButtonBG: buttonBG,
    headerButtonBGHover: buttonBGHover,
    headerButtonIconColor: white,

    //Modal
    modalBG: modalBG,
    modalBorder: modalBG,
    modalSecondaryBG: '#2c2f36',
    modalLines: buttonBG,
    modalButtonBG: '#2c2f36',
    modalButtonText: white,
    modalShadow: 'ba(0,0,0,.425)',
    modalInputBG: transparent,
    modalInputBorder: buttonBG,
    modalInputBorderFocus: mainBlue,
    modalFooterBG: 'ba(0,0,0,0.1)',

    //Navigation
    navigationBG: appBG,
    navigationTabBG: transparent,
    navigationTabIconColor: white,
    navigationTabBGHover: transparent,
    navigationTabIconColorHover: white,
    navigationTabBGActive: mainBlue,
    navigationTabIconColorActive: white,
    navigationTabModalBG: modalBG,
    navigationTabModalText: white,
    navigationTabModalHover: '#2c2f36',

    //Text
    textHighlight: mainBlue,
    textPrimary: white,
    textSecondary: '#c3c5cb',
    textTertiary: '#6C7284',
    textDisabled: '565A69',

    //States
    red1: '#FF6871',
    red2: '#F82D3A',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E'
  }
}
