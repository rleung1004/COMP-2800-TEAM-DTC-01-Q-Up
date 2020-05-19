# Q-UP Web-Application

Welcome to the official Q-UP github repository. In this repository you will find the source code used to develop and host
Q-UP made by Team-KART

## Table of Contents
  - [About Q-UP](#about-q-up)
  - [Contributors](#contributors)
  - [Installation](#installation)
    * [Cloning the repository using command line](#cloning-the-repository-using-command-line)
    * [Installing project dependencies using command line](#installing-project-dependencies-using-command-line)
    * [Running the application on your local machine](#running-the-application-on-your-local-machine)
  - [Tests](#tests)
    * [Postman](#postman)
    * [Unit tests](#unit-tests)
    * [Selenium IDE (Chrome Extension)](#selenium-ide--chrome-extension-)
  - [Technologies](#technologies)
  - [Code References](#code-references)
    * [TermsFeed](#termsfeed)
    * [Pastebin](#pastebin)
    * [MaterialUI](#materialui)
    * [tealium IQ Learning Center](#tealium-iq-learning-center)
    
## About Q-UP

Q-UP is an online queue management solution that allows users to queue from home. We hope this application will have 
great impact in the fight against COVID-19 as it will allow for greater social distancing. In addition, we are 
tackling a universal problem which is wasting time in queues. 

Our application will allow everyone to use their time more efficiently and thus lead better lives. We also aim to make 
our application accessible to the least privileged implementing a system to allow users without electronic means to 
enter the queue.

## Contributors

The following table lists the members of Team-KART.

| Name             | Student ID | GitHub ID                                                |
| ---------------- | ---------- | -------------------------------------------------------- |
| Amirali Askari   | A01088621  | [github.com/AmirAshvins](https://github.com/AmirAshvins)         |
| Ryan Leung       | A01204521  | [github.com/rleung1004](https://github.com/rleung1004)           |
| Tianweil Lun     | A00855225  | [github.com/TerryLun](https://github.com/TerryLun)       |
| Karel Chanivecky | A01052674  | [github.com/KarelChanivecky](https://github.com/KarelChanivecky) |

## Installation

In this section, you will find instructions to how install all the dependencies of our project, and start running our 
 application on your local machine.

### Cloning the repository using command line

In order to clone Q-UP's repository using command line interface, follow these instructions:

1. On GitHub, navigate to the main page of the repository.
    
2. Under the repository name, click Clone or download.

3. To clone the repository using HTTPS, under "Clone with HTTPS",copy the provided link.
  
    Note: For conscience, here's link to clone the project 
    ```html
    https://github.com/rleung1004/COMP_2800_Feature_Branch_Workflow.git
    ```
4. Open Terminal.

5. Change the current working directory to the location where you want the cloned directory.

6. Type ``` git clone ```, and then paste the URL you copied earlier.
    ```html
    $ git clone https://github.com/rleung1004/COMP_2800_Feature_Branch_Workflow.git
    ```
7. Press Enter to create your local clone.
    ```html
    $ git clone https://github.com/rleung1004/COMP_2800_Feature_Branch_Workflow.git
    > Cloning into `the-best-project`...
    > remote: Counting objects: 10, done.
    > remote: Compressing objects: 100% (8/8), done.
    > remove: Total 10 (delta 1), reused 10 (delta 1)
    > Unpacking objects: 100% (10/10), done.
    ```
   
  Now you have successfully cloned our application into your local machine. In the next section, we will install all the 
  dependencies that are required to run our application.
  
### Installing project dependencies using command line

Note: In order to run our application locally on your machine, you need to have ```node.js``` and ```npm``` installed.
please refer <a href="https://docs.npmjs.com/downloading-and-installing-node-js-and-npm">Node and NPM installation 
tutorial</a> to install them on your local machine.

In order to install the project dependencies that are required to run Q-UP's web-application, follow these instructions:

1. Open Terminal.

2. Change the current working directory to the location where you previously cloned our repository.

    Note: The name of the root directory is ```COMP-2800-TEAM-DTC-01-Q-Up```.

3. Navigate to```functions``` folder inside ```q-up_firebase```.
    
    ```html
    $ cd q-up_firebase/functions/
    ```

4. Run ```npm install``` in the ```functions``` folder.

    ```html
    $ npm install
    audited 435 packages in 1.562s
      
    35 packages are looking for funding
     run `npm fund` for details
   
    found 0 vulnerabilities
    ```
5. Navigate back to the root directory.
    
    ```html
    $ cd ../..
    ```
6. Navigate to ```q-up_client``` folder.
    
    ```html
    $ cd q-up_client/
    ```
7. Run ```npm install``` in the ```q-up_client``` folder.

    ```html
    $ npm install
    audited 2013 packages in 10.235s
             
    66 packages are looking for funding
    run `npm fund` for details
          
    found 0 vulnerabilities
    ```       
       
  Now you have successfully installed all the necessary dependencies that are required to run this application. 
  In the next section, we will run the application on your local machine.
  
### Running the application on your local machine

In order to run Q-UP's web-application on your local machine, follow these instructions: 
      
1. Open the cloned project on any IDE of your choice.

    Note: our team used <a href="how to install webstorm themes">WebStorm</a> and 
    <a href="https://code.visualstudio.com/docs/setup/setup-overview">Visual Studio Code</a>. Please refer to these 
    links if you want an installation tutorial for those IDEs.

2. Open your IDEs' terminal.

3. Navigate to ```q-up_client``` folder.
    
    ```html
    $ cd q-up_client/
    ```
4. Type ```npm start``` to start our application.
    
    ```html
    $ npm start
    ```
  
    After a short while, the application will start running on your browser.

## Tests

 This section guides the users to use the test files that are provided in the ```q_up-tests```.

### Postman

Before proceeding with the following instructions, make sure to have <a href="https://www.postman.com/downloads/">Postman</a> on your local machine.

In order to have Q-UP's Postman test collections, follow these instructions:

1.  Open Postman.

2. Click Import, at the top right corner of Postman.

3. Click ```choose Files``` and locate the ```postman_Q-UP_Backend.json``` located in the ```backend-tests``` folder.

An import success message should appear in the application. Now you have access to our API tests.

### Unit tests

In order to run the unit tests of Q-UP's web=application, follow these instructions:

1. Open Terminal.

2. Change the current working directory to the location that Q-UP is located at.

3. Navigate to the ```q-up_tests``` folder.

    ```html
    $ cd q-up_tests/
    ```
4. Run ```npm install``` in the ```q-up_tests``` folder.
    
   ```html
       $ npm install
       audited 245 packages in 1.038s
                
       23 packages are looking for funding
       run `npm fund` for details
             
       found 0 vulnerabilities
       ```    
 5. Run ```npm test``` in the ```q-up_tests``` folder.
 
    ```html
    $ npm test
    ```
    
 After a short while, you will see a series of 55 unit test results will be displayed on your terminal window.

### Selenium IDE (Chrome Extension)

Note: You need to have downloaded and installed 
<a href="https://www.google.ca/chrome/?brand=CHBD&gclid=CjwKCAjwh472BRAGEiwAvHVfGuD2x9L9a_Sv6dU4JdRTeXjKohRtSS8mAP19PEq2_iDIaYhluDQFZBoCr-kQAvD_BwE&gclsrc=aw.ds">
Google Chrome</a> on your local machine.

Note: Before proceeding with the following instructions, make sure to have added <a href="https://chrome.google.com/webstore/search/selenium%20ide?hl=en">Selenium IDE</a> to your
 local machine's google Chrome.

In order to run the tests using Q-UP's selenium Chrome Extension scripts, follow these instructions:

1. Open Google Chrome

2. Open ```Selenium IDE``` on the top right corner of your browser.

3. Click "Open an existing project".

4. Locate the Q-UP's directory in your local machine

5. Locate the ```selenium-chrome-extension_Q-up_user-interaction.side``` file located in the ```user-interactions-tests``` folder.

6. Click Open.

You should be bale to see all the selenium tests for Q-UP's web-application now.

To run the tests:

* click ```Run all Tests``` option located at the top of the extension.
* Press ```Control + Shift + R``` for windows users and ```Command + Shift + R``` for mac users.
                         
## Technologies

The following is a list of all technologies used to develop Q-UP.

| Technology                  | Official Website                           | Description                                                                                                                                                                                                                 |
|-----------------------------|--------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| npm                         | https://www.npmjs.com                      | An online repository for the publishing of open-source Node. js projects, and a command-line utility for interacting with said repository that aids in package installation, version management, and dependency management. |
| React.js                    | https://reactjs.org                        | A declarative, Component-Based, open-source JavaScript library that is used for building user interfaces specifically for single-page applications. It's used for handling the view layer for web and mobile apps.          |
| Node.js                     | https://nodejs.org/en/                     | A platform built on Chrome's JavaScript runtime for easily building fast and scalable network applications.                                                                                                                 |
| Express.js                  | https://expressjs.com                      | A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.                                                                                            |
| Typescript                  | https://www.typescriptlang.org             | A typed superset of Javascript that compiles to plain JavaScript.                                                                                                                                                           |
| Material UI                 | https://material-ui.com                    | An open-source project that features React components that implement Google's Material Design.                                                                                                                              |
| SCSS                        | https://sass-lang.com/guide                | A CSS preprocessor that runs on the server and compiles to CSS code that your browser understands.It contains more features that are not present in CSS which makes it a good choice for developers to use it.              |
| Firebase firestore          | https://firebase.google.com/docs/firestore | A flexible, scalable database for mobile, web, and server development from Firebase and Google Cloud Platform.                                                                                                              |
| Firebase Authentication     | https://firebase.google.com/docs/auth/     | A collection of backend services, easy-to-use SDKs, and ready-made UI libraries to authenticate users to web-applications.                                                                                                  |
| Firebase Cloud Functions    | https://firebase.google.com/docs/functions | A serverless framework that lets you automatically run backend code in response to events triggered by Firebase features and HTTPS requests.                                                                                |
| Algolia                     | https://www.algolia.com                    | A hosted search engine capable of delivering real-time results from the first keystroke.                                                                                                                                    |
| BusBoy                      | https://www.npmjs.com/package/busboy       | A node.js module for parsing incoming HTML form data.                                                                                                                                                                       |
| Moment.js-TimeZone          | https://momentjs.com/timezone/             | A free and open-source javascript library that removes the need to use the native JavaScript Date object directly.                                                                                                          |
| Axios                       | https://www.axios.com                      | A library that helps developers make http requests to external resources.                                                                                                                                                   |
| JSON Web Tokens             | https://jwt.io                             | An open standard that defines a compact and self-contained way for securely transmitting information between parties as a JSON object.                                                                                      |
| Postman                     | https://www.postman.com                    | A popular API client that makes it easy for developers to create, share, test and document APIs.                                                                                                                            |
| Mocha/Chai                  | https://mochajs.org                        | A feature-rich JavaScript test framework running on Node.js and in the browser.                                                                                                                                             |
| Selenium (Chrome Extension) | https://www.selenium.dev/                  | A record/run tool that a test case developer uses to develop Selenium Test cases.                                                                                                                                           |

## Code References

In this section, the code references used in Q-UP's application are listed and described.

### TermsFeed

The content for the two static pages of "Terms and Conditions" and "Privacy Policy" have been generated using 
<a href="https://www.termsfeed.com/privacy-policy-generator/?gclid=CjwKCAjwwYP2BRBGEiwAkoBpAroNfqrmxN6JbvY3Drc4v2kvodrQ1dmhvyYqmtL-_IIpvSlGzgNyqxoC1JsQAvD_BwE">TermsFeed</a>
. TermsFeed is an online Terms and conditions generator that provides free generated content depending on the users needs.

For more information please visit their website at:  www.termsfeed.com.

### Pastebin

The regular express that is used to determine the validity of the email addresses for login functionality uses a code that 
was found in <a href= "https://pastebin.com/f33g85pd">Pastebin</a>. Pastebin is a website that allows users to share plain text 
through public posts. 

For more information please visit their website at: www.pastebin.com.

### MaterialUI

Most of the elements used in our website have been taken from <a href="https://material-ui.com">Material UI</a>. 
Material UI, as discussed above in technologies section, is an open-source project that features React components that 
implement Google's Material Design. 

You will be able to find the list of all available UI components by selecting the hamburger menu located at the top 
left corner, and visiting "Components" and "Components API" options.

For more information please visit their website at: www.material-ui.com.

### tealium IQ Learning Center

The detector that determines if the users of our applications are using a mobile device or not, has been taken from 
<a href="https://community.tealiumiq.com/t5/Developers/How-do-you-build-a-load-rule-for-mobile-only-devices/td-p/5282">
community.tealium </a>. tealium is center that has support guides for Tealium iQ Tag Manager, EventStream, 
AudienceStream and DataAccess.

For more information please visit their website at: www.community.tealiumiq.com

