import { Audio } from 'expo-av';
import { TokenStorage } from '../api';

class SoundManager {
    private clickSound: Audio.Sound | null = null;
    private isAudioEnabled = true;

    async initialize() {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: false,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });

            const { sound } = await Audio.Sound.createAsync(
                require('../../assets/sounds/click.mp3')
            );
            this.clickSound = sound;

            // Get user audio preference
            const user = await TokenStorage.getUser();
            this.isAudioEnabled = user?.preferences?.audio ?? true;
        } catch (error) {
            console.log('Sound initialization failed:', error);
        }
    }

    async playClick() {
        if (this.isAudioEnabled && this.clickSound) {
            try {
                await this.clickSound.replayAsync();
            } catch (error) {
                console.log('Sound play failed:', error);
            }
        }
    }

    setAudioEnabled(enabled: boolean) {
        this.isAudioEnabled = enabled;
    }
}

export const soundManager = new SoundManager();
