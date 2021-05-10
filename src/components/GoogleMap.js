import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import app from '../base';
import firebase from 'firebase';
const uuidv1 = require('uuid/v1');

const AnyReactComponent = ({ text }) => <div className="tree-marker"></div>;
export let instance = null;
class SimpleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionId: uuidv1(),
      markers:[]
    } ;
    instance = this;

  }
  static defaultProps = {
    center: {
      lat: 38.124124,
      lng: -123.123
    },
    zoom: 4,

  };
  
  recordLocation = () => {
    return(
      <div className="pin-tree">Record Location</div>

    )
  }

  mapClick = (props) => {
      var location = {
        latitude: props.lat,
        longitude: props.lng,
      };
      var name = "Area " + Math.round(this.getRandomArbitrary(0,100));
      var key = uuidv1();
    this.setState({
      name: name,
      lat: location.latitude,
      lng: location.longitude,
      key: key
   });
    firebase.database().ref('treeCluster/' + key).set({
        name: name,
        lat: location.latitude,
        lng: location.longitude,
        key: key
    });


    this.state.markers.push({
      lat: location.latitude,
      lng: location.longitude,
      name: name,
      type: "tree",
      key: key
    });
    //console.log(this.props.markers);

    //console.log(MapChart);

  }

  getMyLocation = () => {
    return({
      latitude: this.getRandomArbitrary(32, 45),
      longitude: this.getRandomArbitrary((-124), (-100)),
    })
  }

  getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
  }
  componentWillReceiveProps(nextProps) {
   this.getMarkers(nextProps);
  }
  getMarkers = (props = this.props) => {

  console.log("Added");


}

getMapOptions = (maps) => {

    return {
        streetViewControl: false,
        scaleControl: true,
        fullscreenControl: false,
        styles: [{
            featureType: "poi.business",
            elementType: "labels",
            stylers: [{
                visibility: "off"
            }]
        }],
        gestureHandling: "greedy",
        disableDoubleClickZoom: true,
        minZoom: 11,
        

        mapTypeControl: true,
        mapTypeId: maps.MapTypeId.SATELLITE,
        mapTypeControlOptions: {
            style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: maps.ControlPosition.BOTTOM_CENTER,
            mapTypeIds: [
                maps.MapTypeId.ROADMAP,
                maps.MapTypeId.SATELLITE,
                maps.MapTypeId.HYBRID
            ]
        },
        draggableCursor: "crosshair",

        zoomControl: true,
        clickableIcons: false
    };
}

// mapClick = (props) =>{
//     console.log(props);
// }



  render() {
    return (
     
      <div className="map-container">

        {this.recordLocation()}

   

      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCynR5BWrMbfIxPxKS4E19J3fJNW77swBg' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          options={this.getMapOptions}
          onClick={this.mapClick}
        >

        {this.state.markers.map((value, index) =>{
          if(this.state.markers[index] !== undefined){
            return <AnyReactComponent
              key={this.state.markers[index].key}
              lat={this.state.markers[index].lat}
              lng={this.state.markers[index].lng}
              text={this.state.markers[index].name}
            />
          }

        })}
        </GoogleMapReact>
        </div>
      </div>
    
    );
  }
}

export default SimpleMap;
