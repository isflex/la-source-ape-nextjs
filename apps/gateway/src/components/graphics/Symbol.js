import React from 'react';

const styles = {
  width: '100%',
  height: '100%',
  position: 'absolute'
};

const useViewBox = true

export default class Symbol extends React.Component {
  shouldComponentUpdate(prevProps) {
    return (
      prevProps.bounds !== this.props.bounds ||
      prevProps.path !== this.props.path
    );
  }

  render() {
    const id = this.props.id;
    const preserveAspectRatio = this.props.preserveAspectRatio || 'none';
    const bounds = this.props.bounds;
    const viewbox = this.props.viewbox;
    const strokeSize = this.props.strokeSize;
    const scale = this.props.scale;
    const color = this.props.color;
    const offset = this.props.offset;

    return (
      <svg style={styles} width='100%' height='100%' version='1.1' xmlns='http://www.w3.org/2000/svg'>
        <defs>
          <symbol id={id}
            {...(
              useViewBox ? {
                width: viewbox.width,
                height: viewbox.height,
                viewBox: `0 0 ${viewbox.width} ${viewbox.height}`

                // width: viewbox.width / scale,
                // height: viewbox.height,
                // viewBox: `0 0 ${viewbox.width / scale} ${viewbox.height}`
              } : {
                // width: bounds.width / scale,
                // height: bounds.height / scale,
                // viewBox: `0 0 ${bounds.width / scale} ${bounds.height / scale}`

                // width: bounds.width * scale,
                // height: bounds.height * scale,
                // viewBox: `0 0 ${bounds.width * scale} ${bounds.height * scale}`

                // width: bounds.width * bounds.width / viewbox.width,
                // height: bounds.height,
                // viewBox: `0 0 ${bounds.width * bounds.width / viewbox.width} ${bounds.height}`

                width: bounds.width,
                height: bounds.height,
                viewBox: `0 0 ${bounds.width} ${bounds.height}`
              }
            )}
            preserveAspectRatio={`${preserveAspectRatio}`} fill='none'
          >
            <path
              vectorEffect='non-scaling-stroke'
              d={this.props.path}
              stroke={color}
              strokeWidth={strokeSize}
              fill='none'
              fillRule='evenodd'
            />
          </symbol>
        </defs>
        <use href={`#${id}`}
          x='0' y='0'
          // x={offset.x} y={offset.y}
          width='100%' height='100%'
          // width='100%' height='680'
          // width={bounds.width} height={bounds.height}
          // width={bounds.width} height='680'
          style={{
            // translate: `-${(125 - strokeSize - 2) * 1.75}px 0`,
            // border: '1px solid aquamarine',
          }}
        />
      </svg>
    );
  }
}
