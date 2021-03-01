import { createAction } from '@reduxjs/toolkit'

export const updateNavigationActiveItem = createAction<{ activeItem: string }>('navigation/updateNavigationActiveItem')
