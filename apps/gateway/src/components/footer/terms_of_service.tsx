import React from 'react'
import classNames from 'classnames'
import {
  Box,
  BoxHeader,
  BoxContent,
  Divider,
  Section,
  Text,
  Title,
  TitleLevel,
  TitleMarkup,
  View
} from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
const App: React.FC = () => {
  return (
    <View className={classNames(flexStyles.flexinessRoot)} >
      <Section>
        <Box>
          <BoxHeader>
            <Title level={TitleLevel.LEVEL2} markup={TitleMarkup.H1} className={classNames(flexStyles.hasTextWhite)}>
              CONDITIONS GÉNÉRALES D&apos;UTILISATION
            </Title>
          </BoxHeader>
          <BoxContent>
            <div className={classNames(flexStyles.isFullwidth, flexStyles.isFlex, flexStyles.isFlexDirectionColumn, flexStyles.isAlignItemsCenter, flexStyles.isJustifiedCenter)}
              style={{ margin: '0.5rem 0'}}>
              <svg width="120" height="120" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 0 0.25rem'}}>
                <path fillRule="evenodd" clipRule="evenodd" d="M220.956 48.0127L220.951 48.0126C216.102 48.0975 210.87 48.195 205.08 48.3028L205.073 48.3027C197.681 48.4402 189.381 48.5949 179.81 48.7619C189.384 48.5948 197.686 48.4403 205.08 48.3028C210.872 48.195 216.106 48.0976 220.956 48.0127Z" fill="#CE3A60"/>
                <path d="M485.004 141.449C494.075 168.886 485.82 212.413 475.429 256L475.425 256.012C487.611 301.394 495.471 338.744 486.674 366.418C486.277 367.667 485.743 368.999 485.078 370.402C502.306 335.973 512 297.119 512 256C512 214.822 502.278 175.915 485.004 141.449Z" fill="#CE3A60"/>
                <path d="M23.9151 147.816C8.57046 180.678 0 217.338 0 256C0 298.69 10.4493 338.939 28.9297 374.33C19.2118 346.967 26.0294 300.218 36.5714 256L36.5749 255.988C24.6122 211.438 15.9076 175.305 23.9151 147.816Z" fill="#CE3A60"/>
                <path d="M326.095 48.7619C401.894 137.652 444.574 172.441 475.422 256L475.425 256.012L475.429 256C485.82 212.413 494.075 168.886 485.004 141.449C482.828 137.107 480.531 132.835 478.12 128.638C456.431 98.3718 391.201 50.306 326.095 48.7619Z" fill="#CE3A60"/>
                <path d="M185.905 463.238C110.106 374.348 67.426 339.559 36.5781 256L36.5749 255.988L36.5714 256C26.0294 300.218 19.2118 346.967 28.9297 374.33C30.9442 378.188 33.0542 381.988 35.2565 385.727C56.5663 415.497 120.709 461.692 185.905 463.238Z" fill="#CE3A60"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M220.956 48.0127L220.951 48.0126C216.102 48.0975 210.87 48.195 205.08 48.3028L205.073 48.3027C197.681 48.4402 189.381 48.5949 179.81 48.7619C189.384 48.5948 197.686 48.4403 205.08 48.3028C210.872 48.195 216.106 48.0976 220.956 48.0127Z" fill="#39A256"/>
                <path d="M485.004 141.449C494.075 168.886 485.82 212.413 475.429 256L475.425 256.012C487.611 301.394 495.471 338.744 486.674 366.418C486.277 367.667 485.743 368.999 485.078 370.402C502.306 335.973 512 297.119 512 256C512 214.822 502.278 175.915 485.004 141.449Z" fill="#39A256"/>
                <path d="M23.9151 147.816C8.57046 180.678 0 217.338 0 256C0 298.69 10.4493 338.939 28.9297 374.33C19.2118 346.967 26.0294 300.218 36.5714 256L36.5749 255.988C24.6122 211.438 15.9076 175.305 23.9151 147.816Z" fill="#39A256"/>
                <path d="M179.798 48.7619C119.117 49.8211 52.7706 102.149 30.9511 133.877C28.4692 138.441 26.1221 143.089 23.9151 147.816C15.9076 175.305 24.6122 211.438 36.5749 255.988C57.2926 186.682 105.564 137.208 179.81 48.7619H179.798Z" fill="#39A256"/>
                <path d="M475.425 256.012C454.707 325.319 406.436 374.792 332.19 463.238C397.096 462.105 467.669 402.93 484.008 372.516C484.368 371.813 484.725 371.109 485.078 370.402C485.743 368.999 486.277 367.667 486.674 366.418C495.471 338.744 487.611 301.394 475.425 256.012Z" fill="#39A256"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M220.956 48.0127L220.951 48.0126C216.256 48.0948 211.201 48.1889 205.629 48.2925C205.45 48.2959 205.27 48.2992 205.089 48.3026L205.08 48.3028L205.073 48.3027C204.946 48.3051 204.818 48.3074 204.69 48.3098C204.82 48.3074 204.95 48.3052 205.08 48.3028L205.089 48.3026C205.27 48.2992 205.45 48.2959 205.629 48.2925C211.203 48.1888 216.26 48.0949 220.956 48.0127Z" fill="#324BF7"/>
                <path d="M256 1.52588e-05C245.176 0.188954 202.021 25.2117 179.81 48.7619C180.031 48.7581 180.252 48.7542 180.473 48.7503C189.239 48.5969 196.933 48.4541 203.839 48.3257C204.124 48.3204 204.408 48.3151 204.69 48.3098L205.073 48.3027C204.665 48.3103 204.253 48.318 203.839 48.3257C196.933 48.4541 189.239 48.5969 180.473 48.7503C189.768 48.5877 197.858 48.4371 205.08 48.3028L205.073 48.3027L204.69 48.3098C204.408 48.3151 204.124 48.3204 203.839 48.3257C204.253 48.318 204.665 48.3103 205.073 48.3027L205.08 48.3028L205.089 48.3026L205.629 48.2925C211.201 48.1889 216.256 48.0948 220.951 48.0126L220.956 48.0127C254.907 47.418 270.049 47.4328 326.095 48.7619C301.104 24.1883 267.369 0.198107 256.264 0.000148798L256 1.52588e-05Z" fill="#324BF7"/>
                <path d="M332.19 463.238C262.605 464.453 260.183 465 185.905 463.238C210.896 487.812 244.631 511.802 255.736 512L256 512C266.824 511.811 309.979 486.788 332.19 463.238Z" fill="#324BF7"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M220.956 48.0127L220.951 48.0126C216.102 48.0975 210.87 48.195 205.08 48.3028L205.073 48.3027C197.681 48.4402 189.381 48.5949 179.81 48.7619C189.384 48.5948 197.686 48.4403 205.08 48.3028C210.872 48.195 216.106 48.0976 220.956 48.0127Z" fill="#E553F4"/>
                <path d="M485.004 141.449C494.075 168.886 485.82 212.413 475.429 256L475.425 256.012C487.611 301.394 495.471 338.744 486.674 366.418C486.277 367.667 485.743 368.999 485.078 370.402C502.306 335.973 512 297.119 512 256C512 214.822 502.278 175.915 485.004 141.449Z" fill="#E553F4"/>
                <path d="M23.9151 147.816C8.57046 180.678 0 217.338 0 256C0 298.69 10.4493 338.939 28.9297 374.33C19.2118 346.967 26.0294 300.218 36.5714 256L36.5749 255.988C24.6122 211.438 15.9076 175.305 23.9151 147.816Z" fill="#E553F4"/>
                <path d="M185.905 463.238C120.709 461.692 56.5663 415.497 35.2565 385.727C79.719 461.221 161.805 511.905 255.736 512C244.631 511.802 210.896 487.812 185.905 463.238Z" fill="#E553F4"/>
                <path d="M326.095 48.7619C391.201 50.306 456.431 98.3718 478.12 128.638C433.989 51.8391 351.173 0.0960527 256.264 0.000148798C267.369 0.198107 301.104 24.1883 326.095 48.7619Z" fill="#E553F4"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M220.956 48.0127L220.951 48.0126C216.102 48.0975 210.87 48.195 205.08 48.3028L205.073 48.3027C197.681 48.4402 189.381 48.5949 179.81 48.7619C189.384 48.5948 197.686 48.4403 205.08 48.3028C210.872 48.195 216.106 48.0976 220.956 48.0127Z" fill="#33BAFF"/>
                <path d="M485.004 141.449C494.075 168.886 485.82 212.413 475.429 256L475.425 256.012C487.611 301.394 495.471 338.744 486.674 366.418C486.277 367.667 485.743 368.999 485.078 370.402C502.306 335.973 512 297.119 512 256C512 214.822 502.278 175.915 485.004 141.449Z" fill="#33BAFF"/>
                <path d="M23.9151 147.816C8.57046 180.678 0 217.338 0 256C0 298.69 10.4493 338.939 28.9297 374.33C19.2118 346.967 26.0294 300.218 36.5714 256L36.5749 255.988C24.6122 211.438 15.9076 175.305 23.9151 147.816Z" fill="#33BAFF"/>
                <path d="M179.81 48.7619C202.021 25.2117 245.176 0.188954 256 1.52588e-05C158.838 1.52588e-05 74.318 54.1292 30.9511 133.877C52.7706 102.149 119.117 49.8211 179.798 48.7619C179.802 48.7619 179.806 48.762 179.81 48.7619Z" fill="#33BAFF"/>
                <path d="M332.19 463.238C309.979 486.788 266.824 511.811 256 512C355.423 512 441.608 455.323 484.008 372.516C467.669 402.93 397.096 462.105 332.19 463.238Z" fill="#33BAFF"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M220.956 48.0127L220.951 48.0126C216.102 48.0975 210.87 48.195 205.08 48.3028L205.073 48.3027C197.681 48.4402 189.381 48.5949 179.81 48.7619C189.384 48.5948 197.686 48.4403 205.08 48.3028C210.872 48.195 216.106 48.0976 220.956 48.0127Z" fill="#FFFF00"/>
                <path d="M485.004 141.449C494.075 168.886 485.82 212.413 475.429 256L475.425 256.012C487.611 301.394 495.471 338.744 486.674 366.418C486.277 367.667 485.743 368.999 485.078 370.402C502.306 335.973 512 297.119 512 256C512 214.822 502.278 175.915 485.004 141.449Z" fill="#FFFF00"/>
                <path d="M23.9151 147.816C8.57046 180.678 0 217.338 0 256C0 298.69 10.4493 338.939 28.9297 374.33C19.2118 346.967 26.0294 300.218 36.5714 256L36.5749 255.988C24.6122 211.438 15.9076 175.305 23.9151 147.816Z" fill="#FFFF00"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M220.956 48.0127L220.951 48.0126C216.105 48.0975 210.875 48.1949 205.089 48.3026L205.08 48.3028L205.073 48.3027C197.853 48.437 189.765 48.5877 180.473 48.7503C189.768 48.5877 197.858 48.4371 205.08 48.3028L205.089 48.3026C210.877 48.1949 216.108 48.0976 220.956 48.0127Z" fill="#393760"/>
                <path d="M185.905 463.238C260.183 465 262.605 464.453 332.19 463.238C406.436 374.792 454.707 325.319 475.425 256.012L475.422 256C444.574 172.441 401.894 137.652 326.095 48.7619C270.049 47.4328 254.907 47.418 220.956 48.0127C216.108 48.0976 210.877 48.1949 205.089 48.3026L205.08 48.3028C197.858 48.4371 189.768 48.5877 180.473 48.7503C180.252 48.7542 180.031 48.7581 179.81 48.7619C105.564 137.208 57.2926 186.682 36.5749 255.988L36.5781 256C67.426 339.559 110.106 374.348 185.905 463.238Z" fill="#393760"/>
                <path d="M106.893 352V312H112.928V346.805H131.053V352H106.893ZM140.058 352H133.651L148.046 312H155.019L169.413 352H163.007L151.698 319.266H151.386L140.058 352ZM141.132 336.336H161.913V341.414H141.132V336.336ZM204.962 322.508C204.753 320.659 203.894 319.227 202.383 318.211C200.873 317.182 198.972 316.668 196.68 316.668C195.04 316.668 193.62 316.928 192.423 317.449C191.225 317.957 190.294 318.66 189.63 319.559C188.979 320.444 188.653 321.453 188.653 322.586C188.653 323.536 188.874 324.357 189.317 325.047C189.773 325.737 190.365 326.316 191.094 326.785C191.837 327.241 192.631 327.625 193.477 327.938C194.324 328.237 195.137 328.484 195.919 328.68L199.825 329.695C201.101 330.008 202.41 330.431 203.751 330.965C205.092 331.499 206.335 332.202 207.481 333.074C208.627 333.947 209.551 335.027 210.255 336.316C210.971 337.605 211.329 339.148 211.329 340.945C211.329 343.211 210.743 345.223 209.571 346.98C208.412 348.738 206.726 350.125 204.512 351.141C202.312 352.156 199.649 352.664 196.524 352.664C193.529 352.664 190.938 352.189 188.751 351.238C186.563 350.288 184.851 348.94 183.614 347.195C182.377 345.438 181.693 343.354 181.563 340.945H187.618C187.735 342.391 188.204 343.595 189.024 344.559C189.857 345.509 190.919 346.219 192.208 346.688C193.51 347.143 194.936 347.371 196.485 347.371C198.191 347.371 199.708 347.104 201.036 346.57C202.377 346.023 203.432 345.268 204.2 344.305C204.968 343.328 205.352 342.189 205.352 340.887C205.352 339.702 205.014 338.732 204.337 337.977C203.673 337.221 202.768 336.596 201.622 336.102C200.489 335.607 199.206 335.171 197.774 334.793L193.048 333.504C189.844 332.632 187.305 331.349 185.43 329.656C183.568 327.964 182.637 325.724 182.637 322.938C182.637 320.633 183.262 318.621 184.512 316.902C185.762 315.184 187.455 313.849 189.591 312.898C191.726 311.935 194.135 311.453 196.817 311.453C199.525 311.453 201.915 311.928 203.985 312.879C206.068 313.829 207.709 315.138 208.907 316.805C210.105 318.458 210.73 320.359 210.782 322.508H204.962ZM249.987 332C249.987 336.271 249.206 339.943 247.643 343.016C246.081 346.076 243.939 348.432 241.217 350.086C238.509 351.727 235.43 352.547 231.979 352.547C228.515 352.547 225.423 351.727 222.702 350.086C219.993 348.432 217.858 346.069 216.295 342.996C214.733 339.923 213.952 336.258 213.952 332C213.952 327.729 214.733 324.064 216.295 321.004C217.858 317.931 219.993 315.574 222.702 313.934C225.423 312.28 228.515 311.453 231.979 311.453C235.43 311.453 238.509 312.28 241.217 313.934C243.939 315.574 246.081 317.931 247.643 321.004C249.206 324.064 249.987 327.729 249.987 332ZM244.01 332C244.01 328.745 243.483 326.004 242.428 323.777C241.387 321.538 239.954 319.845 238.131 318.699C236.321 317.54 234.271 316.961 231.979 316.961C229.674 316.961 227.617 317.54 225.807 318.699C223.997 319.845 222.565 321.538 221.51 323.777C220.469 326.004 219.948 328.745 219.948 332C219.948 335.255 220.469 338.003 221.51 340.242C222.565 342.469 223.997 344.161 225.807 345.32C227.617 346.466 229.674 347.039 231.979 347.039C234.271 347.039 236.321 346.466 238.131 345.32C239.954 344.161 241.387 342.469 242.428 340.242C243.483 338.003 244.01 335.255 244.01 332ZM279.934 312H285.989V338.309C285.989 341.108 285.331 343.589 284.016 345.75C282.701 347.898 280.852 349.591 278.469 350.828C276.086 352.052 273.293 352.664 270.09 352.664C266.9 352.664 264.114 352.052 261.731 350.828C259.348 349.591 257.499 347.898 256.184 345.75C254.869 343.589 254.211 341.108 254.211 338.309V312H260.246V337.82C260.246 339.63 260.644 341.238 261.438 342.645C262.245 344.051 263.384 345.158 264.856 345.965C266.327 346.759 268.072 347.156 270.09 347.156C272.121 347.156 273.873 346.759 275.344 345.965C276.828 345.158 277.961 344.051 278.742 342.645C279.537 341.238 279.934 339.63 279.934 337.82V312ZM291.463 352V312H305.721C308.82 312 311.391 312.534 313.436 313.602C315.493 314.669 317.029 316.147 318.045 318.035C319.061 319.91 319.568 322.078 319.568 324.539C319.568 326.987 319.054 329.142 318.025 331.004C317.01 332.853 315.473 334.292 313.416 335.32C311.372 336.349 308.8 336.863 305.701 336.863H294.9V331.668H305.154C307.108 331.668 308.696 331.388 309.92 330.828C311.157 330.268 312.062 329.454 312.635 328.387C313.208 327.319 313.494 326.036 313.494 324.539C313.494 323.029 313.201 321.72 312.615 320.613C312.042 319.507 311.137 318.66 309.9 318.074C308.677 317.475 307.068 317.176 305.076 317.176H297.498V352H291.463ZM311.209 333.953L321.092 352H314.217L304.529 333.953H311.209ZM356.835 325.008H350.741C350.507 323.706 350.071 322.56 349.433 321.57C348.794 320.581 348.013 319.741 347.089 319.051C346.164 318.361 345.129 317.84 343.983 317.488C342.85 317.137 341.646 316.961 340.37 316.961C338.065 316.961 336.002 317.54 334.179 318.699C332.369 319.858 330.936 321.557 329.882 323.797C328.84 326.036 328.319 328.771 328.319 332C328.319 335.255 328.84 338.003 329.882 340.242C330.936 342.482 332.375 344.174 334.198 345.32C336.021 346.466 338.072 347.039 340.35 347.039C341.614 347.039 342.811 346.87 343.944 346.531C345.09 346.18 346.125 345.665 347.05 344.988C347.974 344.311 348.755 343.484 349.393 342.508C350.044 341.518 350.494 340.385 350.741 339.109L356.835 339.129C356.509 341.095 355.878 342.905 354.94 344.559C354.016 346.199 352.824 347.619 351.366 348.816C349.921 350.001 348.267 350.919 346.405 351.57C344.543 352.221 342.512 352.547 340.311 352.547C336.848 352.547 333.762 351.727 331.054 350.086C328.345 348.432 326.21 346.069 324.647 342.996C323.098 339.923 322.323 336.258 322.323 332C322.323 327.729 323.104 324.064 324.667 321.004C326.229 317.931 328.365 315.574 331.073 313.934C333.781 312.28 336.861 311.453 340.311 311.453C342.434 311.453 344.413 311.759 346.249 312.371C348.098 312.97 349.758 313.855 351.229 315.027C352.701 316.186 353.918 317.605 354.882 319.285C355.845 320.952 356.496 322.859 356.835 325.008ZM360.757 352V312H385.835V317.195H366.792V329.383H384.526V334.559H366.792V346.805H386.069V352H360.757Z" fill="white"/>
                <path d="M385 291H106V300H385V291Z" fill="white"/>
                <path d="M126.73 282H113.505L163.772 143.818H177.266L227.532 282H214.308L170.991 160.214H170.046L126.73 282ZM136.243 229.035H204.794V240.37H136.243V229.035ZM218.915 282V143.818H263.513C273.319 143.818 281.506 145.707 288.073 149.486C294.685 153.219 299.656 158.302 302.984 164.734C306.358 171.167 308.045 178.409 308.045 186.46C308.045 194.512 306.38 201.776 303.052 208.254C299.723 214.686 294.775 219.791 288.208 223.57C281.641 227.303 273.477 229.17 263.716 229.17H228.631V217.835H263.379C270.621 217.835 276.625 216.485 281.393 213.786C286.161 211.042 289.715 207.309 292.054 202.586C294.438 197.863 295.63 192.488 295.63 186.46C295.63 180.433 294.438 175.058 292.054 170.335C289.715 165.612 286.139 161.901 281.326 159.202C276.558 156.503 270.508 155.153 263.176 155.153H231.532V282H218.915ZM305.365 282V143.818H385.521V155.153H317.982V207.174H381.27V218.509H317.982V270.665H386.87V282H305.365Z" fill="white"/>
              </svg>
              <Title level={TitleLevel.LEVEL5} className={flexStyles.isMarginless}>{`${process.env.FLEX_APP_TITLE}`}</Title>
            </div>
            <Text>A moins que précisé autrement, les conditions d&apos;utilisation détaillées dans cette section s&apos;appliquent généralement pendant
              l&apos;utilisation de cette Application.</Text>
            <Text>Des conditions d&apos;utilisation uniques ou additionnelles peuvent s&apos;appliquer à des contextes particuliers et sont alors indiqués
              additionnellement au sein de ce document.</Text>
            <Text>En utilisant cette Application, les Utilisateurs s&apos;engagent à respecter les conditions suivantes :</Text>
            <ul>
              <li>Il n&apos;y a pas de restrictions pour les Utilisateurs en termes de leur statut de Consommateur ou d&apos;Utilisateurs Professionnels.</li>
            </ul>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Conditions d&apos;utilisation spécifiques à l&apos;application &laquo; {`${process.env.FLEX_APP_TITLE}`} &raquo;</Title>
            <Box className={classNames(flexStyles.isPaddingless, flexStyles.isFlat, flexStyles.isFlatFlexPurple, flexStyles.isGreyDark)}>
              <Section>
                <Text>
                  Si vous avez des enfants scolarisés à <strong>l&apos;École nouvelle La Source</strong> (actuels ou passés) qui pourraient proposer
                  leurs services pour s&apos;occuper d&apos;autres enfants, vous comprenez que les parents ont aussi la responsabilité d&apos;accompagner leur
                  enfant(s) dans l&apos;utilisation de l&apos;application <strong>{`${process.env.FLEX_APP_TITLE}`}</strong>.
                </Text>
                <Text>
                  Sachant que l&apos;application <strong>{`${process.env.FLEX_APP_TITLE}`}</strong> a été conçue pour protéger au maximum vos informations personnelles
                  et la sécurité de vos données, qu&apos;elle a été développée sur une base volontaire et en tant que service gratuit,
                  vous comprenez que l&apos;application ne peut être tenue responsable d&apos;une quelconque utilisation abusive.
                </Text>
                <Text>
                  L&apos;application <strong>{`${process.env.FLEX_APP_TITLE}`}</strong> est destinée à l&apos;ensemble de la communauté scolaire
                  de <strong>l&apos;École nouvelle La Source</strong> (parents et enfants inclus), mais à ce jour, son accès reste ouvert à toute personne disposant d&apos;un accès à l&apos;URL.
                  Vous comprenez qu&apos;à terme, nous pourrions décider de contrôler et de restreindre l&apos;accès, mais cela nécessite une collaboration
                  entre les différentes parties prenantes, qui se fera progressivement.
                </Text>
                <Text>
                  Vous comprenez que l&apos;application <strong>{`${process.env.FLEX_APP_TITLE}`}</strong> a pour vocation de servir de forum d&apos;annonces plus ou moins ouvert à tous.
                  Son bon fonctionnement repose sur la bonne volonté et la supervision de tous.
                </Text>
              </Section>
            </Box>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Contenu sur cette Application</Title>
            <Text>Sauf indication contraire ou clairement identifiable, tout contenu accessible sur cette Application appartient au Propriétaire ou à
              ses concédants de licence, ou est présenté par ceux-ci.</Text>
            <Text>Le Propriétaire s&apos;efforce de s&apos;assurer que le contenu présenté sur cette Application n&apos;enfreint aucune disposition légale en vigueur
              ni aucun droit de tiers. Il n&apos;est cependant pas toujours possible de parvenir à ce résultat.<br/>Dans de tels cas, sans préjudice aux
              prérogatives légales des Utilisateurs pour mettre leurs droits en application, les Utilisateurs sont priés préférablement de signaler
              toute plainte en se servant des coordonnées fournies dans ce document.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Droits concernant le contenu sur cette Application</Title>
            <Text>Le Propriétaire détient et se réserve tous les droits de propriété intellectuelle pour ce contenu.</Text>
            <Text>Par conséquent, les Utilisateurs ne peuvent pas utiliser ce contenu d&apos;une manière qui n&apos;est pas nécessaire ou implicite dans l&apos;usage
              adéquat du Service.</Text>
            <Text>Particulièrement, mais sans s&apos;y limiter, les Utilisateurs ne peuvent pas copier, télécharger, partager (au-delà des limites avancées
              ci-dessous), modifier, traduire, transformer, publier, transmettre, vendre, sous-licencier, modifier, transférer/assigner à des tiers
              ou créer un travail dérivé du contenu accessible sur cette Application, ou de permettre tout tiers de le faire à travers l&apos;Utilisateur
              ou leur appareil, même sans que l&apos;Utilisateur en ait connaissance.</Text>
            <Text>Où expressément indiqué sur cette Application, l&apos;Utilisateur peut télécharger, copier et/ou partager du contenu accessible sur cette
              Application, pour un usage uniquement personnel et non-commercial et à condition que les attributions de droits d&apos;auteur et toutes les
              autres attributions demandées par le Propriétaire sont correctement mises en place.</Text>
            <Text>Toute limitation statutaire applicable, ou exception au droit d&apos;auteur restera intact.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Accès aux ressources externes</Title>
            <Text>A travers cette Application les Utilisateurs peuvent avoir accès aux ressources externes fournies par des tiers. Les Utilisateurs
              reconnaissent et acceptent que le Propriétaire n&apos;a pas de contrôle sur de telles ressources et ne sera pour cela pas responsable pour
              le contenu et la disponibilité.</Text>
            <Text>Les conditions applicables aux ressources fournies par des tiers, y compris ceux applicables à tout octroi de droits dans le contenu
              résulte des Conditions générales de tous tiers ou, en leur absence du droit statutaire applicable.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Utilisation acceptable</Title>
            <Text>Cette Application et le Service ne peuvent être utilisés que dans le cadre de ce pour lequel ils ont été fournis, sous ces Conditions
              générales et le Droit applicable.</Text>
            <Text>Les Utilisateurs seront seuls responsables de s&apos;assurer que leur utilisation de cette Application et/ou du Service n&apos;enfreint aucune
              loi en vigueur, règlement ou droits de tiers.</Text>
            <Text>C&apos;est pourquoi, le Propriétaire se réserve le droit de prendre toute mesure appropriée pour protéger ses intérêts légitimes, et
              notamment de refuser l&apos;accès de l&apos;Utilisateur à cette Application ou le Service, de mettre fin aux contrats, de reporter toute faute
              commise à travers cette Application ou le Service aux autorités compétentes - telles que les autorités judiciaires ou administratives
              - lorsque les Utilisateurs se livrent ou sont soupçonnés de se livrer aux activités suivantes :</Text>
            <ul>
              <li>une violation de lois ou de règlements en vigueur et/ou de ces Conditions générales ;</li>
              <li>l&apos;atteinte à tout droit de tiers ;</li>
              <li>une atteinte considérable aux intérêts légitimes du Propriétaire ;</li>
              <li>une offense au Propriétaire ou à un tiers</li>
            </ul>
            <Title level={TitleLevel.LEVEL2} markup={TitleMarkup.H2}>Responsabilité et indemnisation</Title>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Utilisateurs Australiens</Title>
            <Title level={TitleLevel.LEVEL4} markup={TitleMarkup.H4}>Limitation de responsabilité</Title>
            <Text>Les présentes Conditions ne sauraient exclure, limiter ou modifier toute garantie, condition, tout droit ou recours dont peut
              bénéficier l&apos;Utilisateur en vertu de la loi de 2010 sur la concurrence et la consommation ou de toute législation similaire d&apos;un État
              ou d&apos;un territoire, et qui ne peuvent être exclus, limités ou modifiés (droit ne pouvant être exclu). Dans les limites autorisées par
              la loi, notre responsabilité envers l&apos;Utilisateur, y compris la responsabilité en cas de violation d&apos;un droit non-excluable et la
              responsabilité non exclue des présentes Conditions d&apos;utilisation, se limite, selon ce que le Propriétaire juge approprié, à une
              nouvelle exécution des services ou au paiement des coûts pour obtenir ces services une nouvelle fois.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Utilisateurs des États-Unis</Title>
            <Title level={TitleLevel.LEVEL4} markup={TitleMarkup.H4}>Exclusion de garantie</Title>
            <Text>Cette Application est fournie strictement « en l&apos;état » et « selon sa disponibilité ». L&apos;utilisation du Service relève
              de la responsabilité de l&apos;Utilisateur. Dans les limites autorisées par la loi en vigueur, le Propriétaire exclut expressément toutes
              conditions, déclarations et garanties, expresses, tacites, légales ou autres, y compris, sans limitation, toute garantie implicite de
              qualité marchande, d&apos;adéquation à un usage particulier ou de non-violation des droits de tiers. Aucun conseil ni aucune information, qu&apos;ils soient verbaux ou écrits, obtenus par l&apos;Utilisateur du Propriétaire ou par le biais du Service ne créera une garantie qui ne
              soit pas expressément énoncée dans les présentes.</Text>

            <Text>Nonobstant ce qui précède, le Propriétaire, ses filiales, sociétés affiliées, concédants de licence, directeurs, administrateurs, représentants, partenaires de co-marquage, partenaires, fournisseurs et employés ne garantissent pas que le contenu est exact, fiable
              ou correcte ; que le Service répondra aux besoins des Utilisateurs ; que le Service sera disponible à un moment ou un endroit donnés, qu&apos;il sera fourni de manière continue ou sécurisée ; que tout défaut ou erreur seront corrigés ; ou que le Service est exempt de virus
              ou d&apos;autres composants dommageables. Tout contenu téléchargé ou obtenu autrement grâce à l&apos;utilisation du Service est téléchargé aux
              risques et périls des Utilisateurs, lesquels sont seuls responsables de tout dommage causé à leur système informatique ou appareil
              mobile ou de la perte de données résultant de ce téléchargement ou de leur utilisation du Service.</Text>
            <Text>Le Propriétaire ne cautionne et ne garantit aucun produit ou service annoncés ou proposés par un tiers grâce au Service ou à tout
              site Internet ou service accédés par un lien hypertexte et n&apos;assume aucune responsabilité quant à ces produits et services. En outre, le Propriétaire ne prendra part à aucune transaction entre les Utilisateurs et les fournisseurs tiers de produits ou services ni ne
              surveillera de quelque manière que ce soit ces transactions.</Text>
            <Text>Le Service peut devenir inaccessible ou ne pas fonctionner correctement avec le navigateur Internet, l&apos;appareil mobile ou le système
              d&apos;exploitation des Utilisateurs. Le Propriétaire ne saurait être tenu pour responsable des dommages supposés ou réels résultant du
              contenu, du fonctionnement ou de l&apos;utilisation de ce Service.</Text>
            <Text>La loi fédérale, certains États et d&apos;autres juridictions n&apos;autorisent pas l&apos;exclusion et les limitations de certaines garanties
              implicites. Les exclusions mentionnées ci-dessus peuvent ne pas s&apos;appliquer aux Utilisateurs. Le présent Contrat accorde des droits
              juridiques spécifiques aux Utilisateurs, lesquels peuvent également bénéficier d&apos;autres droits qui varient selon les États. Les
              clauses de dégagement de responsabilité et exclusions prévus dans le présent Contrat ne s&apos;appliquent pas dans la mesure interdite par
              la loi en vigueur.</Text>
            <Title level={TitleLevel.LEVEL4} markup={TitleMarkup.H4}>Limitations de responsabilité</Title>
            <Text>Dans les limites autorisées par la loi en vigueur, le Propriétaire et ses filiales, sociétés affiliées, directeurs, administrateurs, représentants, partenaires de co-marquage, partenaires, fournisseurs et employés ne peuvent en aucun cas être tenus pour responsables
            </Text>
            <ul>
              <li>des dommages indirects, punitifs, consécutifs, spéciaux, accessoires ou exemplaires, y compris mais sans s&apos;y limiter, les dommages
                pour manque à gagner, perte de clientèle, d&apos;utilisation, de données ou d&apos;autres pertes immatérielles découlant de l&apos;utilisation du
                Service ou de l&apos;incapacité à l&apos;utiliser ; et</li>
              <li>des dommages, pertes ou préjudices résultant du piratage, de la falsification ou de tout autre accès ou utilisation non autorisés
                du Service ou du compte de l&apos;Utilisateur ou des informations qui y figurent ;</li>
              <li>des erreurs, des fautes ou des inexactitudes de contenu ;</li>
              <li>des blessures ou des dommages matériels, de quelque nature que ce soit, résultant de l&apos;accès ou de l&apos;utilisation du Service par
                l&apos;Utilisateur ;</li>
              <li>de tout accès non autorisé aux serveurs sécurisés du Propriétaire, ou de leur utilisation, ou aux informations personnelles qui y
                sont stockées ;</li>
              <li>de toute interruption ou cessation de transmission vers ou depuis le Service ;</li>
              <li>de tout bogue, virus, cheval de Troie ou autre pouvant être transmis au Service ou par son intermédiaire ;</li>
              <li>de toute erreur ou omission de contenu ou de toute perte ou dommage subis suite à l&apos;utilisation du contenu publié, envoyé par
                courrier électronique, transmis ou mis à disposition par le Service ; ou</li>
              <li>la conduite diffamatoire, offensante ou illégale de tout Utilisateur ou tiers. Le Propriétaire ainsi que ses filiales, sociétés
                affiliées, directeurs, administrateurs, représentants, partenaires de co-marquage, partenaires, fournisseurs et employés ne peuvent
                en aucun cas être tenus pour responsables des réclamations, procédures, responsabilités, obligations, dommages, pertes ou coûts d&apos;un
                montant supérieur au montant payé par l&apos;Utilisateur au Propriétaire en vertu des présentes au cours des 12 mois précédents ou
                pendant la durée du présent Contrat entre le Propriétaire et l&apos;Utilisateur, selon la période la plus courte.</li>
            </ul>
            <Text>La présente partie se rapportant à la limitation de responsabilité s&apos;applique, dans toute la mesure permise par la loi, dans la
              juridiction applicable, que la responsabilité présumée résulte d&apos;un contrat, d&apos;un délit, d&apos;une négligence, d&apos;une responsabilité
              stricte ou autre, et ce, même si le Propriétaire a été informé de la possibilité d&apos;un tel dommage.</Text>
            <Text>Certaines juridictions n&apos;autorisant pas l&apos;exclusion ou la limitation des dommages indirects ou accessoires, les limitations ou
              exclusions mentionnées ci-dessus peuvent ne pas s&apos;appliquer à l&apos;Utilisateur. Les présentes Conditions accordent des droits juridiques
              spécifiques à l&apos;Utilisateur, lequel peut également bénéficier d&apos;autres droits qui varient selon les juridictions. Les clauses de
              dégagement, d&apos;exclusion et de limitations de responsabilité prévues dans les présentes Conditions ne s&apos;appliquent pas dans la mesure
              interdite par la loi en vigueur.</Text>
            <Title level={TitleLevel.LEVEL4} markup={TitleMarkup.H4}>Indemnisation</Title>
            <Text>L&apos;Utilisateur accepte de couvrir et de dégager le Propriétaire et ses filiales, sociétés affiliées, directeurs, administrateurs, représentants, partenaires de co-marquage, partenaires, fournisseurs et employés de toute responsabilité en cas de réclamation ou
              demande, dommage, obligation, perte, responsabilité, coût ou dette et dépense, y compris, mais sans s&apos;y limiter, les honoraires et
              frais juridiques, découlant de</Text>
            <ul>
              <li>l&apos;utilisation du Service et son accès par l&apos;Utilisateur, y compris toutes données ou tout contenu transmis ou reçus par
                l&apos;Utilisateur ;</li>
              <li>la violation des présentes conditions par l&apos;Utilisateur, y compris, mais sans s&apos;y limiter, la violation par celui-ci de l&apos;une des
                déclarations et garanties énoncées dans les présentes Conditions ;</li>
              <li>la violation de tout droit de tiers par l&apos;Utilisateur, y compris, mais sans s&apos;y limiter, tout droit de confidentialité ou de
                propriété intellectuelle ;</li>
              <li>la violation par l&apos;Utilisateur de toute loi, règle ou réglementation ;</li>
              <li>tout contenu envoyé depuis le compte de l&apos;Utilisateur, y compris l&apos;accès de tiers avec le nom unique, le mot de passe ou toute
                autre mesure de sécurité de l&apos;Utilisateur, le cas échéant, y compris, mais sans s&apos;y limiter, des informations trompeuses, fausses ou
                inexactes ;</li>
              <li>une faute intentionnelle commise par l&apos;Utilisateur ; ou</li>
              <li>la violation de toute disposition légale par l&apos;Utilisateur ou ses sociétés affiliées, directeurs, administrateurs, représentants, partenaires de co-marquage, partenaires, fournisseurs et employés dans les limites de la loi en vigueur.</li>
            </ul>
            <Title level={TitleLevel.LEVEL2} markup={TitleMarkup.H2}>Dispositions communes</Title>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Clause de non-renonciation</Title>
            <Text>Le fait que le Propriétaire ne fasse pas valoir un droit ou une disposition dans le cadre des présentes Conditions ne saurait
              constituer une renonciation à ce droit ou cette disposition. Aucune renonciation ne saurait être considérée comme une renonciation
              supplémentaire ou continue à la présente condition ou à n&apos;importe quelle autre.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Interruption de service</Title>
            <Text>Afin d&apos;assurer le meilleur niveau possible, le Propriétaire se réserve le droit d&apos;interrompre le Service pour entretien, ou pour des
              mises à jour ou tout autre changement, en informant les Utilisateurs correctement.</Text>
            <Text>Dans les limites du Droit, le propriétaire peut aussi décider de suspendre ou de mettre fin au Service tout entier. S&apos;il est mis fin
              au Service, le Propriétaire coopéra avec les Utilisateurs pour leur permettre de retirer des Données Personnelles ou informations en
              accord avec le Droit applicable.</Text>
            <Text>De plus, les Service peut ne pas être accessible à cause de raisons en dehors du contrôle raisonnable du Propriétaire, tel que la «
              force majeure » (ex : les actions de travail, les ruptures des infrastructures ou les pannes de courant etc).</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Revente de Service</Title>
            <Text>Les Utilisateurs ne peuvent pas reproduire, dupliquer, copier, vendre, revendre ou exploiter toute portion de cette Application et de
              ces Services sans la permission exprès préalable, accordée soit directement ou à travers un programme de revente légitime.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Politique de confidentialité</Title>
            <Text>Pour plus d&apos;information sur l&apos;utilisation de leur Données Personnelles, les utilisateurs peuvent se référer à la politique de
              confidentialité de cette Application.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Droits de propriété intellectuelle</Title>
            <Text>Sans préjudice à toute disposition particulière de ces Conditions générales, tous droits d&apos;auteur, tels que les marques, les brevets
              et les droits de design associés à cette Application sont la propriété exclusive du Propriétaire ou de ces concédants de licence sont
              sujets à la protection accordée par les lois applicables ou les traités internationaux liés à la propriété intellectuelle.</Text>
            <Text>Toutes marques commerciales - nominales ou figurative - et toutes autres marques, noms de commerce, marque de mots, illustrations, images, ou logos apparaissant en connexion avec cette Application sont, et restent, la propriété exclusive du Propriétaire ou de ces
              concédants de licence et sont sujets à la protection accordée par les lois applicables ou les traités internationaux liés à la
              propriété intellectuelle.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Modifications de ces Conditions générales</Title>
            <Text>Le Propriétaire se réserve le droit de modifier ou autrement de rectifier ces Conditions générales à tout moment. Dans de tels cas, le Propriétaire informera correctement l&apos;Utilisateur de ces modifications.</Text>
            <Text>De telles modifications affecteront seulement la relation avec le futur Utilisateur.</Text>
            <Text>L&apos;utilisation continue du Service signifiera l&apos;acceptation par l&apos;Utilisateur des Conditions générales révisées. Si l&apos;Utilisateur ne
              souhaite pas être lié par ces modifications, ces-derniers doivent arrêter d&apos;utiliser le Service. Un refus d&apos;acceptation des Conditions
              générales mettra fin à l&apos;Accord.</Text>
            <Text>La version précédente applicable gouvernera la relation avant l&apos;acceptation par l&apos;Utilisateur. L&apos;Utilisateur peut obtenir toute
              version précédente du Propriétaire.</Text>
            <Text>Si une loi applicable le requiert, le Propriétaire précisera la date à laquelle les Conditions générales modifiées entrent en
              vigueur.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Assignation de contrat</Title>
            <Text>Le Propriétaire se réserve le droit de transférer, assigner, disposer par novation, ou sous-contracter tout ou tous droits ou
              obligations sous ces Conditions générales, en prenant les intérêts légitimes de l&apos;Utilisation en compte.<br/>Les dispositions
              concernant les changements de ces Conditions seront appliquées en conséquence.</Text>
            <Text>Les Utilisateurs ne peuvent pas assigner ou transférer leurs droits ou obligations sous ces Conditions générales de tout manière, sans l&apos;autorisation écrite du Propriétaire.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Contacts</Title>
            <Text>Toute communication liée à l&apos;utilisation de cette Application doit être envoyée utilisant les coordonnées citées dans ce document.              </Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Divisabilité</Title>
            <Text>Dans le cas où toute provision de ces Conditions générales pourrait être considérée invalide ou inapplicable sous le Droit
              applicable, l&apos;invalidité ou l&apos;inapplicabilité d&apos;une telle disposition n&apos;affectera pas la validité des dispositions restantes, qui
              garderont un plein effet.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Utilisateurs de l&apos;UE</Title>
            <Text>Dans le cas où toute disposition de ces Conditions est ou est considérée nulle, invalide ou inapplicable, les parties feront de leur
              mieux pour trouver, de façon amicable, un accord sur des dispositions valides et applicables substituant ainsi les parties invalides, nulles ou inapplicables.<br/>A défaut de ce-faire, les dispositions nulles, invalides ou inapplicables seront remplacées par les
              dispositions statutaires applicables, si cela est permis ou affirmé par la loi en vigueur.<br/>Sans préjudice à ce qui précède, la
              nullité, l&apos;invalidité ou l&apos;impossibilité d&apos;appliquer une disposition particulière de ces Conditions ne rendra pas nul l&apos;entier Accord, à moins que les dispositions divisées ne soient essentielles à l&apos;Accord, ou d&apos;une telle importance que les parties n&apos;auraient pas
              conclu le contrat si elles avaient su que la disposition n&apos;était pas valide, ou dans le cas où les dispositions restantes se
              traduiraient en une épreuve inacceptable pour une des parties.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Utilisateurs des États-Unis</Title>
            <Text>Toute disposition invalide ou inapplicable sera interprétée, comprise et réformée dans la mesure de ce qui est raisonnablement requis
              pour le rendre valide, applicable et consistant avec son objectif initial.<br/>Ces Conditions constituent l&apos;Accord entier entre les
              Utilisateurs et le Propriétaire en ce qui concerne le présent sujet, et dépasse toute autre communication, y compris mais sans se
              limiter à, tout accord antérieur entre les parties à ce sujet.<br/>Ces Conditions seront mises en application dans la pleine mesure de
              ce qui est permis par la Loi.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Loi applicable</Title>
            <Text>Ces Conditions sont gouvernées par le droit de l&apos;endroit où le Propriétaire est basé, tel qu&apos;est décrit dans la section pertinente de
              ce document, sans tenir compte des principes de conflits de lois.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Exception pour les Consommateurs Européens</Title>
            <Text>Cependant, indépendamment de ce qui précède, si l&apos;Utilisateur est qualifié de Consommateur Européen et son lieu de résidence
              habituelle est dans un pays où la Loi permet des niveaux de protection du consommateur plus élevés, ces niveaux de protection plus
              élevés prévaudront.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Lieu de la juridiction compétente</Title>
            <Text>La compétence exclusive de trancher toute controverse résultant de, ou connecté à, ces Conditions générales repose sur les
              juridictions du lieu où le Propriétaire est basé, tel que décrit dans la section pertinente de ce document.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Exception pour les Consommateurs Européens</Title>
            <Text>Ce qui précède ne s&apos;applique pas aux Utilisateurs qui sont qualifiés de Consommateurs Européens, ni aux Consommateurs basés en
              Suisse, Norvège ou Islande.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Définitions et références légales</Title>
            <Text><strong>Cette Application (ou cette Application)</strong></Text>
            <Text>Le bien qui permet la mise à disposition du Service.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Accord</Title>
            <Text>Toute relation juridiquement contraignante ou relation contractuelle entre le Propriétaire et l&apos;Utilisateur, gouverné par ces
              Conditions générales.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Utilisateur Commercial</Title>
            <Text>Tout Utilisateur qui ne se qualifie pas de Consommateur.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Européen (ou Europe)</Title>
            <Text>S&apos;applique où l&apos;Utilisateur est physiquement présent ou a des bureaux enregistrés dans l&apos;UE, quelque soit leur nationalité.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Propriétaire (ou Nous)</Title>
            <Text>Indique la ou les personne(s) ou entité légale(s) qui fournit cette Application et/ou le Service aux Utilisateurs.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Service</Title>
            <Text>Le service fourni par cette Application telle que décrite dans ces Conditions générales et sur cette Application.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Conditions générales</Title>
            <Text>Toutes les dispositions applicables à l&apos;utilisation cette Application et/ou le Service tel que le décrit ce document, y compris tous
              autres documents ou accords, et tels que mis à jour de temps en temps.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Utilisateur (ou Vous)</Title>
            <Text>Indique la personne naturelle ou l&apos;entité légale utilisant cette Application.</Text>
            <Title level={TitleLevel.LEVEL3} markup={TitleMarkup.H3}>Consommateur</Title>
            <Text>Tout Utilisateur qualifié de personne naturelle qui accède aux biens ou aux services pour une utilisation personnelle, ou plus
              généralement, agis à des fins autres que celles de leur commerce, leurs affaires, leur métier ou profession.</Text>
            <Divider />
            <Title level={TitleLevel.LEVEL6}>Dernière mise à jour : 18 janvier 2021</Title>
          </BoxContent>
        </Box>
      </Section>
    </View>
  )
}
export default App
