/* eslint-disable jsx-a11y/href-no-hash */

import classNames from 'classnames';
import React from 'react';
import Panel from 'react-bootstrap/es/Panel';

import Footer from './Footer';

const NewlinesComments = () => (
    <Panel footer={Footer} className="note-card">
        <img
            className="mr--2 circle"
            src="https://example.com/hello.jpg"
            name="John Doe"
            width="24px"
            alt="John Doe"
        />
        <a href="#">
            <strong>John Doe</strong>
        </a> added a note.
        <p className="mv--2">Something completely random.</p>
        <p className="text-muted">3 days ago</p>
    </Panel>
);

export default NewlinesComments;
