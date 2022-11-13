import { StyleSheet, Text, View } from 'react-native'
import React, { useRef } from 'react'
import MapView, { Marker } from 'react-native-maps'
import tw from 'tailwind-react-native-classnames'
import { useSelector } from 'react-redux'
import { selectDestination, selectOrigin, setTraveiTimeInformation } from '../slices/navSlice'
import MapViewDirections from 'react-native-maps-directions'
import { GOOGLE_MAPS_KEY } from '@env'

const Map = () => {
  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)
  const mapRef = useRef(null)
  const dispatch = useDespatch()
  useEffect(() => {
    if (!origin || !destination) return
    mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    })
  }, [origin, destination])
  useEffect(() => {
    if (!origin || !destination) return
    const getTravelTime = async () => {
      fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?
units=imperial&origins=${origin.description}
&destinations=${destination.description}&key=${GOOGLE_MAPS_KEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          dispatch(setTraveiTimeInformation(data.rows[0].elements[0]))
        })
    }
  }, [origin, destination, GOOGLE_MAPS_KEY])

  return origin?.location ? (
    <MapView
      ref={mapRef}
      style={tw`flex-1`}
      mapType='mutedStandard'
      initialRegion={{
        latitude: origin.location.lat,
        longitude: origin.location.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
    >
      {origin && destinations && (
        <MapViewDirections
          origin={origin.description}
          destination={destinations.description}
          apikey={GOOGLE_MAPS_KEY}
          strokeWidth={3}
          strokeColor='black'
        />
      )}
      {origin?.location && (
        <Marker
          coordinate={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
          }}
          title='Origin'
          description={origin.description}
          identifier='origin'
        />
      )}
    </MapView>
  ) : (
    <Text>Loading map</Text>
  )
}

export default Map

const styles = StyleSheet.create({})
