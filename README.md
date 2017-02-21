<h4>Message Consumption and Processor</h4>
<p>
The message consumption and processor system is handled by the 
<a href="https://parseplatform.github.io">Parse Open Source Project</a>
library.
Each trade payload is saved to a mongodb instance and processed by the parse
cloud code for automatic creation of parametric documents containing countries,
currencies, currencies keys (currencyfrom-currencyto) and statistical data for 
the example graph showing average rates by country.
The code handling message processing is contained in cloud/main.js file. 
</p>
<h4>Security</h4>
<p>The message consumption system use a class security level restricting the creation of
 a new trade document to a specific role "traderobot". 
 Each post request must contain the  X-Parse-Session-Token http header created after login
 of a traderobot user: "traderobot".
The entire application is served under a crypted https connection.</p>

<h4>Parse Schema, access control setup and indexes</h4>
<p>The parse schema along with indexes is automatically checked during the app startup, the code 
controlling this functionality is contained in the dbsetup subfolder.</p>

<h4>Message Frontend</h4>
<p>
The message frontend is handled by an angular js application using Parse Live Queries 
(websocket) and Parse Queries (service layer between parse restful endpoints and the app).
Frontend code can be reached in the public/app folder.
The html view containing the app is on views/index.ejs
</p>
<h4>Environment variables</h4>
<ul>
	<li>CFNODEPORT: http port for the nodejs app, default: 3000</li>
	<li>CFMONGO: mongodb url, default: mongodb://localhost:27017/currencyfair</li>
	<li>PARSECFAPP: parse server appid, default: token123456</li>
	<li>PARSECFMASTER: parse server masterkey, default: secret123456</li>
	<li>PARSECFURL: parse server api base url, default: http://localhost:CFAPIPORT/parse</li>
	<li>CFDASHBOARDUSER: username for the parse dashboard, default: currencyfair</li>
	<li>CFDASHBOARDPASS: password for the parse dashboard, default: currencyfair</li> 
	<li>CFAPIPORT: http port of the parse api server, default 1338</li>
	<li>CFDASHBOARDPORT: http port of the parse dashboard server, default 4041</li>  
</ul>
<h4>Message consumption endpoints (code challenge prototype)</h4>
<ul>
<li>PARSECFURL/login?username=traderobot&password=traderobot <p>
	the login endpoint will return a json containing the sessionToken.
</p></li>
<li>POST PARSECFURL/classes/Trade
 	The POST Request must contains the following headers:
 	<ul>
 		<li>X-Parse-Application-Id:PARSECFAPP</li>
 		<li>Content-Type:application/json</li>
 		<li>X-Parse-Session-Token:{session token returned by login}</li>
 	</ul>
 	And a body with json data as requested by the code challenge.
 	Eg: {"userId":"134256","currencyFrom":"EUR","currencyTo":"GBP","amountSell":1000,"amountBuy":747.10,"rate":0.7471,"timePlaced":"24-JAN-15 10:27:44","originatingCountry":"FR"}
</li>
</ul>
<h4>Development setup</h4>
<p>Nodejs and npm required</p>
<ul>
	<li>npm install</li>
	<li>npm start</li>
	<li>gulp run-test</li>
</ul>
<h4>About Backdoor url</h4>
<p>The codetest requires a direct endpoint so, the backdoor has been created for this purpose but,
the correct and secure way to post trade should be the api login and token authentication</p>  
 



 
   
 
 
 
 


	  



 