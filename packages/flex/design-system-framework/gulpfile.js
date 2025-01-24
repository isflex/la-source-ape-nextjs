/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-unused-vars */

const path = require('path')
const gulp = require('gulp')
const replace = require('gulp-replace')
const rename = require('gulp-rename')
const log = require('fancy-log')
// const { promisify } = require('util')
const {
  glob,
  // globSync,
} = require('glob')
const webfontsGenerator = require('@vusion/webfonts-generator')
const prefixCss = require('./gulp/namespace-css')
const concat = require('gulp-concat')

const paths = {
  src: {
    ui: 'src/assets/icon/ui/*.svg',
    picto: 'src/assets/icon/picto/*.svg',
    illustrations: 'src/assets/icon/illustrations/*.svg',
  },
  dest: {
    fonts: 'src/assets/fonts/',
    css: 'src/webfonts/',
    html: 'docs/partials/icons/',
  },
  templates: {
    html: {
      default: 'src/assets/html-template.hbs'
    },
    css: {
      default: 'src/assets/css-icon-template.hbs'
    }
  }
}

function contentUrlFonts () {
  return gulp.src('src/assets/_fonts.template.scss')
    .pipe(replace(/---PATH-REPLACE---/g, ''))
    // .pipe(replace(/---PATH-REPLACE---/g, '../../../../../../../apps/gateway/public'))
    // .pipe(replace(/---PATH-REPLACE---/g, `${process.env.FLEX_PROJ_ROOT}/apps/gateway/public`))
    // .pipe(replace(/---PATH-REPLACE---/g, `${path.resolve(__dirname, '../../../../../../../apps/gateway/public')}`))
    .pipe(replace(/---URL-REPLACE---/g, `${process.env.FLEX_MODFED_DEPLOYED_REMOTE_HOSTNAME}:${process.env.FLEX_CONTENT_PORT}`))
    .pipe(rename('_fonts.scss'))
    .pipe(gulp.dest('src/modules3/primatifs/base/'))
}

function contentUrlMixins () {
  return gulp.src('src/assets/_mixins.template.scss')
    .pipe(replace(/---URL-REPLACE---/g, `${process.env.FLEX_MODFED_DEPLOYED_REMOTE_HOSTNAME}:${process.env.FLEX_CONTENT_PORT}`))
    .pipe(rename('_mixins.scss'))
    .pipe(gulp.dest('src/modules3/primatifs/utilities/mixins/'))
}

function contentUrlProgressBar () {
  return gulp.src('src/assets/_radial-progress-bar.template.scss')
    .pipe(replace(/---URL-REPLACE---/g, `${process.env.FLEX_MODFED_DEPLOYED_REMOTE_HOSTNAME}:${process.env.FLEX_CONTENT_PORT}`))
    .pipe(rename('_radial-progress-bar.scss'))
    .pipe(gulp.dest('src/modules3/primatifs/components/'))
}

gulp.task('content-fonts', gulp.series(contentUrlFonts, contentUrlMixins, contentUrlProgressBar))

async function generateWebfont({ name, fileName, source, fontWeight, codepoints, cssTemplate, htmlTemplate, classPrefix, baseSelector }) {
  try {
    const fontName = `${fileName || `flexi-${name}`}`
    // console.log('process        : ', process.cwd())
    return webfontsGenerator({
      files: await glob(getAbsPath(source)),
      // files: globSync(getAbsPath(source)),
      dest: paths.dest.fonts,
      fontName,
      templateOptions: {
        classPrefix,
        baseSelector,
        fontWeight: fontWeight || 'normal',
        // src: `url('${process.env.FLEX_MODFED_DEPLOYED_REMOTE_HOSTNAME}:${process.env.FLEX_CONTENT_PORT}/assets/fonts/${fontName}.woff2') format('woff2'), url('${process.env.FLEX_MODFED_DEPLOYED_REMOTE_HOSTNAME}:${process.env.FLEX_CONTENT_PORT}/assets/fonts/${fontName}.woff') format('woff')`
        src: `url('/assets/fonts/${fontName}.woff2') format('woff2'), url('/assets/fonts/${fontName}.woff') format('woff')`
        // src: `url('../../../../../apps/gateway/public/assets/fonts/${fontName}.woff2') format('woff2'), url('../../../../../apps/gateway/public/assets/fonts/${fontName}.woff') format('woff')`
        // src: `url('${process.env.FLEX_PROJ_ROOT}/apps/gateway/public/assets/fonts/${fontName}.woff2') format('woff2'), url('${process.env.FLEX_PROJ_ROOT}/apps/gateway/public/assets/fonts/${fontName}.woff') format('woff')`
        // src: `url('${path.resolve(__dirname, `../../../../../apps/gateway/public/assets/fonts/${fontName}.woff2`)}') format('woff2'), url('${path.resolve(__dirname, `../../../../../apps/gateway/public/assets/fonts/${fontName}.woff`)}') format('woff')`

        // src: `
        //   url('${process.env.FLEX_MODFED_DEPLOYED_REMOTE_HOSTNAME}:${process.env.FLEX_CONTENT_PORT}/assets/fonts/${fontName}.woff2') format('woff2'),
        //   url('${process.env.FLEX_MODFED_DEPLOYED_REMOTE_HOSTNAME}:${process.env.FLEX_CONTENT_PORT}/assets/fonts/${fontName}.woff') format('woff')
        // `

        // src: `
        //   url('../../../../../apps/gateway/public/assets/fonts/${fontName}.woff2') format('woff2'),
        //   url('../../../../../apps/gateway/public/assets/fonts/${fontName}.woff') format('woff'),
        //   url('${process.env.FLEX_MODFED_DEPLOYED_REMOTE_HOSTNAME}:${process.env.FLEX_CONTENT_PORT}/assets/fonts/${fontName}.woff2') format('woff2'),
        //   url('${process.env.FLEX_MODFED_DEPLOYED_REMOTE_HOSTNAME}:${process.env.FLEX_CONTENT_PORT}/assets/fonts/${fontName}.woff') format('woff')
        // `
      },
      codepoints,
      cssTemplate: getAbsPath(paths.templates.css.default),
      cssDest: path.join(paths.dest.css, `${name}.scss`),
      html: false,
      htmlTemplate: getAbsPath(paths.templates.html.default),
      htmlDest: path.join(paths.dest.html, `${name}.hbs`),
      types: ['woff2', 'woff'],
      order: ['woff2', 'woff']
    }, function(error) {
      if (error) {
        log.error('Fail!', error)
      } else {
        log.error('Done!')
      }
    })
  } catch (err) {
    // gutil.log('Could not generate webfont', name, err)
    log.error('Could not generate webfont', name, err)
  }
}

/**
 * This tasks generates illustrations icons webfonts
 */
gulp.task('icons-illustrations-webfonts', async () => {
  return generateWebfont({
    name: `all`,
    source: paths.src.illustrations,
    classPrefix: 'flexi-webfont-',
    // classPrefix: 'flexiWebfont',
    baseSelector: '.flexi-webfont',
    fileName: 'flexi-all'
  })
})

/**
 * This tasks generates UI icons webfonts
 */
gulp.task('icons-ui-webfonts', async () => {
  return generateWebfont({
    name: 'ui',
    source: paths.src.ui,
    classPrefix: 'flexi-webfont-ui-',
    // classPrefix: 'flexiWebfontUi',
    baseSelector: '.flexi-webfont-ui',
    fileName: 'flexi-ui',
    codepoints: {
      // we fix this icon, to be used in `utilities/_mixins.scss` in the `arrow` mixin
      // which needs a very specific codepoint to address this particular icon.
      'arrow-down': 0xf101,
      check: 0xf102,
      'times-r': 0xf103,
      plus: 0xf104,
      'arrow-up': 0xf105,
      logo: 0xf106,
      'arrow-right': 0xf107,
      'arrow-left': 0xf108
    }
  })
})

/**
 * This tasks generates picto icons webfonts
 * Cette task n'est utile que pour assurer la génération de la police
 * Les classes CSS doivent être ajoutées à la main dans src/elements/_icon.scss
 */
gulp.task('icons-picto-webfonts', async () => {
  return generateWebfont({
    name: 'picto',
    source: paths.src.picto,
    // classPrefix: 'flexi-picto-',
    // baseSelector: '.flexi-picto',
    classPrefix: 'flexi-webfont-picto-',
    baseSelector: '.flexi-webfont-picto',
    fileName: 'flexi-picto',
  })
})

/**
 * This tasks generates all icon webfonts
 */
gulp.task('webfonts',
  gulp.series(
    'icons-ui-webfonts',
    'icons-picto-webfonts',
    'icons-illustrations-webfonts'
  )
)

gulp.task('namespace-css', async () => {
  // version namespacée
  return gulp.src('dist/flexiness-ds.css')
    .pipe(prefixCss('.is-flexiness'))
    .pipe(concat('flexiness-ds-namespaced.css'))
    .pipe(gulp.dest('dist/'))
})

// Helpers
function getAbsPath(relativePath) {
  const _path = path.join(process.cwd(), relativePath)
  // log.error(_path)
  return _path
}
