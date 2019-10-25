import axios from 'axios';

import {
    LOAD_STATIC_MARKERS,
    LOAD_MARKERS,
    LOAD_MARKER_DETAIL,
    UNLOAD_MARKER_DETAIL,
    CLEAR_ALL_MARKERS,
} from './types';

require('dotenv').config();

export const loadStaticMarkers = () => async (dispatch) => {
    try {
        let body = JSON.stringify({ latMin: -100, latMax: 100, lngMin: -100, lngMax: 100 })
        let config = {
            headers: { 
                'Content-Type': 'application/json',
                'X-Api-Key': process.env.REACT_APP_API_KEY
            }
        }
        const res = await axios.post(process.env.REACT_APP_BASE_URL+'/locations/list',body,config);
        dispatch({ type: LOAD_STATIC_MARKERS, payload: {markerList: res.data}});
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const loadMarkers = (adminFilter) => async (dispatch) => {
    try {
        let body = JSON.stringify({ latMin: -100, latMax: 100, lngMin: -100, lngMax: 100 })
        let config = {
            headers: { 
                'Content-Type': 'application/json',
                'X-Api-Key': process.env.REACT_APP_API_KEY
            }
        }
        const res = await axios.post(process.env.REACT_APP_BASE_URL+'/markers/dev/list',body,config);
        dispatch({ type: LOAD_MARKERS, payload: {markerList: res.data, adminFilter: adminFilter}});
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};


export const getMarketDetail = (data) => async (dispatch) => {
    try {
        let body = JSON.stringify({ marker_id: data.id })
        let config = {
            headers: { 
                'Content-Type': 'application/json',
                'X-Api-Key': process.env.REACT_APP_API_KEY
            }
        }
        const res = await axios.post(process.env.REACT_APP_BASE_URL+'/markers/info',body,config);
        //console.log(res.data[0].products);
        let products = [];
        res.data[0].products.forEach(element => {
            products.push(element.name);
        });
        let nivelCola = '';
        if(res.data[0].queue_level == 1){
            nivelCola = 'Ninguna';
        }else if(res.data[0].queue_level == 2){
            nivelCola = 'Pocas';
        }else if(res.data[0].queue_level == 3){
            nivelCola = 'Algunas';
        }else if(res.data[0].queue_level == 4){
            nivelCola = 'Muchas';
        }else if(res.data[0].queue_level == 5){
            nivelCola = 'No ir, está cerrado';
        }else{
            nivelCola = '';
        }
        let untilAux;
        if(res.data[0].closing_hour == 'null'){
          untilAux = 'Estamos averiguando para usted ♥';
        }else{
          untilAux = res.data[0].closing_hour;
        }
        const markerInfo = {
            ready: true,
            markerDetail: {
                until: untilAux,
                queue_level: nivelCola,
                products:products
            },
        }
        dispatch({ type: LOAD_MARKER_DETAIL, payload: markerInfo});
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const unLoadMarkerDetail = () => dispatch => new Promise((resolve, reject) => {
    dispatch({ type: UNLOAD_MARKER_DETAIL, payload:null});
    resolve();
});

export const newMarker = (data) => async (dispatch) => {
    try {
        let body = JSON.stringify({ 
            lat: data.lat, 
            long: data.lng, 
            name: data.name, 
            closing_hour: data.closing_hour,
            products: data.products,
            queue_level: data.queue_level,
            marker_type: 1
        })
        let config = {
            headers: { 
                'Content-Type': 'application/json',
                'X-Api-Key': process.env.REACT_APP_API_KEY
            }
        }
        console.log(body);
        const res = await axios.post(process.env.REACT_APP_BASE_URL+'/markers',body,config);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const clearAllMarkers = () => dispatch => new Promise((resolve, reject) => {
    dispatch({ type: CLEAR_ALL_MARKERS, payload:null});
    resolve();
});