import React from 'react';

import { Consumer } from './context';

export default function withUserContext(Component) {
    function WithUserContext(props) {
        return (
            <Consumer>
                {({ userContext, onUserContextUpdated, onUserContextOutdated }) => (
                    <Component
                        {...props}
                        userContext={userContext}
                        onUserContextUpdated={onUserContextUpdated}
                        onUserContextOutdated={onUserContextOutdated}
                    />
                )}
            </Consumer>
        );
    }

    WithUserContext.displayName = `withUserContext(${Component.displayName || Component.name})`;
    return WithUserContext;
}
