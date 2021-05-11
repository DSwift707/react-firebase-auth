import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import app from '../base';
import firebase from 'firebase';
import { Button, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import SelectInput from '@material-ui/core/Select/SelectInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons'
const uuidv1 = require('uuid/v1');

const MapMarker = ( {id} ) => <div id={id} className="tree-marker"></div>;
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
        defaultSelection: "Select Existing Cluster",
        loadedMarkers:false,
        centerMap: props.center,
        type:""
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
        key: key,
        type: this.state.type
    });


    this.state.markers.push({
      lat: location.latitude,
      lng: location.longitude,
      name: name,
      type: this.state.type,
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
        var initialArray = [];
        if(this.state.existingClusters[event.target.value].points !== undefined && Object.keys(this.state.existingClusters[event.target.value].points).length > 0){
          for (const [key, value] of Object.entries(this.state.existingClusters[event.target.value].points)) {
            initialArray.push(value);
          }
        }
        this.setState({markers:initialArray});
    }
    updateType = (event) => {
      this.setState({type:event.target.value});
    }
    crudClusterUI = () => {
      return(
      <>
        <div className="create-pin-info">
          <h3>New Point Attributes</h3>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={this.state.type}
            onChange={this.updateType}
          >
            <MenuItem value={"tree"}>Tree</MenuItem>
            <MenuItem value={"pole"}>Power Pole</MenuItem>
            <MenuItem value={"residence"}>Residence</MenuItem>
            <MenuItem value={"hydrant"}>Hydrant</MenuItem>
          </Select>
        </div>
        <div className="cluster-info-container">
          <h3>Cluster Points</h3>
          <ul className="cluster-list">
            {this.state.markers.map((value, index) =>{
          if(this.state.markers[index] !== undefined){
            var coordinate = this.state.markers[index];
            return <li 
            value={coordinate.key}
            lat={coordinate.lat}
            lng={coordinate.lng}
            onMouseEnter={() => this.highlightHover(coordinate.key)}
            onMouseLeave={() => this.unhighlightHover(coordinate.key)}
            onClick={() => this.goToPin(coordinate.lat,coordinate.lng)}
            >
              
                <div className="coordinate-detail pin-locate">
                  <FontAwesomeIcon icon={faCrosshairs} />
                </div>
                <div className="coordinate-detail lat-lng">
                  <b>Lat:</b> {coordinate.lat}
                </div>
                <div className="coordinate-detail lat-lng">
                  <b>Lng:</b> {coordinate.lng}
                </div>
               
              
            </li>

            // return <div
            //   key={this.state.markers[index].key}
            //   lat={this.state.markers[index].lat}
            //   lng={this.state.markers[index].lng}
            //   text={this.state.markers[index].name}
            // />
          }

        })}
          </ul>
        
        </div>
      </>
      )
    }

    highlightHover = (id) =>{
      document.getElementById(id).style.cssText =`
        border: 1px solid green;
        width: 10px;
        height: 10px;
        margin: -2px;
        background-color: green;
      `;
    }
    unhighlightHover = (id) =>{
      document.getElementById(id).style.cssText =`
      border: 1px solid red;
      width: 5px;
      height: 5px;
      margin: 0px;
      background-color: transparent;
    `;
    }
    goToPin = (lat,lng) =>{
      this.setState({centerMap:{lat:lat,lng:lng}});
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
         // defaultCenter={this.props.center}
          center={this.state.centerMap}
          defaultZoom={this.props.zoom}
          options={this.getMapOptions}
          onClick={this.mapClick}
          
        >

        {this.state.markers.map((value, index) =>{
          if(this.state.markers[index] !== undefined){
            return <MapMarker
              id={this.state.markers[index].key}
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
