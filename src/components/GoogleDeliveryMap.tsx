import React, { useState, useEffect, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, CheckCircle2, RotateCcw, ExternalLink, HelpCircle, AlertCircle } from 'lucide-react';
import { MapCoordinates } from '../types';

interface GoogleDeliveryMapProps {
  selectedLocation: MapCoordinates | null;
  onLocationSelect: (location: MapCoordinates | null) => void;
  defaultCenter?: { lat: number; lng: number };
}

export const GoogleDeliveryMap: React.FC<GoogleDeliveryMapProps> = ({
  selectedLocation,
  onLocationSelect,
  defaultCenter = { lat: 37.7749, lng: -122.4194 } // Default to San Francisco or user's store area
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const [center, setCenter] = useState<{ lat: number; lng: number }>(
    selectedLocation ? { lat: selectedLocation.lat, lng: selectedLocation.lng } : defaultCenter
  );
  const [zoom, setZoom] = useState<number>(14);
  const [locating, setLocating] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // If user selected location from outside, keep in sync
  useEffect(() => {
    if (selectedLocation) {
      setCenter({ lat: selectedLocation.lat, lng: selectedLocation.lng });
    }
  }, [selectedLocation]);

  const handleMapClick = useCallback((e: any) => {
    if (e.detail && e.detail.latLng) {
      const lat = typeof e.detail.latLng.lat === 'function' ? e.detail.latLng.lat() : e.detail.latLng.lat;
      const lng = typeof e.detail.latLng.lng === 'function' ? e.detail.latLng.lng() : e.detail.latLng.lng;
      onLocationSelect({
        lat,
        lng,
        formattedAddress: `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`
      });
      setGeoError(null);
    }
  }, [onLocationSelect]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCenter(newCoords);
        setZoom(16);
        onLocationSelect({
          ...newCoords,
          formattedAddress: `GPS: ${newCoords.lat.toFixed(5)}, ${newCoords.lng.toFixed(5)}`
        });
        setLocating(false);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setGeoError(error.message || 'Could not retrieve your location. You can click on the map to pin.');
        setLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleClearPin = () => {
    onLocationSelect(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-stone-600">
          <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Click anywhere on the map to drop your exact delivery pin</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
            {locating ? 'Locating...' : 'Use My GPS Location'}
          </button>

          {selectedLocation && (
            <button
              type="button"
              onClick={handleClearPin}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Clear Pin
            </button>
          )}
        </div>
      </div>

      {geoError && (
        <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Map Container */}
      <div className="relative w-full h-[280px] sm:h-[320px] rounded-xl overflow-hidden border border-stone-200 shadow-inner bg-stone-100">
        {apiKey ? (
          <APIProvider apiKey={apiKey}>
            <Map
              center={center}
              zoom={zoom}
              onCenterChanged={(ev) => setCenter(ev.detail.center)}
              onZoomChanged={(ev) => setZoom(ev.detail.zoom)}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
              onClick={handleMapClick}
              gestureHandling="greedy"
              disableDefaultUI={false}
              fullscreenControl={false}
              streetViewControl={false}
              style={{ width: '100%', height: '100%' }}
            >
              {selectedLocation && (
                <AdvancedMarker
                  position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                  title="Your Delivery Spot"
                >
                  <Pin background="#ea580c" glyphColor="#ffffff" borderColor="#c2410c" scale={1.2}>
                    <MapPin className="w-4 h-4 text-white" />
                  </Pin>
                </AdvancedMarker>
              )}
            </Map>
          </APIProvider>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center text-stone-500">
            <MapPin className="w-8 h-8 text-stone-400 mb-2 animate-bounce" />
            <p className="text-sm font-medium text-stone-700">Google Maps key required</p>
            <p className="text-xs text-stone-500 mt-1">Please configure VITE_GOOGLE_MAPS_API_KEY in .env</p>
          </div>
        )}

        {/* Center crosshair helper indicator when no pin is placed */}
        {!selectedLocation && apiKey && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-stone-200 text-[11px] text-stone-600 shadow-xs pointer-events-none flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>Click map to place pin</span>
          </div>
        )}
      </div>

      {/* Selected Pin Details Box */}
      {selectedLocation && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-emerald-950">Delivery Pin Dropped!</p>
              <p className="text-emerald-800 font-mono text-[11px]">
                Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
          </div>
          <a
            href={`https://maps.google.com/?q=${selectedLocation.lat},${selectedLocation.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-medium transition-colors shadow-2xs shrink-0"
          >
            <span>Preview in Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};
