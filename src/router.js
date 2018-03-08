import React from 'react';
import { StackNavigator,  NavigationAction } from 'react-navigation';


import Home from './screens/home';
import Login from './screens/loginPage';

const RootStack = StackNavigator(

    {
        Home: {
            screen: Home,
        },
        Login: {
            screen: Login,
        },
    },
    {
        initialRouteName: 'Login',
    }

);
export default class Stack extends React.Component {
    render() {

        return <RootStack />
    }
}