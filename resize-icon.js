const sharp = require('sharp');

sharp('./assets/icon.png')
  .resize(1024, 1024, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  })
  .toFile('./assets/icon-resized.png')
  .then(info => { console.log('Image resized successfully:', info); })
  .catch(err => { console.error('An error occurred:', err); });