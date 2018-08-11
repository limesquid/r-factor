import React from 'react';
import PropTypes from 'prop-types';
import Section from 'components/section';
import TeamMember from './team-member';
import backgroundImage from './bg.png';
import './styles.scss';

const MeetOurTeam = ({ members }) => (
  <Section
    className="meet-our-team"
    title="Meet our team"
    background={backgroundImage}>
    <div className="team-members">
      {members.map((member, index) => (
        <TeamMember key={index} {...member} />
      ))}
    </div>
  </Section>
);

MeetOurTeam.propTypes = {
  members: PropTypes.array
};

export default MeetOurTeam;
