

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, 
  Typography, 
  AppBar, 
  Toolbar, 
  Container 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import SubmersibleMap from './SubmersibleMap';
import Submersible3DView from './Submersible3DView';

const Dashboard = ({ onLogout }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [position, setPosition] = useState([-30, -120]);
    const [depth, setDepth] = useState(100);
    const [speed, setSpeed] = useState(5);

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>
                    <Button 
                        color="inherit" 
                        onClick={handleLogout}
                        startIcon={<LogoutIcon />}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Container>
                <SubmersibleMap 
                    position={position}
                    depth={depth}
                    speed={speed}
                    setPosition={setPosition}
                    setDepth={setDepth}
                    setSpeed={setSpeed}
                />
                <Submersible3DView 
                    position={position}
                    depth={depth}
                    speed={speed}
                />
            </Container>
        </>
    );
};

export default Dashboard;
