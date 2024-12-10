/* eslint-disable no-console */

import fs from 'fs'
import devcert from 'devcert'

if (!fs.existsSync(`${process.env.HOME}/certs/${process.env.FLEX_DOMAIN_NAME}`)) {
  fs.mkdirSync(`${process.env.HOME}/certs/${process.env.FLEX_DOMAIN_NAME}`)
}

const domains = [`${process.env.FLEX_DOMAIN_NAME}`]

devcert
  .certificateFor(domains, { getCaPath: true, skipHostsFile: true })
  .then(({ key, cert, caPath }) => {
    fs.writeFileSync(`${process.env.HOME}/certs/${process.env.FLEX_DOMAIN_NAME}/devcert.key`, key)
    fs.writeFileSync(`${process.env.HOME}/certs/${process.env.FLEX_DOMAIN_NAME}/devcert.cert`, cert)
    fs.writeFileSync(`${process.env.HOME}/certs/${process.env.FLEX_DOMAIN_NAME}/.capath`, caPath)
  })
  .catch(console.error)

// https://www.techrepublic.com/article/how-to-quickly-give-users-sudo-privileges-in-linux/
// https://askubuntu.com/questions/335987/remove-sudo-privileges-from-a-user-without-deleting-the-user
// https://superuser.com/questions/1502762/how-to-create-linux-user-that-would-not-require-password-to-login-with-su
