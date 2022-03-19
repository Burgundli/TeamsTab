import * as React from 'react';
import { Provider, teamsTheme, Loader, ThemeProvider, reactionClassName, Button, teamsDarkTheme, teamsHighContrastTheme, teamsV2Theme } from "@fluentui/react-northstar";
import TeamsBaseComponent, { getQueryVariable } from 'msteams-react-base-component'
import { ITeamsThemeContextProps } from 'msteams-ui-components-react';
import * as microsoftTeams from '@microsoft/teams-js';
import Tab from "./Tab";
import { HashRouter as Router, Redirect, Route } from "react-router-dom";

export class MyTab extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            theme : teamsTheme,
        }
    }
    
    
    componentWillMount = () => {
        microsoftTeams.initialize();
        
        microsoftTeams.registerOnThemeChangeHandler((theme) => { 
            let UITheme; 
            switch(theme){
                case "dark": 
                    UITheme = teamsDarkTheme;
                    break;
                case "contras":
                    UITheme = teamsHighContrastTheme;
                    break;
                default: 
                    UITheme = teamsV2Theme;
            }
            this.setState({theme : UITheme});
        });
    }

     render() {
        return (
             <Provider theme={this.state.theme} styles={{ backgroundColor: "#eeeeee" } }>
                 <Router>
          <Route exact path="/">
            <Redirect to="/tab" />
          </Route>
          {this.props.isLoading? (
            <Loader style={{ margin: 100 }} />
          ) : (
            <>
              <Route exact path="/tab" component={Tab} />
              {/* <Route exact path="/config" component={TabConfig} /> */}
            </>
          )}
        </Router>
            </Provider>
        );
    }
}