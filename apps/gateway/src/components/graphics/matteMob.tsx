import React from 'react'
// import { observer } from 'mobx-react-lite'
// import classNames from 'classnames';
// import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';
// import { default as stylesPage } from '@src/styles/scss/pages/about.module.scss';

// https://gist.github.com/mikebridge/b1d4f195dfa7b6fc8f0ae31682c8fcf8

interface IComponentProps {
  bounds: Record<string, number>
  ratio: number
  showMatte: boolean
}

export default class Matte extends React.Component<IComponentProps> {
  shouldComponentUpdate(prevProps: IComponentProps) {
    return (
      prevProps.bounds !== this.props.bounds
    );
  }

  render() {
    const bounds = this.props.bounds;

    return (
      <svg
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'
        // style={styles}
        // width="100%" height="100%"
        width={bounds.width}
        height={bounds.height}
        viewBox={`0 0 ${bounds.width} ${bounds.height}`}
        style={{
          position: 'absolute',
          overflow: 'visible',
        }}
      >
        <defs>
          <radialGradient id="radialGradient1">
            <stop offset="35%" stopColor="#000" />
            <stop offset="65%" stopColor="#3a3a3a" />
            <stop offset="95%" stopColor="#fff" />
          </radialGradient>
          <radialGradient id="radialGradient2">
            <stop offset="45%" stopColor="#3a3a3a" />
            <stop offset="95%" stopColor="#fff" />
          </radialGradient>
          <clipPath id="clipPathMainMob" clipPathUnits="userSpaceOnUse">
            <path
              id="matteGreen"
              d={
                `
                  M${0} ${bounds.height}
                  L${0} ${bounds.height - 40}
                  ${150} ${bounds.height - 40}
                  ${150} ${bounds.height}
                  ${0} ${bounds.height}
                  Z
                `
              }
              fill="#000"
              style={{
                translate: 'calc(50% / 2 - 72.5px) -55px'
              }}
            />
            <path
              id="matteBlue"
              d={
                `
                  M${0} ${bounds.height}
                  L${0} ${bounds.height - 40}
                  ${130} ${bounds.height - 40}
                  ${130} ${bounds.height}
                  ${0} ${bounds.height}
                  Z
                `
              }
              fill="#000"
              style={{
                translate: 'calc(50% + (25% - 70px)) -55px'
              }}
            />
            <path
              id="matteYellow"
              d={
                `
                  M${0} ${bounds.height}
                  L${0} ${bounds.height - 40}
                  ${180} ${bounds.height - 40}
                  ${180} ${bounds.height}
                  ${0} ${bounds.height}
                  Z
                `
              }
              fill="#000"
              style={{
                translate: 'calc(50% / 2 - 85px) -6px'
              }}
            />
            <path
              id="matteRed"
              d={
                `
                  M${0} ${bounds.height}
                  L${0} ${bounds.height - 40}
                  ${190} ${bounds.height - 40}
                  ${190} ${bounds.height}
                  ${0} ${bounds.height}
                  Z
                `
              }
              fill="#000"
              style={{
                translate: 'calc(50% + (25% - 99px)) -6px'
              }}
            />
          </clipPath>

          <mask id="maskMain-mob" maskContentUnits="userSpaceOnUse">
            <g id="matteMain-mob"
              style={{
                ...(!this.props.showMatte && {
                  scale: this.props.ratio
                }),
              }}
            >
              <rect
                x="-10" y="-10"
                width={`calc(${bounds.width}px + 20px)`} height={`calc(${bounds.height}px + 45px)`}
                fill="#fff" fillOpacity={1}
              />
              <rect
                x="-10" y="-10"
                width={`calc(${bounds.width}px + 20px)`} height={`calc(${bounds.height}px + 45px)`}
                fill="#000" fillOpacity={1}
                clipPath="url(#clipPathMainMob)"
              />
              {/* <ellipse cx="50%" cy="calc(50% - 13.5%)" rx="60%" ry="15%" fill="url('#radialGradient1')" /> */}
            </g>
          </mask>
        </defs>
      </svg>
    )
  }
}
