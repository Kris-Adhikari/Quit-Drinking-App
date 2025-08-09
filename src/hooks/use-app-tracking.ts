import { useState, useEffect, useCallback } from 'react';
// import * as Tracking from 'expo-tracking-transparency';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock tracking functionality for development
const Tracking = {
  getTrackingPermissionsAsync: async () => ({ status: 'undetermined', canAskAgain: true }),
  requestTrackingPermissionsAsync: async () => ({ status: 'granted' }),
};

export const useAppTracking = () => {
  const [trackingStatus, setTrackingStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check current tracking permission status
  const checkTrackingStatus = useCallback(async () => {
    try {
      setLoading(true);
      const status = await Tracking.getTrackingPermissionsAsync();
      setTrackingStatus(status.status);
      return status.status;
    } catch (error) {
      console.error('Error checking tracking status:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Request tracking permission
  const requestTrackingPermission = useCallback(async () => {
    try {
      const currentStatus = await Tracking.getTrackingPermissionsAsync();
      
      if (currentStatus.status === 'undetermined') {
        const result = await Tracking.requestTrackingPermissionsAsync();
        setTrackingStatus(result.status);
        
        // Save user's choice
        await AsyncStorage.setItem('tracking_permission_requested', 'true');
        await AsyncStorage.setItem('tracking_permission_status', result.status);
        
        return result.status;
      }
      
      return currentStatus.status;
    } catch (error) {
      console.error('Error requesting tracking permission:', error);
      return null;
    }
  }, []);

  // Check if we can show tracking request
  const canRequestTracking = useCallback(async () => {
    try {
      const status = await Tracking.getTrackingPermissionsAsync();
      return status.canAskAgain && status.status === 'undetermined';
    } catch (error) {
      console.error('Error checking if can request tracking:', error);
      return false;
    }
  }, []);

  // Get user-friendly status text
  const getStatusText = useCallback((status: string | null) => {
    switch (status) {
      case 'granted':
        return 'Allowed';
      case 'denied':
        return 'Denied';
      case 'restricted':
        return 'Restricted';
      case 'undetermined':
        return 'Not Determined';
      default:
        return 'Unknown';
    }
  }, []);

  // Load initial status
  useEffect(() => {
    checkTrackingStatus();
  }, [checkTrackingStatus]);

  return {
    trackingStatus,
    loading,
    checkTrackingStatus,
    requestTrackingPermission,
    canRequestTracking,
    getStatusText,
    isTrackingEnabled: trackingStatus === 'granted',
  };
};