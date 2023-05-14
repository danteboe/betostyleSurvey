const fs = require('fs');
const express = require('express');
const app = express();
const { JSDOM } = require("jsdom");

const port = process.env.PORT || 4000;
const indexHtml = fs.readFileSync('./survey.html', 'utf-8');
const browserify = require('browserify');

app.use(express.static('C:/Users/JUAN DAVID/Documents/Projects/betostyleSurvey'));

app.get('/', (req, res) => {
  const dom = new JSDOM(indexHtml);
  const document = dom.window.document;
  const elements = document.getElementsByClassName("column");
  const images = document.getElementsByClassName("image_unselected");
  const urls = [];
  
  const clothing = csvToArrayOfObjects('./clothes.csv');
  


  for (var i = 0; i<clothing.length; i++){
      urls.push(clothing[i]['link']);
      
  }

  var indexes = []
  function getImageTag(img) {
    var randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * urls.length);
    } while (indexes.includes(randomIndex));
    var link = '/img_clothes/' + urls[randomIndex];
    img.setAttribute('src', link.slice(0, -1));
    img.setAttribute('id', [randomIndex]);
    indexes.push(randomIndex);
  }


  for (var i = 0; i < images.length; i++) {
      getImageTag(images[i]);
  }

 

  res.send(dom.serialize());
});

function csvToArrayOfObjects(filename) {
  const fileContents = fs.readFileSync(filename, 'utf-8');
  const rows = fileContents.trim().split('\n');
  const headers = rows[0].split(',');
  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const values = rows[i].split(',');
    const obj = {};

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j].trim()] = values[j].trim();
    }

    result.push(obj);
  }

  return result;
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
