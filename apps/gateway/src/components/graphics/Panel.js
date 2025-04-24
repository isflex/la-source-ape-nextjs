import React from 'react';
import * as motion from 'motion/react-client';
// import { stagger } from 'motion'
// import classNames from 'classnames';
// import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';
// import { default as stylesPage } from '@src/styles/scss/pages/about.module.scss';

const styles = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  overflow: 'visible',
  // border: '1px solid aquamarine',
};

export default class Panel extends React.Component {
  shouldComponentUpdate(prevProps) {
    return (
      prevProps.bounds !== this.props.bounds ||
      prevProps.path !== this.props.path ||
      prevProps.pathIds !== this.props.pathIds ||
      prevProps.showMatte !== this.props.showMatte ||
      prevProps.mode !== this.props.mode
    );
  }

  render() {
    const id = this.props.id;
    const preserveAspectRatio = this.props.preserveAspectRatio || 'none';
    const bounds = this.props.bounds;
    const viewbox = this.props.viewbox;
    const strokeSize = this.props.strokeSize;
    const scale = this.props.scale;
    const offset = this.props.offset;
    const ratio = this.props.ratio;

    return (
      <svg
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
        style={styles}
        width="100%" height="100%"
        // width={bounds.width}
        // height={bounds.height}
        // viewBox={`0 0 ${bounds.width} ${bounds.height}`}
        // viewBox={`0 0 ${bounds.width / scale} ${bounds.height / scale}`}
        // preserveAspectRatio={`${preserveAspectRatio}`}
        id={id}
      >

        {/* debugging : remove scale on #matteMain to visualize */}
        {this.props.showMatte && (
          <use href={`#matteMain-${this.props.mode}`} />
        )}

        <g
          id="spaghettiPaths"
          style={{
            scale: scale,
            // translate: `${offset.x}px ${offset.y}px`,
          }}
          {...(
            !this.props.showMatte ? {
              mask: `url(#maskMain-${this.props.mode})`
            } : null
          )}
        >
          {this.props.pathIds.map((id) => {
            const pathData = this.props.paths[id];
            if (!pathData) return null;
            const _color = pathData.color || 'black';
            const _duration = pathData.duration || 10;
            const transition = { duration: _duration, yoyo: Infinity, ease: 'easeInOut' }
            return (
              // <path
              //   key={id}
              //   id={id}
              //   vectorEffect='non-scaling-stroke'
              //   d={pathData.path}
              //   stroke={_color}
              //   strokeWidth={strokeSize}
              //   // style={{
              //   //   maskImage: `url(#maskMain)`,
              //   //   maskRepeat: 'no-repeat',
              //   //   maskSize: '100%',
              //   //   maskMode: 'alpha',
              //   //   maskPosition: 'center',
              //   //   maskClip: 'view-box, content-box, fill-box, stroke-box'
              //   // }}
              // />
              <motion.path
                d={pathData.path}
                fill='transparent'
                stroke={_color}
                strokeWidth={strokeSize}
                strokeLinecap='round'
                initial={{ pathLength: 0.001 }}
                animate={{ pathLength: 1 }}
                transition={transition}
                key={id}
                id={id}
                vectorEffect='non-scaling-stroke'
              />
            )
          })}
        </g>
      </svg>
    );
  }
}
