module.exports = (api) => {
  const config = {
    presets: [
      [
        '@babel/preset-env',
        { targets: { node: 'current' } },
      ],
      '@babel/preset-react',
    ],
  };

  if (api.env() === 'production') {
    config.plugins = [
      [
        'react-remove-properties', {
          properties: ['data-testid'],
        },
      ],
    ];
  }
  return config;
};
