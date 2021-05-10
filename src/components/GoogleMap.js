import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import app from '../base';
import firebase from 'firebase';
import { Button, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import SelectInput from '@material-ui/core/Select/SelectInput';
const uuidv1 = require('uuid/v1');

const MapMarker = ({ text }) => <div className="tree-marker"></div>;
export let instance = null;
class SimpleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isCluster: false,
        clusterId: undefined,
        allowEdit:false,
        sessionId: uuidv1(),
        markers:[],
        inputValue:"",
        existingClusters:{},
        activeCluster:undefined,
        defaultSelection: "Select Existing Cluster"
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
      var name = "Area";
      var key = uuidv1();
    this.setState({
      name: name,
      lat: location.latitude,
      lng: location.longitude,
      key: key
   });
    firebase.database().ref('treeClusters/' + this.state.activeCluster.id + "/points/" + key).set({
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

updateValue=(e)=>{
    this.setState({inputValue:e.target.value})
}

// mapClick = (props) =>{
//     console.log(props);
// }
    createCluster = () => {
        if(this.state.inputValue == undefined || this.state.inputValue.length < 1){
            //TODO: More error handling here
            alert("Cluster Name is Required");
            return;
        }
        var clusterId = uuidv1();
        this.setState({
            isCluster: true,
            clusterId: clusterId,
            allowEdit: true
        })
        firebase.database().ref('treeClusters/' + clusterId).set({
            timestamp: Date.now(),
            id: clusterId,
            name: this.state.inputValue
        });
        console.log(clusterId);
    }

    initUI = () => {
        
        return(<>
        <h2 className="info-header">Select an existing cluster or create a new one:</h2>
            <Select
                className="select-existing"
                    labelId="selectCluster"
                    id="selectCluster"
                    value={this.state.defaultSelection}
                    autoWidth
                    onChange={this.updateSelection}
                    >
                    <MenuItem value="Select Existing Cluster" disabled>
                        Existing Cluster
                    </MenuItem>
                    {this.state.existingClusters ? this.buildListItem() : console.log("no") }
            
            </Select>
            <div className="div-bars">||</div>
            <TextField id="clusterName" label="New Cluster Name" onChange={this.updateValue} /> 
            <Button color="primary" variant="contained" className="side-button" onClick={() => this.createCluster()}>Create Cluster</Button>
            
            </>
        )
    }

    updateSelection = (event) => {
        this.setState({defaultSelection: event.target.value,
            isCluster: true,
            clusterId: event.target.value,
            allowEdit: true,
            activeCluster: this.state.existingClusters[event.target.value]
        })
    }

    crudClusterUI = () => {

    }

    getClusters = () =>{
        var db = firebase.database();
        var ref = db.ref("/treeClusters");
        ref.once("value", function(data) {
           this.setState({
               existingClusters: data.val()
           })
          }, this);
    }

    buildListItem = () => {
            if(this.state.existingClusters !== undefined || this.state.existingClusters.length > 0){
            var list =  Object.keys(this.state.existingClusters).map((id)=>{
                var cluster = this.state.existingClusters[id];
                return(<MenuItem value={cluster.id}>{cluster.name + " cluster"}</MenuItem>)
            })
            return list;
        }
    }
    componentDidMount(){
        this.getClusters();
    }


  render() {
    return (
     <div className="main-panel">

     
      <div className={"map-container allow-edit-" + this.state.allowEdit}>

        
   

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
            return <MapMarker
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
      <div className="input-container">
           {this.state.isCluster === true? this.crudClusterUI() : this.initUI()}
           
            

      </div>
    </div>
    );
  }
}

export default SimpleMap;
