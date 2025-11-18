import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddEventScreen from '../app/AddEvent';
import { Alert } from 'react-native';

//Mockataan DateTimePicker, jotta Jest ei kaadu natiivikomponenttiin
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => (
    <View testID="mocked-datetimepicker">
      <Text>DateTimePicker</Text>
    </View>
  );
});

//Mockataan Reanimated, jotta animaatiot eivät aiheuta virheitä testeissä
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

describe('AddEventScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  const mockOnSave = jest.fn();

  const baseRoute = {
    params: {
      selectedDate: '2025-10-10',
      onSave: mockOnSave,
      location: { lat: 60.1234, lng: 24.5678 },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    jest.spyOn(Date, 'now').mockReturnValue(123456789); // vakioi ID testien ajaksi
  });

  it('näyttää valitun päivämäärän', () => {
    const { getByText } = render(
      <AddEventScreen navigation={mockNavigation} route={baseRoute} />
    );
    expect(getByText(/Date: 2025-10-10/)).toBeTruthy();
  });

  it('näyttää virheilmoituksen, jos otsikko puuttuu tallennettaessa', () => {
    const { getByText } = render(
      <AddEventScreen navigation={mockNavigation} route={baseRoute} />
    );

    fireEvent.press(getByText('Save Event'));
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter an event title.');
  });

  it('kutsuu onSave ja palaa takaisin, jos otsikko annettu', () => {
    const { getByPlaceholderText, getByText } = render(
      <AddEventScreen navigation={mockNavigation} route={baseRoute} />
    );

    fireEvent.changeText(getByPlaceholderText('Enter event title'), 'Kokous');
    fireEvent.press(getByText('Save Event'));

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Kokous',
        date: '2025-10-10',
      })
    );
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
