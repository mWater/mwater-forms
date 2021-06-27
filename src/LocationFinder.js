import EventEmiiter from 'events';
import _ from 'lodash';

// Improved location finder. Triggers found event with HTML5 position object (containing coords, etc).
// Pass storage as option (implementing localStorage API) to get caching of position
class LocationFinder {
  constructor(options) {
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.pause = this.pause.bind(this);
    this.resume = this.resume.bind(this);
    this.eventEmitter = new EventEmiiter();

    // "error" messages are handled specially and will crash if not handled!
    this.eventEmitter.on('error', () => {});

    this.storage = (options || {}).storage;

    // Keep count of watches
    this.watchCount = 0;
  }

  on(event, callback) {
    return this.eventEmitter.on(event, callback);
  }

  off(event, callback) {
    return this.eventEmitter.removeListener(event, callback);
  }

  cacheLocation(pos) {
    if (this.storage != null) {
      return this.storage.set('LocationFinder.lastPosition', JSON.stringify(pos));
    }
  }

  getCachedLocation() {
    if ((this.storage != null) && this.storage.get('LocationFinder.lastPosition')) {
      const pos = JSON.parse(this.storage.get('LocationFinder.lastPosition'));

      // Check that valid position (unreproducible bug)
      if (!pos.coords) {
        return;
      }

      // Accuracy is down since cached
      pos.coords.accuracy = 10000; // 10 km
      return pos;
    }
  }
    
  getLocation(success, error) {
    // If no geolocation, send error immediately
    if (!navigator.geolocation) {
      if (error) { error("No geolocation available"); }
      return;
    }

    console.log("Getting location");

    // Both failures are required to trigger error
    const triggerLocationError = _.after(2, err => {
      if (error) {
        return error(err);
      }
    });

    const lowAccuracyError = err => {
      console.error(`Low accuracy location error: ${err.message}`);
      return triggerLocationError(err);
    };

    const highAccuracyError = err => {
      console.error(`High accuracy location error: ${err.message}`);
      return triggerLocationError(err);
    };

    let lowAccuracyFired = false;
    let highAccuracyFired = false;

    const lowAccuracy = pos => {
      if (!highAccuracyFired) {
        lowAccuracyFired = true;
        this.cacheLocation(pos);
        return success(pos);
      }
    };

    const highAccuracy = pos => {
      highAccuracyFired = true;
      this.cacheLocation(pos);
      return success(pos);
    };

    // Get both high and low accuracy, as low is sufficient for initial display
    navigator.geolocation.getCurrentPosition(lowAccuracy, lowAccuracyError, {
        maximumAge : 1000*30,   // 30 seconds ok for low accuracy
        timeout : 30000,
        enableHighAccuracy : false
    });

    navigator.geolocation.getCurrentPosition(highAccuracy, highAccuracyError, {
        timeout : 60*1000*3,    // Up to 3 minutes wait
        enableHighAccuracy : true
    });

    // Fire stored one within short time
    return setTimeout(() => {
      const cachedLocation = this.getCachedLocation();
      if (cachedLocation && !lowAccuracyFired && !highAccuracyFired) {
        return success(cachedLocation);
      }
    }
    , 250);
  }

  startWatch() {
    // If no geolocation, trigger error
    if (!navigator.geolocation) {
      console.error("No geolocation available");
      this.eventEmitter.emit('error');
      return;
    }

    let highAccuracyFired = false;
    let lowAccuracyFired = false;
    let cachedFired = false;

    const lowAccuracy = pos => {
      if (!highAccuracyFired) {
        lowAccuracyFired = true;
        this.cacheLocation(pos);
        return this.eventEmitter.emit('found', pos);
      }
    };

    const lowAccuracyError = err => {
      // Low accuracy errors are not enough to trigger final error
      console.error(`Low accuracy watch location error: ${err.message}`);
      // if failed due to PERMISSION_DENIED emit error, or should we always emit error?
      if (err.code === 1) {
        return this.eventEmitter.emit('error', err);
      }
    };

    const highAccuracy = pos => {
      highAccuracyFired = true;
      this.cacheLocation(pos);
      return this.eventEmitter.emit('found', pos);
    };

    const highAccuracyError = err => {
      // High accuracy error is not final (https://w3c.github.io/geolocation-api/#position_options_interface)
      console.error(`High accuracy watch location error: ${err.message}`);
      // if failed due to PERMISSION_DENIED emit error, or should we always emit error?
      if (err.code === 1) {
        return this.eventEmitter.emit('error', err);
      }
    };

    // Fire initial low-accuracy one
    navigator.geolocation.getCurrentPosition(lowAccuracy, lowAccuracyError, {
      maximumAge: 30*1000,
      timeout: 30000,
      enableHighAccuracy: false
    });

    // Increment watch count
    this.watchCount += 1;

    // If already watching, continue without doubling up watchPosition
    if (this.locationWatchId != null) {
      return;
    }

    this.locationWatchId = navigator.geolocation.watchPosition(highAccuracy, highAccuracyError, {
      enableHighAccuracy : true,
      maximumAge: 0
    });  

    // Listen for pause events to stop watching
    document.addEventListener("pause", this.pause);
    document.addEventListener("resume", this.resume);

    console.log(`Starting location watch ${this.locationWatchId}`);

    // Fire stored one within short time
    return setTimeout(() => {
      const cachedLocation = this.getCachedLocation();
      if (cachedLocation && !lowAccuracyFired && !highAccuracyFired) {
        cachedFired = true;
        return this.eventEmitter.emit('found', cachedLocation);
      }
    }
    , 500);
  }

  stopWatch() {
    // Decrement watch count if watching
    if (this.watchCount === 0) {
      return;
    }

    this.watchCount -= 1;

    // Do nothing if still watching
    if (this.watchCount > 0) {
      return;
    }

    if (this.locationWatchId != null) {
      console.log(`Stopping location watch ${this.locationWatchId}`);
      navigator.geolocation.clearWatch(this.locationWatchId);
      this.locationWatchId = undefined;
    }

    // Listen for pause events to stop watching
    document.removeEventListener("pause", this.pause);
    return document.removeEventListener("resume", this.resume);
  }

  pause() {
    if (this.locationWatchId != null) {
      navigator.geolocation.clearWatch(this.locationWatchId);
      return this.locationWatchId = undefined;
    }
  }

  resume() {
    const highAccuracy = pos => {
      this.cacheLocation(pos);
      return this.eventEmitter.emit('found', pos);
    };

    const highAccuracyError = err => {
      console.error(`High accuracy watch location error: ${err.message}`);

      // No longer watching since there was an error
      this.stopWatch();

      // Send error message
      return this.eventEmitter.emit('error');
    };

    if ((this.locationWatchId == null)) {
      return this.locationWatchId = navigator.geolocation.watchPosition(highAccuracy, highAccuracyError, {
          enableHighAccuracy : true
      });  
    }
  }
}

export default LocationFinder;  
