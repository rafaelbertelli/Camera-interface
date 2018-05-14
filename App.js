import React from 'react';
import { Text, View, TouchableOpacity, Button } from 'react-native';
import { Camera, Permissions } from 'expo';

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.front,
    zoom: 0.0,
    step: 0.1,

    faces: [],
  };


  auto = () => {
    if(this.state.zoom >= 0.9) this.setState({ step: -this.state.step })
    this.setState({ zoom: this.state.zoom  + this.state.step})
    // setTimeout(() => this.auto(), 300)
  }

  onFace = ({faces=[]}) => {
    this.setState({faces: faces.map((face) => {
      return {x: face.bounds.origin.x, y: face.bounds.origin.y, width: face.bounds.size.width, height: face.bounds.size.height}
    })})
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  componentDidMount() {
    this.auto()
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (

        <React.Fragment>

          <View style={{ flex: 1 }}>
            <Camera style={{ flex: 1 }} type={this.state.type} ratio="16:9" onFacesDetected={this.onFace}>

              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                }}>

                {this.state.faces.map((face, index) => {
                  return (
                    <View key={index} style={
                      {
                        position: 'relative',
                        width: face.width,
                        height: face.height,
                        left: face.x,
                        top: face.y,
                        borderColor: 'red',
                        borderWidth: 1,
                        backgroundColor: 'transparent',
                      }
                    }/>
                  )
                })}

                <TouchableOpacity
                  style={{
                    flex: 0.1,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.setState({
                      type: this.state.type === Camera.Constants.Type.front
                        ? Camera.Constants.Type.back
                        : Camera.Constants.Type.front,
                    });
                  }}>
                  <Text
                    style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                    {' '}Flip{' '}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 0.1,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.setState({ zoom: 0.0, step: 0.1 });
                  }}>
                  
                </TouchableOpacity>              

              </View>
            </Camera>
          </View>

        </React.Fragment>        
      );
    }
  }
}