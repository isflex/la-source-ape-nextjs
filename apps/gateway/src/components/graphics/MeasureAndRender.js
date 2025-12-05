
'use client'

/**
 * Measure's the element's bounding box and then renders children
 */
import React from 'react';
import debounce from 'debounce';

class MeasureAndRender extends React.Component {
  state = {
    measurement: null,
    hasMeasured: false
  };

  onWindowResize = debounce(() => {
    this.setState({
      measurement: this.el.getBoundingClientRect()
    });
  }, this.props.debounce || 100);

  componentDidMount() {
    this.setState({
      measurement: this.el.getBoundingClientRect(),
      hasMeasured: true
    });
    if (typeof window !== 'undefined') window.addEventListener('resize', this.onWindowResize);
  }

  componentWillUnmount() {
    // stop listening to window resize
    if (typeof window !== 'undefined') window.removeEventListener('resize', this.onWindowResize);
  }

  render() {
    // eslint-disable-next-line prefer-const
    let style = {};
    if (this.props.stretch) {
      style.position = 'absolute';
      style.top = 0;
      style.right = 0;
      style.bottom = 0;
      style.left = 0;
    }

    return (
      <div
        style={style}
        ref={node => {
          this.el = node;
        }}
      >
        {this.state.hasMeasured && this.props.children(this.state.measurement)}
      </div>
    );
  }
}

export default MeasureAndRender;
