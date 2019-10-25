import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

class AdminPanel extends Component { 

  
  renderListByDate(){
    const sortDates = (a, b) => moment(b.lastChange) - moment(a.lastChange) ;
    var markersArry = [];
    Object.entries(this.props.markers).forEach(function(data) {
      const markerId = data[0];
      const markerData = data[1];
      markersArry.push(Object.assign(markerData, {id: markerId}));
    });
    let ordenados = markersArry.sort(sortDates);
  }


  render() {    
    return (
      <div>
        hola
      </div>
    )
  }
};

function mapStateToProps(state){
    return {
      markers: state.markers.markers,
      globals: state.globals
    };
  };

export default connect(mapStateToProps)(AdminPanel);