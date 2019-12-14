sgMail.setApiKey(SENDGRID_API_KEY);
                const msg = {
                to: 'fullstackmayor@gmail.com',
                from: 'fullstackmayor@gmail.com',
                subject: 'Password reset',
                html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="http://localhost:3000/reset/${token}/${userStatus}">link</a> to set a new password.</p>
                `
                }
                sgMail.send(msg) 



                const mailjet = require ('node-mailjet')
.connect('47b4b4f88fa682a417e9b5f788b8083c', 'a5d21154bd00cc161313ea30dc60d23a')
const request = mailjet
.post("send", {'version': 'v3.1'})
.request({
  "Messages":[
    {
      "From": {
        "Email": "fullstackmayor@gmail.com",
        "Name": "Abraham"
      },
      "To": [
        {
          "Email": "fullstackmayor@gmail.com",
          "Name": "Abraham"
        }
      ],
      "Subject": "Greetings from Mailjet.",
      "TextPart": "My first Mailjet email",
      "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
      "CustomID": "AppGettingStartedTest"
    }
  ]
})
request
  .then((result) => {
    console.log(result.body)
  })
  .catch((err) => {
    console.log(err.statusCode)
  })
                