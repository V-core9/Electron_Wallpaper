// Adding a custom String(str).reverse() method
String.prototype.reverse = function () {
  try {
    return this.split('').reverse().join('')
  } catch (err) {
    return err.message
  }
}

export {}
