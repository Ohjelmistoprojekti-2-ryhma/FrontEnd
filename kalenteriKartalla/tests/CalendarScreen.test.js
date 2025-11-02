import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CalendarScreen from '../app/calendar';

//Määritetään mock täysin eristettynä ilman ulkopuolisia viittauksia
jest.mock('react-native-calendars', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');

  return {
    Calendar: ({ onDayPress }) => (
      <View testID="mock-calendar">
        <Text>Mock Calendar</Text>
        <TouchableOpacity
          testID="calendar-day"
          onPress={() => onDayPress({ dateString: '2025-09-20' })} 
        >
          <Text>Press Day</Text>
        </TouchableOpacity>
      </View>
    ),
  };
});


beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((msg) => {
    if (typeof msg === 'string' && msg.includes('SafeAreaView has been deprecated')) return;
    console.warn(msg);
  });
});

describe('CalendarScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('näyttää otsikon ja oletuspäivän tapahtumat', () => {
    const { getByText } = render(
      <CalendarScreen navigation={mockNavigation} route={{ params: {} }} />
    );

    expect(getByText(/Events on 14\.9\.2025:/i)).toBeTruthy();
    expect(getByText(/Coffee with friends/i)).toBeTruthy();
  });

  it('avaa EditEvent-näkymän, kun tapahtumaa painetaan', () => {
    const { getByText } = render(
      <CalendarScreen navigation={mockNavigation} route={{ params: {} }} />
    );

    fireEvent.press(getByText(/Coffee with friends/i));
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      'EditEvent',
      expect.objectContaining({
        event: expect.objectContaining({ title: 'Coffee with friends' }),
        onSaveEdit: expect.any(Function),
        onDelete: expect.any(Function),
      })
    );
  });

  it('näyttää “No events for this day”, jos päivälle ei ole tapahtumia', () => {
    const { getByTestId, getByText } = render(
      <CalendarScreen navigation={mockNavigation} route={{ params: {} }} />
    );

    fireEvent.press(getByTestId('calendar-day'));
    expect(getByText(/No events for this day/i)).toBeTruthy();
  });

  it('avaa AddEvent-näkymän, kun painetaan + -painiketta', () => {
    const { getByText } = render(
      <CalendarScreen navigation={mockNavigation} route={{ params: {} }} />
    );

    fireEvent.press(getByText('+'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      'AddEvent',
      expect.objectContaining({
        selectedDate: '2025-09-14',
        onSave: expect.any(Function),
      })
    );
  });

  it('lisää uuden tapahtuman, jos se tulee route.paramseihin', () => {
    const newEvent = {
      id: 3,
      date: '2025-09-14',
      title: 'New Event',
      time: '12:00',
      description: 'Lunch meeting',
    };

    const { getByText, rerender } = render(
      <CalendarScreen navigation={mockNavigation} route={{ params: {} }} />
    );

    rerender(
      <CalendarScreen
        navigation={mockNavigation}
        route={{ params: { newEvent } }}
      />
    );

    expect(getByText(/New Event/i)).toBeTruthy();
  });
});
