# jas-jwt-service

**Import the package an create an object**

`import JasJwtService form 'jas-jwt-service';`

`const jwt = new JasJwtToken();`

**Generate token**

`const generatedToken = jwt.createToken(`

`{...sensitive data}, `

`"SECERET_KEY any string you want",`

`expiryDuration as a string` *// 35m, 2h, 7d*

`)`

**Extract the token from the request**

`const token = jwt.extractTokenFromRequest(req);`

`const resultData = jwt.verifyToken(token);`

`if(!resultData || (resultData && resultData.secretKey !== "SECERET_KEY you passed when generate token")) {`

*// Unauthorized*

`} `

`else {`

*// Proceed next*

`}`
