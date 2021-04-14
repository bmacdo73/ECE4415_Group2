


//Each myArr Entry is an object for easy DOM manipulation
function artPiece(Names, Img, Desc, URL){
    this.Names = Names;
    this.Img = Img;
    this.Desc = Desc;
    this.URL = URL;
}
let myArr = [];
myArr.push(new artPiece("3dbenchy", "3dbenchy.png", "This is a small piece used in the setup of a 3D printer to test its alignment.", "/sandbox.html?f=3dbenchy&c=0xff3f00&m=p"));
myArr.push(new artPiece("Thunderbird Totem Pole", "thunderbird.png", "A thunderbird totem pole, Vancouver, BC.", "/sandbox.html?f=thunderbird&c=0x2c2017&m=s"));
myArr.push(new artPiece("Dragon Netsuke", "dragonNetsuke.png", "A netsuke of a dragon. From the Auckland Museum, Auckland, New Zealand.", "/sandbox.html?f=dragonNetsuke&c=0x420000&m=p"));
myArr.push(new artPiece("Kwakiutl Totem Pole", "kwakiutlTP.png", "Giant-Cannibal with eagle and copper plate in his hand, British Columbia, Kwakiutl Culture. From Musée du Cinquantenaire, Brussels, Belgium.", "/sandbox.html?f=kwakiutlTP&c=0x2c2017&m=s"));
myArr.push(new artPiece("Lion Skull", "lionSkull.png", "A lion skull. From the Auckland Museum, Auckland, New Zealand.", "/sandbox.html?f=lionSkull&c=0xccbe95&m=p"));
myArr.push(new artPiece('Praroditeljka, "Foremother"', "foremother.png", "A cobblestone sculpture from the Lepenski Vir culture, ~7000 BC, Belgrade, Serbia.", "/sandbox.html?f=foremother&c=0xbf9969&m=s"));
myArr.push(new artPiece("Etruscan Boar Vessel", "boarVessel.png", "A ceramic boar vessel, ~600-500 BC, Etrsucan. From the Cleveland Museum of Art.", "/sandbox.html?f=boarVessel&c=0x0f0600&m=p"));
myArr.push(new artPiece("Venus de Milo", "venusDeMilo.png", "An ancient Greek marble statue, ~130-100 BC, sculpted by Alexandros of Antioch. From the Louvre Museum, Paris, France.", "/sandbox.html?f=venusDeMilo&c=0x70706c&m=p"));


//Info arrays for the search functions
let pieceNames = [" 3dbenchy", " thunderbird totem pole", " dragon netsuke", " kwakiutl totem pole", " lion skull", ' praroditeljka, "foremother"', " etruscan boar vessel", " venus de milo"];

let request = new XMLHttpRequest();


//Populate the myArr with entries on initial page load
function pageInit(){
    let uList = document.getElementById("displayList");
    for (i in myArr){
        //Allocating all information from the myArr artPiece objects
        let lItem = document.createElement("li");

        let lName = document.createElement("button");
        lName.innerText = myArr[i].Names;
        lName.setAttribute("URL",  myArr[i].URL);
        lName.setAttribute("class", "link");
        lName.onclick = function(){
            const URL = lName.getAttribute("URL");
            // viewModel(lName.innerHTML);
            viewModel(URL);
        };

        let lImg = document.createElement("img");
        let lImgSrcTemp = "./img/"+myArr[i].Img;
        lImg.setAttribute("src", lImgSrcTemp);
        lImg.setAttribute("alt", myArr[i].Names);

        let lDesc = document.createElement("p");
        lDesc.innerHTML = myArr[i].Desc;

        //Appending all information to the HTML
        lItem.appendChild(lImg);
        lItem.appendChild(lName);
        lItem.appendChild(lDesc);

        //Final step add the newly made <li> to the existing <ul>
        uList.appendChild(lItem);
    }
}

//Function to search the myArr by piece name using the string input by the user
function searchName(id){
    //declarations
    let stringIn = id.value;
    let alpha = /^[a-zA-Z\s0-9]*$/; //objective C. only a-z or A-Z chars

    let validate = alpha.exec(stringIn); //validate the string
    let isStringValid = Boolean(validate);
    let newStringIn = validate.toString().toLowerCase();

    let isStringSub63 = 1;
        
    if (isStringValid){
        let len = stringIn.length;
        if (len <63) isStringSub63 = 1; //objective C. string is less than 20 chars long
        else {
            isStringSub63 = 0;
            alert("No results");
        }
    }

    if (isStringValid && isStringSub63) {
        //call the function to search the array for any matching entries
        searchMyArr(newStringIn,0);
    }
    else alert("Invalid input");
}

function searchMyArr(query){
    let searchResults = document.getElementById("searchResults");
    let dynSearch = document.getElementById("dynSearch");
    if (query == ""){
        while(searchResults.hasChildNodes()){
            searchResults.removeChild(searchResults.firstChild);
        }
        dynSearch.innerHTML = ("");
    } else {
        //declarations
        let hitCounter = 0;
        let hits = [];

        for (let i in pieceNames) {
            if (hitCounter < 3) {
                if (pieceNames[i].indexOf(query) > -1) {
                    hits.push(i);
                    hitCounter++;
                }
            }
        }

        //populate the search results list
        let pFlavour = document.getElementById("dynSearch");
        let br = document.createElement("br");

        while(searchResults.hasChildNodes()){
            searchResults.removeChild(searchResults.firstChild);
        }
        if (hitCounter > 0){
            pFlavour.innerHTML = "Search results:\n\n";
            pFlavour.appendChild(br);
            //Reusing the code for the onLoad pageInit() function
            for (i in hits) {
                //Allocating all information from the myArr artPiece objects
                let searchLItem = document.createElement("li");

                let searchLName = document.createElement("button");
                searchLName.innerText = myArr[hits[i]].Names;
                searchLName.setAttribute("URL", myArr[hits[i]].URL);
                searchLName.setAttribute("class", "link");
                searchLName.onclick = function () {
                    const URL = searchLName.getAttribute("URL");
                    // viewModel(lName.innerHTML);
                    viewModel(URL);
                };

                let searchLImg = document.createElement("img");
                let searchLImgSrcTemp = "./img/" + myArr[hits[i]].Img;
                searchLImg.setAttribute("src", searchLImgSrcTemp);
                searchLImg.setAttribute("alt", myArr[i].Names);
                
                let searchLDesc = document.createElement("p");
                searchLDesc.innerHTML = myArr[hits[i]].Desc;


                //Appending all information to the HTML
                searchLItem.appendChild(searchLImg);
                searchLItem.appendChild(searchLName);
                searchLItem.appendChild(searchLDesc);

                //Final step add the newly made <li> to the existing <ul>
                searchResults.appendChild(searchLItem);
            }
        //if no matches, alert the user
        } else {
            pFlavour.innerHTML = "No matches found!";
            pFlavour.appendChild(br);
        }
    }
}

function viewModel(URL){
    window.open(URL);
}