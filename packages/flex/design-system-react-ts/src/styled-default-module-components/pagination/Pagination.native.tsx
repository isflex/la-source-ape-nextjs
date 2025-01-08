import React, { useState, useEffect } from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import { View } from '../'
import { PaginationProps, Pager } from './PaginationProps'
import { IconName } from '../icon'
import { createIconSetFromFontello } from 'react-native-vector-icons'
import icoMoonConfig from '../../assets/fonts/icons/selection.json'
// import { useFonts } from 'expo-font'

const CustomIcon = createIconSetFromFontello(icoMoonConfig)

/**
 * Pagination Component
 * @param count {number} Number elements
 * @param defaultPage {number} Current default active page (default is 1)
 * @param pageSize {number} Element per page (default is 10)
 * @param onClick {Function} Return pagination object
 */
const Pagination = ({ count, defaultPage = 1, pageSize = 10, onClick, ...others }: PaginationProps): React.JSX.Element => {
  const [currentPage, setCurrentPage] = useState<number>(defaultPage)
  const [arrayPage] = useState<Array<number>>(Array.from(Array(count + 1).keys()))
  const [pager, setPager] = useState<Pager>({
    currentPage: currentPage,
    pageSize: pageSize,
    totalPages: pageSize,
    endPage: count,
    pages: arrayPage,
  })

  // const [fontsLoaded] = useFonts({
  //   trilogyicons: require('../../assets/fonts/icons/trilogyicons.ttf'),
  // })

  useEffect(() => {
    // Calculate total pages
    const totalPages = Math.ceil(count / pageSize)

    let startPage = 1
    let endPage = 5

    if (totalPages <= 5) {
      // less than pageSize(default is 5) total pages so show all
      startPage = 1
      endPage = totalPages
    } else {
      // more than 3 total pages so calculate start and end pages
      if (currentPage <= 3) {
        startPage = 1
        endPage = 5
      } else if (currentPage + 3 >= totalPages) {
        startPage = totalPages - 4
        endPage = totalPages
      } else {
        startPage = currentPage - 2
        endPage = currentPage + 2
      }
    }

    // Create an array of pages
    const pages = [...Array(endPage + 1 - startPage).keys()].map((i) => startPage + i)

    // Set pager object
    setPager({
      currentPage,
      pageSize,
      totalPages,
      endPage,
      pages,
    })
  }, [currentPage, pageSize, count])

  useEffect(() => {
    if (onClick) {
      onClick(pager)
    }
  }, [pager, onClick])

  const totalCountPages = count / pageSize

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 18,
      color: '#333',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '400',
      marginRight: 12,
    },
    textCurrent: {
      fontSize: 18,
      color: '#fff',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '400',
      // marginRight: 12,
    },
    rounded: {
      backgroundColor: '#009dcc',
      width: 30,
      height: 30,
      borderRadius: 30,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
      marginTop: -3,
    },
    currentPage: {
      fontSize: 18,
      color: '#009dcc',
      fontWeight: '500',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    dotsLeft: {
      color: '#D1D1D1',
      marginRight: 12,
    },
    dotsRight: {
      color: '#D1D1D1',
      marginRight: -12,
    },
    arrowLeft: {
      marginRight: 7,
    },
    arrowRight: {
      marginLeft: 7,
    },
  })

  return (
    <View style={styles.container} {...others}>
      <TouchableOpacity
        style={{ marginRight: 5 }}
        onPress={() => {
          if (currentPage !== 1) {
            setCurrentPage(currentPage - 1)
          }
        }}
      >
        {/* {fontsLoaded && ( */}
        <CustomIcon
          style={styles.arrowLeft}
          name={IconName.UI_ARROW_LEFT_R.replace('tri-', '').replace('ui-', '')}
          size={20}
          color={'#333'}
        />
        {/* )} */}
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {!pager.pages.includes(1) && (
          <View>
            <Text style={styles.dotsLeft}>…</Text>
          </View>
        )}
        {pager.pages.map((pageNumber) => (
          <View key={pageNumber}>
            <TouchableOpacity
              style={currentPage === pageNumber && styles.rounded}
              onPress={() => {
                setCurrentPage(pageNumber)
              }}
            >
              <Text style={currentPage === pageNumber ? styles.textCurrent : styles.text}>{pageNumber}</Text>
            </TouchableOpacity>
          </View>
        ))}
        {!pager.pages.includes(totalCountPages) && (
          <View style={{ marginRight: 15 }}>
            <Text style={styles.dotsRight}>…</Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={{ marginLeft: 5 }}
        onPress={() => {
          if (currentPage !== Math.max(pager.totalPages)) {
            setCurrentPage(currentPage + 1)
          }
        }}
      >
        {/* {fontsLoaded && ( */}
        <CustomIcon
          style={styles.arrowRight}
          name={IconName.UI_ARROW_RIGHT_R.replace('tri-', '').replace('ui-', '')}
          size={20}
          color={'#333'}
        />
        {/* )} */}
      </TouchableOpacity>
    </View>
  )
}

export default Pagination
