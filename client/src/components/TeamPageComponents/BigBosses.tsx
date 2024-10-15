import React from 'react';
import data from "./boss.json"
import {Avatar, Card, CardContent, Typography} from '@mui/material';
import './BigBosses.css'

interface BossType {
    id: number;
    name: string;
    role: string;
}

// Photos of the club staff are not stored in the repository: an avatar with initials is shown instead.
function initials(fullName: string): string {
    const [lastName = '', firstName = ''] = fullName.split(' ');
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

const BigBosses = () => {
    const bosses: BossType[] = data.boss;

    return (
        <div className="boss-container">

            <h1 style={{color: "white", fontSize: "30px"}}>Представители клуба</h1>

            <div className="boss-content">
                {bosses.map((item) => (
                    <Card key={item.id} className="boss-card">
                        <Avatar className="boss-avatar" alt={item.name}>{initials(item.name)}</Avatar>
                        <CardContent>
                            <Typography variant="h6">{item.name}</Typography>
                            <Typography variant="body2">{item.role}</Typography>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default BigBosses;
