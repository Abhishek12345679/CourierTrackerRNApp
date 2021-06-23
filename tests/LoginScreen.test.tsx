import 'react-native'
import React from "react"
import { render } from '@testing-library/react-native'
import renderer from 'react-test-renderer'

import LoginScreen from "../src/screens/LoginScreen"

it('has welcome text', () => {
    renderer.create(<LoginScreen />)
    // jest.mock('mobx-react', () => require('mobx-react/dist/mobxreact.rn.module'));
    // expect(getAllByText('Welcome \nHooman <3 ')).toBe(2)
})