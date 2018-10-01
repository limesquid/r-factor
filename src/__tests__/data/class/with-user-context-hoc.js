import React, { Component } from 'react';

import { Consumer } from './context';

export default function withUserContext(ComponentComponent) {
    class WithUserContext extends Component {
        render() {
            const props = this.props;

            return (
                <Consumer>
                    {({ userContext, onUserContextUpdated, onUserContextOutdated }) => (
                        <ComponentComponent
                            {...props}
                            userContext={userContext}
                            onUserContextUpdated={onUserContextUpdated}
                            onUserContextOutdated={onUserContextOutdated}
                        />
                    )}
                </Consumer>
            );
        }
    }

    WithUserContext.displayName = `withUserContext(${ComponentComponent.displayName || ComponentComponent.name})`;
    return WithUserContext;
}
