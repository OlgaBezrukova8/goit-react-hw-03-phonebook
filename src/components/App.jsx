import React, { Component } from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { Title } from './Title/Title';
import { ContactForm } from './ContactForm/ContactForm';
import { ContactList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const parsedContacts = JSON.parse(localStorage.getItem('contacts'));

    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  handleFilter = event => {
    this.setState({ filter: event.target.value });
  };

  isExists = contactName => {
    const arrayFilter = this.state.contacts.filter(
      contact => contact.name === contactName
    );

    return arrayFilter.length !== 0;
  };

  handleSubmit = event => {
    event.preventDefault();
    const { name, number } = event.target;

    if (this.isExists(name.value)) {
      Notify.warning(`${name.value} is already in contacts`);
    } else {
      this.setState(prevState => {
        return {
          contacts: [
            ...prevState.contacts,
            {
              id: name.value,
              name: name.value,
              number: number.value,
            },
          ],
        };
      });
    }
  };

  getFilterName = () => {
    const { contacts, filter } = this.state;
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter(el =>
      el.name.toLowerCase().includes(normalizedFilter)
    );
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(({ id }) => id !== contactId),
    }));
  };

  render() {
    const visibleName = this.getFilterName();

    return (
      <div>
        <Title title="Phonebook" />
        <ContactForm onSubmit={this.handleSubmit} />

        <Title title="Contacts" />
        <Filter value={this.state.filter} onChange={this.handleFilter} />
        <ContactList
          contacts={visibleName}
          onDeleteContact={this.deleteContact}
        />
      </div>
    );
  }
}
