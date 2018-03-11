import React from 'react';
import { StackNavigator,  NavigationAction } from 'react-navigation';


import Home from '../screens/home';
import Login from '../screens/loginPage';
import Ranking from '../components/ranking';
const RootStack = StackNavigator(

    {
        Home: {
            screen: Home,
        },
        Login: {
            screen: Login,
        },
        Ranking: {
            screen: Ranking,
        }
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