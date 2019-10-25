import update from 'react-addons-update';
import moment from 'moment';

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
      action.payload.markerList.forEach(element => {

        let lastChange;
        if(element.updated_at){
            lastChange = element.updated_at;
        }else{
            lastChange = element.created_at;
        }
        //TODO: Aplicar TimeZone correctamente
        lastChange = moment(lastChange).subtract({'hours': 4});

        if(action.payload.adminFilter == 'none'){    
          dinamycMarkers[element.marker_id] = {
            lat: element.lat,
            lng: element.long,
            name: element.name,
            until: 'none',
            marker_type: element.marker_type, 
            enable: element.enable,
            lastChange: lastChange
          }
        }else if(action.payload.adminFilter == 'enabled'){
          if(element.enable){
            dinamycMarkers[element.marker_id] = {
              lat: element.lat,
              lng: element.long,
              name: element.name,
              until: 'none',
              marker_type: element.marker_type, 
              enable: element.enable,
              lastChange: lastChange
            }
          }
        }else if(action.payload.adminFilter == 'disabled'){
          if(!element.enable){
            dinamycMarkers[element.marker_id] = {
              lat: element.lat,
              lng: element.long,
              name: element.name,
              until: 'none',
              marker_type: element.marker_type, 
              enable: element.enable,
              lastChange: lastChange
            }
          }
        }else{
          dinamycMarkers = {};
        }
      });
      //console.log(dinamycMarkers);
      return update(state, {markers: {$merge: dinamycMarkers}} );
    case CLEAR_ALL_MARKERS:
      return update(state, {markers: {$set: {}}} );
    /*
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
    */
    default:
      return state;
  }
}