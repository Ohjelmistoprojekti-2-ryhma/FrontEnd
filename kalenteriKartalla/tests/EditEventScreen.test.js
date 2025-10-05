import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EditEventScreen from '../app/EditEventScreen';
import { Alert } from 'react-native';

describe('EditEventScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  const mockOnSaveEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const baseRoute = {
    params: {
      event: {
        id: 1,
        title: 'Vanha tapahtuma',
        date: '2025-10-10',
        location: { lat: 60.1234, lng: 24.5678 },
      },
      onSaveEdit: mockOnSaveEdit,
      onDelete: mockOnDelete,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  it('näyttää alkuperäisen otsikon', () => {
    const { getByDisplayValue } = render(
      <EditEventScreen navigation={mockNavigation} route={baseRoute} />
    );
    expect(getByDisplayValue('Vanha tapahtuma')).toBeTruthy();
  });

  it('näyttää virheilmoituksen, jos otsikko puuttuu tallennettaessa', () => {
    const { getByPlaceholderText, getByText } = render(
      <EditEventScreen navigation={mockNavigation} route={baseRoute} />
    );

    fireEvent.changeText(getByPlaceholderText('Event title'), '');
    fireEvent.press(getByText('Save Changes'));

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter an event title.');
  });

  it('kutsuu onSaveEdit ja palaa takaisin, jos otsikko annettu', () => {
    const { getByPlaceholderText, getByText } = render(
      <EditEventScreen navigation={mockNavigation} route={baseRoute} />
    );

    fireEvent.changeText(getByPlaceholderText('Event title'), 'Uusi otsikko');
    fireEvent.press(getByText('Save Changes'));

    expect(mockOnSaveEdit).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        title: 'Uusi otsikko',
      })
    );
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('näyttää poistoalertin kun Delete Event painetaan', () => {
    const { getByText } = render(
      <EditEventScreen navigation={mockNavigation} route={baseRoute} />
    );

    fireEvent.press(getByText('Delete Event'));
    expect(Alert.alert).toHaveBeenCalledWith(
      'Delete Event',
      'Are you sure you want to delete this event?',
      expect.any(Array)
    );
  });
});
