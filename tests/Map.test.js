import { render, fireEvent, waitFor, act } from '@testing-library/react-native'; 

import Map from '../app/map'; 
import React from 'react';

// Pakota Jest käyttämään __mocks__/@react-navigation/native/native.js tiedostoa
jest.mock('@react-navigation/native'); 

import { View } from 'react-native'; 

// --- GLOBAALI MOCK-VIIRE (ref-funktioiden kaappaamiseen) ---
let webViewRefMock = { injectJavaScript: jest.fn() };

// --- WebView MOCK: TÄMÄ KORVAA NATIIVIKOMPONENTIN JA KAAPPAA REFIN ---
jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');

  const RNWebView = React.forwardRef(({ onMessage, onLoadEnd, source, ...props }, ref) => {
    React.useImperativeHandle(ref, () => {
        const mockHandle = { 
            // Mockattu injectJavaScript-funktio
            injectJavaScript: jest.fn() 
        };
        // Päivitetään globaali viite jokaisen renderöinnin yhteydessä
        webViewRefMock = mockHandle;
        return mockHandle;
    });
    return (
      <View
        testID="mock-webview" // TÄMÄ ON TÄRKEÄÄ getByTestId:lle
        onMessage={onMessage}
        onLoadEnd={onLoadEnd}
        source={source}
        {...props}
      />
    );
  });
  return { WebView: RNWebView };
});

// Mockaukset käyttävät samaa suhteellista polkua:
jest.mock('../components/getMapHTML', () => ({ 
  getMapHTML: jest.fn(() => '<html>mocked map html</html>'),
}));
jest.mock('../components/MapStyles', () => ({
  container: { flex: 1 },
}));

describe('Map-komponentti', () => {
  const mockGoBack = jest.fn();
  const mockOnSelectLocation = jest.fn();

  const defaultProps = {
    navigation: { goBack: mockGoBack },
    route: {
      params: {
        onSelectLocation: mockOnSelectLocation,
        eventTitle: 'Test Event',
        events: [{ id: 1, title: 'Test 1', location: { latitude: 60, longitude: 24 } }],
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks(); 
    
    // Alustetaan/nollataan globaali mock-viite joka testin alussa
    webViewRefMock = { injectJavaScript: jest.fn() };

    require('../components/getMapHTML').getMapHTML.mockClear(); 
  });

  // --- Testi 1: Renderöinti ja HTML:n luonti ---
  test('renderöi WebView:n ja kutsuu getMapHTML:ää oikeilla arvoilla', () => {
    const { getByTestId } = render(<Map {...defaultProps} />);
    const webview = getByTestId('mock-webview');

    expect(webview).toBeTruthy();
    
    const mockGetMapHTML = require('../components/getMapHTML').getMapHTML;
    expect(mockGetMapHTML).toHaveBeenCalledWith(
      defaultProps.route.params.events,
      defaultProps.route.params.eventTitle
    );
    expect(webview.props.source.html).toBe('<html>mocked map html</html>');
  });

  // --- Testi 2: handleMessage (Sijainnin valinta onnistuu) ---
  test('käsittelee viestin oikein, kutsuu onSelectLocation:ia ja palaa takaisin', () => {
    const { getByTestId } = render(<Map {...defaultProps} />);
    const webview = getByTestId('mock-webview');

    const mockCoords = { lat: 60.1, lng: 24.9 };
    const mockEvent = {
      nativeEvent: { data: JSON.stringify(mockCoords) },
    };

    fireEvent(webview, 'Message', mockEvent);

    expect(mockOnSelectLocation).toHaveBeenCalledWith({
      latitude: mockCoords.lat,
      longitude: mockCoords.lng,
    });
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
  
  // --- Testi 3: handleLoadEnd (Kartan lataus ja eventien lähetys) ---
  test('kutsuu injectJavaScript:ia onLoadEnd:ssa päivittääkseen kartan tapahtumat', async () => {
    const { getByTestId } = render(<Map {...defaultProps} />);
    const webview = getByTestId('mock-webview');
    
    // Laukaise tapahtuma
    fireEvent(webview, 'LoadEnd');

    // Odotetaan, että tilapäivitys ja injektointi tapahtuvat.
    await waitFor(() => {
        expect(webViewRefMock.injectJavaScript).toHaveBeenCalledTimes(1);
        expect(webViewRefMock.injectJavaScript.mock.calls[0][0]).toContain('window.updateEvents');
    }, { timeout: 3000 });
  });
  
  // --- Testi 4: useFocusEffect (Näkyville tulo) ---
  test('kutsuu injectJavaScript:ia uudelleen, kun näkymä aktivoituu (useFocusEffect)', async () => {
        // Otetaan rerender-funktio käyttöön
    const { getByTestId, rerender } = render(<Map {...defaultProps} />);
    const webview = getByTestId('mock-webview');
    
    // 1. Simulaatio 1: Kartta latautuu (asettaa webViewReady=true).
    // fireEvent laukaisee tilapäivityksen. act varmistaa sen käsittelyn.
    await act(async () => {
        fireEvent(webview, 'LoadEnd');
    });
    
    // Varmista, että ensimmäinen kutsu (onLoadEnd:sta) on tapahtunut.
    await waitFor(() => {
        expect(webViewRefMock.injectJavaScript).toHaveBeenCalledTimes(1);
    }, { timeout: 3000 });
    
    // 2. Nollataan kutsut. Nyt webViewReady on true.
    webViewRefMock.injectJavaScript.mockClear();
    
    // 3. LAUKAISE UUDELLEENRENDERÖINTI (simuloi esim. näkymän fokusoitumista)
    // Tämä pakottaa mockatun useFocusEffectin laukeamaan uudelleen.
    await act(async () => {
        rerender(<Map {...defaultProps} />);
    });
    
    // 4. Odotetaan useFocusEffectin laukeavan uudelleen
    await waitFor(() => {
        expect(webViewRefMock.injectJavaScript).toHaveBeenCalledTimes(1); 
    }, { timeout: 3000 });
    
    jest.restoreAllMocks();
  });

  // --- Testi 5: handleMessage (Virheellinen data) ---
  test('käsittelee virheellisen datan onMessage:ssa ja antaa varoituksen', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { getByTestId } = render(<Map {...defaultProps} />);
    const webview = getByTestId('mock-webview');

    const mockEvent = {
      nativeEvent: { data: 'invalid json data' },
    };

    fireEvent(webview, 'Message', mockEvent);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Invalid data from map:',
      expect.any(Error)
    );
    expect(mockOnSelectLocation).not.toHaveBeenCalled();
    expect(mockGoBack).not.toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
  });
});