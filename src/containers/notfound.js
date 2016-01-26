import React, { DOM } from 'react';

function NotFound() {
    const {h1} = DOM;
    return h1(null, '404 - Not Found');
}

export default React.createFactory(NotFound);
