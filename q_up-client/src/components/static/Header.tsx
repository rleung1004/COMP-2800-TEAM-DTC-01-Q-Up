import React from 'react';
import Grid from '@material-ui/core/Grid';
import '../../styles/staticHeader.scss';
import clsx from 'clsx';
import {
   makeStyles,
   useTheme,
   Theme,
   createStyles,
} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';

//  Hamburger menu stuff
const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         display: 'flex',
      },
      white: {
         color: '#fff',
      },
      nodecor: {
         textDecoration: 'none',
         '&:hover': {
            color: 'white',
            textDecoration: 'none',
         },
      },
      menuButton: {
         marginRight: theme.spacing(2),
      },
      hide: {
         display: 'none',
      },
      drawer: {
         width: drawerWidth,
         flexShrink: 0,
      },
      drawerPaper: {
         background: '#242323',
         width: drawerWidth,
      },
      drawerHeader: {
         display: 'flex',
         alignItems: 'center',
         padding: theme.spacing(0, 1),
         // necessary for content to be below app bar
         ...theme.mixins.toolbar,
         justifyContent: 'flex-end',
      },
      content: {
         flexGrow: 1,
         padding: theme.spacing(3),
         transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
         }),
         marginLeft: -drawerWidth,
      },
      contentShift: {
         transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
         }),
         marginLeft: 0,
      },
   })
);
//  End hamburger menu stuff

export default function Header(props: any) {
   const Navbar = props.Nav ? props.Nav : null;

   //  Hamburger menu stuff
   const classes = useStyles();
   const theme = useTheme();
   const [open, setOpen] = React.useState(false);

   const handleDrawerOpen = () => {
      setOpen(true);
   };

   const handleDrawerClose = () => {
      setOpen(false);
   };
   //  End hamburger menu stuff

   return (
      <header style={{ backgroundColor: '#242323' }}>
         <Grid container alignItems='center'>
            <Grid item xs={2}>
               <h1>QUP</h1>
            </Grid>
            <Grid item container xs={8} justify='center'>
               <img src={require('../../img/logo.png')} alt='QUP logo' />
            </Grid>
            <Grid item xs={2}>
               <IconButton
                  color='inherit'
                  aria-label='open drawer'
                  onClick={handleDrawerOpen}
                  edge='start'
                  className={clsx(classes.menuButton, open && classes.hide)}
               >
                  <MenuIcon />
               </IconButton>
            </Grid>
         </Grid>
         <Drawer
            className={classes.drawer}
            variant='persistent'
            anchor='right'
            open={open}
            classes={{
               paper: classes.drawerPaper,
            }}
         >
            <div className={classes.drawerHeader}>
               <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'ltr' ? (
                     <ChevronLeftIcon className={classes.white} />
                  ) : (
                     <ChevronRightIcon className={classes.white} />
                  )}
               </IconButton>
            </div>
            <Divider />

            <List>
               <ListItem button key={'Home'}>
                  <Link className={classes.nodecor} to='/'>
                     Home
                  </Link>
               </ListItem>
               <ListItem button key={'View Profile'}>
                  <ListItemText
                     className={classes.white}
                     primary={'View Profile'}
                  />
               </ListItem>
               <ListItem button key={'Search Queues'}>
                  <ListItemText
                     className={classes.white}
                     primary={'Search Queues'}
                  />
               </ListItem>
               <ListItem button key={'Help'}>
                  <ListItemText className={classes.white} primary={'Help'} />
               </ListItem>
               <ListItem button key={'About Us'}>
                  <Link className={classes.nodecor} to='/aboutUs'>
                     About Us
                  </Link>
               </ListItem>
            </List>
            <Divider />
            <List>
               <ListItem button key={'Logout'}>
                  <ListItemText className={classes.white} primary={'Logout'} />
               </ListItem>
            </List>
         </Drawer>
         {Navbar}
      </header>
   );
}
