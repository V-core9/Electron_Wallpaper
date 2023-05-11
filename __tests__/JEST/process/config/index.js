const cfg = require('../../../../src/process/config')

test('Config -> debug', async () => {
  //* Get Pre
  expect(await cfg.get('debug')).toBe(false)
  //! BAD Set
  expect(await cfg.set('debug', 111)).toBe(false)
  //? Good Set
  expect(await cfg.set('debug', true)).toBe(true)
  //* Get after
  expect(await cfg.get('debug')).toBe(true)
})

test('Config -> title', async () => {
  //* Get Pre
  expect(await cfg.get('title')).toBe('Electron Wallpaper')
  //! BAD Set
  expect(await cfg.set('title', 1111)).toBe(false)
  //? Good Set
  expect(await cfg.set('title', 'Test')).toBe(true)
  //* Get after
  expect(await cfg.get('title')).toBe('Test')
})

test('Config -> accessibleTitle', async () => {
  //* Get Pre
  expect(await cfg.get('accessibleTitle')).toBe('Electron Wallpaper')
  //! BAD Set
  expect(await cfg.set('accessibleTitle', 1111)).toBe(false)
  //? Good Set
  expect(await cfg.set('accessibleTitle', 'Test')).toBe(true)
  //* Get after
  expect(await cfg.get('accessibleTitle')).toBe('Test')
})

test('Config -> weatherApiKey', async () => {
  //* Get Pre
  expect(await cfg.get('weatherApiKey')).toBe(null)
  //! BAD Set
  expect(await cfg.set('weatherApiKey', '1111')).toBe(false)
  //? Good Set
  expect(
    await cfg.set('weatherApiKey', '1111asdasdw1232121111asdasdw1232')
  ).toBe(true)
  //* Get after
  expect(await cfg.get('weatherApiKey')).toBe(
    '1111asdasdw1232121111asdasdw1232'
  )
})

test('Config -> maximized', async () => {
  //* Get Pre
  expect(await cfg.get('maximized')).toBe(false)
  //! BAD Set
  expect(await cfg.set('maximized', 111)).toBe(false)
  //? Good Set
  expect(await cfg.set('maximized', true)).toBe(true)
  //* Get after
  expect(await cfg.get('maximized')).toBe(true)
})

test('Config -> mSet', async () => {
  //* Set
  expect(await cfg.set('maximized', true)).toBe(true)
  expect(await cfg.set('debug', true)).toBe(true)
  //* Get
  expect(await cfg.get('maximized')).toBe(true)
  expect(await cfg.get('debug')).toBe(true)

  //? Good Set
  expect(
    await cfg.mSet({ maximized: false, debug: false, title: 'Yea Title' })
  ).toBe(undefined)
  //* Get after
  expect(await cfg.get('maximized')).toBe(false)
  expect(await cfg.get('debug')).toBe(false)
  expect(await cfg.get('title')).toBe('Yea Title')
})
