# Stage4 code setup
## Setup
1. clone the code to local machine
```
git clone https://github.com/cs411-alawini/fa25-cs411-team044-SQLHeavy.git
```
2. enter into stage4_checkpoint1 directory
```
cd ./fa25-cs411-team044-SQLHeavy/docs/stage4_checkpoint1
```
3. create a new project "App" through react
```
npx create-react-app app
```
4. run the app.py file
```
python app.py
```
5. copy every .js file to app folder
```
cp ./*.js ./app/src/
```
6. enter into app folder and run the App.js file
```
cd app
npm install react-router-dom axios leaflet react-leaflet (download package for the first time executing)
npm start
```