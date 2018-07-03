import React, { Component } from 'react';
import Section from 'components/section';

class ContactUs extends Component {
  render() {
    const { name, email, subject, message } = this.state;

    return (
      <Section dark wide className='home__contact-us' title='Contact us'>
      </Section>
    );
  }
}

export default ContactUs;
