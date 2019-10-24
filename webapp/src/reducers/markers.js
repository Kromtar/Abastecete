import update from 'react-addons-update';

import { LOAD_STATIC_MARKERS, LOAD_MARKERS, CLEAR_ALL_MARKERS, TEST_LOCAL_FILTER_ONLY_ENABLED, TEST_LOCAL_FILTER_ONLY_DISABLED } from '../actions/types';

var defaultValues = {
  markers: {
    /*
      a0001:{
        lat: -32.949715,
        lng: -71.544152,
        name: 'a'
      },
      a0002:{
        lat: 50.505,
        lng: -0.09,
        name: 'b'
      },
    */
  }
}

export default function(state = defaultValues , action) {
  switch (action.type){
    case LOAD_STATIC_MARKERS:
      let statics = {};
      //TODO: Sacar esto de aqui
      action.payload.markerList.forEach(element => {
        let untilAux;
        if(element.until == 'null'){
          untilAux = 'Estamos averiguando para usted ♥';
        }else{
          untilAux = element.until;
        }
        statics[element.location_id] = {
          lat: element.lat,
          lng: element.long,
          name: element.name,
          until: untilAux,
          marker_type: -1,
        }
      });
      return update(state, {markers: {$merge: statics}} );
    case LOAD_MARKERS:
      let dinamycMarkers = {};
      //console.log(action.payload.markerList);
      action.payload.markerList.forEach(element => {
        dinamycMarkers[element.marker_id] = {
          lat: element.lat,
          lng: element.long,
          name: element.name,
          until: 'none',
          marker_type: element.marker_type, 
          enable: element.enable
        }
      });
      //console.log(dinamycMarkers);
      return update(state, {markers: {$merge: dinamycMarkers}} );
    case CLEAR_ALL_MARKERS:
      return update(state, {markers: {$set: {}}} );
    case TEST_LOCAL_FILTER_ONLY_ENABLED:
      let newListEnabled = {}
      Object.entries(state.markers).forEach(function(data) {
        const markerId = data[0];
        const markerData = data[1];
        if(markerData.enable){
          newListEnabled[markerId] = markerData;
        }
      });
      return update(state, {markers: {$set: newListEnabled}} );
    case TEST_LOCAL_FILTER_ONLY_DISABLED:
      let newListDisabled = {}
      Object.entries(state.markers).forEach(function(data) {
        const markerId = data[0];
        const markerData = data[1];
        if(!markerData.enable){
          newListDisabled[markerId] = markerData;
        }
      });
      return update(state, {markers: {$set: newListDisabled}} );
    default:
      return state;
  }
}