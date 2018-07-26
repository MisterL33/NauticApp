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
        //headerMode: 'none',
        navigationOptions: {
          headerVisible: true,
          title: 'Carte des spots',
          headerStyle: {
            backgroundColor: '#66ccff',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
         
        }
        
    }

);
export default class Stack extends React.Component {

    render() {

        return <RootStack />
    }
}