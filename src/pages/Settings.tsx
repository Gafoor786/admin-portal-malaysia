
import React from 'react';

interface SettingsProps {
}

interface SettingsState {
}

export default class Settings extends React.Component<SettingsProps, SettingsState> {
    constructor(props: SettingsProps) {
        super(props);
        this.state = {
            count: 0
        };
    }

    render() {
        return (
            <div className="container">
                <p >Coming Soon... !</p>{' '}
            </div>
        );
    }
}