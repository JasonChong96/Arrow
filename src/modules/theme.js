import { amber } from '@material-ui/core/colors';

export const headerHeight = 70;

export const appColor = '#FFB300';

export const easing = 'cubic-bezier(0.35, 0.01, 0.77, 0.34);';

export default {
  breakpoints: {
    xs: 0,
    ix: 400,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1920,
  },
  palette: {
    primary: amber,
    appBar: amber[500],
  },
  button: {
    borderRadius: {
      xs: 4,
      lg: 28,
      xl: 32,
    },
    padding: {
      lg: [12, 28],
      xl: [14, 32],
    },
  },
};
