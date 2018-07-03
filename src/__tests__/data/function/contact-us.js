import React from 'react';
import Section from 'components/section';

function ContactUs() {
  const { name, email, subject, message } = this.state;

  return (
    <Section dark wide className='home__contact-us' title='Contact us'>
    </Section>
  );
}

export default ContactUs;
