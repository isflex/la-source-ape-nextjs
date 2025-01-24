/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react'
import { observer } from 'mobx-react-lite'
import classNames from 'classnames'
import {BrowserRouter as Router } from 'react-router'
import {
  // Ussqdqf,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  ArrowDirection,
  AvatarDirection,
  Badge,
  Box,
  BoxContent,
  BoxFooter,
  BoxHeader,
  BoxMarkup,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonMarkup,
  Card,
  CardContent,
  CardImage,
  CardImageSize,
  Checkbox,
  Columns,
  ColumnsItem,
  Container,
  Disclaimer,
  DisclaimerItem,
  Divider,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Footer,
  FooterBody,
  FooterDesktop,
  FooterHeader,
  FooterMobile,
  FooterSub,
  FooterWrapper,
  Hero,
  ImageList,
  ImageListItem,
  ImageListVariant,
  Icon,
  IconColor,
  IconName,
  IconPosition,
  IconSize,
  IconStatus,
  IconStatusPosition,
  InfoBlock,
  InfoBlockAction,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus,
  Input,
  InputStatus,
  InputType,
  Link,
  List,
  ListIconStatus,
  ListItem,
  ListItemDescription,
  Menu,
  MenuItem,
  MenuScrolling,
  Modal,
  ModalMarkup,
  Navbar,
  NavbarAccordionItem,
  NavbarBrand,
  NavbarDivider,
  NavbarDropdown,
  NavbarDropdownSection,
  NavbarEnd,
  NavbarExtras,
  NavbarItem,
  NavbarItemMarkup,
  NavbarLink,
  NavbarLinks,
  NavbarMenu,
  NavbarStart,
  Notification,
  Options,
  OptionsItem,
  Pagination,
  Popover,
  PopoverArrowPosition,
  PopoverDirection,
  Price,
  PriceLevel,
  PriceVariant,
  PricingPlan,
  PricingPlanExtra,
  PricingPlanFooter,
  PricingPlanHeader,
  PricingPlanItem,
  PricingPlanItems,
  PricingPlanPrice,
  PricingPlanProduct,
  PricingTable,
  PricingTableExtra,
  ProductTour,
  Progress,
  ProgressItem,
  ProgressRadial,
  Radio,
  RowItem,
  Rows,
  Section,
  Select,
  SelectOption,
  Slice,
  SliceBody,
  SliceContent,
  SliceCta,
  SliceIcon,
  SliceImage,
  SliceList,
  Slider,
  SliderItem,
  Stepper,
  StepperStep,
  StepperStepMarkup,
  Sticker,
  StickerMarkup,
  SubMenuItem,
  Switch,
  Table,
  TableBody,
  TableHead,
  TableTd,
  TableTh,
  TableTr,
  Tabs,
  TabsItem,
  Tag,
  TagList,
  TagVariant,
  Text,
  Textarea,
  TextIconMarkup,
  TextLevel,
  TextMarkup,
  Tile,
  Timeline,
  TimelineContent,
  TimelineItem,
  TimelineMarker,
  Title,
  TitleLevel,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  ToolbarSpace,
  View,
  AlertState,
  BackgroundStyle,
  Loading,
  TypographyAlign,
  TypographyBold,
  TypographyColor,
  TypographyTransform,
  VariantState,
} from '@flex-design-system/react-ts/client-sync-styled-default'
// } from 'flex_design_system_react_ts_client'
// } from '../styled-default'
import { default as styles } from '@flex-design-system/framework'

import './style.css'

import {
  FlexGlobalThis,
  // UserInterfaceStore,
  // AppContextInterface,
  AppProps,
} from 'flexiness'

declare let globalThis: FlexGlobalThis
// const UIStore: UserInterfaceStore | undefined = globalThis.Flexiness?.domainApp?.UIStore

// let appContext: AppContextInterface | undefined
// ///////////////////////////////////////////////////////////////////////////

function formatMontant(value: string) {
  const tmpValue = value.replace(',', '.').replace(/[^0-9.]/g, '')
  const digits = tmpValue.split('.').filter((_, i) => i <= 1)
  let rightDigits = digits[1] || ''
  if (rightDigits.length > 2) rightDigits = rightDigits.substring(0, 2)
  return digits.join('.')
}

const App = observer((): React.JSX.Element => {
  // console.log('@flex-design-system/react-ts | Modules | Theme -', UIStore?.appContext.theme.palette.mode)
  // const themeMode: string = UIStore?.appContext.theme.palette.mode || 'light'

  const [valueTextInput, setValueTextInput] = React.useState<string | undefined>()
  const [testEvenement, setTestEvenement] = React.useState(false)
  const [skeleton, setSkeleton] = React.useState<boolean>(false)
  const Titles = [1, 2, 3, 4, 5, 6, 7].map((level) => (
    <Title key={level} level={level} skeleton={skeleton}>
      Mon super titre de niveau {level}
    </Title>
  ))

  const TitlesInverted = [1, 2, 3, 4, 5, 6, 7].map((level) => (
    <Title key={level} inverted level={level} skeleton={skeleton}>
      Mon super titre de niveau {level}
    </Title>
  ))

  const [sliceCheckone, setSliceCheckone] = React.useState(false)
  const [sliceChecktwo, setSliceChecktwo] = React.useState(false)
  const [sliceCheckthree, setSliceCheckthree] = React.useState(false)
  const [sliceCheckfour, setSliceCheckfour] = React.useState(false)

  const { host } = location
  const viewClasses = classNames(
    host === `localhost:7007` && 'presentation-composant',
    host === `localhost:7707` && 'presentation-composant',
    host === `localhost:4003` && 'flex-view',
    host === `localhost:4001` && 'flex-view',
    host === `localhost:3000` && 'flex-view',
  )

  const baseRowHeight = 121
  const [imageListVariant, setImageListVariant] = React.useState(ImageListVariant.QUILTED)
  interface ImageListData {
    img: string
    title: string
    author?: string
    rows?: number
    cols?: number
  }
  const imageListData: ImageListData[] = [
    {
      img: 'https://images.unsplash.com/photo-1549388604-817d15aa0110',
      title: 'Bed',
      rows: 2,
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1525097487452-6278ff080c31',
      title: 'Books',
    },
    {
      img: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
      title: 'Sink',
      rows: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
      title: 'Kitchen',
    },

    // ////////////////////////////////////////////////////////////////////

    {
      img: 'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3',
      title: 'Blinds',
    },
    {
      img: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
      title: 'Laptop',
    },
    {
      img: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
      title: 'Storage',
      rows: 2,
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
      title: 'Candle',
    },
    {
      img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
      title: 'Kitchen',
    },

    // ////////////////////////////////////////////////////////////////////

    {
      img: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
      title: 'Coffee',
      rows: 2,
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
      title: 'Laptop',
    },
    {
      img: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
      title: 'Doors',
      rows: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
      title: 'Sink',
    },

    // ////////////////////////////////////////////////////////////////////

    {
      img: 'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3',
      title: 'Blinds',
    },
    {
      img: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
      title: 'Laptop',
    },
    {
      img: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
      title: 'Storage',
      rows: 2,
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
      title: 'Candle',
    },
    {
      img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
      title: 'Kitchen',
    },

    // ////////////////////////////////////////////////////////////////////

    {
      img: 'https://images.unsplash.com/photo-1549388604-817d15aa0110',
      title: 'Bed',
      rows: 2,
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
      title: 'Laptop',
    },
    {
      img: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
      title: 'Doors',
      rows: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
      title: 'Sink',
    },

    // ////////////////////////////////////////////////////////////////////

    {
      img: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
      title: 'Storage',
    },
    {
      img: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
      title: 'Candle',
    },
    {
      img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
      title: 'Coffee table',
      rows: 2,
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1525097487452-6278ff080c31',
      title: 'Books',
    },
    {
      img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
      title: 'Kitchen',
    },

    // ////////////////////////////////////////////////////////////////////

    {
      img: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
      title: 'Coffee',
      rows: 2,
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1525097487452-6278ff080c31',
      title: 'Books',
    },
    {
      img: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
      title: 'Sink',
      rows: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
      title: 'Kitchen',
    },

    // ////////////////////////////////////////////////////////////////////

    {
      img: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
      title: 'Storage',
    },
    {
      img: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
      title: 'Candle',
    },
    {
      img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
      title: 'Coffee table',
      rows: 2,
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1525097487452-6278ff080c31',
      title: 'Books',
    },
    {
      img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
      title: 'Kitchen',
    },

    // ////////////////////////////////////////////////////////////////////

    {
      img: 'https://images.unsplash.com/photo-1549388604-817d15aa0110',
      title: 'Bed',
      rows: 2,
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1525097487452-6278ff080c31',
      title: 'Books',
    },
    {
      img: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
      title: 'Sink',
    },
    {
      img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
      title: 'Kitchen',
      cols: 2,
    },

    // ////////////////////////////////////////////////////////////////////

    {
      img: 'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3',
      title: 'Blinds',
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622',
      title: 'Chairs',
      rows: 2,
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
      title: 'Laptop',
    },
    {
      img: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
      title: 'Doors',
    },

    // ////////////////////////////////////////////////////////////////////

    {
      img: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
      title: 'Coffee',
      rows: 2,
      cols: 2,
    },
    {
      img: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
      title: 'Storage',
    },
    {
      img: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
      title: 'Candle',
    },
    {
      img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
      title: 'Coffee table',
      cols: 2,
    },
  ]

  const setSrc = (image: string, size: number, rows: number | undefined, cols: number | undefined, variant: string) => {
    const calulateSize = (size = baseRowHeight, axis = 1) => {
      return variant === `${ImageListVariant.QUILTED}` && axis !== undefined ? size * axis : size
    }

    switch (true) {
      case variant === `${ImageListVariant.STANDARD}`:
        return {
          src: `${image}?w=${calulateSize(size, cols)}&h=${calulateSize(size, rows)}&fit=crop&auto=format`,
          srcSet: `${image}?w=${calulateSize(size, cols)}&h=${calulateSize(size, rows)}&fit=crop&auto=format&dpr=2 2x`,
        }
      case variant === `${ImageListVariant.QUILTED}`:
        return {
          src: `${image}?w=${calulateSize(size, cols)}&h=${calulateSize(size, rows)}&fit=crop&auto=format`,
          srcSet: `${image}?w=${calulateSize(size, cols)}&h=${calulateSize(size, rows)}&fit=crop&auto=format&dpr=2 2x`,
        }
      case variant === `${ImageListVariant.MASONRY}`:
        return {
          src: `${image}?w=${calulateSize(size, cols)}&fit=crop&auto=format`,
          srcSet: `${image}?w=${calulateSize(size, cols)}&fit=crop&auto=format&dpr=2 2x`,
        }
      case variant === `${ImageListVariant.WOVEN}`:
        return {
          src: `${image}?w=${calulateSize(size, cols)}&fit=crop&auto=format`,
          srcSet: `${image}?w=${calulateSize(size, cols)}&fit=crop&auto=format&dpr=2 2x`,
        }
      default:
        return null
    }
  }

  const setGridArea = (axis: number | undefined, variant: string) => {
    return variant === `${ImageListVariant.QUILTED}` && axis !== undefined ? axis : 1
  }

  return (
    <View
      className={classNames(
        viewClasses,
        styles.flexinessRoot,
        // styles.isFullwidth,
        // styles.isFlex,
        // styles.isFlexDirectionColumn,
        // styles.isAlignItemsCenter,
        // styles.isJustifyContentSpaceBetween,
        // styles.hasTextWhite
      )}
      // data-flex-theme={themeMode}
    >
      {/*
       * ##############
       * TITRE
       * ##############
       */}
      <Section skeleton={skeleton}>
        <Title level={TitleLevel.LEVEL4}>Titres</Title>
        <Button onClick={() => setSkeleton(!skeleton)} classList={['is-secondary']}>
          {skeleton ? 'is-loading' : 'is-loaded'}
        </Button>
        <Divider />
        {Titles}

        <View
          className={classNames(
            styles.hasBackgroundTertiary,
            // themeMode === 'dark'
            //   ? styles.hasBackgroundWhite
            //   : styles.hasBackgroundTertiary
          )}
        >
          {TitlesInverted}
        </View>
      </Section>
      {/*
       * ##############
       * BOUTON
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Bouton</Title>
        <Divider />

        <Text level={TextLevel.LEVEL3}>Button with to props redirect : </Text>

        <div style={{ marginBottom: '10px' }} />

        <Button onClick={() => alert('Click on btn')} variant={VariantState.PRIMARY} markup={ButtonMarkup.BUTTON}>
          Button
        </Button>

        <div style={{ marginBottom: '10px' }} />

        <Button onClick={() => alert('Click on btn')} variant={VariantState.SECONDARY} markup={ButtonMarkup.BUTTON}>
          Button
        </Button>

        <div style={{ marginBottom: '10px' }} />

        <Button disabled onClick={() => alert('Click on btn')} variant={VariantState.SECONDARY} markup={ButtonMarkup.BUTTON}>
          Button
        </Button>

        <div style={{ marginBottom: '10px' }} />

        <Button small variant={VariantState.PRIMARY} markup={ButtonMarkup.BUTTON}>
          Button
        </Button>

        <div style={{ marginBottom: '10px' }} />

        <Button markup={ButtonMarkup.A} to={'/test'} variant={VariantState.PRIMARY}>
          Button Lien
        </Button>

        <div style={{ marginBottom: '10px' }} />

        <Button markup={ButtonMarkup.A} disabled to={'/test'} variant={VariantState.PRIMARY}>
          Button Lien disabled
        </Button>
      </Section>
      {/*
       * ##############
       * ACCORDION
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Accordion</Title>
        <Divider />

        <Accordion boxed>
          <AccordionItem id='UN' active={true}>
            <AccordionHeader toggle>Hello World 1</AccordionHeader>
            <AccordionBody>Lorem ipsum dolor sit amet</AccordionBody>
          </AccordionItem>
          <AccordionItem active={true} id='DEUX'>
            <AccordionHeader toggle>Hello World 2</AccordionHeader>
            <AccordionBody>Lorem ipsum dolor sit amet</AccordionBody>
          </AccordionItem>
          <AccordionItem id='TROIS'>
            <AccordionHeader toggle>Hello World 3</AccordionHeader>
            <AccordionBody>Lorem ipsum dolor sit amet</AccordionBody>
          </AccordionItem>
        </Accordion>
      </Section>
      {/*
       * ##############
       * TEXTE
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Texte</Title>
        <Divider />

        <Text level={TextLevel.LEVEL2} markup={TextMarkup.P}>
          Mon super text
        </Text>
      </Section>{' '}
      {/*
       * ##############
       * BOX
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Box</Title>
        <Button onClick={() => setSkeleton(!skeleton)} classList={['is-secondary']}>
          {skeleton ? 'is-loading' : 'is-loaded'}
        </Button>
        <Divider />
        <Box>Simple box - Lorem ipsum dolor sit amet, conseddvctetur adipiscing elit. Phasellus nec iaculis mauris.</Box>
        <Box
          onClick={() => {
            window.alert('Cliqué !')
          }}
        >
          Box Cliquable - Lorem ipsum dolor sit amet, conseddvctetur adipiscing elit. Phasellus nec iaculis mauris.
        </Box>
        <Box markup={BoxMarkup.A} to='https://google.fr'>
          {' '}
          Box Cliquable - Lorem ipsum dolor sit amet, conseddvctetur adipiscing elit. Phasellus nec iaculis mauris.
        </Box>

        <div style={{ marginTop: '15px' }} />

        <Box skeleton={skeleton}>
          <BoxHeader>Header content</BoxHeader>
          <BoxContent>
            <p>Lorem ipsum dolor sit amet, conseddvctetur adipiscing elit. Phasellus nec iaculis mauris.</p>
          </BoxContent>
          <BoxFooter>
            <p>Footer content</p>
          </BoxFooter>
        </Box>
      </Section>{' '}
      {/*
       * ##############
       * ICONE
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Icone</Title>
        <Divider />

        <Icon color={IconColor.WARNING} size={IconSize.LARGE} name={IconName.UI_STAR_S} />

        <Icon size={IconSize.LARGE} name={IconName.UI_4G} />

        <Icon circled size={IconSize.LARGE} name={IconName.UI_4G} />

        <Title level={TitleLevel.LEVEL4}>Icone avec texte et position</Title>
        <Divider />

        <Container>
          <div>
            <Text>Icon UP</Text>
            <Icon content='Input + text' size={IconSize.LARGE} position={IconPosition.UP} name={IconName.UI_4G} />
          </div>
          <Divider />
          <div>
            <Text>Icon DOWN</Text>
            <Icon content='Input + text' size={IconSize.LARGE} position={IconPosition.DOWN} name={IconName.UI_4G} />
          </div>
          <Divider />
          <div>
            <Text>Icon LEFT</Text>
            <Icon content='Input + text' size={IconSize.LARGE} position={IconPosition.LEFT} name={IconName.UI_4G} />
          </div>
          <Divider />
          <div>
            <Text>Icon RIGHT</Text>
            <Icon content='Input + text' size={IconSize.LARGE} position={IconPosition.RIGHT} name={IconName.UI_4G} />
          </div>

          <div>
            <Icon
              content={<Link href={'https://google.fr'}>My super link with href</Link>}
              size={IconSize.LARGE}
              position={IconPosition.LEFT}
              name={IconName.UI_4G}
            />
          </div>
        </Container>

        <Title level={TitleLevel.LEVEL4}>Icone avec status</Title>
        <Divider />

        <Icon statusPosition={IconStatusPosition.TOP} status={IconStatus.SUCCESS} size={IconSize.MEDIUM} name={IconName.FILE_EURO} />

        <Icon statusPosition={IconStatusPosition.BOTTOM} status={IconStatus.SUCCESS} size={IconSize.MEDIUM} name={IconName.FILE_EURO} />

        {/*
        <Title level={TitleLevel.LEVEL4}>Icone penchée</Title>
        <Divider />
        <Icon stretched size={IconSize.LARGE} name={IconName.UI_4G} />
        */}
      </Section>{' '}
      {/*
       * ##############
       * CHAMPS
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Champs</Title>
        <Divider />

        <Input
          hovered
          hasIcon
          defaultValue='My default input value'
          help='this is my help message'
          type={InputType.TEXT}
          status={InputStatus.SUCCESS}
          customIcon={IconName.UI_STAR}
          onIconClick={() => {
            window.alert('lol')
          }}
          placeholder='This is my placeholder'
        />

        <div style={{ marginBottom: '15px' }} />
        <Input
          hovered
          hasIcon
          forceControl
          defaultValue='12'
          value={valueTextInput}
          status={InputStatus.SUCCESS}
          customIcon={IconName.EUROS}
          onIconClick={() => {
            window.alert('lol')
          }}
          placeholder='Forced control formatted normal input'
          onChange={(e) => {
            setValueTextInput(formatMontant(e.inputValue))
          }}
        />

        <div style={{ marginBottom: '15px' }} />

        <Input
          hasIcon
          defaultValue='My 2nd default input value'
          help='this is my help message'
          type={InputType.TEXT}
          status={InputStatus.WARNING}
          customIcon={IconName.UI_STAR}
          placeholder='This is my placeholder'
        />

        <div style={{ marginBottom: '15px' }} />

        <form>
          <Input
            hasIcon
            help='this is my help message'
            type={InputType.PASSWORD}
            status={InputStatus.DANGER}
            // // customIcon={IconName.UI_EYE}
            placeholder='This is my placeholder'
          />
        </form>

        <div style={{ marginBottom: '15px' }} />

        <Input hasIcon search help='this is my help message' type={InputType.TEXT} placeholder='This is my placeholder' />
      </Section>{' '}
      {/*
       * ##############
       * TEXTAREA
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Textarea</Title>
        <Divider />

        <Textarea defaultValue='Default textarea text' placeholder='Textarea placeholder' />
      </Section>{' '}
      {/*
       * ##############
       * BARRE DE RECHERCHE
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Barre de recherche</Title>
        <Divider />

        <Input
          onKeyPress={(e) => console.log('search event press => ', e)}
          onKeyUp={(e) => console.log('search event up => ', e)}
          onIconClick={(e) => console.log('On icon click event => ', e)}
          onClick={(e) => console.log('On click inout search => ', e)}
          name='searchbar'
          hasIcon
          search
          type={InputType.TEXT}
          placeholder='Forfait, téléphones, fibre…'
        />
      </Section>{' '}
      {/*
       * ##############
       * STICKER
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Sticker</Title>
        <Divider />

        <Sticker variant={VariantState.PRIMARY}>Sticker</Sticker>

        <Sticker variant={VariantState.SECONDARY}>Sticker</Sticker>

        <Sticker variant={VariantState.TERTIARY}>Sticker</Sticker>
      </Section>{' '}
      <Section>
        <Sticker stretched variant={VariantState.PRIMARY}>
          Sticker
        </Sticker>

        <Sticker stretched variant={VariantState.SECONDARY}>
          Sticker
        </Sticker>

        <Sticker stretched variant={VariantState.PRIMARY}>
          Sticker
        </Sticker>
      </Section>{' '}
      {/*
       * ##############
       * COLONNES
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Colonnes</Title>
        <Divider />

        <Columns marginSize={3}>
          <ColumnsItem size={4}>
            <div style={{ border: '1px solid red' }}>Column #1</div>
          </ColumnsItem>
          <ColumnsItem size={4}>
            <div style={{ border: '1px solid red' }}>Column #2</div>
          </ColumnsItem>
          <ColumnsItem size={4}>
            <div style={{ border: '1px solid red' }}>Column #3</div>
          </ColumnsItem>
        </Columns>

        <Columns marginSize={3}>
          <ColumnsItem size={4}>
            <div style={{ border: '1px solid red' }}>Column #4</div>
          </ColumnsItem>
          <ColumnsItem size={4}>
            <div style={{ border: '1px solid red' }}>Column #5</div>
          </ColumnsItem>
          <ColumnsItem size={4}>
            <div style={{ border: '1px solid red' }}>Column #6</div>
          </ColumnsItem>
        </Columns>

        <Title level={TitleLevel.LEVEL4}>Colonnes responsive</Title>
        <Divider />

        <Columns mobile>
          <ColumnsItem desktopSize={2} tabletSize={2} mobileSize={6}>
            <div style={{ border: '1px solid red' }}>Column #1</div>
          </ColumnsItem>
          <ColumnsItem desktopSize={10} tabletSize={10} mobileSize={6}>
            <div style={{ border: '1px solid red' }}>Column #2</div>
          </ColumnsItem>
        </Columns>
      </Section>{' '}
      {/*
       * ##############
       * SEPARETEUR
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Separateur</Title>
        <Divider />

        <Divider content='+' />
      </Section>{' '}
      {/*
       * ##############
       * TAGS
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Tags</Title>
        <Divider />

        <Tag onClick={() => alert('test')} variant={TagVariant.DANGER}>
          Tag danger
        </Tag>

        <Tag onClick={() => alert('test')} variant={TagVariant.SUCCESS}>
          Tag success
        </Tag>

        <Tag onClick={() => alert('test')} variant={TagVariant.WARNING}>
          Tag warning
        </Tag>

        <Tag variant={TagVariant.SECONDARY}>Tag secondaire</Tag>

        <Title level={TitleLevel.LEVEL4}>Tag supprimable</Title>
        <Divider />

        <Tag deletable onClick={() => alert('Tag action')} variant={TagVariant.SECONDARY}>
          Tag supprimable
        </Tag>
      </Section>{' '}
      {/*
       * ##############
       * TAG LIST
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Tag avec liste</Title>
        <Divider />

        <p>Avec liste</p>
        <TagList>
          <Tag variant={TagVariant.DANGER}>Tag danger</Tag>
          <Tag variant={TagVariant.SECONDARY}>Tag secondaire</Tag>
          <Tag variant={TagVariant.SUCCESS}>Tag success</Tag>
          <Tag variant={TagVariant.WARNING}>Tag warning</Tag>

          <Tag deletable onClick={() => alert('Tag action')} variant={TagVariant.SECONDARY}>
            Tag supprimable
          </Tag>
        </TagList>
      </Section>{' '}
      {/*
       * ##############
       * FIL ARIANE
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Fil ariane</Title>
        <Divider />

        <Breadcrumb>
          <BreadcrumbItem href='https://google.fr'>Parent</BreadcrumbItem>
          <BreadcrumbItem>Parent</BreadcrumbItem>
          <BreadcrumbItem active>Page en cours</BreadcrumbItem>
        </Breadcrumb>
      </Section>{' '}
      {/*
       * ##############
       * ETAPES
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Etapes</Title>
        <Divider />

        <Stepper centered>
          <StepperStep markup={StepperStepMarkup.DIV} done label='Dossier' step={1} />
          <StepperStep markup={StepperStepMarkup.DIV} done label='Ouverture' step={2} />
          <StepperStep active current label='Intervention' step={3} />
          <StepperStep label='Cloture' step={4} />
        </Stepper>
      </Section>{' '}
      {/*
       * ##############
       * SLIDER
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Slider</Title>
        <Divider />
        <Slider className={classNames(styles.showMore)}>
          <SliderItem>
            <div className={classNames(styles.card, styles.isHorizontal)}>
              <div className={styles.cardImage}>
                <figure className={classNames(styles.image, 'is-4by3')}>
                  <img alt='Placeholder' src='https://i.etsystatic.com/10951167/r/il/df66c4/1860902191/il_570xN.1860902191_kuoj.jpg' />
                </figure>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.rows}>
                  <div className={styles.row}>
                    <p className={styles.suptitle}>Subtitle</p>
                    <h3 className={classNames(styles.title, styles.is3)}>Title lorem 1</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ligula ex, aliquam at neque eu, vulputate vera.</p>
                  </div>
                  <div className={classNames(styles.row, styles.isNarrow)}>
                    <button className={classNames(styles.button, styles.isPrimary)}>Button Lorem</button>
                  </div>
                </div>
              </div>
            </div>
          </SliderItem>
          <SliderItem>
            <div className={classNames(styles.card, styles.isHorizontal)}>
              <div className={styles.cardImage}>
                <figure className={classNames(styles.image, 'is-4by3')}>
                  <img alt='Placeholder' src='https://i.etsystatic.com/10951167/r/il/df66c4/1860902191/il_570xN.1860902191_kuoj.jpg' />
                </figure>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.rows}>
                  <div className={styles.row}>
                    <p className={styles.suptitle}>Subtitle</p>
                    <h3 className={classNames(styles.title, styles.is3)}>Title lorem 2</h3>
                    <p>Sed justo sem, tempor nec felis sit amet, pretium finibus sem. Suspendisse eu elit quis mauris rutrum condimentum.</p>
                  </div>
                  <div className={classNames(styles.row, styles.isNarrow)}>
                    <button className={classNames(styles.button, styles.isPrimary)}>Button Lorem</button>
                  </div>
                </div>
              </div>
            </div>
          </SliderItem>
          <SliderItem>
            <div className={classNames(styles.card, styles.isHorizontal)}>
              <div className={styles.cardImage}>
                <figure className={classNames(styles.image, 'is-4by3')}>
                  <img alt='Placeholder' src='https://i.etsystatic.com/10951167/r/il/df66c4/1860902191/il_570xN.1860902191_kuoj.jpg' />
                </figure>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.rows}>
                  <div className={styles.row}>
                    <p className={styles.suptitle}>Subtitle</p>
                    <h3 className={classNames(styles.title, styles.is3)}>Title lorem 3</h3>
                    <p>Vivamus eleifend libero sit amet volutpat ornare. Donec laoreet est vitae dolor rutrum ullamcorper.</p>
                  </div>
                  <div className={classNames(styles.row, styles.isNarrow)}>
                    <button className={classNames(styles.button, styles.isPrimary)}>Button Lorem</button>
                  </div>
                </div>
              </div>
            </div>
          </SliderItem>
        </Slider>
      </Section>{' '}
      {/*
       * ##############
       * INFO BLOCK
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Info block</Title>
        <Divider />
        <InfoBlock boxed>
          <InfoBlockHeader status={InfoBlockStatus.WARNING}>
            <Title level={TitleLevel.LEVEL2}>Une erreur est survenue</Title>
            {/* <div>Une erreur est survenue</div> */}
            {/* Une erreur est survenue */}
          </InfoBlockHeader>
          <InfoBlockContent>
            <Text>La page à laquelle vous essayez accéder est momentanément indisponible</Text>
            <Text>Veuillez réessayer ultérieurement</Text>
          </InfoBlockContent>
          <InfoBlockAction>
            <Button variant={VariantState.PRIMARY} onClick={() => alert('test')}>
              Button
            </Button>
          </InfoBlockAction>
        </InfoBlock>
      </Section>{' '}
      {/*
       * ##############
       * IMAGE LIST
       * ##############
       */}
      {/* https://mui.com/material-ui/react-image-list/ */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Image List</Title>
        <Divider />
        <Container fluid className={styles.isPaddingless}>
          <Columns marginSize={3}>
            <ColumnsItem size={3}>
              <Radio
                label={`${ImageListVariant.STANDARD}`}
                name='imageList'
                value={`${ImageListVariant.STANDARD}`}
                id={`imageList-${ImageListVariant.STANDARD}`}
                onClick={() => setImageListVariant(ImageListVariant.STANDARD)}
                checked={imageListVariant === ImageListVariant.STANDARD}
              />
            </ColumnsItem>
            <ColumnsItem size={3}>
              <Radio
                label={`${ImageListVariant.QUILTED}`}
                name='imageList'
                value={`${ImageListVariant.QUILTED}`}
                id={`imageList-${ImageListVariant.QUILTED}`}
                onClick={() => setImageListVariant(ImageListVariant.QUILTED)}
                checked={imageListVariant === ImageListVariant.QUILTED}
              />
            </ColumnsItem>
            <ColumnsItem size={3}>
              <Radio
                label={`${ImageListVariant.MASONRY}`}
                name='imageList'
                value={`${ImageListVariant.MASONRY}`}
                id={`imageList-${ImageListVariant.MASONRY}`}
                onClick={() => setImageListVariant(ImageListVariant.MASONRY)}
                checked={imageListVariant === ImageListVariant.MASONRY}
              />
            </ColumnsItem>
            <ColumnsItem size={3}>
              <Radio
                label={`${ImageListVariant.WOVEN}`}
                name='imageList'
                value={`${ImageListVariant.WOVEN}`}
                id={`imageList-${ImageListVariant.WOVEN}`}
                onClick={() => setImageListVariant(ImageListVariant.WOVEN)}
                checked={imageListVariant === ImageListVariant.WOVEN}
              />
            </ColumnsItem>
          </Columns>
          <br />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'stretch' }}>
            <div style={{ width: '100%', maxWidth: 500, overflowY: 'scroll' }}>
              <ImageList
                variant={imageListVariant}
                {...(imageListVariant === ImageListVariant.QUILTED ? { cols: 4, rowHeight: (baseRowHeight * 2) / 3 } : { cols: 3, gap: 8 })}
                // cols={4}
                // rowHeight={baseRowHeight}
                // rowHeight='auto'
              >
                {imageListData.map((item, index) => (
                  <ImageListItem
                    key={`${index}`}
                    cols={setGridArea(item?.cols || 1, imageListVariant)}
                    rows={setGridArea(item?.rows || 1, imageListVariant)}
                  >
                    <img {...setSrc(item.img, baseRowHeight, item?.rows, item?.cols, imageListVariant)} alt={item.title} loading='lazy' />
                  </ImageListItem>
                ))}
              </ImageList>
            </div>
          </div>
        </Container>
      </Section>{' '}
      {/*
       * ##############
       * CARTE
       * ##############
       */}
      <Section>
        <div style={{ maxWidth: 500 }}>
          <Title level={TitleLevel.LEVEL4}>Carte</Title>
          <Divider />

          <Card skeleton={skeleton}>
            <CardImage
              size={CardImageSize.SIZE_3}
              src='https://i.etsystatic.com/10951167/r/il/df66c4/1860902191/il_570xN.1860902191_kuoj.jpg'
              alt='Shiba Inu Dog'
            />
            <CardContent
              titleSup='The Litle Shiba'
              title='Shiba Dog'
              buttonText='Button'
              // eslint-disable-next-line max-len
              text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ligula ex, aliquam at neque eu, vulputate vera.'
            />
            <Button onClick={() => setSkeleton(!skeleton)} classList={['is-secondary']}>
              {skeleton ? 'is-loading' : 'is-loaded'}
            </Button>
          </Card>

          <Title level={TitleLevel.LEVEL4}>Carte horizontale</Title>
          <Divider />

          <Card horizontal>
            <CardImage
              size={CardImageSize.SIZE_3}
              src='https://i.etsystatic.com/10951167/r/il/df66c4/1860902191/il_570xN.1860902191_kuoj.jpg'
              alt='Shiba Inu Dog'
            />
            <CardContent
              titleSup='The Litle Shiba'
              title='Shiba Dog'
              buttonText='Button'
              // eslint-disable-next-line max-len
              text='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ligula ex, aliquam at neque eu, vulputate vera.'
            />
          </Card>
        </div>
      </Section>{' '}
      {/*
       * ##############
       * RANGEES AVEC COLONNES
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Rangées avec colonnes</Title>
        <Divider />

        <Columns>
          <ColumnsItem>
            <Rows>
              <RowItem>
                <Text>Case 1</Text>
              </RowItem>
              <RowItem>
                <Text>Case 2</Text>
              </RowItem>
              <RowItem narrow>
                <Button markup={ButtonMarkup.BUTTON} variant={VariantState.PRIMARY}>
                  Button
                </Button>
              </RowItem>
            </Rows>
          </ColumnsItem>

          <ColumnsItem>
            <Rows>
              <RowItem>
                <Text>Case 3</Text>
              </RowItem>
              <RowItem narrow>
                <Button variant={VariantState.SECONDARY}>Button</Button>
              </RowItem>
            </Rows>
          </ColumnsItem>
        </Columns>
      </Section>{' '}
      {/*
       * ##############
       * PRIX
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Prix</Title>
        <Divider />

        <Price
          variant={PriceVariant.PRIMARY}
          // huge
          level={PriceLevel.LEVEL1}
          amount={24.99}
          mention='(1)'
          period='mois'
          showCents
        />

        <Price
          variant={PriceVariant.SECONDARY}
          // huge
          level={PriceLevel.LEVEL1}
          amount={24.99}
          mention='(1)'
          period='mois'
          showCents
        />

        <Price variant={PriceVariant.PRIMARY} level={PriceLevel.LEVEL3} amount={18.99} mention='(1)' period='mois' showCents />

        <Price variant={PriceVariant.SECONDARY} level={PriceLevel.LEVEL3} amount={18.99} mention='(1)' period='mois' showCents />

        <Hero variant={VariantState.TERTIARY}>
          <Price inverted level={PriceLevel.LEVEL1} amount={18.99} mention='(1)' period='mois' showCents />
        </Hero>
      </Section>{' '}
      {/*
       * ##############
       * HERO
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Hero</Title>
        <Divider />

        <Hero backgroundSrc={'https://ci.flexiness.com:3001/over_the_shoulder.jpg'}>
          <div className={styles.container}>
            <p className={styles.suptitle}>Message de bienvenue</p>
            <h1 className={styles.title}>Bonjour Michel</h1>
            <h2 className={styles.subtitle}>Fugiat velit dolor ad adipisicing id quis enim cupidatat Lorem dolore aute excepteur tempor.</h2>
            {/* <button className='button'>Click me !</button> */}
            <Button markup={ButtonMarkup.BUTTON} variant={VariantState.PRIMARY} onClick={() => alert('Click on hero btn')}>
              Click me !
            </Button>
          </div>
        </Hero>

        <Title level={TitleLevel.LEVEL4}>Hero + Background Color</Title>
        <Divider />

        <Hero variant={VariantState.PRIMARY}>
          <div className={styles.container}>
            <p className={styles.suptitle}>Message de bienvenue</p>
            <h1 className={styles.title}>Bonjour Michel</h1>
            <h2 className={styles.subtitle}>Fugiat velit dolor ad adipisicing id quis enim cupidatat Lorem dolore aute excepteur tempor.</h2>
            {/* <button className='button'>Click me !</button> */}
            <Button markup={ButtonMarkup.BUTTON} variant={VariantState.SECONDARY} onClick={() => alert('Click on hero btn')}>
              Click me !
            </Button>
          </div>
        </Hero>

        <Hero variant={VariantState.SECONDARY}>
          <div className={styles.container}>
            <p className={styles.suptitle}>Message de bienvenue</p>
            <h1 className={styles.title}>Bonjour Michel</h1>
            <h2 className={styles.subtitle}>Fugiat velit dolor ad adipisicing id quis enim cupidatat Lorem dolore aute excepteur tempor.</h2>
            {/* <button className='button'>Click me !</button> */}
            <Button markup={ButtonMarkup.BUTTON} variant={VariantState.PRIMARY} onClick={() => alert('Click on hero btn')}>
              Click me !
            </Button>
          </div>
        </Hero>
      </Section>{' '}
      {/*
       * ##############
       * CONTENEUR
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Conteneur</Title>
        <Divider />

        <Container>
          <Text>Container content</Text>
        </Container>
      </Section>{' '}
      {/*
       * ##############
       * CONTENEUR FLUIDE
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Conteneur fluide</Title>
        <Divider />

        <Container fluid>
          <Text>Container Fullwidth content</Text>
        </Container>
      </Section>{' '}
      {/*
       * ##############
       * LIEN
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Lien</Title>
        <Divider />

        <Link to={'my-link'}>With React BrowserRouter</Link>

        <div style={{ marginBottom: '15px' }} />

        <Link href={'https://google.fr'}>My super link with href</Link>
      </Section>{' '}
      {/*
       * ##############
       * MENU
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Menu</Title>
        <Divider />

        <Menu>
          <MenuItem onClick={() => alert('Click on item 1')} to='/'>
            Item 1
          </MenuItem>
          <MenuItem to='/' active>
            Item 2
          </MenuItem>
          <MenuItem>
            Item 3
            <SubMenuItem>
              <MenuItem to='/'>Item 3.1</MenuItem>
              <MenuItem to='/'>Item 3.2</MenuItem>
            </SubMenuItem>
          </MenuItem>
          <MenuItem to='/'>Item 4</MenuItem>
        </Menu>
      </Section>{' '}
      {/*
       * ##############
       * MENU DEROULANT
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Menu Déroulant</Title>
        <Divider />
        <div className={classNames(styles.isFullwidth, styles.isInlineBlock)} style={{ height: 'auto' }}>
          <MenuScrolling
            pulled='left'
            className={
              classNames()
              // themeMode === 'light'
              //   ? styles.hasBackgroundWhite
              //   : styles.hasBackgroundTertiaryDark
            }
          >
            <View classList={['field']}>
              <Title level={TitleLevel.LEVEL5}>Miguel floated left</Title>
            </View>
            <View classList={['field']}>
              <Input placeholder='Rechercher' hasIcon search />
            </View>
            <Menu notASide classList={['has-text-weight-bold']}>
              <MenuItem arrow>Infos personnelles</MenuItem>
              <MenuItem arrow>Factures et paiements</MenuItem>
              <MenuItem arrow badge={3}>
                Messagerie
              </MenuItem>
              <MenuItem arrow>Commande</MenuItem>
            </Menu>
            <Menu notASide classList={['has-text-weight-bold']}>
              <MenuItem arrow icon={IconName.UI_QUESTION_CIRCLE}>
                Aide & Contact
              </MenuItem>
              <MenuItem arrow icon={IconName.UI_SHOPPING_CART}>
                Boutique en ligne
              </MenuItem>
            </Menu>
            <Menu notASide classList={['has-text-weight-bold']}>
              <MenuItem icon={IconName.UI_POWER}>Déconnexion</MenuItem>
            </Menu>
            <br />
            <br />
          </MenuScrolling>

          <MenuScrolling
            pulled='right'
            // hasBackgroundWhite={themeMode === 'light'}
          >
            <View classList={['field']}>
              <Title level={TitleLevel.LEVEL5}>Miguel floated right</Title>
            </View>
            <View classList={['field']}>
              <Input placeholder='Rechercher' hasIcon search />
            </View>
            <Menu notASide classList={['has-text-weight-bold']}>
              <MenuItem arrow>Infos personnelles</MenuItem>
              <MenuItem arrow>Factures et paiements</MenuItem>
              <MenuItem arrow badge={3}>
                Messagerie
              </MenuItem>
              <MenuItem arrow>Commande</MenuItem>
            </Menu>
            <Menu notASide classList={['has-text-weight-bold']}>
              <MenuItem arrow icon={IconName.UI_QUESTION_CIRCLE}>
                Aide & Contact
              </MenuItem>
              <MenuItem arrow icon={IconName.UI_SHOPPING_CART}>
                Boutique en ligne
              </MenuItem>
            </Menu>
            <Menu notASide classList={['has-text-weight-bold']}>
              <MenuItem icon={IconName.UI_POWER}>Déconnexion</MenuItem>
            </Menu>
            <br />
            <br />
          </MenuScrolling>
        </div>
      </Section>{' '}
      {/*
       * ##############
       * TOOLBAR
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Toolbar</Title>
        <Divider />

        <Toolbar
        // background={themeMode === 'light' ? BackgroundStyle.WHITE : undefined}
        >
          <ToolbarGroup>
            <ToolbarItem>Ligne :</ToolbarItem>
            <ToolbarItem>
              <View classList={['field']}>
                <div className='select'>
                  <select>
                    <option value=''>Select lorem</option>
                  </select>
                </div>
              </View>
            </ToolbarItem>
          </ToolbarGroup>

          <ToolbarGroup elastic>
            <ToolbarSpace />
            <ToolbarItem className={'is-clipped-to-bottom'}>
              <Tabs>
                <TabsItem active>One</TabsItem>
                <TabsItem>Two</TabsItem>
                <TabsItem>Three</TabsItem>
              </Tabs>
            </ToolbarItem>
            <ToolbarSpace />
          </ToolbarGroup>
        </Toolbar>
      </Section>{' '}
      {/*
       * ##############
       * SWITCH SUCCESS
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Switch Success</Title>
        <Divider />

        <Switch
          label='Switch one'
          alert={AlertState.SUCCESS}
          name='switch'
          // eslint-disable-next-line no-console
          onChange={(e: { switchState: unknown }) => console.log(e.switchState)}
          // checked
          // readonly
        />

        <Title level={TitleLevel.LEVEL4}>Switch Warning</Title>
        <Divider />

        <Switch
          label='Switch two readonly'
          alert={AlertState.WARNING}
          name='switch'
          checked
          // eslint-disable-next-line no-console
          onChange={(e: { switchState: unknown }) => console.log(e.switchState)}
          readonly
        />

        <Title level={TitleLevel.LEVEL4}>Switch Danger</Title>
        <Divider />

        <Switch
          label='Switch three'
          alert={AlertState.DANGER}
          name='switch'
          checked
          // readonly
        />
      </Section>{' '}
      <Section className={styles.hasBackgroundTertiary}>
        <Title inverted level={TitleLevel.LEVEL4}>
          Switch Inverted
        </Title>
        <Divider />

        <Switch inverted label='Switch Four' alert={AlertState.SUCCESS} name='switch' checked />
      </Section>{' '}
      {/*
       * ##############
       * RADIO
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Radio</Title>
        <Divider />

        <Container>
          <Radio
            label='Radio 1'
            name='radio1'
            value='default value 1'
            // eslint-disable-next-line no-console
            onChange={(e) => console.log(e.radioValue, e.radioChecked)}
            checked={true}
          />

          <Radio
            label='Radio 2'
            name='radio1'
            value='default value 2'
            // eslint-disable-next-line no-console
            onChange={(e) => console.log(e.radioValue, e.radioChecked)}
            checked={false}
          />
        </Container>
      </Section>{' '}
      {/*
       * ##############
       * CHECKBOX
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Checkbox</Title>
        <Divider />

        <Container>
          <Checkbox
            label='Checkbox 1'
            name='checkbox'
            value='default value 1'
            // eslint-disable-next-line no-console
            onClick={(e) => console.log(e.checkboxValue, e.checkboxChecked)}
            checked={false}
          />

          <Checkbox
            label='Checkbox 2'
            name='checkbox'
            // eslint-disable-next-line no-console
            onClick={(e) => console.log(e.checkboxValue, e.checkboxChecked)}
            value='default value 2'
            checked={true}
          />
        </Container>
      </Section>{' '}
      {/*
       * ##############
       * TABS
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Tabs</Title>
        <Divider />
        <Section>
          <Title level={TitleLevel.LEVEL5}>Fullwidth</Title>
          <Tabs fullwidth>
            <TabsItem active>One</TabsItem>
            <TabsItem>Two</TabsItem>
            <TabsItem>Three</TabsItem>
          </Tabs>
        </Section>
        <Section>
          <Title level={TitleLevel.LEVEL5}>centered</Title>
          <Tabs centered>
            <TabsItem active>One</TabsItem>
            <TabsItem>Two</TabsItem>
            <TabsItem>Three</TabsItem>
          </Tabs>
        </Section>
      </Section>{' '}
      {/*
       * ##############
       * TILE
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Tile</Title>
        <Divider />

        <Tile ancestor>
          <Tile parent>
            <Tile child>
              <Box>
                <Title level={5}>Mon mobile</Title>
                <Text>Gérer, dépanner</Text>
              </Box>
            </Tile>
          </Tile>
          <Tile parent>
            <Tile child>
              <Box>
                <Title level={5}>Mon offre</Title>
                <Text>Forfaits & Options</Text>
              </Box>
            </Tile>
          </Tile>
          <Tile parent>
            <Tile child>
              <Box>
                <Title level={5}>Ma conso</Title>
                <Text>Dépassement forfait</Text>
              </Box>
            </Tile>
          </Tile>
        </Tile>
      </Section>{' '}
      {/*
       * ##############
       * BADGE
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Badge</Title>
        <Divider />
        <Badge>10</Badge>

        <Title level={TitleLevel.LEVEL4}>Badge avec texte</Title>
        <Divider />
        <Badge content={2} textContent='Text with badge' />
      </Section>{' '}
      {/*
       * ##############
       * TIMELINE
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Timeline</Title>
        <Divider />

        <div
          style={{
            // backgroundColor: themeMode === 'light'
            //   ? 'white'
            //   : 'transparent',
            width: '100%',
            height: '100%',
          }}
        >
          <Timeline>
            <TimelineItem>
              <TimelineMarker iconName={IconName.ENVELOPE} />
              <TimelineContent
                heading='20 Septembre - Compte'
                content='Modification de votre identifiant de connexion'
                link='https://google.fr'
                contentLink='Google'
              />
            </TimelineItem>

            <TimelineItem active>
              <TimelineMarker iconName={IconName.ENVELOPE} />
              <TimelineContent
                heading='20 Septembre - Compte'
                content='Modification de votre identifiant de connexion'
                link='https://google.fr'
                contentLink='Google'
              />
            </TimelineItem>

            <TimelineItem>
              <TimelineMarker iconName={IconName.ENVELOPE} />
              <TimelineContent
                heading='20 Septembre - Compte'
                content='Modification de votre identifiant de connexion'
                link='https://google.fr'
                contentLink='Google'
              />
            </TimelineItem>
          </Timeline>
        </div>
      </Section>{' '}
      {/*
       * ##############
       * TABLE
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Table</Title>
        <Divider />

        <Table bordered>
          <TableHead>
            <TableTr>
              <TableTh>Title 1</TableTh>
              <TableTh>Title 2</TableTh>
              <TableTh>Title 3</TableTh>
            </TableTr>
          </TableHead>
          <TableBody>
            <TableTr>
              <TableTd>Donnée 1</TableTd>
              <TableTd>Donnée 2</TableTd>
              <TableTd>Donnée 3</TableTd>
            </TableTr>
            <TableTr>
              <TableTd>Donnée 4</TableTd>
              <TableTd>Donnée 5</TableTd>
              <TableTd>Donnée 6</TableTd>
            </TableTr>
          </TableBody>
        </Table>
      </Section>{' '}
      {/*
       * ##############
       * SELECT
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Select</Title>
        <Divider />

        <Select name='SelectOne' dynamicPlaceholder label='Filter options' placeholder={'Ceci est un placeholder'}>
          <SelectOption id='id_one' value='opt_one'>
            option 1
          </SelectOption>
          <SelectOption id='id_two' value='opt_two'>
            option 2
          </SelectOption>
          <SelectOption id='id_three' value='opt_three'>
            option 3
          </SelectOption>
        </Select>

        <Title level={TitleLevel.LEVEL4}>Nullable Select</Title>

        <Divider />

        <Select nullable name='SelectOne' dynamicPlaceholder label='Filter options' placeholder={'Choisir une option'}>
          <SelectOption id='id_one' value='opt_one'>
            option 1
          </SelectOption>
          <SelectOption id='id_two' value='opt_two'>
            option 2
          </SelectOption>
          <SelectOption id='id_three' value='opt_three'>
            option 3
          </SelectOption>
        </Select>

        <Title level={TitleLevel.LEVEL4}>Select Without Placeholder</Title>

        <Divider />

        <Select nullable name='SelectOne' label='Filter options'>
          <SelectOption id='id_one' value='opt_one'>
            option 1
          </SelectOption>
          <SelectOption id='id_two' value='opt_two'>
            option 2
          </SelectOption>
          <SelectOption id='id_three' value='opt_three'>
            option 3
          </SelectOption>
        </Select>
      </Section>{' '}
      {/*
       * ##############
       * EVENEMENT
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Evenement</Title>
        <Divider />

        <Select
          onChange={(e) => {
            setTestEvenement(e.selectValue === 'opt_three')
          }}
          name='SelectOne'
          dynamicPlaceholder
          label='Filter options'
        >
          <SelectOption id='id_one' value='opt_one'>
            option 1
          </SelectOption>
          <SelectOption id='id_two' value='opt_two'>
            option 2
          </SelectOption>
          <SelectOption id='id_three' value='opt_three'>
            option 3
          </SelectOption>
        </Select>

        <div
          style={{
            // backgroundColor: themeMode === 'dark'
            //   ? '#7d7d7d'
            //   : '#eee',
            padding: '30px',
          }}
        >
          <View classList={['field']}>
            <Button
              onClick={() => {
                if (window) window.alert('Pas option 3')
              }}
              variant={VariantState.PRIMARY}
              disabled={testEvenement}
            >
              Disabled si option 3
            </Button>
          </View>
          <View classList={['field']}>
            <Progress percent={testEvenement ? 100 : 50} uniqueLegend='100% si option 3' />
          </View>
          <View classList={['field']}>
            <Tag deletable={testEvenement} variant={TagVariant.SECONDARY}>
              Tag supprimable si option 3
            </Tag>
          </View>
          <View classList={['field']}>
            <Tabs>
              <TabsItem active={!testEvenement}>Ouvert si pas option 3</TabsItem>
              <TabsItem active={testEvenement}>Ouvert si option 3</TabsItem>
            </Tabs>
          </View>
          <View classList={['field']}>
            <Input defaultValue={testEvenement ? 'OPTION 3' : undefined} placeholder='Se complete si option 3 coché' />
          </View>
          <View classList={['field']}>
            <Textarea defaultValue={testEvenement ? 'OPTION 3' : undefined} placeholder='Se complete si option 3 coché' />
          </View>
          <View classList={['field']}>
            <Checkbox checked={testEvenement} label='Coché si option 3 choisi' />
          </View>
          <View classList={['field']}>
            <Radio checked={testEvenement} label={'Coché si option 3 choisi'} />
          </View>
          <View classList={['field']}>
            <Dropdown active={testEvenement}>
              <DropdownTrigger label='Ouvert si Option 3 choisi' name='Dropdown placeholder' />
              <DropdownMenu>
                <DropdownItem
                  label='Item label 1'
                  name='item1'
                  value='Value 1'
                  // eslint-disable-next-line no-console
                  onChange={(e) => console.log(e)}
                />
              </DropdownMenu>
            </Dropdown>
          </View>
        </div>
        <Divider />
        <div style={{ marginBottom: '70px' }} />

        {/* <Title level={TitleLevel.LEVEL4}>Notifications</Title>
        <Divider />

        <Notification alert={AlertState.INFO} title='Notification' /> */}
      </Section>{' '}
      {/*
       * ##############
       * NOTIFICATION
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Notifications</Title>
        <Divider />
        <Notification alert={AlertState.INFO} title='Notification above page section' />
        <Section>
          <Notification alert={AlertState.SUCCESS} title='Notification within page section' />
        </Section>{' '}
        <Section>
          <Notification alert={AlertState.WARNING} title='Notification' />
        </Section>{' '}
        <Section>
          <Notification alert={AlertState.DANGER} title='Notification' />
        </Section>{' '}
        <Section>
          <Notification
            title='Notification'
            description='Reprehenderit eiusmod duis eu consectetur deserunt enim esse est do mollit. Aliqua et velit et culpa nulla veniam tempor veniam voluptate nulla. Nisi est sunt incididunt irure in ullamco eiusmod sunt. Reprehenderit incididunt labore qui culpa cillum eiusmod ex non aute ea Lorem. Incididunt laborum quis consequat commodo laborum consectetur id anim elit pariatur.'
          />
        </Section>{' '}
        <Section>
          <Notification
            alert={AlertState.INFO}
            title='Notification with button'
            buttonContent='Valider'
            buttonMarkup={ButtonMarkup.BUTTON}
            // buttonVariant={VariantState.PRIMARY}
            // eslint-disable-next-line no-alert
            buttonClick={() => alert('Test call to action click event')}
          />
        </Section>{' '}
        <Section>
          <Notification title='Notification with end icon' arrow />
        </Section>{' '}
        <Section>
          <Notification
            title='Notification with text and end icon'
            arrow
            description='Reprehenderit eiusmod duis eu consectetur deserunt enim esse est do mollit. Aliqua et velit et culpa nulla veniam tempor veniam voluptate nulla. Nisi est sunt incididunt irure in ullamco eiusmod sunt. Reprehenderit incididunt labore qui culpa cillum eiusmod ex non aute ea Lorem. Incididunt laborum quis consequat commodo laborum consectetur id anim elit pariatur.'
          />
        </Section>{' '}
        <Section>
          <Notification title='Notification bloc' info />
        </Section>{' '}
        <Section>
          <Notification description='Banner notification description' banner iconName={IconName.SIM_CARD} />
        </Section>{' '}
      </Section>
      {/*
       * ##############
       * POPOVER
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Popover</Title>
        <Divider />
        <Section>
          <Title level={TitleLevel.LEVEL5}>Popover</Title>
          <Columns>
            <ColumnsItem>
              <Popover content='Voici une simple popover'>
                <Button variant={VariantState.PRIMARY}>Simple</Button>
              </Popover>
            </ColumnsItem>
            <ColumnsItem>
              <Popover>
                <Button variant={VariantState.PRIMARY}>Sans content</Button>
              </Popover>
            </ColumnsItem>
            <ColumnsItem>
              <Popover
                content={
                  <>
                    <Tag variant={TagVariant.DANGER}>Test</Tag>
                    <Icon name={IconName.ACCESSIBILITY} />
                  </>
                }
              >
                <Button variant={VariantState.PRIMARY}>Node content</Button>
              </Popover>
            </ColumnsItem>
            <ColumnsItem>
              <Popover active content='Popover active'>
                <Button variant={VariantState.PRIMARY}>Active</Button>
              </Popover>
            </ColumnsItem>
          </Columns>
        </Section>
        <Section>
          <Title level={TitleLevel.LEVEL5}>Popover direction</Title>
          <Columns>
            <ColumnsItem>
              <Popover content='En haut'>
                <Button variant={VariantState.PRIMARY}>Top</Button>
              </Popover>
            </ColumnsItem>
            <ColumnsItem>
              <Popover direction={PopoverDirection.BOTTOM} content='En bas'>
                <Button variant={VariantState.PRIMARY}>Bottom</Button>
              </Popover>
            </ColumnsItem>
            <ColumnsItem>
              <Popover direction={PopoverDirection.RIGHT} content='A droite'>
                <Button variant={VariantState.PRIMARY}>Right</Button>
              </Popover>
            </ColumnsItem>
            <ColumnsItem>
              <Popover direction={PopoverDirection.LEFT} content='A gauche'>
                <Button variant={VariantState.PRIMARY}>Left</Button>
              </Popover>
            </ColumnsItem>
          </Columns>
        </Section>
        <Section>
          <Title level={TitleLevel.LEVEL5}>
            Arrow Position (possiblement le css n est pas en dernière version, quand il sera à jour ça marchera ici)
          </Title>
          <Columns>
            <ColumnsItem>
              <Popover content='Centré'>
                <Button variant={VariantState.PRIMARY}>Centré</Button>
              </Popover>
            </ColumnsItem>
            <ColumnsItem>
              <Popover arrowPosition={PopoverArrowPosition.START} content='Début'>
                <Button variant={VariantState.PRIMARY}>Début</Button>
              </Popover>
            </ColumnsItem>
            <ColumnsItem>
              <Popover arrowPosition={PopoverArrowPosition.END} content='Fin'>
                <Button variant={VariantState.PRIMARY}>Fin</Button>
              </Popover>
            </ColumnsItem>
          </Columns>
        </Section>
      </Section>{' '}
      {/*
       * ##############
       * MODAL
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Modal</Title>
        <Divider />

        <Modal
          content='Modal content description 1'
          triggerMarkup={ModalMarkup.A}
          triggerClassNames='button is-primary'
          title='title modal'
          triggerContent='Open modal'
          ctaContent='Action'
          // eslint-disable-next-line no-alert
          ctaOnClick={() => alert('Click on cta')}
          onOpen={() => alert('open modal')}
          onClose={() => alert('close modal')}
        />
      </Section>{' '}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Modal custom </Title>
        <Divider />

        <Modal
          triggerMarkup={ModalMarkup.A}
          triggerClassNames='button is-primary'
          triggerContent='Open modal'
          onOpen={() => alert('open modal')}
          onClose={() => alert('close modal')}
        >
          <View>
            <Text>Custom modal content</Text>
          </View>
        </Modal>
      </Section>{' '}
      {/*
       * ##############
       * PROGRESSBAR
       * ##############
       */}
      <Section>
        <Section>
          <Title level={TitleLevel.LEVEL4}>Progress Bar</Title>
          <Divider />

          <Progress percent={30} />

          <Progress percent={30} alert={AlertState.INFO} />

          <Progress percent={30} alert={AlertState.WARNING} />

          <Progress percent={30} alert={AlertState.DANGER} />

          <Progress percent={30} alert={AlertState.SUCCESS} />
        </Section>{' '}
        <Section>
          <Title level={TitleLevel.LEVEL4}>Barre de Progretion empilée</Title>
          <Divider />

          <Progress stacked>
            <ProgressItem percent={15} alert={AlertState.SUCCESS} />
            <ProgressItem percent={15} alert={AlertState.INFO} />
            <ProgressItem percent={15} alert={AlertState.WARNING} />
            <ProgressItem percent={15} alert={AlertState.DANGER} />
          </Progress>
        </Section>{' '}
        <Section>
          <Title level={TitleLevel.LEVEL4}>Progretion avec unique légende</Title>
          <Divider />

          <Progress percent={30} alert={AlertState.INFO} uniqueLegend='My unique legend' />
        </Section>{' '}
        <Section>
          <Title level={TitleLevel.LEVEL4}>Progretion avec légendes aux extremitées</Title>
          <Divider />

          <Progress percent={15} alert={AlertState.INFO} firstExtremLegend='0 Go' secondExtremLegend='5 Go' />
        </Section>{' '}
        <Section>
          <Title level={TitleLevel.LEVEL4}>Barre de progression circulaire</Title>
          <Divider />

          <ProgressRadial percent={15} />

          <Title level={TitleLevel.LEVEL4}>Barre de progression circulaire avec label & description</Title>
          <Divider />

          <ProgressRadial percent={15} label='02:00' description='ListItemDescription' />
        </Section>{' '}
      </Section>
      {/*
       * ##############
       * OPTIONS
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Options</Title>
        <Divider />

        <Options>
          <OptionsItem
            label='50 Go'
            name='option'
            value='50go'
            // eslint-disable-next-line no-console
            onChange={(e) => console.log(e.optionValue, e.optionChecked)}
            checked
          />

          <OptionsItem
            label='100 Go'
            name='option'
            // eslint-disable-next-line no-console
            onChange={(e) => console.log(e.optionValue, e.optionChecked)}
            value='100go'
          />
        </Options>
      </Section>{' '}
      {/*
       * ##############
       * DROPDOWN
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Dropdown</Title>
        <Divider />

        <Dropdown>
          <DropdownTrigger label='Dropdown label' name='Dropdown placeholder' />
          <DropdownMenu>
            <DropdownItem
              label='Item label 1'
              name='item1'
              value='Value 1'
              // eslint-disable-next-line no-console
              onChange={(e) => console.log(e)}
            />
            <DropdownItem
              label='Item label 2'
              name='item2'
              value='Value 2'
              // eslint-disable-next-line no-console
              onChange={(e) => console.log(e)}
            />
            <DropdownItem
              label='Item label 3'
              name='item3'
              value='Value 3'
              onClick={(e) => {
                // eslint-disable-next-line no-console
                console.log(e)
              }}
            />
            <DropdownDivider />
            <DropdownItem>
              <Link>Validate</Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Section>{' '}
      {/*
       * ##############
       * FOOTER
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Footer</Title>
        <Divider />

        <Footer fullwidth>
          <FooterDesktop fullwidth>
            <FooterWrapper>
              <FooterHeader>
                {/* <img src='/Logo-dark-bg.6b002b64.svg' className='image logo' /> */}
                <div>
                  <Link title='Site institutionnel' href='https://www.corporate.bouyguestelecom.fr'>
                    Site institutionnel
                  </Link>
                  <Link title='Plan du site' href='https://www.bouyguestelecom.fr/plan-du-site'>
                    Plan du site
                  </Link>
                  <Link title='Infos légales' href='https://www.corporate.bouyguestelecom.fr/informations-legales'>
                    Infos légales
                  </Link>
                  <Link title='Signaler un contenu' href='https://signalement.fftelecoms.org'>
                    Signaler un contenu
                  </Link>
                  <Link title='Tarifs & conditions' href='https://www.bouyguestelecom.fr/tarifs-conditions'>
                    Tarifs & conditions
                  </Link>
                  <Link title='Nous contacter' href='https://www.assistance.bouyguestelecom.fr/contact-service-clients'>
                    Nous contacter
                  </Link>
                </div>
              </FooterHeader>
              <FooterBody>
                <Divider marginless />
                <Columns>
                  <ColumnsItem>
                    <Text classList={['subfooter-title']}>Forfait Mobiles 4G</Text>
                    <Link
                      classList={['subfooter-link']}
                      removeLinkClass
                      title='Forfaits B&You sans engagement'
                      href='https://www.bouyguestelecom.fr/forfaits-mobiles/sans-engagement'
                    >
                      Forfaits B&You sans engagement
                    </Link>
                    <a
                      className='subfooter-link'
                      title='Forfaits Sensation avec mobile'
                      href='https://www.bouyguestelecom.fr/forfaits-mobiles/avec-engagement/sensation-avantages-smartphone'
                    >
                      Forfaits Sensation avec mobile
                    </a>
                    <a
                      className='subfooter-link'
                      title='Forfaits Mobiles Pro'
                      href='https://www.bouyguestelecom.fr/forfaits-mobiles-pro/avec-engagement/sensation-avantages-smarphone'
                    >
                      Forfaits Mobiles Pro
                    </a>
                    <a className='subfooter-link' title='Applications Mobiles' href='https://www.services.bouyguestelecom.fr'>
                      Applications Mobiles
                    </a>
                    <a className='subfooter-link' title='Services pour mobile' href='https://www.services.bouyguestelecom.fr'>
                      Services pour mobile
                    </a>
                  </ColumnsItem>
                  <ColumnsItem>
                    <Text classList={['subfooter-title']}>Téléphones mobiles</Text>
                    <Link
                      classList={['subfooter-link']}
                      removeLinkClass
                      title='Smartphones Apple'
                      href='https://www.bouyguestelecom.fr/telephones-mobiles/telephone-portable-apple-iphone'
                    >
                      Smartphones Apple
                    </Link>
                    <a
                      className='subfooter-link'
                      title='Smartphones Samsung'
                      href='https://www.bouyguestelecom.fr/telephones-mobiles/telephone-portable-samsung'
                    >
                      Smartphones Samsung
                    </a>
                    <a
                      className='subfooter-link'
                      title='Smartphones Sony'
                      href='https://www.bouyguestelecom.fr/telephones-mobiles/telephone-portable-sony'
                    >
                      Smartphones Sony
                    </a>
                    <a
                      className='subfooter-link'
                      title='Smartphones HTC'
                      href='https://www.bouyguestelecom.fr/telephones-mobiles/telephone-portable-htc'
                    >
                      Smartphones HTC
                    </a>
                    <a
                      className='subfooter-link'
                      title='Smartphones Huawei'
                      href='https://www.bouyguestelecom.fr/telephones-mobiles/telephone-portable-huawei'
                    >
                      Smartphones Huawei
                    </a>
                    <a title='Smartphones Nokia' href='https://www.bouyguestelecom.fr/telephones-mobiles/telephone-portable-nokia'>
                      Smartphones Nokia
                    </a>
                    <a title='FAQ mobile' href='https://www.assistance.bouyguestelecom.fr/mobiles'>
                      FAQ mobile
                    </a>
                  </ColumnsItem>
                  <ColumnsItem>
                    <Text classList={['subfooter-title']}>Internet</Text>
                    <a className='subfooter-link' title='Box Internet' href='https://www.bouyguestelecom.fr/offres-internet'>
                      Box Internet
                    </a>
                    <a className='subfooter-link' title='Internet Garanti' href='https://www.bouyguestelecom.fr/offres-internet/accompagnement-bbox'>
                      Internet Garanti
                    </a>
                    <a className='subfooter-link' title='Services pour la Bbox' href='https://www.services.bouyguestelecom.fr'>
                      Services pour la Bbox
                    </a>
                    <a className='subfooter-link' title='Clé internet 3G/4G' href='https://www.bouyguestelecom.fr/forfait-internet-mobile'>
                      Clé internet 3G/4G
                    </a>
                    <a className='subfooter-link' title='Box internet Pro' href='https://www.bouyguestelecom.fr/offres-internet-bbox-pro'>
                      Box internet Pro
                    </a>
                    <a className='subfooter-link' title='FAQ Bbox' href='https://www.assistance.bouyguestelecom.fr/internet-bbox'>
                      FAQ Bbox
                    </a>
                  </ColumnsItem>
                  <ColumnsItem>
                    <Text classList={['subfooter-title']}>Pourquoi nous choisir ?</Text>
                    <a className='subfooter-link' title='Profitez de la 4G/4G+' href='https://www.bouyguestelecom.fr/reseau/4g'>
                      Profitez de la 4G/4G+
                    </a>
                    <a
                      className='subfooter-link'
                      title='Couverture fixe et mobile'
                      href='https://www.bouyguestelecom.fr/reseau/cartes-de-couverture-reseau-mobile'
                    >
                      Couverture fixe et mobile
                    </a>
                    <a className='subfooter-link' title='Avantages clients' href='https://www.bouyguestelecom.fr/choisir-bouygues-telecom'>
                      Avantages clients
                    </a>
                    <a className='subfooter-link' title='Avantages Pro' href='https://www.bouyguestelecom.fr/pro'>
                      Avantages Pro
                    </a>
                    <a className='subfooter-link' title='Le comité client' href='https://blog.bouyguestelecom.fr'>
                      Le comité client
                    </a>
                  </ColumnsItem>
                  <ColumnsItem>
                    <Text classList={['subfooter-title']}>Bouygues Telecom</Text>
                    <a className='subfooter-link' title='Notre entreprise' href='https://www.corporate.bouyguestelecom.fr/nous-connaitre'>
                      Notre entreprise
                    </a>
                    <a className='subfooter-link' title='Nos valeurs' href='https://www.corporate.bouyguestelecom.fr/nos-engagements'>
                      Nos valeurs
                    </a>
                    <a className='subfooter-link' title='Carrière' href='https://www.jobs.bouyguestelecom.fr'>
                      Carrière
                    </a>
                    <a
                      className='subfooter-link'
                      title='Espace Fournisseur'
                      href='https://www.corporate.bouyguestelecom.fr/nos-engagements/achats-responsables'
                    >
                      Espace Fournisseur
                    </a>
                    <a className='subfooter-link' title='Presse' href='https://www.corporate.bouyguestelecom.fr/press-room'>
                      Presse
                    </a>
                    <a className='subfooter-link' title='Newsletter' href='https://www.bouyguestelecom.fr/newsletter'>
                      Newsletter
                    </a>
                  </ColumnsItem>
                </Columns>
              </FooterBody>
            </FooterWrapper>
          </FooterDesktop>
          <FooterMobile>
            <img
              alt='Bouygues Telecom'
              src='https://www.bouyguestelecom.fr/static/wbm/assets/hub-npm/images/Logo-dark-bg.6b002b64.svg'
              className='image logo'
            />
            <div className={classNames(styles.hasTextWhite, styles.isSize7, styles.hasTextCentered)}>
              <p>Téléchargez l&apos;appli Espace Client</p>
              <div>
                <a rel='noopener noreferrer' href='https://itunes.apple.com/fr/app/espace-client-mobile-bouygues/id422590767'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 135 48'>
                    <path
                      d='M121.22 4H11.77a13.21 13.21 0 00-2 .18 6.67 6.67 0 00-1.9.63A6.44 6.44 0 006.24 6a6.26 6.26 0 00-1.17 1.62 6.6 6.6 0 00-.62 1.9 13 13 0 00-.18 2v24.96a13 13 0 00.18 2 6.59 6.59 0 00.63 1.9A6.21 6.21 0 006.24 42a6.27 6.27 0 001.62 1.18 6.7 6.7 0 001.9.63 13.45 13.45 0 002 .18h111.47a13.28 13.28 0 002-.18 6.8 6.8 0 001.91-.63 6.28 6.28 0 001.62-1.18 6.39 6.39 0 001.18-1.61 6.6 6.6 0 00.62-1.9 13.51 13.51 0 00.19-2V11.53a13.51 13.51 0 00-.19-2 6.62 6.62 0 00-.62-1.9 6.47 6.47 0 00-2.8-2.8 6.77 6.77 0 00-1.91-.63 13 13 0 00-2-.18h-2z'
                      fill='#a6a6a6'
                    />
                    <path d='M12.69 43.13h-.9A12.69 12.69 0 019.92 43a5.88 5.88 0 01-1.66-.55 5.41 5.41 0 01-1.4-1 5.32 5.32 0 01-1-1.4 5.72 5.72 0 01-.54-1.66 12.41 12.41 0 01-.17-1.87V11.55a12.37 12.37 0 01.15-1.87A5.76 5.76 0 015.84 8a5.37 5.37 0 011-1.4 5.57 5.57 0 011.4-1 5.82 5.82 0 011.65-.54 12.59 12.59 0 011.88-.16h111.45a12.38 12.38 0 011.86.16 5.94 5.94 0 011.67.55A5.59 5.59 0 01129.16 8a5.76 5.76 0 01.54 1.65 13 13 0 01.17 1.89v24.93a12.73 12.73 0 01-.17 1.85 5.74 5.74 0 01-.54 1.67 5.48 5.48 0 01-1 1.39 5.41 5.41 0 01-1.4 1 5.86 5.86 0 01-1.67.55 12.54 12.54 0 01-1.87.16H12.69z' />
                    <path
                      className='cls-2'
                      d='M29 24.3a5 5 0 012.36-4.15 5.07 5.07 0 00-4-2.16c-1.68-.18-3.31 1-4.16 1S21 18 19.61 18a5.32 5.32 0 00-4.47 2.73c-1.93 3.35-.49 8.27 1.36 11 .93 1.33 2 2.81 3.43 2.75s1.91-.88 3.58-.88 2.14.88 3.59.85 2.43-1.33 3.32-2.67a11 11 0 001.52-3.09A4.78 4.78 0 0129 24.3zM26.29 16.21a4.87 4.87 0 001.11-3.49 5 5 0 00-3.21 1.66A4.64 4.64 0 0023 17.74a4.1 4.1 0 003.29-1.53zM39.9 18.7v-5.12H38v-.84h4.7v.84h-1.87v5.12zm7.1-1.21a1.83 1.83 0 01-2 1.3 2 2 0 01-2-2.33 2.08 2.08 0 011.78-2.33h.29c1.25 0 2 .86 2 2.27v.31h-3.19A1.19 1.19 0 0045 18h.11a1.08 1.08 0 001.07-.55zM43.88 16h2.27a1.09 1.09 0 00-1-1.16h-.11A1.15 1.15 0 0043.88 16zm.64-2.59l1-1.42h1l-1.16 1.42zm3.78-.97h.89v6.26h-.89zm6.15 5.05a1.83 1.83 0 01-2 1.3 2 2 0 01-2.08-2.32 2.08 2.08 0 011.78-2.33h.29c1.25 0 2 .86 2 2.27v.31h-3.11A1.19 1.19 0 0052.41 18h.11a1.08 1.08 0 001.07-.55zM51.33 16h2.27a1.09 1.09 0 00-1-1.16h-.11A1.15 1.15 0 0051.33 16zm.67-2.55L53 12h1l-1.16 1.42zm6.65 2.22a1 1 0 00-1.06-.76c-.74 0-1.2.57-1.2 1.53s.46 1.56 1.2 1.56a1 1 0 001.06-.74h.86a1.76 1.76 0 01-1.92 1.53 2.07 2.07 0 01-2.11-2.35 2.05 2.05 0 011.76-2.31h.35a1.78 1.78 0 011.93 1.56zm2.04-3.23h.88v2.48h.07a1.39 1.39 0 011.36-.8 1.48 1.48 0 011.55 1.68v2.9h-.89V16c0-.72-.33-1.08-1-1.08a1.05 1.05 0 00-1.13 1.14v2.64h-.89zm5 4.99c0-.81.6-1.28 1.67-1.34l1.22-.09v-.39c0-.48-.31-.74-.92-.74s-.84.18-.94.5h-.86c.09-.77.82-1.27 1.84-1.27s1.77.56 1.77 1.51v3.09h-.86v-.63h-.07a1.52 1.52 0 01-1.35.71 1.36 1.36 0 01-1.49-1.21s-.01-.1-.01-.14zm2.89-.43v-.38l-1.1.07c-.62 0-.9.25-.9.65s.35.64.83.64a1.06 1.06 0 001.16-.95zm2.28-2.8h.86v.69h.07a1.22 1.22 0 011.21-.77 1.87 1.87 0 01.4 0V15a2.43 2.43 0 00-.5-.05 1.06 1.06 0 00-1.15 1v2.75h-.89zm3.35 4.95h.91c.08.33.45.54 1.05.54s1.18-.35 1.18-.95v-.86h-.07a1.51 1.51 0 01-1.39.76c-1.15 0-1.86-.89-1.86-2.24s.72-2.27 1.87-2.27a1.56 1.56 0 011.41.79h.07v-.72h.85v4.54c0 1-.81 1.68-2.08 1.68s-1.85-.5-1.94-1.27zm3.16-2.76c0-.9-.46-1.47-1.22-1.47s-1.19.57-1.19 1.47.43 1.47 1.19 1.47 1.22-.57 1.22-1.47zm6.09 1.1a1.83 1.83 0 01-2 1.3 2 2 0 01-2.08-2.32 2.08 2.08 0 011.78-2.33h.29c1.25 0 2 .86 2 2.27v.31h-3.12A1.19 1.19 0 0081.42 18h.11a1.08 1.08 0 001.07-.55zM80.33 16h2.27a1.09 1.09 0 00-1-1.16h-.1A1.15 1.15 0 0080.33 16zm4.38-1.8h.86v.69h.07a1.22 1.22 0 011.22-.77 1.87 1.87 0 01.4 0V15a2.43 2.43 0 00-.5-.05 1.06 1.06 0 00-1.15 1v2.75h-.89zm5.73 2.25c0-1.42.73-2.32 1.87-2.32a1.48 1.48 0 011.38.79h.07v-2.48h.89v6.26h-.85V18h-.07a1.56 1.56 0 01-1.41.79c-1.15-.01-1.88-.92-1.88-2.34zm.92 0c0 1 .45 1.53 1.2 1.53s1.21-.58 1.21-1.53-.47-1.53-1.21-1.53-1.2.58-1.2 1.53zm4.49.98c0-.81.6-1.28 1.67-1.34l1.22-.09v-.39c0-.48-.31-.74-.92-.74s-.84.18-.94.5H96c.09-.77.82-1.27 1.84-1.27s1.77.56 1.77 1.51v3.09h-.86v-.63h-.05a1.51 1.51 0 01-1.35.71 1.36 1.36 0 01-1.49-1.21s-.01-.1-.01-.14zm2.89-.43v-.38l-1.1.07c-.62 0-.9.25-.9.65s.35.64.83.64a1.06 1.06 0 001.16-.95zm2.26-2.8h.86v.72h.07a1.35 1.35 0 011.34-.8 1.46 1.46 0 011.56 1.67v2.91H104V16c0-.72-.31-1.08-1-1.08a1 1 0 00-1.08 1.14v2.64H101zm6.86-.09c1 0 1.67.47 1.76 1.27h-.85c-.08-.33-.41-.54-.91-.54s-.87.24-.87.59.23.44.72.55l.75.17c.86.2 1.26.57 1.26 1.23 0 .85-.79 1.41-1.87 1.41s-1.77-.48-1.85-1.28h.89a.91.91 0 001 .56c.55 0 .95-.25.95-.61s-.21-.44-.66-.55l-.79-.18c-.86-.2-1.25-.59-1.25-1.26s.71-1.36 1.72-1.36zM39.44 22.07h1.86v12.42h-1.86zm4.1 4.54l1-4.54h1.81l-1.23 4.54zm9.85 4.52h-4.73l-1.14 3.36h-2L50 22.07h2.08l4.48 12.42h-2zm-4.24-1.55h3.75l-1.85-5.45H51zm17.1.42c0 2.81-1.51 4.62-3.78 4.62A3.07 3.07 0 0159.62 33v4.48h-1.9v-12h1.8v1.51a3.21 3.21 0 012.88-1.6c2.33-.05 3.85 1.76 3.85 4.61zm-1.91 0c0-1.83-.95-3-2.39-3s-2.37 1.23-2.37 3 1 3 2.38 3 2.38-1.19 2.38-3zm11.87 0c0 2.81-1.51 4.62-3.78 4.62A3.07 3.07 0 0169.59 33v4.48h-1.9v-12h1.8v1.51a3.21 3.21 0 012.88-1.6c2.33-.05 3.84 1.76 3.84 4.61zm-1.91 0c0-1.83-.95-3-2.39-3s-2.37 1.23-2.37 3 1 3 2.38 3 2.38-1.19 2.38-3zm8.5 1c.14 1.23 1.33 2 3 2s2.69-.81 2.69-1.92-.68-1.54-2.29-1.94l-1.61-.39c-2.28-.55-3.34-1.62-3.34-3.35 0-2.14 1.87-3.61 4.52-3.61s4.42 1.47 4.48 3.61h-1.9c-.11-1.24-1.14-2-2.63-2s-2.52.76-2.52 1.86c0 .88.65 1.39 2.25 1.79l1.37.34c2.55.6 3.61 1.63 3.61 3.44 0 2.32-1.85 3.78-4.79 3.78-2.75 0-4.61-1.42-4.73-3.67zm11.64-7.71v2.14h1.72v1.47h-1.72v5c0 .78.34 1.14 1.1 1.14a5.81 5.81 0 00.61 0v1.46a5.1 5.1 0 01-1 .09c-1.83 0-2.55-.69-2.55-2.44V26.9h-1.35v-1.47h1.32v-2.14zM97.15 30c0-2.85 1.68-4.64 4.29-4.64s4.29 1.79 4.29 4.64-1.66 4.64-4.29 4.64-4.29-1.82-4.29-4.64zm6.7 0c0-2-.9-3.11-2.4-3.11S99 28 99 30s.89 3.11 2.4 3.11 2.4-1.14 2.4-3.11zm3.43-4.57H109V27a2.16 2.16 0 012.18-1.64 2.87 2.87 0 01.64.07v1.74a2.6 2.6 0 00-.83-.11 1.87 1.87 0 00-1.94 2.08v5.37h-1.86zm13.19 6.4c-.25 1.64-1.85 2.77-3.9 2.77-2.63 0-4.27-1.76-4.27-4.6s1.64-4.68 4.19-4.68 4.08 1.72 4.08 4.47v.64h-6.39v.11a2.36 2.36 0 002.14 2.56h.29a2 2 0 002.09-1.27zm-6.28-2.7h4.53a2.18 2.18 0 00-2.05-2.3h-.17a2.29 2.29 0 00-2.31 2.28v.01z'
                      fill='#fff'
                    />
                  </svg>
                </a>
                <a rel='noopener noreferrer' href='https://play.google.com/store/apps/details?id=fr.bouyguestelecom.ecm.android'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 143 48'>
                    <defs>
                      <linearGradient
                        id='a'
                        x1='25.8'
                        y1='10.71'
                        x2='9.02'
                        y2='27.49'
                        gradientTransform='translate(0 2)'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop offset='0' stopColor='#00a0ff' />
                        <stop offset='.01' stopColor='#00a1ff' />
                        <stop offset='.26' stopColor='#00beff' />
                        <stop offset='.51' stopColor='#00d2ff' />
                        <stop offset='.76' stopColor='#00dfff' />
                        <stop offset='1' stopColor='#00e3ff' />
                      </linearGradient>
                      <linearGradient id='b' x1='37.83' y1='22' x2='13.64' y2='22' gradientTransform='translate(0 2)' gradientUnits='userSpaceOnUse'>
                        <stop offset='0' stopColor='#ffe000' />
                        <stop offset='.41' stopColor='#ffbd00' />
                        <stop offset='.78' stopColor='orange' />
                        <stop offset='1' stopColor='#ff9c00' />
                      </linearGradient>
                      <linearGradient
                        id='c'
                        x1='28.83'
                        y1='24.3'
                        x2='6.07'
                        y2='47.05'
                        gradientTransform='translate(0 2)'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop offset='0' stopColor='#ff3a44' />
                        <stop offset='1' stopColor='#c31162' />
                      </linearGradient>
                      <linearGradient
                        id='d'
                        x1='11.3'
                        y1='2.18'
                        x2='21.46'
                        y2='12.34'
                        gradientTransform='translate(0 2)'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop offset='0' stopColor='#32a071' />
                        <stop offset='.07' stopColor='#2da771' />
                        <stop offset='.48' stopColor='#15cf74' />
                        <stop offset='.8' stopColor='#06e775' />
                        <stop offset='1' stopColor='#00f076' />
                      </linearGradient>
                    </defs>
                    <rect x='4' y='4' width='135' height='40' rx='5' ry='5' />
                    <path
                      d='M134 4.8a4.2 4.2 0 014.2 4.2v30a4.2 4.2 0 01-4.2 4.2H9A4.2 4.2 0 014.8 39V9A4.2 4.2 0 019 4.8h125m0-.8H9a5 5 0 00-5 5v30a5 5 0 005 5h125a5 5 0 005-5V9a5 5 0 00-5-5z'
                      fill='#a6a6a6'
                    />
                    <path
                      d='M72.14 25.75A4.25 4.25 0 1076.41 30a4.19 4.19 0 00-4.13-4.25zm0 6.83a2.58 2.58 0 112.39-2.75V30a2.46 2.46 0 01-2.34 2.58zm-9.31-6.83A4.25 4.25 0 1067.09 30 4.19 4.19 0 0063 25.75h-.13zm0 6.83a2.58 2.58 0 112.38-2.76V30a2.46 2.46 0 01-2.34 2.58h-.05zm-11.09-5.52v1.8h4.32a3.77 3.77 0 01-1 2.27 4.42 4.42 0 01-3.33 1.32 4.8 4.8 0 010-9.6A4.6 4.6 0 0155 24.14l1.27-1.27A6.29 6.29 0 0051.74 21a6.61 6.61 0 10-.51 13.21h.51a5.84 5.84 0 006.17-6.07 5.87 5.87 0 00-.1-1.13zm45.31 1.4a3.92 3.92 0 00-7.65 1.28V30a4.16 4.16 0 004.07 4.25h.15a4.23 4.23 0 003.54-1.88l-1.45-1a2.43 2.43 0 01-2.09 1.18 2.16 2.16 0 01-2.06-1.29l5.69-2.35zm-5.8 1.42a2.33 2.33 0 012.17-2.48 1.65 1.65 0 011.58.9zM86.63 34h1.87V21.5h-1.87zm-3.06-7.3h-.07a3 3 0 00-2.24-1 4.26 4.26 0 000 8.51 2.9 2.9 0 002.24-1h.06v.61c0 1.63-.87 2.5-2.27 2.5a2.35 2.35 0 01-2.14-1.51l-1.63.68A4.05 4.05 0 0081.29 38c2.19 0 4-1.29 4-4.43V26h-1.72zm-2.14 5.88a2.59 2.59 0 010-5.16 2.4 2.4 0 012.27 2.52V30a2.38 2.38 0 01-2.17 2.57h-.1zm24.38-11.08h-4.47V34h1.87v-4.74h2.61a3.89 3.89 0 100-7.76zm0 6h-2.61v-4.26h2.65a2.14 2.14 0 010 4.29zm11.53-1.8a3.5 3.5 0 00-3.34 1.91l1.66.69a1.77 1.77 0 011.7-.92 1.8 1.8 0 012 1.58v.16a4.13 4.13 0 00-1.95-.48c-1.79 0-3.6 1-3.6 2.81a2.89 2.89 0 003 2.75h.08a2.63 2.63 0 002.4-1.2h.06v1h1.8v-4.81c0-2.19-1.66-3.46-3.79-3.46zm-.23 6.85c-.61 0-1.46-.31-1.46-1.06 0-1 1.06-1.33 2-1.33a3.32 3.32 0 011.7.42 2.26 2.26 0 01-2.19 2zM127.74 26l-2.14 5.42h-.06L123.32 26h-2l3.33 7.58-1.9 4.21h1.95L129.82 26zm-16.81 8h1.87V21.5h-1.87z'
                      fill='#fff'
                    />
                    <path d='M14.44 11.54a2 2 0 00-.46 1.4v22.12a2 2 0 00.46 1.4l.07.07L26.9 24.15v-.29L14.51 11.47z' fill='url(#a)' />
                    <path d='M31 28.28l-4.1-4.13v-.29l4.1-4.14h.09L36 22.56c1.4.79 1.4 2.09 0 2.89l-4.89 2.78z' fill='url(#b)' />
                    <path d='M31.12 28.22L26.9 24 14.44 36.46a1.63 1.63 0 002.08.06l14.61-8.3' fill='url(#c)' />
                    <path d='M31.12 19.78l-14.61-8.3a1.63 1.63 0 00-2.08.06L26.9 24z' fill='url(#d)' />
                    <path d='M31 28.13l-14.49 8.25a1.67 1.67 0 01-2 0l-.07.07.07.07a1.66 1.66 0 002 0l14.61-8.3z' opacity='.2' />
                    <path
                      className='cls-8'
                      d='M14.44 36.32a2 2 0 01-.46-1.4v.15a2 2 0 00.46 1.4l.07-.07zM36 25.3l-5 2.83.09.09L36 25.44A1.75 1.75 0 0037 24a1.86 1.86 0 01-1 1.3z'
                    />
                    <path
                      d='M16.51 11.62L36 22.7a1.86 1.86 0 011 1.3 1.75 1.75 0 00-1-1.44L16.51 11.48c-1.4-.79-2.54-.13-2.54 1.47v.15c.03-1.61 1.15-2.27 2.54-1.48z'
                      opacity='.25'
                      fill='#fff'
                    />
                    <path
                      className='cls-10'
                      d='M45.28 17v-6h1.84a3 3 0 012.21.83 2.94 2.94 0 01.83 2.17 2.94 2.94 0 01-.83 2.17 3 3 0 01-2.21.83zm.77-.74h1.06A2.09 2.09 0 0049.37 14a2.09 2.09 0 00-1.91-2.26H46zm5.19.74v-6H52v6zm3.83.13a2.24 2.24 0 01-1.28-.43 2 2 0 01-.79-1.2l.7-.28a1.61 1.61 0 00.51.83 1.3 1.3 0 00.88.34 1.4 1.4 0 00.86-.26.84.84 0 00.36-.72.92.92 0 00-.36-.77 3.69 3.69 0 00-1.13-.51 3 3 0 01-1.21-.65 1.36 1.36 0 01-.41-1 1.49 1.49 0 01.51-1.12 1.87 1.87 0 011.29-.49 1.93 1.93 0 011.24.38 1.76 1.76 0 01.62.83l-.7.29a1 1 0 00-.37-.53 1.31 1.31 0 00-1.53 0 .75.75 0 00-.31.62.7.7 0 00.29.57 2.78 2.78 0 00.85.41 7.23 7.23 0 01.74.28 3.38 3.38 0 01.6.36 1.42 1.42 0 01.46.55 1.79 1.79 0 01.16.77 1.65 1.65 0 01-.18.78 1.46 1.46 0 01-.48.54 2.37 2.37 0 01-.64.31 2.4 2.4 0 01-.68.1zM59 17h-.77v-6h2a1.9 1.9 0 011.32.51 1.74 1.74 0 01.1 2.46l-.1.1a1.89 1.89 0 01-1.32.51H59zm0-3.17h1.29a1.05 1.05 0 00.81-1.74 1 1 0 00-.78-.33H59zm9 2.39a3.12 3.12 0 01-4.4 0 3.24 3.24 0 010-4.45 3.1 3.1 0 014.38 0 3.23 3.23 0 01.02 4.45zm-3.83-.5a2.31 2.31 0 003.26 0 2.56 2.56 0 000-3.44 2.31 2.31 0 00-3.26 0 2.56 2.56 0 000 3.44zM69.95 17v-6h.94l2.92 4.67V11h.77v6h-.8l-3.05-4.89V17zm6 0v-6h.77v6zm2.14 0v-6h2.17a1.76 1.76 0 011.22.46 1.51 1.51 0 01.52 1.17 1.31 1.31 0 01-.22.75 1.39 1.39 0 01-.59.49 1.52 1.52 0 01.73.52 1.36 1.36 0 01.29.86 1.57 1.57 0 01-.54 1.22 1.85 1.85 0 01-1.28.49zm.77-3.43h1.4a.9.9 0 00.7-.29A.89.89 0 0081 12a.86.86 0 00-.67-.29h-1.47zm0 2.69h1.55a.92.92 0 00.72-.31 1 1 0 00-.72-1.68h-1.55zm4.38.74v-6H84v5.26h2.6V17zm7.84-5.26h-2.73v1.9h2.46v.72h-2.46v1.9h2.73V17h-3.5v-6h3.5zm4.66 5.39a2.24 2.24 0 01-1.28-.43 2 2 0 01-.82-1.2l.7-.28a1.61 1.61 0 00.51.83 1.3 1.3 0 00.88.34 1.4 1.4 0 00.86-.26.84.84 0 00.36-.72.92.92 0 00-.36-.77 3.69 3.69 0 00-1.13-.51 3 3 0 01-1.21-.65 1.36 1.36 0 01-.41-1 1.49 1.49 0 01.51-1.12 1.87 1.87 0 011.33-.48 1.93 1.93 0 011.24.38 1.76 1.76 0 01.62.83l-.7.29a1 1 0 00-.37-.53 1.31 1.31 0 00-1.53 0 .75.75 0 00-.31.62.7.7 0 00.29.57 2.78 2.78 0 00.85.41 7.24 7.24 0 01.74.28 3.38 3.38 0 01.6.36 1.42 1.42 0 01.46.55 1.79 1.79 0 01.16.77 1.65 1.65 0 01-.18.78 1.46 1.46 0 01-.48.54 2.37 2.37 0 01-.64.31 2.4 2.4 0 01-.69.09zm5.2 0a2.11 2.11 0 01-1.61-.65 2.39 2.39 0 01-.62-1.71V11h.77v3.8a1.72 1.72 0 00.37 1.15A1.54 1.54 0 00102 16a1.72 1.72 0 00.37-1.15V11h.77v3.77a2.43 2.43 0 01-.6 1.71 2.1 2.1 0 01-1.6.65zm3.46-.13v-6h2a1.9 1.9 0 011.32.51 1.73 1.73 0 01.15 2.39 1.78 1.78 0 01-1 .61l1.68 2.49h-.91L106 14.57h-.86V17zm.77-3.15h1.24a1.13 1.13 0 00.79-.3 1 1 0 00.33-.76 1.06 1.06 0 00-.29-.72 1 1 0 00-.78-.33h-1.29z'
                      fill='#fff'
                    />
                  </svg>
                </a>
              </div>
              <div className='has-text-white'>
                <a title='Nous contacter' href='https://www.assistance.bouyguestelecom.fr/contact-service-clients'>
                  Nous contacter
                </a>{' '}
                |{' '}
                <a title='Infos légales' href='https://www.corporate.bouyguestelecom.fr/informations-legales'>
                  Infos légales
                </a>
              </div>
            </div>
          </FooterMobile>
          <FooterSub>
            <View classList={['social-icons']}>
              {/* <div className='social-icons'> */}
              <span className='is-hidden-touch'>Nous retrouver</span>
              <a title='Retrouvez-nous sur Facebook' href='https://www.facebook.com/bouyguestelecom'>
                <Icon classList={['is-size-5']} name={IconName.SOCIAL_FACEBOOK} />
                {/* <span className='icon is-size-5'>
                  <i className='tri-social-facebook' aria-hidden='true'></i>
                </span> */}
              </a>
              <a title='Retrouvez-nous sur Twitter' href='https://twitter.com/bouyguestelecom'>
                <Icon classList={['is-size-5']} name={IconName.SOCIAL_TWITTER} />
                {/* <span className='icon is-size-5'>
                  <i className='tri-social-twitter' aria-hidden='true'></i>
                </span> */}
              </a>
              <a title='Retrouvez-nous sur Youtube' href='https://www.youtube.com/user/BouyguesTelecom'>
                <Icon classList={['is-size-5']} name={IconName.SOCIAL_YOUTUBE} />
                {/* <span className='icon is-size-5'>
                  <i className='tri-social-youtube' aria-hidden='true'></i>
                </span> */}
              </a>
              <a title='Retrouvez-nous sur Instragram' href='https://www.instagram.com/bouyguestelecom/'>
                <Icon
                  // classList={['is-size-5']}
                  className={classNames(styles.isSize5)}
                  name={IconName.SOCIAL_INSTAGRAM}
                />
                {/* <span className='icon is-size-5'>
                  <i className='tri-social-instagram' aria-hidden='true'></i>
                </span> */}
              </a>
              {/* </div> */}
            </View>
            <div className={classNames(styles.partnersIcons, styles.isHiddenTouch)}>
              {/* <View classList={['partners-icons', 'is-hidden-touch']}> */}
              {/* <div className='partners-icons is-hidden-touch'> */}
              <span className={classNames(styles.icon)}>
                {/* <i className='tri-lock' aria-hidden='true'></i> */}
                <i className={classNames(styles.flexiLock)} aria-hidden='true'></i>
              </span>
              <span className={classNames(styles.icon)}>
                {/* <i className='tri-payment-visa' aria-hidden='true'></i> */}
                <i className={classNames(styles.flexiPaymentVisa)} aria-hidden='true'></i>
              </span>
              <span className={classNames(styles.icon)}>
                {/* <i className='tri-payment-paypal' aria-hidden='true'></i> */}
                <i className={classNames(styles.flexiPaymentPaypal)} aria-hidden='true'></i>
              </span>
              <span className={classNames(styles.icon)}>
                {/* <i className='tri-payment-mastercard' aria-hidden='true'></i> */}
                <i className={classNames(styles.flexiPaymentMastercard)} aria-hidden='true'></i>
              </span>
              <span className={classNames(styles.icon)}>
                {/* <i className='tri-payment-americanexpress' aria-hidden='true'></i> */}
                <i className={classNames(styles.flexiPaymentAmericanexpress)} aria-hidden='true'></i>
              </span>
              <span className={classNames(styles.icon)}>
                {/* <i className='tri-payment-cb' aria-hidden='true'></i> */}
                <i className={classNames(styles.flexiPaymentCb)} aria-hidden='true'></i>
              </span>
              <a title='Handicap Zero' href='https://www.handicapzero.org/telephonie/bouygues-telecom/'>
                <span className={classNames(styles.icon)}>
                  {/* <i className='tri-handicapzero' aria-hidden='true'></i> */}
                  <i className={classNames(styles.flexiHandicapzero)} aria-hidden='true'></i>
                </span>
              </a>
              <a title='Accessibilité de Bouygues Telecom' href='https://www.acce-o.fr/client/bouygues/'>
                <span className={classNames(styles.icon)}>
                  {/* <i className='tri-accessibility' aria-hidden='true'></i> */}
                  <i className={classNames(styles.flexiAccessibility)} aria-hidden='true'></i>
                </span>
              </a>
              {/* </View> */}
            </div>
          </FooterSub>
        </Footer>
      </Section>{' '}
      {/*
       * ##############
       * MENTIONS LEGALES
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Mentions légales</Title>
        <Divider />

        <Disclaimer title='Informations sur la Messagerie'>
          <DisclaimerItem>Disclaimer Item 1</DisclaimerItem>
          <DisclaimerItem>Disclaimer Item 2</DisclaimerItem>
          <DisclaimerItem>Disclaimer Item 3</DisclaimerItem>
        </Disclaimer>
      </Section>{' '}
      {/*
       * ##############
       * TABLEAU OFFRES
       * ##############
       */}
      <Section>
        <Section>
          <Title level={TitleLevel.LEVEL4}>Tableau offres</Title>
          <Divider />
        </Section>{' '}
        <Section>
          <PricingTable>
            <PricingTableExtra>
              <Card horizontal>
                <CardContent>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </CardContent>
              </Card>
            </PricingTableExtra>
            <PricingPlan>
              <PricingPlanExtra>
                <Card horizontal>
                  <CardContent>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </CardContent>
                </Card>
              </PricingPlanExtra>
              <PricingPlanProduct hat>
                <Sticker hat alert={AlertState.INFO}>
                  Test
                </Sticker>
                <PricingPlanHeader
                // background={themeMode === 'light' ? BackgroundStyle.WHITE : undefined}
                >
                  <Title>50Mo</Title>
                  <Text className='details'>Engagement 24 mois</Text>
                </PricingPlanHeader>
                <PricingPlanItems
                // background={themeMode === 'light' ? BackgroundStyle.WHITE : undefined}
                >
                  <PricingPlanPrice>
                    <Price
                      variant={PriceVariant.SECONDARY}
                      level={PriceLevel.LEVEL3}
                      amount={24.99}
                      className='is-loaded'
                      mention='(3)'
                      period='mois'
                      showCents
                    />
                  </PricingPlanPrice>
                  <PricingPlanItem spacing={3}>
                    <Sticker markup={StickerMarkup.P} small alert={AlertState.SUCCESS}>
                      Prix déjà client
                    </Sticker>
                    <Price level={PriceLevel.LEVEL3} amount={24.99} mention='(3)' period='mois' showCents />
                    <Text>12 mois, puis 1€</Text>
                  </PricingPlanItem>
                  <PricingPlanItem>Forfait exclusivement bloqué</PricingPlanItem>
                  <div className='plan-call-to-action'>
                    <Button variant={VariantState.PRIMARY} fullwidth>
                      Ajouter au panier
                    </Button>
                  </div>
                </PricingPlanItems>
                <PricingPlanItems>
                  <PricingPlanItem spacing={2}>
                    <Title level={TitleLevel.LEVEL6} className='plan-item-title'>
                      Appels / SMS / MMS
                    </Title>
                    <Text className='plan-item-details'>2h appel, SMS / MMS illimités</Text>
                  </PricingPlanItem>
                  <PricingPlanItem className='is-2'>
                    <Sticker alert={AlertState.INFO} small>
                      Options
                    </Sticker>
                    <Title level={TitleLevel.LEVEL6} className='plan-item-title'>
                      50Mo
                    </Title>
                    <Text className='plan-item-details'>Option</Text>
                  </PricingPlanItem>
                  <PricingPlanFooter>
                    <Link>En savoir plus</Link>
                  </PricingPlanFooter>
                </PricingPlanItems>
              </PricingPlanProduct>
            </PricingPlan>
            <PricingPlan>
              <PricingPlanExtra>
                <Box />
              </PricingPlanExtra>
              <PricingPlanProduct>
                <PricingPlanHeader>
                  <Title>50Mo</Title>
                  <Text className='details'>Engagement 24 mois</Text>
                </PricingPlanHeader>
                <PricingPlanItems
                // background={themeMode === 'light' ? BackgroundStyle.WHITE : undefined}
                >
                  <PricingPlanPrice>
                    <Price level={PriceLevel.LEVEL3} amount={24.99} className='is-loaded' mention='(3)' period='mois' showCents />
                  </PricingPlanPrice>
                  <PricingPlanItem spacing={3} />
                  <PricingPlanItem spacing={3}>
                    <View classList={['field']}>
                      <input
                        className='is-checkradio has-background-color is-info'
                        id='exampleCheckboxBackgroundColorSuccess'
                        type='checkbox'
                        name='exampleCheckboxBackgroundColorSuccess'
                      />
                      <label htmlFor='exampleCheckboxBackgroundColorSuccess'>Option bloquée</label>
                    </View>
                  </PricingPlanItem>
                  <div className='plan-call-to-action'>
                    <Button variant={VariantState.PRIMARY} fullwidth>
                      Ajouter au panier
                    </Button>
                  </div>
                </PricingPlanItems>
                <PricingPlanItems>
                  <PricingPlanItem spacing={2}>
                    <Title level={TitleLevel.LEVEL6}>Appels / SMS / MMS</Title>
                    <Text className='plan-item-details'>2h appel, SMS / MMS illimités</Text>
                  </PricingPlanItem>
                  <PricingPlanItem spacing={2}>
                    <Title level={TitleLevel.LEVEL6}>À étranger</Title>
                    <Text className='plan-item-details'>Option</Text>
                  </PricingPlanItem>
                </PricingPlanItems>
                <PricingPlanFooter>
                  <Link>En savoir plus</Link>
                </PricingPlanFooter>
              </PricingPlanProduct>
            </PricingPlan>
            <PricingPlan>
              <PricingTableExtra>
                <Box />
              </PricingTableExtra>
              <PricingPlanProduct>
                <PricingPlanHeader>
                  <Title level={TitleLevel.LEVEL6}>50Mo</Title>
                  <Text className='plan-item-details'>Engagement 24 mois</Text>
                </PricingPlanHeader>
                <PricingPlanItems
                // background={themeMode === 'light' ? BackgroundStyle.WHITE : undefined}
                >
                  <PricingPlanPrice>
                    <Price variant={PriceVariant.SECONDARY} level={PriceLevel.LEVEL3} amount={24.99} mention='(3)' period='mois' showCents />
                  </PricingPlanPrice>
                  <PricingPlanItem spacing={3}>
                    <Sticker markup={StickerMarkup.P} small alert={AlertState.SUCCESS}>
                      Prix déjà client
                    </Sticker>
                    <Price level={PriceLevel.LEVEL3} amount={24.99} mention='(3)' period='mois' showCents />
                    <Text>12 mois, puis 1€</Text>
                  </PricingPlanItem>
                  <PricingPlanItem>Forfait exclusivement bloqué</PricingPlanItem>
                  <div className='plan-call-to-action'>
                    <Button variant={VariantState.PRIMARY} fullwidth>
                      Ajouter au panier
                    </Button>
                  </div>
                </PricingPlanItems>
                <PricingPlanItems>
                  <PricingPlanItem narrow>
                    <Title level={TitleLevel.LEVEL6} className='plan-item-title'>
                      Appels / SMS / MMS
                    </Title>
                    <Text className='plan-item-details'>2h appel, SMS / MMS illimités</Text>
                  </PricingPlanItem>
                  <PricingPlanItem spacing={2}>
                    <Title level={TitleLevel.LEVEL6} className='plan-item-title'>
                      Options
                    </Title>
                    <Text className='plan-item-details'>Options</Text>
                  </PricingPlanItem>
                  <PricingPlanItem spacing={2}>
                    <Title level={TitleLevel.LEVEL6} className='plan-item-title'>
                      Options
                    </Title>
                    <Text className='plan-item-details'>Options</Text>
                  </PricingPlanItem>
                  <PricingPlanFooter>
                    <Link> En savoir plus</Link>
                  </PricingPlanFooter>
                </PricingPlanItems>
              </PricingPlanProduct>
            </PricingPlan>
          </PricingTable>
        </Section>{' '}
      </Section>
      {/*
       * ##############
       * PRODUCT TOUR
       * ##############
       */}
      <Section>
        <Section>
          <Title level={TitleLevel.LEVEL4}>Product tour</Title>
          <Divider />
        </Section>{' '}
        <Section>
          <ProductTour
            avatarDirection={AvatarDirection.LEFT}
            active
            closeable
            arrowDirection={ArrowDirection.UP}
            avatarSrc={`${process.env.FLEX_CONTENT_HOST}/assets/jpg/avatar_square.jpg`}
          >
            <Text>Product tour text content</Text>
          </ProductTour>

          <div style={{ marginBottom: '150px' }} />

          <Title level={TitleLevel.LEVEL4}>Pagination</Title>
          <Divider />

          <Pagination onClick={(e) => console.log('event', e)} count={100} defaultPage={2} />
        </Section>{' '}
      </Section>
      {/*
       * ##############
       * HEADER NEW
       * ##############
       */}
      {/*
      <Section>
        <Title level={TitleLevel.LEVEL4}>Header (new)</Title>
        <Divider />

        <div className={classNames(styles.isClipped)}>
          <Navbar newNavbar>
            <NavbarMenu>
              <NavbarStart>
                <NavbarLinks>
                  <NavbarItem megaDropdown>
                    <NavbarLink href={'#'}>Téléphones / Accessoires</NavbarLink>
                    <NavbarDropdown>
                      <NavbarDropdownSection>
                        <Icon
                          className='navbar-category-title'
                          content='Téléphones'
                          name={IconName.MOBILE}
                          size={IconSize.SMALL}
                        />
                        <NavbarLink href={'#'}>Iphone</NavbarLink>
                        <NavbarLink href={'#'}>Samsung</NavbarLink>
                        <NavbarLink href={'#'}>Huawei</NavbarLink>
                        <Icon
                          className='navbar-category-title'
                          content='Bons plans'
                          name={IconName.MOBILE}
                          size={IconSize.SMALL}
                        />
                        <NavbarLink href={'#'} highlighted>
                          Tous les Bons Plans
                        </NavbarLink>
                      </NavbarDropdownSection>
                      <NavbarDropdownSection>
                        <Icon
                          className='navbar-category-title'
                          content='Accessoires pour téléphone'
                          name={IconName.MOBILE}
                          size={IconSize.SMALL}
                        />
                        <NavbarLink href={'#'}>Étuis et protections</NavbarLink>
                        <NavbarLink href={'#'}>Clé 4G et tablette 4G</NavbarLink>
                        <NavbarLink href={'#'} highlighted>
                          Tous les accessoires pour téléphone
                        </NavbarLink>
                      </NavbarDropdownSection>
                      <NavbarDropdownSection>
                        <img alt='Bouygues Telecom' src='https://fakeimg.pl/350x200/?text=Contenu+libre' />
                      </NavbarDropdownSection>
                    </NavbarDropdown>
                  </NavbarItem>
                  <NavbarItem>
                    <NavbarLink href={'#'}>Forfaits mobile</NavbarLink>
                  </NavbarItem>
                  <NavbarItem>
                    <NavbarLink href={'#'}>Box internet</NavbarLink>
                  </NavbarItem>
                  <NavbarItem>
                    <NavbarLink href={'#'}>Forfaits mobile + Box</NavbarLink>
                  </NavbarItem>
                  <NavbarItem>
                    <Icon
                      markup={TextIconMarkup.SPAN}
                      className='navbar-category-title navbar-link has-text-primary'
                      content='Promos'
                      name={IconName.V_SIGN}
                      size={IconSize.SMALL}
                      position={IconPosition.RIGHT}
                    />
                  </NavbarItem>
                </NavbarLinks>
              </NavbarStart>
            </NavbarMenu>
          </Navbar>
        </div>

        <div style={{ marginBottom: '100px' }} />

        <Title level={TitleLevel.LEVEL4}>Complete header (new)</Title>
        <Divider />

        <div className={classNames(styles.isClipped)}>
          <Navbar newNavbar>
            <NavbarBrand>
              <NavbarItem markup={NavbarItemMarkup.A} hiddenTablet>
                <img
                  alt='Bouygues Telecom'
                  src='https://ci.flexiness.com:3333/img/Logo.svg'
                />
              </NavbarItem>
              <NavbarItem markup={NavbarItemMarkup.A} hiddenMobile>
                <img
                  alt='Bouygues Telecom'
                  src='https://ci.flexiness.com:3333/img/Logo.svg'
                />
              </NavbarItem>
            </NavbarBrand>
            <NavbarMenu hiddenTouch>
              <NavbarStart>
                <NavbarLinks>
                  <NavbarItem megaDropdown>
                    <NavbarLink href={'#'}>Téléphones / Accessoires</NavbarLink>
                    <NavbarDropdown>
                      <NavbarDropdownSection>
                        <Icon
                          className='navbar-category-title'
                          content='Téléphones'
                          name={IconName.MOBILE}
                          size={IconSize.SMALL}
                        />
                        <NavbarLink to='/iphone'>Iphone</NavbarLink>
                        <NavbarLink onClick={() => console.log('Navbar link click alert')}>Samsung</NavbarLink>
                        <NavbarLink href='Huawei'>Huawei</NavbarLink>
                        <NavbarLink href={'#'}>Samsung</NavbarLink>
                        <NavbarLink href={'#'}>Huawei</NavbarLink>
                        <Icon
                          className='navbar-category-title'
                          content='Bons plans'
                          name={IconName.MOBILE}
                          size={IconSize.SMALL}
                        />
                        <NavbarLink href={'#'} highlighted>
                          Tous les Bons Plans
                        </NavbarLink>
                      </NavbarDropdownSection>
                      <NavbarDropdownSection>
                        <Icon
                          className='navbar-category-title'
                          content='Accessoires pour téléphone'
                          name={IconName.MOBILE}
                          size={IconSize.SMALL}
                        />
                        <NavbarLink href={'#'}>Étuis et protections</NavbarLink>
                        <NavbarLink href={'#'}>Clé 4G et tablette 4G</NavbarLink>
                        <NavbarLink href={'#'} highlighted>
                          Tous les accessoires pour téléphone
                        </NavbarLink>
                      </NavbarDropdownSection>
                      <NavbarDropdownSection>
                        <img alt='Bouygues Telecom' src='https://fakeimg.pl/350x200/?text=Contenu+libre' />
                      </NavbarDropdownSection>
                    </NavbarDropdown>
                  </NavbarItem>
                  <NavbarItem>
                    <NavbarLink href={'#'}>Forfaits mobile</NavbarLink>
                  </NavbarItem>
                  <NavbarItem>
                    <NavbarLink href={'#'}>Box internet</NavbarLink>
                  </NavbarItem>
                  <NavbarItem>
                    <NavbarLink href={'#'}>Forfaits mobile + Box</NavbarLink>
                  </NavbarItem>
                  <NavbarItem>
                    <Icon
                      markup={TextIconMarkup.SPAN}
                      className='navbar-category-title navbar-link has-text-primary'
                      content='Promos'
                      name={IconName.V_SIGN}
                      size={IconSize.SMALL}
                      position={IconPosition.RIGHT}
                    />
                  </NavbarItem>
                </NavbarLinks>
              </NavbarStart>
            </NavbarMenu>
            <NavbarMenu>
              <NavbarExtras hiddenTouch>
                <Input hasIcon type={InputType.TEXT} placeholder='Forfait, téléphones, fibre…' />
              </NavbarExtras>
              <NavbarEnd>
                <NavbarItem>
                  <NavbarLink href={'https://google.fr'}>
                    <Icon
                      markup={TextIconMarkup.SPAN}
                      textClassName='is-hidden-mobile'
                      content='Assistance'
                      name={IconName.HANDS_HELPING}
                      size={IconSize.SMALL}
                      position={IconPosition.LEFT}
                    />
                  </NavbarLink>
                </NavbarItem>
                <NavbarItem>
                  <NavbarLink href={'https://google.fr'}>
                    <Icon
                      markup={TextIconMarkup.SPAN}
                      textClassName='is-hidden-mobile'
                      content='Nos boutiques'
                      name={IconName.STORE}
                      size={IconSize.SMALL}
                      position={IconPosition.LEFT}
                    />
                  </NavbarLink>
                </NavbarItem>
                <NavbarItem>
                  <NavbarLink href={'https://google.fr'}>
                    <Icon
                      badgeContent='2'
                      stacked
                      textClassName='is-hidden-mobile'
                      content='Panier'
                      name={IconName.UI_SHOPPING_CART}
                      position={IconPosition.LEFT}
                    />
                  </NavbarLink>
                </NavbarItem>
                <NavbarItem alternate>
                  <NavbarLink href='https://google.fr'>
                    <Icon name={IconName.UI_USER} />
                    <Text className='is-hidden-mobile' markup={TextMarkup.SPAN}>
                      Se connecter
                    </Text>
                  </NavbarLink>
                </NavbarItem>

                <NavbarItem alternate hiddenDesktop>
                  <Icon name={IconName.UI_MENU} />
                  <NavbarDropdown>
                    <NavbarDropdownSection extras>
                      <Input hasIcon search type={InputType.TEXT} placeholder='Forfait, téléphones, fibre…' />
                    </NavbarDropdownSection>
                    <NavbarDivider />
                    <NavbarDropdownSection className='navbar-extras'>
                      <NavbarAccordionItem headerContent='Téléphones et accessoires'>
                        <NavbarLink>Item</NavbarLink>
                        <NavbarLink>Item</NavbarLink>
                      </NavbarAccordionItem>
                      <NavbarAccordionItem headerContent='Forfaits mobiles'>
                        <NavbarLink>Item</NavbarLink>
                        <NavbarLink>Item</NavbarLink>
                      </NavbarAccordionItem>
                      <NavbarAccordionItem headerContent='Box internet'>
                        <NavbarLink>Item</NavbarLink>
                        <NavbarLink>Item</NavbarLink>
                      </NavbarAccordionItem>
                      <NavbarAccordionItem headerContent='Forfait mobile + Box'>
                        <NavbarLink>Item</NavbarLink>
                        <NavbarLink>Item</NavbarLink>
                      </NavbarAccordionItem>
                      <NavbarAccordionItem headerContent='Promos'>
                        <NavbarLink>Item</NavbarLink>
                        <NavbarLink>Item</NavbarLink>
                      </NavbarAccordionItem>
                    </NavbarDropdownSection>
                    <NavbarDropdownSection>
                      <NavbarLink className='has-ending-arrow'>Accéder à votre espace client</NavbarLink>
                      <NavbarLink className='has-ending-arrow'>Suivre votre commande</NavbarLink>
                      <NavbarLink className='has-ending-arrow'>Activer votre ligne</NavbarLink>
                    </NavbarDropdownSection>
                    <NavbarDivider />
                    <NavbarDropdownSection>
                      <NavbarItem>
                        <NavbarLink href='#'>
                          <Icon name={IconName.HANDS_HELPING} size={IconSize.SMALL} content='Assistance' />
                        </NavbarLink>
                      </NavbarItem>
                      <NavbarItem>
                        <NavbarLink href='#'>
                          <Icon name={IconName.STORE} size={IconSize.SMALL} content='Nos boutique' />
                        </NavbarLink>
                      </NavbarItem>
                      <NavbarItem>
                        <NavbarLink href='#'>
                          <Icon name={IconName.UI_LOGO} size={IconSize.SMALL} content='La marque' />
                        </NavbarLink>
                      </NavbarItem>
                      <NavbarItem>
                        <NavbarLink href='#'>
                          <Icon name={IconName.USER_TIE} size={IconSize.SMALL} content='Professionel' />
                        </NavbarLink>
                      </NavbarItem>
                    </NavbarDropdownSection>
                    <NavbarDropdownSection>
                      <Columns mobile>
                        <ColumnsItem>
                          <a href='/' className='is-flex is-positionned-center'>
                            <img
                              alt='Bouygues Telecom'
                              src='https://design.bouyguestelecom.fr/store-apple.5ab39ea3.svg'
                              className='is-block'
                            />
                          </a>
                        </ColumnsItem>
                        <ColumnsItem>
                          <a href='/' className='is-flex is-positionned-center'>
                            <img
                              alt='Bouygues Telecom'
                              src='https://design.bouyguestelecom.fr/store-google.63dc5064.svg'
                              className='is-block'
                            />
                          </a>
                        </ColumnsItem>
                      </Columns>
                    </NavbarDropdownSection>
                  </NavbarDropdown>
                </NavbarItem>
              </NavbarEnd>
            </NavbarMenu>
          </Navbar>
        </div>
        <div style={{ marginBottom: '200px' }} />
      </Section>
      */}
      {/*
       * ##############
       * LISTE ELEMENT
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>{`Liste d'éléments classiques`}</Title>
        <Divider />
        <List>
          <ListItem>Bonjour</ListItem>
          <ListItem>Bonjour</ListItem>
          <ListItem>Bonjour</ListItem>
        </List>
      </Section>
      {/*
       * ##############
       * LISTE ELEMENTS AVEC ICONES
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>{`Liste d'éléments avec icônes`}</Title>
        <Divider />

        <List hasIcon>
          <ListItem status={ListIconStatus.SUCCESS} customIcon={IconName.CHECK}>
            Bonjour
          </ListItem>
          <ListItem status={ListIconStatus.DANGER} customIcon={IconName.TIMES}>
            Bonjour
          </ListItem>
          <ListItem status={ListIconStatus.DANGER} customIcon={IconName.TIMES}>
            Bonjour
          </ListItem>
        </List>
      </Section>
      {/*
       * ##############
       * LISTE DESCRIPTIONS
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Liste de descriptions</Title>
        <Divider />

        <List>
          <ListItem title='Title'>
            <ListItemDescription>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever
              since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book
            </ListItemDescription>
          </ListItem>
          <ListItem title='Title'>
            <ListItemDescription>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever
              since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book
            </ListItemDescription>
          </ListItem>
        </List>
      </Section>
      {/*
       * ##############
       * LISTE DESCRIPTION INVERSE
       * ##############
       */}
      <Section>
        <Title level={TitleLevel.LEVEL4}>Liste de descriptions inversé</Title>
        <Divider />

        <List>
          <ListItem title='Title'>
            <ListItemDescription>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever
              since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book
            </ListItemDescription>
            <ListItemDescription>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever
              since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book
            </ListItemDescription>
          </ListItem>
          <ListItem title='Title'>
            <ListItemDescription>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever
              since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book
            </ListItemDescription>
            <ListItemDescription>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever
              since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book
            </ListItemDescription>
          </ListItem>
        </List>
      </Section>
      {/*
       * ##############
       * COULEURS DES TEXTES
       * ##############
       */}
      <Section>
        <Section>
          <Title level={TitleLevel.LEVEL4}>Couleurs des textes</Title>
          <Divider />

          <Table bordered>
            <TableHead>
              <TableTr>
                <TableTh>Classe CSS</TableTh>
                <TableTh>Couleur de la marque</TableTh>
              </TableTr>
            </TableHead>
            <TableBody>
              <TableTr>
                <TableTd>has-text-primary</TableTd>
                <TableTd>
                  <Text typo={TypographyColor.TEXT_PRIMARY}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd>has-text-secondary</TableTd>
                <TableTd>
                  <Text typo={TypographyColor.TEXT_SECONDARY}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd>has-text-tertiary</TableTd>
                <TableTd>
                  <Text typo={TypographyColor.TEXT_TERTIARY}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd>has-text-quaternary</TableTd>
                <TableTd>
                  <Text typo={TypographyColor.TEXT_QUATERNARY}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
            </TableBody>
          </Table>
        </Section>
        <Section>
          <Table bordered>
            <TableHead>
              <TableTr>
                <TableTh>Classe CSS</TableTh>
                <TableTh>Couleur sémantique</TableTh>
              </TableTr>
            </TableHead>
            <TableBody>
              <TableTr>
                <TableTd>has-text-info</TableTd>
                <TableTd>
                  <Text typo={TypographyColor.TEXT_INFO}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd>has-text-success</TableTd>
                <TableTd>
                  <Text typo={TypographyColor.TEXT_SUCCESS}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd>has-text-warning</TableTd>
                <TableTd>
                  <Text typo={TypographyColor.TEXT_WARNING}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd>has-text-danger</TableTd>
                <TableTd>
                  <Text typo={TypographyColor.TEXT_DANGER}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
            </TableBody>
          </Table>
        </Section>
        <Section>
          <Table bordered>
            <TableHead>
              <TableTr>
                <TableTh>Classe CSS</TableTh>
                <TableTh>Variante de gris</TableTh>
              </TableTr>
            </TableHead>
            <TableBody>
              <TableTr>
                <TableTd>has-text-grey-dark</TableTd>
                <TableTd>
                  <Text typo={TypographyColor.TEXT_GREY_DARK}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd>has-text-grey-</TableTd>
                <TableTd>
                  <Text typo={TypographyColor.TEXT_GREY}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd>has-text-grey-light</TableTd>
                <TableTd>
                  <Text typo={TypographyColor.TEXT_GREY_LIGHT}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd>has-text-grey-lighter</TableTd>
                <TableTd>
                  <Text typo={TypographyColor.TEXT_GREY_LIGHTER}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd>has-text-white</TableTd>
                <TableTd>
                  <Text typo={TypographyColor.TEXT_WHITE}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
            </TableBody>
          </Table>
        </Section>
        <Section>
          <Title level={TitleLevel.LEVEL4}>Transformation du texte</Title>
          <Divider />

          <Table bordered>
            <TableHead>
              <TableTr>
                <TableTh>Classe CSS</TableTh>
                <TableTh>Résultat</TableTh>
              </TableTr>
            </TableHead>
            <TableBody>
              <TableTr>
                <TableTd>is-capitalized</TableTd>
                <TableTd>
                  <Text typo={TypographyTransform.TEXT_CAPITALIZED}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd>is-lowercase</TableTd>
                <TableTd>
                  <Text typo={TypographyTransform.TEXT_LOWERCASE}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd>is-uppercase</TableTd>
                <TableTd>
                  <Text typo={TypographyTransform.TEXT_UPPERCASE}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd>is-italic</TableTd>
                <TableTd>
                  <Text typo={TypographyTransform.TEXT_ITALIC}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
            </TableBody>
          </Table>
        </Section>
        <Section>
          <Title level={TitleLevel.LEVEL4}>Graisse du texte</Title>
          <Divider />

          <Table bordered>
            <TableHead>
              <TableTr>
                <TableTh>Classe CSS</TableTh>
                <TableTh>Résultat</TableTh>
              </TableTr>
            </TableHead>
            <TableBody>
              <TableTr>
                <TableTd>has-text-weight-normal</TableTd>
                <TableTd>
                  <Text typo={TypographyBold.TEXT_WEIGHT_NORMAL}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd>has-text-weight-medium</TableTd>
                <TableTd>
                  <Text typo={TypographyBold.TEXT_WEIGHT_MEDIUM}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd>has-text-weight-semibold</TableTd>
                <TableTd>
                  <Text typo={TypographyBold.TEXT_WEIGHT_SEMIBOLD}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
            </TableBody>
          </Table>
        </Section>
        <Section>
          <Title level={TitleLevel.LEVEL4}>Alignement du texte</Title>
          <Divider />

          <Table bordered fullwidth>
            <TableHead>
              <TableTr>
                <TableTh>Classe CSS</TableTh>
                <TableTh>Résultat</TableTh>
              </TableTr>
            </TableHead>
            <TableBody>
              <TableTr>
                <TableTd>has-text-centered</TableTd>
                <TableTd>
                  <Text typo={TypographyAlign.TEXT_CENTERED}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd>has-text-justified</TableTd>
                <TableTd>
                  <Text typo={TypographyAlign.TEXT_JUSTIFIED}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd>has-text-left</TableTd>
                <TableTd>
                  <Text typo={TypographyAlign.TEXT_LEFT}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd>has-text-right</TableTd>
                <TableTd>
                  <Text typo={TypographyAlign.TEXT_RIGHT}>Lorem ipsum dolor sit amet</Text>
                </TableTd>
              </TableTr>
            </TableBody>
          </Table>
        </Section>
        <Section>
          <Title level={TitleLevel.LEVEL4}>Typographie pour titres</Title>
          <Divider />

          <Table bordered fullwidth>
            <TableHead>
              <TableTr>
                <TableTh>Classe(s) CSS</TableTh>
                <TableTh>Résultat</TableTh>
              </TableTr>
            </TableHead>
            <TableBody>
              <TableTr>
                <TableTd>has-text-success + is-italic</TableTd>
                <TableTd>
                  <Title level={TitleLevel.LEVEL5} typo={`${TypographyColor.TEXT_SUCCESS} ${TypographyTransform.TEXT_ITALIC}`}>
                    Titre 5
                  </Title>
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd>has-text-uppercase + has-text-right</TableTd>
                <TableTd>
                  <Title level={TitleLevel.LEVEL3} typo={`${TypographyTransform.TEXT_UPPERCASE} ${TypographyAlign.TEXT_RIGHT}`}>
                    Titre 3
                  </Title>
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTd>has-text-weight-semibold + has-text-centered</TableTd>
                <TableTd>
                  <Title level={TitleLevel.LEVEL1} typo={`${TypographyBold.TEXT_WEIGHT_SEMIBOLD} ${TypographyAlign.TEXT_CENTERED}`}>
                    Titre 1
                  </Title>
                </TableTd>
              </TableTr>
            </TableBody>
          </Table>
        </Section>
      </Section>
      <Section>
        <Title level={TitleLevel.LEVEL4}>Slice</Title>
        <Slice onClick={() => alert('Click on whole slice')}>
          <SliceIcon iconSize={IconSize.LARGE} iconName={IconName.TV_BTV} />
          <SliceContent>
            <Title level={TitleLevel.LEVEL6}>Slice avec un simple icône chevron svg</Title>
            <Text>Un texte supplémentaire pour décrire le contenu de l&apos;action</Text>
          </SliceContent>
          <SliceCta>
            <Icon name={IconName.UI_ARROW_RIGHT} size={IconSize.SMALL} />
          </SliceCta>
        </Slice>

        <div style={{ marginTop: '15px' }} />

        <Slice>
          <SliceIcon iconSize={IconSize.LARGE} iconName={IconName.TV_BTV} />
          <SliceContent>
            <Title level={TitleLevel.LEVEL6}>Slice avec un simple bouton CTA</Title>
            <Text>Un texte supplémentaire pour décrire le contenu de l&apos;action</Text>
          </SliceContent>
          <SliceCta>
            <Button variant={VariantState.PRIMARY} onClick={() => alert('click on cta')}>
              Button CTA
            </Button>
          </SliceCta>
        </Slice>

        <div style={{ marginTop: '15px' }} />
      </Section>
      <Section>
        <Title level={TitleLevel.LEVEL4}>Slice Options avec Input(s)</Title>
        <SliceList selectable>
          <Slice
            selectable
            onClick={() => {
              setSliceCheckone(!sliceCheckone)
              setSliceChecktwo(false)
              setSliceCheckthree(false)
            }}
          >
            <Checkbox removeControl removeField name='slice_checkone' id='slice_checkone' checked={sliceCheckone} />
            <SliceContent>
              <Title level={TitleLevel.LEVEL6}>Slice avec un bouton (activable)</Title>
              <Text>Un texte supplémentaire pour décrire le contenu de l&apos;action</Text>
            </SliceContent>
            {sliceCheckone && (
              <SliceCta>
                <Button variant={VariantState.PRIMARY} onClick={() => alert('click on cta')}>
                  Button CTA
                </Button>
              </SliceCta>
            )}
          </Slice>
          <Slice
            selectable
            onClick={() => {
              setSliceCheckone(false)
              setSliceChecktwo(!sliceChecktwo)
              setSliceCheckthree(false)
            }}
          >
            <Checkbox removeControl removeField name='slice_checktwo' id='slice_checktwo' checked={sliceChecktwo} />
            <SliceIcon iconSize={IconSize.LARGE} iconName={IconName.TV_BTV} />
            <SliceContent>
              <Title level={TitleLevel.LEVEL6}>Icône (.svg) + Slice avec un bouton (activable)</Title>
              <Text>Un texte supplémentaire pour décrire le contenu de l&apos;action</Text>
            </SliceContent>
            {sliceChecktwo && (
              <SliceCta>
                <Button variant={VariantState.PRIMARY} onClick={() => alert('click on cta')}>
                  Button CTA
                </Button>
              </SliceCta>
            )}
          </Slice>
          <Slice
            selectable
            onClick={() => {
              setSliceCheckone(false)
              setSliceChecktwo(false)
              setSliceCheckthree(!sliceCheckthree)
            }}
          >
            <Checkbox removeControl removeField name='slice_checkthree' id='slice_checkthree' checked={sliceCheckthree} />
            <SliceImage src='https://ci.flexiness.com:5001/assets/png/arrow-left-flex.png' alt='chevron' />
            <SliceContent>
              <Title level={TitleLevel.LEVEL6}>Image (.png) + Slice avec un bouton (activable)</Title>
              <Text>Un texte supplémentaire pour décrire le contenu de l&apos;action</Text>
            </SliceContent>
            {sliceCheckthree && (
              <SliceCta>
                <Button variant={VariantState.PRIMARY} onClick={() => alert('click on cta')}>
                  Button CTA
                </Button>
              </SliceCta>
            )}
          </Slice>
        </SliceList>
      </Section>
      <Section>
        <Title level={TitleLevel.LEVEL4}>Slice Options sans Input</Title>
        <SliceList selectable>
          <Slice
            selectable
            onClick={() => {
              setSliceCheckfour(!sliceCheckfour)
            }}
          >
            <SliceImage rounded src={`${process.env.FLEX_CONTENT_HOST}/assets/jpg/avatar_square.jpg`} alt='chevron' />
            <SliceContent>
              <Title level={TitleLevel.LEVEL6}>Image (rounded) + Slice avec un bouton (activable)</Title>
              <Text>Un texte supplémentaire pour décrire le contenu de l&apos;action</Text>
            </SliceContent>
            {sliceCheckfour && (
              <SliceCta>
                <Button variant={VariantState.SECONDARY} onClick={() => alert('click on cta')}>
                  Button CTA
                </Button>
              </SliceCta>
            )}
          </Slice>
        </SliceList>
      </Section>
      <Section>
        <Title level={TitleLevel.LEVEL4}>Composant View</Title>
        <View loading={Loading.LOADING}>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Phasellus nec iaculis mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Phasellus nec iaculis mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
          </Text>
        </View>
      </Section>
    </View>
  )
})

const  ModulesDefault: React.FC<AppProps> = ({ isStandalone = false }) => {
  return isStandalone ? (
    <Router>
      <View>
        <App />
      </View>
    </Router>
  ) : (
    <View>
      <App />
    </View>
  )
}

export default ModulesDefault
