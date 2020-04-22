export const getBoundsOfData = data => {
    let bounds = {ne: [], sw: []};
  
    data.forEach(({lon = null, lat = null}) => {
      if (lon && lat) {
        if (bounds.ne.length === 0) {
          bounds = {ne: [lon, lat], sw: [lon, lat]};
        } else {
          if (lat < bounds.sw[1]) {
            bounds.sw[1] = lat;
          }
          if (lat > bounds.ne[1]) {
            bounds.ne[1] = lat;
          }
          if (lon < bounds.sw[0]) {
            bounds.sw[0] = lon;
          }
          if (lon > bounds.ne[0]) {
            bounds.ne[0] = lon;
          }
        }
      }
    });
    return {
      ne: [parseFloat(bounds.ne[0]), parseFloat(bounds.ne[1])],
      sw: [parseFloat(bounds.sw[0]), parseFloat(bounds.sw[1])],
    };
  };
  
  const getDistanceFromPoints = (p1, p2) => {
    const R = 6372.795477598;
    const a = {
      lat: (p1.lat * (2 * 3.14)) / 360,
      lon: (p1.lon * (2 * 3.14)) / 360,
    };
    const b = {
      lat: (p2.lat * (2 * 3.14)) / 360,
      lon: (p2.lon * (2 * 3.14)) / 360,
    };
  
    try {
      return (
        R *
        Math.acos(
          Math.sin(a.lat) * Math.sin(b.lat) +
            Math.cos(a.lat) * Math.cos(b.lat) * Math.cos(a.lon - b.lon),
        )
      );
    } catch (error) {
      console.log(error);
      return 0;
    }
  };
  
  export const sortDataForUsersPosition = (data, userPosition) => {
    const dataWithDistance = data.map(elm => ({
      ...elm,
      distance: getDistanceFromPoints(
        {lat: elm.lat, lon: elm.lon},
        {lat: userPosition.lat, lon: userPosition.lon},
      ),
    }));
    return dataWithDistance.sort((a, b) => {
      if (a.distance < b.distance) {
        return -1;
      }
      if (a.distance > b.distance) {
        return 1;
      }
      return 0;
    });
  };