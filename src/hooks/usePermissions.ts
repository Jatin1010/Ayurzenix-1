import { useState, useCallback } from 'react';

export type PermissionType = 'camera' | 'gallery' | 'notifications' | 'microphone';

export function usePermissions() {
  const [activePermission, setActivePermission] = useState<PermissionType | null>(null);
  const [isPermanentlyDenied, setIsPermanentlyDenied] = useState(false);
  const [isDenied, setIsDenied] = useState(false);
  const [onGrantedCallback, setOnGrantedCallback] = useState<(() => void) | null>(null);

  const checkPermission = async (type: PermissionType): Promise<boolean> => {
    const localFlag = localStorage.getItem(`permission_${type}`);
    if (localFlag === 'granted') return true;

    if (navigator.permissions && type !== 'gallery') {
      try {
        let name: PermissionName;
        if (type === 'notifications') name = 'notifications' as PermissionName;
        else if (type === 'camera') name = 'camera' as PermissionName;
        else if (type === 'microphone') name = 'microphone' as PermissionName;
        else return false;

        const status = await navigator.permissions.query({ name });
        if (status.state === 'granted') {
          localStorage.setItem(`permission_${type}`, 'granted');
          return true;
        }
      } catch (e) {
        console.warn('Permission query not supported for', type);
      }
    }
    
    return false;
  };

  const requestPermission = useCallback(async (type: PermissionType, onGranted: () => void) => {
    const isGranted = await checkPermission(type);
    
    if (isGranted) {
      onGranted();
      return;
    }

    setActivePermission(type);
    setOnGrantedCallback(() => onGranted);
    setIsPermanentlyDenied(false);
    setIsDenied(false);
  }, []);

  const handleAllow = async () => {
    if (!activePermission) return;

    try {
      if (activePermission === 'camera') {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());
          
          localStorage.setItem(`permission_camera`, 'granted');
          onGrantedCallback?.();
          setActivePermission(null);
          setIsDenied(false);
        } catch (err: any) {
          console.error('Camera permission error:', err);
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            if (navigator.permissions) {
              const status = await navigator.permissions.query({ name: 'camera' as PermissionName });
              if (status.state === 'denied') {
                setIsPermanentlyDenied(true);
              } else {
                setIsDenied(true);
              }
            } else {
              setIsPermanentlyDenied(true);
            }
          }
        }
      } else if (activePermission === 'microphone') {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop());
          
          localStorage.setItem(`permission_microphone`, 'granted');
          onGrantedCallback?.();
          setActivePermission(null);
          setIsDenied(false);
        } catch (err: any) {
          console.error('Microphone permission error:', err);
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            if (navigator.permissions) {
              const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
              if (status.state === 'denied') {
                setIsPermanentlyDenied(true);
              } else {
                setIsDenied(true);
              }
            } else {
              setIsPermanentlyDenied(true);
            }
          }
        }
      } else if (activePermission === 'notifications') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          localStorage.setItem(`permission_notifications`, 'granted');
          onGrantedCallback?.();
          setActivePermission(null);
          setIsDenied(false);
        } else {
          if (permission === 'denied') {
            setIsPermanentlyDenied(true);
          } else {
            setIsDenied(true);
          }
        }
      } else if (activePermission === 'gallery') {
        localStorage.setItem(`permission_gallery`, 'granted');
        onGrantedCallback?.();
        setActivePermission(null);
        setIsDenied(false);
      }
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  };

  const openSettings = () => {
    alert('Please enable permissions in your browser settings for this site.');
    setActivePermission(null);
  };

  return {
    activePermission,
    isPermanentlyDenied,
    isDenied,
    requestPermission,
    handleAllow: isPermanentlyDenied ? openSettings : handleAllow,
    closeModal: () => setActivePermission(null),
  };
}
