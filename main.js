let headerimages=document.querySelector("#headerimages")
let selectedvalue= "August2019"
var Airtable_TCOA_State_Standards_url =  "https://api.airtable.com/v0/appE6aFAtJyhHEvCy/NYC?api_key=keyS5mMq95mwxiIXd"
var xhr3 = new XMLHttpRequest();
xhr3.open("GET", Airtable_TCOA_State_Standards_url);
xhr3.onreadystatechange = function () {
    if (xhr3.readyState === 4) {
      result = JSON.parse(xhr3.responseText); //formatting as json
      result.records.sort(
        (a, b) => parseFloat(a.fields.Order) - parseFloat(b.fields.Order)
      ); //sorting the array in ascending order according to sr. no
       result.records.forEach(row => {
        if (row.fields.Image){
          let headerflash= document.createElement("img")
          headerflash.src = row.fields.Image[0].url
          headerflash.classList.add("headerflashimage")
          headerflash.style.display="none"
          document.querySelector("#topimages").append(headerflash)

          let splashimg= document.createElement("img")
          let splashimgcontainer= document.createElement("div")
          splashimg.src = row.fields.Image[0].url
          splashimg.classList.add("masonry-brick")
          splashimgcontainer.classList.add("masonry-brickcontainer")
          splashimgcontainer.style.width= Math.floor(Math.sqrt(result.records.length-1))+"%"
          splashimgcontainer.style.padding="5px"
          // splashimg.style.height= Math.floor(Math.sqrt(result.records.length-1))-1+"%"
          splashimgcontainer.append(splashimg)
          document.querySelector(".masonry").append(splashimgcontainer)
  //         document.querySelector("#year").addEventListener("change", function(evt){ 
  //  alert(evt.target.value)  
  // })
          // if(row.fields.January2020=="FALSE"){
            splashimg.style.opacity="25%"
          // }
        }
    
        allheaderflash=document.querySelectorAll(".headerflashimage")
        fadeInImage(allheaderflash[0],100) //THIS IS THE TIME FOR VIDEO
       });
       document.querySelector("#years").addEventListener("change", function(evt){ 
        selectedvalue=evt.target.value
        // console.log(selectedvalue)
       })
       document.querySelector("#imgfrequency").addEventListener("change", function(evt){ 
        // selectedvalue=evt.target.value
        // console.log(selectedvalue)
        bricks=document.querySelectorAll(".masonry-brick")
        switch (evt.target.value) {
          case "TRUE":         
          bricks.forEach((brick,i) => {
            if(result.records[i].fields[selectedvalue]=="FALSE"){
              brick.style.opacity="25%"
            }else{brick.style.opacity="100%"}
          })
            break;
            case "FALSE":
              bricks.forEach((brick,i) => {
                if(result.records[i].fields[selectedvalue]=="TRUE"){
                  brick.style.opacity="25%"
                }else{brick.style.opacity="100%"}
              });
              break; 
              case "ALL":
                result.records.forEach((row,i) => {
                  allTopics(bricks[i])
                })
        
          default:
            break;
        }
       })
       document.querySelector("#true").addEventListener("change", function(evt){ 
         bricks=document.querySelectorAll(".masonry-brick")
         bricks.forEach((brick,i) => {
           if(result.records[i].fields[selectedvalue]=="FALSE"){
             brick.style.opacity="25%"
           }else{brick.style.opacity="100%"}
         });
       })
       document.querySelector("#false").addEventListener("change", function(evt){ 
        bricks=document.querySelectorAll(".masonry-brick")
        bricks.forEach((brick,i) => {
          if(result.records[i].fields[selectedvalue]=="TRUE"){
            brick.style.opacity="25%"
          }else{brick.style.opacity="100%"}
        });
       })
       document.querySelector("#topics").addEventListener("change", function(evt){
        bricks=document.querySelectorAll(".masonry-brick")
        result.records.forEach((row,i) => {
          allTopics(bricks[i])
        })
      })
   }};
  xhr3.send();
var Airtable_Topics_url =  "https://api.airtable.com/v0/appfN1F1cWqk676qF/FadingDefinitions?api_key=keyS5mMq95mwxiIXd"
function allTopics (brick) {
  brick.style.opacity="100%"
}
var xhr2 = new XMLHttpRequest();
xhr2.open("GET", Airtable_Topics_url);
// // xhr2.onreadystatechange = function () {
//     if (xhr2.readyState === 4) {
//       result = JSON.parse(xhr2.responseText); //formatting as json
//        result.records.forEach(row => {
//         if (row.fields.Definitions){
//           let splashimg= document.createElement("img")
//           splashimg.src = row.fields.Definitions[0].url
//           document.querySelector("#DefinitionsBlock").append(splashimg)
//           // var duration = 1;
//           // var delay = 1;
//           // var tl = new TimelineLite({onComplete:repeat});
//           // $("#images img").each(function(index, element){
//           //   var offset = index === 0 ? 0 : "-=" + duration; //insert first animation at a time of 0 or all other animations at a time that will overlap with the previous animation fading out.
//           //   tl.to(element, duration, {autoAlpha:1,scale:1.5, repeat:1, yoyo:true, repeatDelay:delay}, offset)
//           //   //when the last image fades out we need to cross-fade the first image
//           //   if (index === $("#images img").length - 1){
//           //     tl.to($("#images img")[0], duration, {autoAlpha:1, scale:1.5}, offset)
//           //   }
// //           });

// //           function repeat() {
// //             tl.play(duration);
// // }
//         }
//        });
//    }};
  xhr2.send();
var url = "https://api.airtable.com/v0/appfN1F1cWqk676qF/ScrollingHeader?api_key=keyS5mMq95mwxiIXd";
// var url = "https://api.airtable.com/v0/appfijBB2J0D9T3zT/Portfolio_MainBlocks?api_key=keyS5mMq95mwxiIXd";
var xhr = new XMLHttpRequest();
xhr.open("GET", url);
// xhr.onreadystatechange = function () {
//     if (xhr.readyState === 4) {
//        //console.log(xhr.status);
//        //console.log(xhr.responseText.record);
//        result = JSON.parse(xhr.responseText); //formatting as json
//        result.records.sort(
//         (a, b) => parseFloat(a.fields.SerialNumber) - parseFloat(b.fields.SerialNumber)
//       ); //sorting the array in ascending order according to sr. no
//        console.log(result)
//        result.records.forEach(SlideImage => 
//         { let image= document.createElement("img")
//         image.src= SlideImage.fields.SlideImage[0].url
//         console.log (headerimages)
//         image.style.width="100%"
//         image.style.height="100%"
//         headerimages.appendChild(image)
//        });
//     }};

    xhr.send();
// navigation bar
    function myFunction() {
        var x = document.getElementById("myLinks");
        if (x.style.display === "block") {
          x.style.display = "none";
        } else {
          x.style.display = "block";
        }
      }
// Zoom image: Block 1
      const zoomElement = document.querySelector("#scrollimage");
let zoom = 1;
const ZOOM_SPEED = 0.01;

// document.addEventListener("wheel", function(e) {  
    
//     if(e.deltaY > 0 && zoom < 2){     
//         zoomElement.style.transform = `scale(${zoom += ZOOM_SPEED})`;  
//       }
//       else if(e.deltaY < 0 && zoom > 1){     
//         zoomElement.style.transform = `scale(${zoom -= ZOOM_SPEED})`;  
//       }
//       // else{    
//       //   zoomElement.style.transform = `scale(${zoom -= ZOOM_SPEED})`;  }

// });
// currentIndex=0
// function fadeInImage(image) {
//   image.style.opacity = 0;
//   image.style.display = "block";
//   image.addEventListener('animationend', () => {
//     console.log(image)
//     image.style.display = "none";
//     currentIndex++;
//     if (currentIndex >= allheaderflash.length) {
//       currentIndex = 0;
//     }
//     fadeInImage(allheaderflash[currentIndex]);
//   }, {once: true});
// }
// currentIndex=0
// function fadeInImage(image, duration) {
//   image.style.opacity = 0;
//   image.style.display = "block";
//   setTimeout(() => {
//     image.style.opacity = 1;
//   }, 0);
//   console.log(image)
//   setTimeout(() => {
//     fadeOutImage(image, duration);
//   }, duration - 1000);
// }

// function fadeOutImage(image, duration) {
//   image.style.opacity = 1;
//   setTimeout(() => {
//     image.style.opacity = 0;
//   }, duration - 1000);
//   setTimeout(() => {
//     currentIndex++;
//     image.style.display="none"
//     if (currentIndex >= allheaderflash.length) {
//       currentIndex = 0;
//     }
//     fadeInImage(allheaderflash[currentIndex], duration);
//   }, duration);
// }
function fadeInImage(image, duration) {
  let opacity = 0;
  image.style.display="block"
  const interval = setInterval(() => {
    image.style.opacity = opacity;
    opacity += 0.01;
    if (opacity >= 1) {
      clearInterval(interval);
      setTimeout(() => {
        fadeOutImage(image, duration);
      }, duration);
    }
  }, duration / 100);
}

// Define a function to fade out an image
function fadeOutImage(image, duration) {
  let opacity = 1;
  const interval = setInterval(() => {
    image.style.opacity = opacity;
    opacity -= 0.01;
    if (opacity <= 0) {
      clearInterval(interval);
      image.style.display="none"
      setTimeout(() => {
        fadeInImage(image.nextElementSibling || images[0], duration);
      }, duration);
    }
  }, duration / 100);
}
  //         document.querySelector("#years").addEventListener("change", function(evt){ 
  //  selectedvalue=evt.target.value
  //  console.log(selectedvalue)
  // })
  // document.querySelector("#true").addEventListener("change", function(evt){ 
  //   console.log("click",selectedvalue)
  //   bricks=document.querySelectorAll(".masonry-brick")
  //   bricks.forEach((brick,i) => {
  //     console.log(result.records[i].fields[selectedvalue])
  //     if(result.records[i].fields[selectedvalue]=="FALSE"){
  //       brick.style.opacity="25%"
  //     }else{brick.style.opacity="100%"}
  //   });
  // })
  // document.querySelector("#false").addEventListener("change", function(evt){ 
  //   console.log("click2")
  //   bricks=document.querySelectorAll(".masonry-brick")
  //  result.records.forEach((row,i) => {
  //     console.log(row.fields[selectedvalue])
  //     if(row.fields[selectedvalue]=="TRUE"){
  //       bricks[i].style.opacity="25%"
  //     }else{bricks[i].style.opacity="100%"}
  //   });
  // })