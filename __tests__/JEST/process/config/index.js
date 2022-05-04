const cfg = require('../../../../src/process/config');

test('base 01', async () => {
  //* Getting Pre
  expect(await cfg.get('debug')).toBe(false);
  expect(await cfg.get('title')).toBe("Electron Wallpaper");
  expect(await cfg.get('accessibleTitle')).toBe("Electron Wallpaper");
  expect(await cfg.get('weatherApiKey')).toBe(null);

  //! BAD Setters
  expect(await cfg.set('debug', 111)).toBe(false);
  expect(await cfg.set('title', 1111)).toBe(false);
  expect(await cfg.set('accessibleTitle', 1111)).toBe(false);
  expect(await cfg.set('weatherApiKey', "1111")).toBe(false);

  //? Good Setters
  expect(await cfg.set('debug', true)).toBe(true);
  expect(await cfg.set('title', 'Test')).toBe(true);
  expect(await cfg.set('accessibleTitle', 'Test')).toBe(true);
  expect(await cfg.set('weatherApiKey', '1111asdasdw1232121111asdasdw1232')).toBe(true);

  //* Getting after
  expect(await cfg.get('debug')).toBe(true);
  expect(await cfg.get('title')).toBe("Test");
  expect(await cfg.get('accessibleTitle')).toBe("Test");
  expect(await cfg.get('weatherApiKey')).toBe('1111asdasdw1232121111asdasdw1232');
});