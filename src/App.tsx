import "./App.scss";
import NextLink from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  Box,
  Grid,
  Paper,
  Button,
  Divider,
  Drawer,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import React, { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppNavBar from "@components/AppNavBar";
import { AppRoutes } from "@utilities/AppRouter";
import { drawerWidth } from "@data/constants";
import { useAuthContext } from "@utilities/State";
import { styled, alpha } from "@mui/material/styles";
import { theme } from "./theme";
import { DashboardLayout } from "./components/dashboard-layout";
import Dashboard from "@pages/Dashboardtest";
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
    <>
      <Router>
        <ThemeProvider theme={theme}>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </ThemeProvider>
      </Router>
    </>
  );
}

export default App;
