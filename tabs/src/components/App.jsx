// https://fluentsite.z22.web.core.windows.net/quick-start
import { Provider, teamsTheme, Loader, ThemeProvider, teamsDarkTheme, teamsV2Theme, teamsHighContrastTheme } from "@fluentui/react-northstar";
import { HashRouter as Router, Redirect, Route } from "react-router-dom";
import { useTeamsFx } from "./lib/useTeamsFx";
import Tab from "./Tab";
import "./App.css";
import TabConfig from "./TabConfig";
import { useEffect, useState, useReducer } from "react";
import { MyTab } from "./UpdateTab";
const microsoftTeams = require('@microsoft/teams-js');


export default function App() {
  const { theme , loading } = useTeamsFx();
  const initialState = { UITheme : teamsTheme }; 

  microsoftTeams.initialize();
  microsoftTeams.getContext((context) => {
      const {UITheme} = reducer(undefined, {type : context.theme} );
      initialState.UITheme = UITheme;
  })

  function reducer (state, action) {
    switch(action.type){
      case 'dark': 
        return { UITheme : teamsDarkTheme }; 
      case 'default': 
        return { UITheme : teamsV2Theme }; 
      case 'contrast': 
        return { UITheme : teamsHighContrastTheme };
      default: 
        return { UITheme : teamsV2Theme }; 
    }
  }
  const [ state, dispatch ] = useReducer(reducer, initialState);
  microsoftTeams.registerOnThemeChangeHandler((theme) => dispatch({type : theme}));

  return (
    <>
      <Provider theme={state.UITheme} styles={{ backgroundColor: "#eeeeee" } }>
        <Router>
          <Route exact path="/">
            <Redirect to="/tab" />
          </Route>
          {loading ? (
            <Loader style={{ margin: 100 }} />
          ) : (
            <>
              <Route exact path="/tab" component={Tab} />
              <Route exact path="/config" component={TabConfig} />
            </>
          )}
        </Router>
      </Provider>
      </>
  );
}
