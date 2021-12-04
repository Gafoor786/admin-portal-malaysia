import "./App.scss";
import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import React, { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppNavBar from "@components/AppNavBar";
import { AppRoutes } from "@utilities/AppRouter";
import { Box, Grid, Paper } from "@mui/material";
import { drawerWidth } from "@data/constants";
import { useAuthContext } from "@utilities/State";
import { styled, alpha } from "@mui/material/styles";
import { theme } from "./theme";
// import { HashRouter as Router } from 'react-router-dom';

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const { state } = useAuthContext();
  const StyledOuterBox = styled(Box)(({ theme }) => {
    return {
      // border: state.authenticated ? 20 : 0,

      // background: '#060d1f',
      [theme.breakpoints.up("md")]: {
        // borderRadius: state.authenticated ? 30 : 0,
        padding: theme.spacing(state.authenticated ? 2 : 0),
        minHeight: `calc(100vh - ${theme.spacing(
          state.authenticated ? 2 : 1
        )})`,
      },
      [theme.breakpoints.down("md")]: {
        paddingTop: theme.spacing(state.authenticated ? 2 : 0),
        minHeight: `calc(100vh - ${theme.spacing(1)})`,
      },
    };
  });

  const StyledBox = styled(Box)(({ theme }) => {
    return {
      p: 2,
      marginTop: `${Number(theme.mixins.toolbar.minHeight?.toString()) + 10}px`,
      [theme.breakpoints.up("md")]: {
        padding: 1,
        // paddingTop: theme.spacing(state.authenticated ? 8 : 0),
        // borderRadius: 30,
        m: 2,
      },
      [theme.breakpoints.down("md")]: {
        // paddingTop: theme.spacing(state.authenticated ? 8 : 0),
        p: state.authenticated ? 2 : 0,
      },
    };
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <AppNavBar /> */}

      <Box
        sx={{ display: "flex", height: "100%" }}
        style={
          {
            // backgroundColor: prefersDarkMode ? '#14182A' : 'Highlight',
          }
        }
      >
        {state.authenticated ? (
          <Box
            component="nav"
            sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            aria-label="mailbox folders"
          ></Box>
        ) : null}

        <StyledBox
          component="main"
          sx={{
            flexGrow: 1,
            height: "100%",
            // backgroundColor: { xs: "secondary.light", sm: "#0000ff" },
          }}
        >
          <Grid>
            <Grid
              sx={{
                padding: (theme) =>
                  state.authenticated
                    ? theme.spacing(1, 1, 1, 0)
                    : theme.spacing(0),
              }}
            >
              <StyledOuterBox
                // sx={{ padding: (theme) => theme.spacing(state.authenticated ? 2 : 0) }}
                style={
                  {
                    //  paddingTop: theme.mixins.toolbar.minHeight,
                    // backgroundColor: 'aqua',
                    // backgroundColor: prefersDarkMode ? DASHBOARD_BG : 'Highlight', // 1b2342  060D1f
                    // border: state.authenticated ? 20 : 0,
                    // minHeight: `calc(100vh - ${theme.spacing(state.authenticated ? 3 : 1)})`,
                    // background: '#060d1f'
                  }
                }
                component={Paper}
              >
                <Router>
                  <AppNavBar />
                  {/* <ResponsiveDrawer /> */}
                  {/* <Dashboard /> */}
                  <Suspense fallback={<div>Loading...</div>}>
                    <AppRoutes />
                  </Suspense>
                </Router>
              </StyledOuterBox>
            </Grid>
          </Grid>
        </StyledBox>
      </Box>

      {/* <SideMenu /> */}
    </ThemeProvider>
  );
}

export default App;
