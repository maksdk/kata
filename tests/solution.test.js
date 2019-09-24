import AlarmClock from '../enteties/AlarmClock';

describe('AlarmClock', () => {
   it('should have default values', () => {
      const clock = new AlarmClock();
      expect(clock.minutes()).toBe(0);
      expect(clock.hours()).toBe(12);
      expect(clock.alarmHours()).toBe(6);
      expect(clock.alarmMinutes()).toBe(0);
   });

   it('should change state when click to mode', () => {
      const clock = new AlarmClock();
      expect(clock.isAlarmOn()).toBe(false);
      expect(clock.getCurrentMode()).toBe('clock');

      clock.clickMode();
      clock.tick();
      expect(clock.isAlarmOn()).toBe(false);
      expect(clock.getCurrentMode()).toBe('alarm');

      clock.clickMode();
      clock.tick();
      expect(clock.isAlarmOn()).toBe(false);
      expect(clock.getCurrentMode()).toBe('clock');

      clock.longClickMode();
      clock.tick();
      expect(clock.isAlarmOn()).toBe(true);
      expect(clock.getCurrentMode()).toBe('clock');

      clock.clickMode();
      clock.tick();
      expect(clock.isAlarmOn()).toBe(true);
      expect(clock.getCurrentMode()).toBe('alarm');

      clock.clickMode();
      clock.tick();
      expect(clock.isAlarmOn()).toBe(true);
      expect(clock.getCurrentMode()).toBe('clock');

      clock.longClickMode();
      expect(clock.isAlarmOn()).toBe(false);
      expect(clock.getCurrentMode()).toBe('clock');
   });
});