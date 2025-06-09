jest.mock('react-native', () => {
  const React = require('react');
  return {
    View: ({ children, ...props }) => React.createElement('View', props, children),
    StyleSheet: { create: s => s },
  };
});
