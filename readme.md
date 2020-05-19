# Q-UP Web-Application

Welcome to the official Q-UP github repository. In this repository you will find the source code used to develop and host
Q-UP made by Team-KART

## Table of Contents
  * [About Q-UP](#About Q-UP)
    + [TermsFeed](#termsFeed)
  * [Contributors](#contributors)
  * [Installation](#installation)
  * [Technologies](#technologies)
  * [References](#references)
    + [TermsFeed](#termsFeed)
    + [MaterialUI](#MaterialUI)
    + [Images](#images)

## About Q-UP

The following is the describes of Q-UP's application's motivations and its domain.

### Description

Q-UP is an online queue management solution that allows users to queue from home. We hope this application will have 
great impact in the fight against COVID-19 as it will allow for greater social distancing. In addition, we are 
tackling a universal problem which is wasting time in queues. Our application will allow everyone to use their time more 
efficiently and thus lead better lives. We also aim to make our application accessible to the least privileged 
implementing a system to allow users without electronic means to enter the queue.

### Implemented Features

The following is a list of currently implemented features for this application.
* 

## Contributors

The following table lists the members of Team-KART.

| Name             | Student ID | GitHub ID                                                |
| ---------------- | ---------- | -------------------------------------------------------- |
| Amirali Askari   | A01088621  | [github.com/AmirAshvins](https://github.com/AmirAshvins)         |
| Ryan Leung       | A01204521  | [github.com/rleung1004](https://github.com/rleung1004)           |
| Tianweil Lun     | A00855225  | [github.com/TerryLun](https://github.com/TerryLun)       |
| Karel Chanivecky | A01052674  | [github.com/KarelChanivecky](https://github.com/KarelChanivecky) |

## Installation

In this section, you will find instructions to how install all the dependencies of our project, and start running the 
development version on your local machine.

### Cloning Q-UP's repository using command line

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
### Installing project dependencies using command line

Note: In order to run our application locally on your machine, you need to have ```node.js``` and ```npm``` installed.
please refer <a href="https://docs.npmjs.com/downloading-and-installing-node-js-and-npm">Node and NPM installation 
tutorial</a> to install them on your local machine.

1. open Terminal.

2. Change the current working directory to the location where you want previously cloned our repository.

    Note: The name of the root directory is ```COMP-2800-TEAM-DTC-01-Q-Up```.

3. navigate to```functions``` folder inside ```q-up_firebase```.
    
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
6. navigate to ```q-up_client``` folder.
    
    ```html
    $ cd q-up_client/
    ```

1. Open the cloned project on any IDE of your choice.

    Note: our team used <a href="how to install webstorm themes">WebStorm</a> and 
    <a href="https://code.visualstudio.com/docs/setup/setup-overview">Visual Studio Code</a>. Please refer to these 
    links if you want an installation tutorial for those IDEs

2.

To run this application, first run \$npm install in the q_up-client directory, and open index.ts.

## Technologies

The following is a list of all technologies used to develop Q-UP

## References

### TermsFeed

The content for the two static pages of "Terms and Conditions" and "Privacy Policy" have been generated using 
<a href="https://www.termsfeed.com/privacy-policy-generator/?gclid=CjwKCAjwwYP2BRBGEiwAkoBpAroNfqrmxN6JbvY3Drc4v2kvodrQ1dmhvyYqmtL-_IIpvSlGzgNyqxoC1JsQAvD_BwE">TermsFeed</a>
. TermsFeed is an online Terms and conditions generator that provides free generated content depending on the users needs.

For more information please visit their website at:  www.termsfeed.com

### Pastebin

The regular express that is used to determine the validity of the email addresses for login functionality uses a code that 
was found in <a href= "https://pastebin.com/f33g85pd">Pastebin</a>. Pastebin is a website that allows users to share plain text 
through public posts. 

For more information please visit their website at: www.pastebin.com

### MaterialUI

Most of the elements used in our website have been taken from <a href="https://material-ui.com">Material UI</a>. 
Material UI, as discussed above in technologies section, is an open-source project that features React components that 
implement Google's Material Design. 

You will be able to find the list of all available UI components by selecting the hamburger menu located at the top 
left corner, and visiting "Components" and "Components API" options.

For more information please visit their website at: www.material-ui.com
 
### Images

The following are the links to where the images used in our applications were taken: 

1.
2. 
3.