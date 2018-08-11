import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Section from 'components/section';
import TeamMember from './team-member';
import backgroundImage from './bg.png';
import './styles.scss';

class MeetOurTeam extends Component {
  static propTypes = {
    members: PropTypes.array
  };

  render() {
    const { members } = this.props;

    return (
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
  }
}

export default MeetOurTeam;
