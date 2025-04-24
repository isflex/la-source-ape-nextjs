import React, { useState } from 'react'
import { VariantState, AlertState } from './src/objects/facets'
import { ScrollView, StyleSheet, Alert, Image, Dimensions } from 'react-native'
import { Loading } from './src/objects/facets/Loadable'
import {
  View,
  Button,
  Text,
  TextLevel,
  Title,
  TitleLevel,
  InputStatus,
  Input,
  InputType,
  Textarea,
  IconName,
  Sticker,
  Divider,
  Badge,
  BadgeTextDirection,
  Switch,
  Checkbox,
  Radio,
  Container,
  Columns,
  ColumnsItem,
  Tag,
  TagVariant,
  Card,
  CardContent,
  CardImage,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Box,
  BoxContent,
  BoxFooter,
  BoxHeader,
  Link,
  Price,
  PriceVariant,
  PriceLevel,
  Tile,
  Icon,
  IconSize,
  IconPosition,
  IconStatus,
  IconStatusPosition,
  Notification,
  Tabs,
  TabsItem,
  Progress,
  ProgressItem,
  ProgressRadial,
  Modal,
  Select,
  SelectOption,
  Slider,
  SliderItem,
  Hero,
  Stepper,
  StepperStep,
  Pagination,
  Rows,
  RowItem,
  Table,
  TableBody,
  TableHead,
  TableTd,
  TableTh,
  TableTr,
  Options,
  OptionsItem,
  InfoBlock,
  InfoBlockAction,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus,
  IconColor,
} from './src/unstyled-module-components'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 50,
    paddingLeft: 35,
    paddingRight: 35,
  },
  sliderContainer: {
    padding: 0,
  },
  view: {
    marginTop: 15,
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
  },
})

const App = (): React.JSX.Element => {
  const [radio, setRadio] = useState('radioTwo')
  const [option, setOption] = useState('optionTwo')
  const data = [
    {
      key: 0,
      label: 'Radio One',
      value: 'radioOne',
    },
    {
      key: 1,
      label: 'Radio Two',
      value: 'radioTwo',
    },
  ]

  const dataOption = [
    {
      key: 0,
      label: 'Option One',
      value: 'optionOne',
      name: 'options',
    },
    {
      key: 1,
      label: 'Option Two',
      value: 'optionTwo',
      name: 'options',
    },
  ]

  const checkRadio = (value: string) => {
    setRadio(value)
  }

  const checkOption = (value: string) => {
    setOption(value)
  }

  const width = Dimensions.get('screen')
  const height = (width.width * 100) / 60 // 60%

  return (
    <ScrollView style={styles.container}>
      <Title level={TitleLevel.LEVEL2}>Trilogy React Native</Title>

      <View style={styles.view}>
        <Text level={TextLevel.LEVEL3}>Bouton</Text>
        <Button fullwidth variant={VariantState.PRIMARY} onClick={() => Alert.alert('My alert')}>
          BUTTON NATIVE
        </Button>
        <View style={styles.view} />
        <Button variant={VariantState.SECONDARY} onClick={() => Alert.alert('My alert')}>
          BUTTON NATIVE
        </Button>
        <View style={styles.view} />
        <Button disabled onClick={() => Alert.alert('My alert')}>
          BUTTON NATIVE
        </Button>
        <View style={styles.view} />
        <Button small variant={VariantState.PRIMARY} onClick={() => Alert.alert('My alert')}>
          SMALL NATIVE BUTTON
        </Button>
        <View style={styles.view} />
        <Button loading={Loading.LOADING} variant={VariantState.PRIMARY}>
          Loading Button
        </Button>
        <View style={styles.view} />
        <Button compact variant={VariantState.PRIMARY}>
          Compact Button
        </Button>
        <View style={styles.view} />
        <Text level={TextLevel.LEVEL1}>Text native 1</Text>
        <Text level={TextLevel.LEVEL2}>Text native 2</Text>
        <Text level={TextLevel.LEVEL3}>Text native 3</Text>
        <Text level={TextLevel.LEVEL4}>Text native 4</Text>
        <Title level={TitleLevel.LEVEL1}>Title level 1</Title>
        <Title level={TitleLevel.LEVEL2}>Title level 2</Title>
        <Title level={TitleLevel.LEVEL3}>Title level 3</Title>
        <Title level={TitleLevel.LEVEL4}>Title level 4</Title>
        <Title level={TitleLevel.LEVEL5}>Title level 5</Title>
        <Title level={TitleLevel.LEVEL6}>Title level 6</Title>
        <Title level={TitleLevel.LEVEL7}>Title level 7</Title>

        <Hero variant={VariantState.TERTIARY}>
          <Text inverted level={TextLevel.LEVEL1}>
            Text native 1
          </Text>
          <Text inverted level={TextLevel.LEVEL2}>
            Text native 2
          </Text>
          <Text inverted level={TextLevel.LEVEL3}>
            Text native 3
          </Text>
          <Text inverted level={TextLevel.LEVEL4}>
            Text native 4
          </Text>
          <Title inverted level={TitleLevel.LEVEL1}>
            Title level 1
          </Title>
          <Title inverted level={TitleLevel.LEVEL2}>
            Title level 2
          </Title>
          <Title inverted level={TitleLevel.LEVEL3}>
            Title level 3
          </Title>
          <Title inverted level={TitleLevel.LEVEL4}>
            Title level 4
          </Title>
          <Title inverted level={TitleLevel.LEVEL5}>
            Title level 5
          </Title>
          <Title inverted level={TitleLevel.LEVEL6}>
            Title level 6
          </Title>
          <Title inverted level={TitleLevel.LEVEL7}>
            Title level 7
          </Title>
        </Hero>

        <View style={styles.view} />
        <Text level={TextLevel.LEVEL3}>Champs</Text>
        <Input
          hasIcon
          status={InputStatus.SUCCESS}
          name='success'
          placeholder='Default input placeholder'
          help='This is my help message'
          defaultValue='Success Input'
          autoCorrect={false}
          disabled={false}
        />
        <View style={styles.view} />
        <Input
          hasIcon
          name='warning'
          placeholder='Default input placeholder'
          status={InputStatus.WARNING}
          help='This is my help message'
          defaultValue='Warning Input'
        />
        <View style={styles.view} />
        <Input
          hasIcon
          name='danger'
          placeholder='Default input placeholder'
          status={InputStatus.DANGER}
          help='This is my help message'
          defaultValue='Danger Input'
        />
        <View style={styles.view} />
        <Input
          hasIcon
          customIcon={IconName.AFRICA}
          type={InputType.PASSWORD}
          name='danger'
          placeholder='Password placeholder'
          help='This is my help message'
          defaultValue='Input password'
        />
        <View style={styles.view} />
        <Text level={TextLevel.LEVEL3}>Barre de recherche</Text>
        <Input search name='search' placeholder='Search something' />
        <View style={styles.view} />
        <Text level={TextLevel.LEVEL3}>Textarea</Text>
        <Textarea
          name='danger'
          placeholder='Textarea placeholder'
          help='This is my help message'
          defaultValue='Textarea default value'
          disabled={false}
        />
        <View style={styles.view} />
        <Text level={TextLevel.LEVEL3}>Sticker</Text>
        <Sticker variant={VariantState.PRIMARY}>Sticker</Sticker>
        <View style={styles.view} />
        <Sticker variant={VariantState.SECONDARY}>Sticker</Sticker>
        <View style={styles.view} />
        <Sticker variant={VariantState.TERTIARY}>Sticker</Sticker>
        <View style={styles.view} />
        <Sticker alert={AlertState.SUCCESS}>STICKER</Sticker>
        <View style={styles.view} />
        <Text level={TextLevel.LEVEL3}>Small sticker</Text>
        <Sticker small variant={VariantState.PRIMARY}>
          STICKER
        </Sticker>
        <View style={styles.view} />
        <Sticker small variant={VariantState.SECONDARY}>
          STICKER
        </Sticker>
        <View style={styles.view} />
        <Text level={TextLevel.LEVEL3}>Stretched sticker</Text>
        <Sticker stretched variant={VariantState.PRIMARY}>
          STICKER
        </Sticker>
        <View style={styles.view} />
        <Sticker stretched variant={VariantState.SECONDARY}>
          STICKER
        </Sticker>
        <View style={styles.view} />
        <Sticker stretched variant={VariantState.TERTIARY}>
          STICKER
        </Sticker>
        <View style={styles.view} />
        <Sticker stretched alert={AlertState.SUCCESS}>
          STICKER
        </Sticker>
        <View style={styles.view} />
        <Text level={TextLevel.LEVEL3}>Séparateur</Text>
        <View style={styles.view} />
        <Divider />
        <View style={styles.view} />
        <Text level={TextLevel.LEVEL3}>Séparateur avec contenu</Text>
        <Divider content='+' />
        <View style={styles.view} />
        <Text level={TextLevel.LEVEL3}>Badge</Text>
        <View style={styles.view} />
        <Badge content={10} />
        <Text level={TextLevel.LEVEL3}>Badge avec texte</Text>
        <View style={styles.view} />
        <Badge textContent='Text content badge' content={10} direction={BadgeTextDirection.LEFT} />
        <View style={styles.view} />
        <Text level={TextLevel.LEVEL3}>Switch</Text>
        <Switch
          name={'first_swicth'}
          checked
          onChange={(e) => Alert.alert(`${e.switchName} - ${e.switchState}`)}
          alert={AlertState.SUCCESS}
          inverted
        />
        <Switch alert={AlertState.WARNING} />
        <Switch alert={AlertState.DANGER} />
        <Switch alert={AlertState.INFO} />
        <View style={styles.view} />
        <View style={{ backgroundColor: '#E3E3E3', width: '100%', padding: 10 }}>
          <Checkbox
            name='checkbox_one'
            onClick={(e) => Alert.alert(`${e.checkboxName} => ${e.checkboxChecked}`)}
            checked
            label='my checkbox'
          />
          <View style={styles.view} />
          <Checkbox
            name='checkbox_two'
            inverted
            onClick={(e) => Alert.alert(`${e.checkboxName} => ${e.checkboxChecked}`)}
            checked
            label='my checkbox'
          />
        </View>
        <View style={styles.view} />
        <View style={{ backgroundColor: '#E3E3E3', width: '100%', padding: 10 }}>
          {data.map((i) => (
            <Radio
              key={i.key}
              label={i.label}
              value={i.value}
              onClick={(e) => {
                checkRadio(e.radioValue)
                Alert.alert(`Checked => ${e.radioValue}`)
              }}
              checked={radio}
            />
          ))}
        </View>
        <View style={styles.view} />
        <Text level={TextLevel.LEVEL2}>Options</Text>
        <View style={{ marginBottom: 10 }} />
        <Options>
          {dataOption.map((i) => (
            <OptionsItem
              key={i.key}
              label={i.label}
              value={i.value}
              name={i.name}
              onClick={(e) => {
                checkOption(e.optionValue)
                Alert.alert(`Checked => ${e.optionName} - ${e.optionValue}`)
              }}
              checked={option}
            />
          ))}
        </Options>
        <View style={{ marginRight: 10 }} />
        <View style={styles.view} />
        <Text level={TextLevel.LEVEL3}>Container</Text>
        <Container>
          <Text>Container</Text>
        </Container>
        <Text level={TextLevel.LEVEL3}>Container fluid</Text>
        <Container fluid>
          <Text>Container fluid</Text>
        </Container>
        <View style={styles.view} />
        <Text level={TextLevel.LEVEL3}>Columns</Text>
        <Columns>
          <ColumnsItem size={6}>
            <View style={{ borderWidth: 1, borderColor: '#EF3E3E' }}>
              <Text level={TextLevel.LEVEL4}>Col 8</Text>
            </View>
          </ColumnsItem>
          <ColumnsItem size={3}>
            <View style={{ borderWidth: 1, borderColor: '#EF3E3E' }}>
              <Text level={TextLevel.LEVEL4}>Col 6dkjfqsdkufghkudsqjfkuqdsjfk:qskjisqf,</Text>
            </View>
          </ColumnsItem>
          <ColumnsItem size={3}>
            <View style={{ borderWidth: 1, borderColor: '#EF3E3E' }}>
              <Text level={TextLevel.LEVEL4}>Col 6dkjfqsdkufghkudsqjfkuqdsjfk:qskjisqf,</Text>
            </View>
          </ColumnsItem>
        </Columns>
        <Columns>
          <ColumnsItem size={3}>
            <View style={{ borderWidth: 1, borderColor: '#EF3E3E' }}>
              <Text level={TextLevel.LEVEL4}>Col 3</Text>
            </View>
          </ColumnsItem>
          <ColumnsItem size={3}>
            <View style={{ borderWidth: 1, borderColor: '#EF3E3E' }}>
              <Text level={TextLevel.LEVEL4}>Col 3</Text>
            </View>
          </ColumnsItem>
          <ColumnsItem size={6}>
            <View style={{ borderWidth: 1, borderColor: '#EF3E3E' }}>
              <Text level={TextLevel.LEVEL4}>Col 6</Text>
            </View>
          </ColumnsItem>
        </Columns>
        <View style={styles.view} />
        <Columns>
          <ColumnsItem>
            <Tag variant={TagVariant.PRIMARY}>Tag primaire</Tag>
          </ColumnsItem>
          <ColumnsItem>
            <Tag variant={TagVariant.SECONDARY}>Tag secondaire</Tag>
          </ColumnsItem>
        </Columns>
        <View style={styles.view} />
        <Columns>
          <ColumnsItem>
            <Tag deletable onClick={() => Alert.alert('Tag action')} variant={TagVariant.PRIMARY}>
              Tag primaire
            </Tag>
          </ColumnsItem>
          <ColumnsItem>
            <Tag deletable onClick={() => Alert.alert('Tag action')} variant={TagVariant.SECONDARY}>
              Tag secondaire
            </Tag>
          </ColumnsItem>
        </Columns>
        <View style={styles.view} />
        <Card>
          <CardImage src='https://i.etsystatic.com/10951167/r/il/df66c4/1860902191/il_570xN.1860902191_kuoj.jpg' />
          <CardContent
            titleSup='SUBTITLE'
            title='Title lorem'
            text='Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed ligula ex, aliquam at neque eu, vulputate vera.'
            buttonText='Button'
            buttonClick={() => Alert.alert('Click on button card')}
            buttonVariant={VariantState.PRIMARY}
          />
        </Card>
        <View style={styles.view} />
        <Card horizontal>
          <CardImage src='https://i.etsystatic.com/10951167/r/il/df66c4/1860902191/il_570xN.1860902191_kuoj.jpg' />
          <CardContent
            titleSup='SUBTITLE'
            title='Title lorem'
            text='Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed ligula ex, aliquam at neque eu, vulputate vera.'
            buttonText='Button'
            buttonClick={() => Alert.alert('Click on button card')}
            buttonVariant={VariantState.PRIMARY}
          />
        </Card>
        <View style={styles.view} />
        <Text level={TextLevel.LEVEL3}>Accordion</Text>

        <Accordion boxed>
          <AccordionItem
            headerItems={
              <AccordionHeader>
                <View>
                  <Columns>
                    <ColumnsItem size={6}>
                      <View style={{ backgroundColor: 'red' }}>
                        <Text style={{ color: 'black' }}>
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </Text>
                      </View>
                    </ColumnsItem>
                    <ColumnsItem size={3}>
                      <View style={{ backgroundColor: 'green' }}>
                        <Text style={{ color: 'black' }}>
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </Text>
                      </View>
                    </ColumnsItem>
                    <ColumnsItem size={3}>
                      <View style={{ backgroundColor: 'blue' }}>
                        <Text style={{ color: 'black' }}>Col Item 3</Text>
                      </View>
                    </ColumnsItem>
                  </Columns>
                </View>
              </AccordionHeader>
            }
            bodyItems={
              <AccordionBody>
                <Text>Body 1</Text>
              </AccordionBody>
            }
          ></AccordionItem>
          <AccordionItem
            disabled
            headerItems={
              <AccordionHeader>
                <Text>Accordion Header 2</Text>
              </AccordionHeader>
            }
            bodyItems={
              <AccordionBody>
                <Text>Body 2</Text>
              </AccordionBody>
            }
          ></AccordionItem>
          <AccordionItem
            headerItems={
              <AccordionHeader>
                <Text>Accordion Header 3</Text>
              </AccordionHeader>
            }
            bodyItems={
              <AccordionBody>
                <Text>Body 3</Text>
              </AccordionBody>
            }
          ></AccordionItem>
        </Accordion>
        <View style={styles.view} />
        <Text level={TextLevel.LEVEL3}>Box</Text>
        <Box>
          <BoxHeader>Box Header</BoxHeader>
          <BoxContent>
            Lorem ipsum dolor sit amet, conseddvctetur adipiscing elit. Phasellus nec iaculis mauris.
          </BoxContent>
          <BoxFooter>Footer content</BoxFooter>
        </Box>
        <View style={styles.view} />
        <Link to={'https://www.google.fr'}>My super link</Link>
        <View style={styles.view} />
        <Text level={TextLevel.LEVEL3}>Price</Text>

        <ProgressRadial
          alert={AlertState.TERTIARY}
          percent={25}
          label={
            <Price
              variant={PriceVariant.PRIMARY}
              level={PriceLevel.LEVEL4}
              amount={24.99}
              mention='(1)'
              period='mois'
              showCents
            />
          }
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
        <Price
          variant={PriceVariant.PRIMARY}
          level={PriceLevel.LEVEL2}
          amount={24.99}
          mention='(1)'
          period='mois'
          showCents
        />
        <Price
          variant={PriceVariant.SECONDARY}
          level={PriceLevel.LEVEL3}
          amount={24.99}
          mention='(1)'
          period='mois'
          showCents
        />
        <Price
          variant={PriceVariant.PRIMARY}
          level={PriceLevel.LEVEL4}
          amount={24.99}
          mention='(1)'
          period='mois'
          showCents
        />
        <Price
          variant={PriceVariant.SECONDARY}
          level={PriceLevel.LEVEL5}
          amount={24.99}
          mention='(1)'
          period='mois'
          showCents
        />

        <Hero variant={VariantState.TERTIARY}>
          <Price inverted level={PriceLevel.LEVEL5} amount={24.99} mention='(1)' period='mois' showCents />
        </Hero>

        <View style={styles.view} />
        <Text level={TextLevel.LEVEL3}>Tile</Text>
        <Columns>
          <ColumnsItem>
            <Tile>
              <Box>
                <View style={{ padding: 10 }}>
                  <Title level={TitleLevel.LEVEL6}>Mon mobile</Title>
                  <Text level={TextLevel.LEVEL4}>Gérer, dépanner</Text>
                </View>
              </Box>
            </Tile>
          </ColumnsItem>
          <ColumnsItem>
            <Tile>
              <Box>
                <View style={{ padding: 10 }}>
                  <Title level={TitleLevel.LEVEL6}>Mon mobile</Title>
                  <Text level={TextLevel.LEVEL4}>Gérer, dépanner</Text>
                </View>
              </Box>
            </Tile>
          </ColumnsItem>
        </Columns>
        <View style={styles.view} />
        <Text level={TextLevel.LEVEL3}>Icon</Text>
        <View style={{ backgroundColor: '#646464', minHeigth: 50, width: '100%' }}>
          <Text level={TextLevel.LEVEL2}>White icon :</Text>
          <Icon size={IconSize.HUGE} color={IconColor.WHITE} name={IconName.UI_HOME} />
        </View>
        <View style={styles.view} />
        <Icon size={IconSize.MEDIUM} name={IconName.UI_HOME} />
        <View style={styles.view} />
        <Text level={TextLevel.LEVEL3}>Circled icon</Text>
        <View style={styles.view} />
        <Icon size={IconSize.MEDIUM} circled name={IconName.UI_HOME} />
        <Icon status={IconStatus.SUCCESS} size={IconSize.MEDIUM} circled name={IconName.UI_HOME} />
        <Icon status={IconStatus.WARNING} size={IconSize.MEDIUM} circled name={IconName.UI_HOME} />
        <View style={styles.view} />
        <Text level={TextLevel.LEVEL3}>Text + icon</Text>
        <View style={styles.view} />
        <Icon position={IconPosition.RIGHT} content='RIGHT ICON' size={IconSize.MEDIUM} name={IconName.UI_HOME} />
        <View style={styles.view} />
        <Divider />
        <View style={styles.view} />
        <Icon position={IconPosition.LEFT} content='LEFT ICON' size={IconSize.MEDIUM} name={IconName.UI_HOME} />
        <View style={styles.view} />
        <Divider />
        <View style={styles.view} />
        <Icon position={IconPosition.DOWN} content='DOWN ICON' size={IconSize.MEDIUM} name={IconName.UI_HOME} />
        <View style={styles.view} />
        <Divider />
        <View style={styles.view} />
        <Hero variant={VariantState.TERTIARY}>
          <Icon
            color={IconColor.WHITE}
            position={IconPosition.DOWN}
            content='DOWN ICON'
            size={IconSize.MEDIUM}
            name={IconName.UI_HOME}
          />
          <Icon
            color={IconColor.DANGER}
            position={IconPosition.DOWN}
            content='DOWN ICON'
            size={IconSize.MEDIUM}
            name={IconName.UI_HOME}
          />
          <Icon
            color={IconColor.INFO}
            position={IconPosition.DOWN}
            content='DOWN ICON'
            size={IconSize.MEDIUM}
            name={IconName.UI_HOME}
          />
        </Hero>
        <View style={styles.view} />
        <Divider />
        <View style={styles.view} />
        <Columns>
          <ColumnsItem size={4}>
            <View style={{ borderWidth: 1, borderColor: 'red', alignSelf: 'center' }}>
              <Icon position={IconPosition.UP} content='Test' size={IconSize.MEDIUM} name={IconName.UI_HOME} />
            </View>
          </ColumnsItem>
          <ColumnsItem size={4}>
            <View style={{ borderWidth: 1, borderColor: 'red', alignSelf: 'center' }}>
              <Icon position={IconPosition.UP} content='Test' size={IconSize.MEDIUM} name={IconName.UI_HOME} />
            </View>
          </ColumnsItem>
          <ColumnsItem size={4}>
            <View style={{ borderWidth: 1, borderColor: 'red', alignSelf: 'center' }}>
              <Icon position={IconPosition.UP} content='Test' size={IconSize.MEDIUM} name={IconName.UI_HOME} />
            </View>
          </ColumnsItem>
        </Columns>
        <Icon position={IconPosition.UP} content='TEST' size={IconSize.MEDIUM} name={IconName.UI_HOME} />
        <View style={styles.view} />
        <Divider />
        <View style={styles.view} />
        <Text level={TextLevel.LEVEL3}>Status + icon</Text>
        <Icon
          status={IconStatus.SUCCESS}
          statusPosition={IconStatusPosition.TOP}
          size={IconSize.HUGE}
          name={IconName.FILE_EURO}
        />
        <View style={styles.view} />
        <Icon
          status={IconStatus.TERTIARY}
          statusPosition={IconStatusPosition.BOTTOM}
          size={IconSize.HUGE}
          name={IconName.FILE_EURO}
        />
        <View style={styles.view} />
        <Text level={TextLevel.LEVEL3}>Stretched icon</Text>
        <Icon stretched status={IconStatus.TERTIARY} size={IconSize.MEDIUM} name={IconName.UI_HOME} />
        <View style={{ marginTop: 30 }} />
        <Notification alert={AlertState.INFO} title='Notification' />
        <View style={styles.view} />
        <Notification alert={AlertState.SUCCESS} title='Notification' />
        <View style={styles.view} />
        <Notification alert={AlertState.WARNING} title='Notification' />
        <View style={styles.view} />
        <Notification alert={AlertState.DANGER} title='Notification' />
        <View style={styles.view} />
        <Notification title='Notification' description='Notification description' />
        <View style={styles.view} />
        <Notification
          alert={AlertState.INFO}
          title='Notification'
          buttonContent={'Button'}
          buttonClick={() => Alert.alert('Click on button')}
        />
        <View style={styles.view} />
        <Notification
          alert={AlertState.INFO}
          title='Notification'
          arrow
          buttonClick={() => Alert.alert('Click on arrow')}
        />
        <View style={styles.view} />
        <Notification title='Notification info' info />
        <View style={{ marginTop: 30 }} />
        <Tabs>
          <TabsItem active>One</TabsItem>
          <TabsItem>Two</TabsItem>
          <TabsItem onClick={() => Alert.alert('click on tab three')}>Three</TabsItem>
        </Tabs>
        <View style={{ marginBottom: 30 }} />
        <Progress percent={33} />
        <View style={styles.view} />
        <Progress percent={33} alert={AlertState.INFO} />
        <View style={styles.view} />
        <Progress percent={33} alert={AlertState.SUCCESS} />
        <View style={styles.view} />
        <Progress percent={33} alert={AlertState.WARNING} />
        <View style={styles.view} />
        <Progress stacked>
          <ProgressItem percent={15} alert={AlertState.SUCCESS} />
          <ProgressItem percent={15} alert={AlertState.INFO} />
          <ProgressItem percent={15} alert={AlertState.WARNING} />
          <ProgressItem percent={15} alert={AlertState.DANGER} />
        </Progress>
        <View style={{ marginBottom: 30 }} />
        <Progress percent={30} alert={AlertState.INFO} uniqueLegend='My unique legend' />
        <View style={{ marginBottom: 30 }} />
        <Progress percent={15} alert={AlertState.INFO} firstExtremLegend='0 Go' secondExtremLegend='5 Go' />
        <View style={{ marginBottom: 30 }} />
        <ProgressRadial alert={AlertState.TERTIARY} percent={25} label={'25%'} />
        <View style={styles.view} />
        <ProgressRadial percent={25} label='25%' description='Description' />
        <View style={styles.view} />
        <ProgressRadial alert={AlertState.WARNING} full percent={110} label='110%' description='Depassement !' />
        <View style={styles.view} />
        <ProgressRadial alert={AlertState.DANGER} full percent={200} label='200%' description='Too much !' />
        <View style={styles.view} />
        <ProgressRadial disk alert={AlertState.INFO} percent={200} label='200%' description='Too much !' />
        <View style={styles.view} />
        <ProgressRadial disk alert={AlertState.WARNING} percent={200} label='200%' description='Too much !' />
        <View style={styles.view} />
        <ProgressRadial disk alert={AlertState.DANGER} percent={200} label='200%' />
        <View style={{ marginBottom: 30 }} />
        <Text level={TextLevel.LEVEL3}>Modal</Text>
        <View style={styles.view} />
        <Modal
          content='Labore ea esse ea minim sit magna amet duis eiusmod est dolore.
          In irure aliquip anim reprehenderit sint eiusmod quis eiusmod
          eiusmod commodo aliquip non est do.'
          title='title modal'
          triggerContent='Open modal'
          ctaContent='Action'
          // eslint-disable-next-line no-alert
          ctaOnClick={() => Alert.alert('Click on action')}
        />
        <View style={{ marginBottom: 30 }} />
        <Select selected='opt_two'>
          <SelectOption label='Option one' value='opt_one'>
            Option One
          </SelectOption>
          <SelectOption label='Option two' value='opt_two'>
            Option Two
          </SelectOption>
          <SelectOption label='Option three' value='opt_three'>
            Option Three
          </SelectOption>
        </Select>
        <View style={{ marginBottom: 150 }} />
        <Text level={TextLevel.LEVEL3}>Hero</Text>
        <Hero backgroundSrc={'https://picsum.photos/id/1/1500/600'}>
          <Text style={{ color: '#fff' }} level={TextLevel.LEVEL2}>
            MESSAGE DE BIENVENUE
          </Text>
          <Title style={{ color: '#fff' }} level={TitleLevel.LEVEL3}>
            Bonjour Michel
          </Title>
          <Text style={{ color: '#fff' }} level={TextLevel.LEVEL3}>
            Fugiat velit dolor ad adipisicing id quis enim cupidatat Lorem dolore aute excepteur tempor.
          </Text>
          <View style={{ marginTop: 20 }} />
          <Button variant={VariantState.PRIMARY} onClick={() => Alert.alert('Click on Hero button')}>
            Press me !
          </Button>
        </Hero>
        <View style={{ marginBottom: 30 }} />

        <Text level={TextLevel.LEVEL3}>Hero + Background Color</Text>

        <View style={{ marginBottom: 5 }} />

        <Hero variant={VariantState.PRIMARY}>
          <Text style={{ color: '#fff' }} level={TextLevel.LEVEL2}>
            MESSAGE DE BIENVENUE
          </Text>
          <Title style={{ color: '#fff' }} level={TitleLevel.LEVEL3}>
            Bonjour Michel
          </Title>
          <Text style={{ color: '#fff' }} level={TextLevel.LEVEL3}>
            Fugiat velit dolor ad adipisicing id quis enim cupidatat Lorem dolore aute excepteur tempor.
          </Text>
          <View style={{ marginTop: 20 }} />
        </Hero>
        <View style={{ marginBottom: 30 }} />

        <Hero variant={VariantState.SECONDARY}>
          <Text style={{ color: '#fff' }} level={TextLevel.LEVEL2}>
            MESSAGE DE BIENVENUE
          </Text>
          <Title style={{ color: '#fff' }} level={TitleLevel.LEVEL3}>
            Bonjour Michel
          </Title>
          <Text style={{ color: '#fff' }} level={TextLevel.LEVEL3}>
            Fugiat velit dolor ad adipisicing id quis enim cupidatat Lorem dolore aute excepteur tempor.
          </Text>
          <View style={{ marginTop: 20 }} />
        </Hero>

        <View style={{ marginBottom: 30 }} />

        <Hero variant={VariantState.TERTIARY}>
          <Text style={{ color: '#fff' }} level={TextLevel.LEVEL2}>
            MESSAGE DE BIENVENUE
          </Text>
          <Title style={{ color: '#fff' }} level={TitleLevel.LEVEL3}>
            Bonjour Michel
          </Title>
          <Text style={{ color: '#fff' }} level={TextLevel.LEVEL3}>
            Fugiat velit dolor ad adipisicing id quis enim cupidatat Lorem dolore aute excepteur tempor.
          </Text>
          <View style={{ marginTop: 20 }} />
        </Hero>

        <View style={{ marginBottom: 30 }} />

        <Text level={TextLevel.LEVEL2}>Stepper</Text>

        <View style={{ marginBottom: 5 }} />

        <Stepper centered>
          <StepperStep done label='Dossier' step={1} />
          <StepperStep done label='Ouverture' step={2} />
          <StepperStep active current label='Intervention' step={3} />
          <StepperStep label='Cloture' step={4} />
        </Stepper>
        <View style={{ marginBottom: 30 }} />
        <Text level={TextLevel.LEVEL2}>Pagination</Text>
        <View style={{ marginBottom: 10 }} />
        <Pagination count={100} defaultPage={2} />
        <View style={{ marginBottom: 30 }} />
        <Text level={TextLevel.LEVEL2}>Rows</Text>
        <Columns>
          <ColumnsItem>
            <Rows>
              <RowItem>
                <Text level={TextLevel.LEVEL3}>Case 1</Text>
              </RowItem>
              <RowItem>
                <Text level={TextLevel.LEVEL3}>Case 2</Text>
              </RowItem>
              <RowItem>
                <Button compact variant={VariantState.PRIMARY}>
                  Button
                </Button>
              </RowItem>
            </Rows>
          </ColumnsItem>

          <ColumnsItem>
            <Rows>
              <RowItem>
                <Text level={TextLevel.LEVEL3}>Case 3</Text>
              </RowItem>
              <RowItem>
                <Text level={TextLevel.LEVEL3}>Case 4</Text>
              </RowItem>
              <RowItem>
                <Button compact variant={VariantState.SECONDARY}>
                  Button
                </Button>
              </RowItem>
            </Rows>
          </ColumnsItem>
        </Columns>
        <View style={{ marginBottom: 30 }} />
        <Text level={TextLevel.LEVEL2}>Table</Text>
        <View style={{ marginBottom: 10 }} />
        <Table bordered>
          <TableHead>
            <TableTr>
              <TableTh>Title 1</TableTh>
              <TableTh>Title 2</TableTh>
              <TableTh>Title 3</TableTh>
            </TableTr>
          </TableHead>
          <TableBody>
            <TableTr
              expandable
              expanded={
                <View>
                  <Text>Table expended content</Text>
                </View>
              }
              // expanded='Table expended content'
            >
              <TableTd>
                <Text level={TextLevel.LEVEL4}>Donnée 1</Text>
              </TableTd>
              <TableTd>
                <Text level={TextLevel.LEVEL4}>Donnée 2</Text>
              </TableTd>
              <TableTd>
                <Text level={TextLevel.LEVEL4}>Donnée 3</Text>
              </TableTd>
            </TableTr>

            <TableTr>
              <TableTd>
                <Text level={TextLevel.LEVEL4}>Donnée 4</Text>
              </TableTd>
              <TableTd>
                <Text level={TextLevel.LEVEL4}>Donnée 5</Text>
              </TableTd>
              <TableTd>
                <Text level={TextLevel.LEVEL4}>Donnée 6</Text>
              </TableTd>
            </TableTr>
          </TableBody>
        </Table>
        <View style={{ marginBottom: 30 }} />
        <Text level={TextLevel.LEVEL2}>Info block</Text>
        <View style={{ marginBottom: 15 }} />
        <InfoBlock boxed>
          <InfoBlockHeader status={InfoBlockStatus.WARNING}>Une erreur est survenue</InfoBlockHeader>
          <InfoBlockContent>
            <Text level={TextLevel.LEVEL4} style={{ textAlign: 'center' }}>
              La page à laquelle vous essayez accéder est momentanément indisponible
            </Text>
            <Text level={TextLevel.LEVEL4} style={{ textAlign: 'center' }}>
              Veuillez réessayer ultérieurement
            </Text>
          </InfoBlockContent>
          <InfoBlockAction>
            <Button variant={VariantState.PRIMARY} onClick={() => Alert.alert('test')}>
              Button
            </Button>
          </InfoBlockAction>
        </InfoBlock>
        <View style={{ marginBottom: 15 }} />
        <Text level={TextLevel.LEVEL2}>Slider</Text>
        <View style={{ marginBottom: 15 }} />
        <View style={{ marginLeft: -35, marginRight: -35 }}>
          <Slider>
            <SliderItem>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#333',
                  padding: 15,
                  paddingLeft: 50,
                }}
              >
                <Text level={TextLevel.LEVEL2} style={{ color: '#fff' }}>
                  #1
                </Text>
              </View>
            </SliderItem>
            <SliderItem>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#E83A3A',
                  padding: 15,
                  paddingLeft: 50,
                }}
              >
                <Text level={TextLevel.LEVEL2} style={{ color: '#fff' }}>
                  #2
                </Text>
              </View>
            </SliderItem>
            <SliderItem>
              <Image
                style={{
                  width: width.width,
                  height: height,
                  maxHeight: 300,
                  resizeMode: 'cover',
                }}
                source={{
                  uri:
                    'https://images.pexels.com/photos/4056472/pexels-photo-4056472.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=300',
                }}
              />

              {/* <View style={{ width: '100%', height: '100%', backgroundColor: '#0B97F2', padding: 15, paddingLeft: 50 }}>
                <Text level={TextLevel.LEVEL2} style={{ color: '#fff' }}>
                  #3
                </Text>
              </View> */}
            </SliderItem>
          </Slider>
        </View>
        <View style={{ marginBottom: 30 }} />
      </View>
    </ScrollView>
  )
}

export default App
