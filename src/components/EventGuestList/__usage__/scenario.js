import React from 'react'

import GuestList from '..'

const guests = {
  'friedger.id': {
    '@type': 'Person',
    '@context': 'http://schema.org',
    name: 'Friedger Müffke',
    description: 'Entredeveloper in Europe',
    image: [
      {
        '@type': 'ImageObject',
        name: 'avatar',
        contentUrl:
          'https://gaia.blockstack.org/hub/1Maw8BjWgj6MWrBCfupqQuWANthMhefb2v/0/avatar-0',
      },
    ],
    account: [
      {
        '@type': 'Account',
        placeholder: false,
        service: 'twitter',
        identifier: 'fmdroid',
        proofType: 'http',
        proofUrl: 'https://twitter.com/fmdroid/status/927285474854670338',
      },
      {
        '@type': 'Account',
        placeholder: false,
        service: 'facebook',
        identifier: 'friedger.mueffke',
        proofType: 'http',
        proofUrl:
          'https://www.facebook.com/friedger.mueffke/posts/10155370909214191',
      },
      {
        '@type': 'Account',
        placeholder: false,
        service: 'github',
        identifier: 'friedger',
        proofType: 'http',
        proofUrl:
          'https://gist.github.com/friedger/d789f7afd1aa0f23dd3f87eb40c2673e',
      },
      {
        '@type': 'Account',
        placeholder: false,
        service: 'bitcoin',
        identifier: '1MATdc1Xjen4GUYMhZW5nPxbou24bnWY1v',
        proofType: 'http',
        proofUrl: '',
      },
      {
        '@type': 'Account',
        placeholder: false,
        service: 'pgp',
        identifier: '5371148B3FC6B5542CADE04F279B3081B173CFD0',
        proofType: 'http',
        proofUrl: '',
      },
      {
        '@type': 'Account',
        placeholder: false,
        service: 'ethereum',
        identifier: '0x73274c046ae899b9e92EaAA1b145F0b5f497dd9a',
        proofType: 'http',
        proofUrl: '',
      },
    ],
    apps: {
      'https://app.graphitedocs.com':
        'https://gaia.blockstack.org/hub/17Qhy4ob8EyvScU6yiP6sBdkS2cvWT9FqE/',
      'https://www.stealthy.im':
        'https://gaia.blockstack.org/hub/1KyYJihfZUjYyevfPYJtCEB8UydxqQS67E/',
      'https://www.chat.hihermes.co':
        'https://gaia.blockstack.org/hub/1DbpoUCdEpyTaND5KbZTMU13nhNeDfVScD/',
      'https://app.travelstack.club':
        'https://gaia.blockstack.org/hub/1QK5n11Xn1p5aP74xy14NCcYPndHxnwN5y/',
      'https://app.afari.io':
        'https://gaia.blockstack.org/hub/1E4VQ7A4WVTSXu579xDH8SjJTonfEbR6kL/',
      'https://blockusign.co':
        'https://gaia.blockstack.org/hub/1Pom8K1nh3c3M6R5oHZMK5Y4p2s2386qVQ/',
      'https://blkbreakout.herokuapp.com':
        'https://gaia.blockstack.org/hub/1fE5AQaRGKBJVKBAT2DT28tazgsuwAhUp/',
      'https://kit.now.sh':
        'https://gaia.blockstack.org/hub/1GiyoGB1Rw8vDJEb3jwDRBeivWuSKL5b7u/',
      'http://localhost:3000':
        'https://gaia.blockstack.org/hub/1NRwke9GLbyKG5efbEqFEDgCJGVLoce9TL/',
      'http://localhost:3001':
        'https://gaia.blockstack.org/hub/1sRMsXZADgJD513aX1d7txPWDUw1H2wwd/',
      'https://planet.friedger.de':
        'https://gaia.blockstack.org/hub/1BnkJMbfEz2XDb5kSQtRureeXf91HjJ2x/',
      'http://127.0.0.1:3001':
        'https://gaia.blockstack.org/hub/1NrUHmxV2ABHTugfDCyEcJVdQUNxCt99Wy/',
      'https://animal-kingdom-1.firebaseapp.com':
        'https://gaia.blockstack.org/hub/1EEMu1HAH7Gfe8WiPUVaPyeQuMe6bX12Dj/',
      'https://gaia_admin.brightblock.org':
        'https://gaia.blockstack.org/hub/19gWjknDbEkhQVKLqBnW1y4LpBnpripMnn/',
      'https://dpage.io':
        'https://gaia.blockstack.org/hub/1HdNyomWupHPP4YinrFbEKKezh5x9vRKnf/',
      'https://app.dappywallet.com':
        'https://gaia.blockstack.org/hub/1EEmaiiDZrCKNmcQNGNHkRGN7pstUZTzfV/',
      'https://animalkingdoms.netlify.com':
        'https://gaia.blockstack.org/hub/1G3SNwnaNWFpoNyz4Jzo2avKS49W33rU8y/',
      'https://ourtopia.co':
        'https://gaia.blockstack.org/hub/1DS1SeRyK1EVigp6V8g9jCFMFQGHvWEkVL/',
      'http://localhost:8080':
        'https://gaia.blockstack.org/hub/1GApfxNVsCqvUPoMQxZXv2Yz8ZuHKNXc6r/',
      'http://127.0.0.1:8080':
        'https://gaia.blockstack.org/hub/1EeKHp5xwfBGrdWLHyRm2RhQKiw5kVQSaj/',
      'https://chat.openintents.org':
        'https://gaia.blockstack.org/hub/18zdPLrtyxzE8ArXw6Ne3E84GpZQPWAkwo/',
      'https://humans.name':
        'https://gaia.blockstack.org/hub/1Bhexe6K4viWyUqR9VQEUPPo8xjpf4YjB5/',
      'http://127.0.0.1:3000':
        'https://gaia.blockstack.org/hub/1LBwEcxjmPVfZeNGY7pYysfZ4TNab2cxs/',
      'https://upbeat-wing-158214.netlify.com':
        'https://gaia.blockstack.org/hub/1GEswKnyPW7E2Z9uxjxUndAkFf6HYYX3v5/',
      'https://cal.openintents.org':
        'https://gaia.blockstack.org/hub/14nFNe9opru28Deoy5aB297kgLM3jkNmwF/',
      'https://debutapp.social':
        'https://gaia.blockstack.org/hub/1EokUib85GvmHu3xewYtBWLNiemSKJAiKR/',
      'https://oi-timesheet.com':
        'https://gaia.blockstack.org/hub/1KjTySPCicoTHA1SwRch3n6iZCK1oJyu9m/',
    },
    api: {
      gaiaHubConfig: { url_prefix: 'https://gaia.blockstack.org/hub/' },
      gaiaHubUrl: 'https://hub.blockstack.org',
    },
  },
}

const Scenario = () => {
  return (
    <div>
      <GuestList guests={guests} />
    </div>
  )
}

export default Scenario
