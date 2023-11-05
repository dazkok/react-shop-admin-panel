import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import LaptopChromebookRoundedIcon from '@mui/icons-material/LaptopChromebookRounded';
import {Link} from "react-router-dom";
import Divider from "@mui/material/Divider";

export const mainListItems = (
    <React.Fragment>
        <Link to={'/'} className={'menu-link'}>
            <ListItemButton>
                <ListItemIcon>
                    <DashboardRoundedIcon/>
                </ListItemIcon>
                <ListItemText primary="Dashboard"/>
            </ListItemButton>
        </Link>

        <Link to={'/orders'} className={'menu-link'}>
            <ListItemButton>
                <ListItemIcon>
                    <ShoppingCartRoundedIcon/>
                </ListItemIcon>
                <ListItemText primary="Orders"/>
            </ListItemButton>
        </Link>

        <Link to={'/users'} className={'menu-link'}>
            <ListItemButton>
                <ListItemIcon>
                    <PeopleRoundedIcon/>
                </ListItemIcon>
                <ListItemText primary="Customers"/>
            </ListItemButton>
        </Link>

        <Divider/>

        <Link to={'/categories'} className={'menu-link'}>
            <ListItemButton>
                <ListItemIcon>
                    <CategoryRoundedIcon/>
                </ListItemIcon>
                <ListItemText primary="Categories"/>
            </ListItemButton>
        </Link>

        <Link to={'/products'} className={'menu-link'}>
            <ListItemButton>
                <ListItemIcon>
                    <LaptopChromebookRoundedIcon/>
                </ListItemIcon>
                <ListItemText primary="Products"/>
            </ListItemButton>
        </Link>

        <Divider/>

        <Link to={'/reports'} className={'menu-link'}>
            <ListItemButton>
                <ListItemIcon>
                    <BarChartRoundedIcon/>
                </ListItemIcon>
                <ListItemText primary="Reports"/>
            </ListItemButton>
        </Link>

        <Link to={'/integrations'} className={'menu-link'}>
            <ListItemButton>
                <ListItemIcon>
                    <LayersRoundedIcon/>
                </ListItemIcon>
                <ListItemText primary="Integrations"/>
            </ListItemButton>
        </Link>
    </React.Fragment>
);