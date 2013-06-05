//Matt Nowakowski
//MIU
//term 1306
//Project 1




window.addEventListener("DOMContentLoaded", function doItAll(){

    function grab(e){
        var elementID = document.getElementById(e);
        return elementID;
    }

    function makeSelect(){
        var formTag = document.getElementsByTagName("form"),
            selectLi = grab("select"),
            makeSelect = document.createElement("select");
        makeSelect.setAttribute("id", "weapons");
        for(var i = 0, j = weaponType.length; i < j; i++){
            var makeOption = document.createElement("option");
            var optText = weaponType[i];
            makeOption.setAttribute("value", optText);
            makeOption.innerHTML = optText;
            makeSelect.appendChild(makeOption);
        }
        selectLi.appendChild(makeSelect);
    }

    function getRadio(){
        var radios = document.forms[0].sclass;
        for(var i = 0; i < radios.length; i++){
            if (radios[i].checked){
                sclassValue = radios[i].value;
            }
        }
    }

    function getCheckbox(){
        if(grab('fav').checked){
           favValue = grab('fav').value;
        } else {
           favValue = "No"
        }
    }

    function toggleControls(n){
        switch(n){
            case "on":
                grab("weaponForm").style.display = "none";
                grab('clearData').style.display = "inline";
                grab("displayData").style.display = "none";
                grab("addNew").style.display = "inline";
                break;
            case "off":
                grab("weaponForm").style.display = "block";
                grab('clearData').style.display = "inline";
                grab("displayData").style.display = "inline";
                grab("addNew").style.display = "none";
                grab("items").style.display = "none";
                break;
            default:
                return false;
        }
    }

    function validate(e){
        var getLoadoutName = grab("lon");
        var getWeaponCategory = grab("weapons");

        errMsg.innerHTML = "";
        getLoadoutName.style.border = "1px solid black";
        getWeaponCategory.style.border = "1px solid black";

        var messageArray = [];

        if(getLoadoutName.value === ""){
            var loadoutNameError = "Please enter the weapon's name.";
            getLoadoutName.style.border = "2px solid red";
            messageArray.push(loadoutNameError);
        }

        if(getWeaponCategory.value === "--Weapon Category--"){
            var weaponCategoryError = "Please select a weapon category.";
            getWeaponCategory.style.border = "2px solid red";
            messageArray.push(weaponCategoryError);
        }

        if(messageArray.length >= 1){
            for(var i = 0, j = messageArray.length; i < j; i++){
                var text = document.createElement("li");
                text.innerHTML = messageArray[i];
                errMsg.appendChild(text);
            }
            e.preventDefault();
            return false;
        } else {
            storeData(this.key);
        }
    }

    function storeData(key){
        if(!key){
            var id = Math.floor(Math.random()*100000001);
        } else {
            id = key;
        }
        getRadio();
        getCheckbox();
        var item = {};
        item.loadoutName = ["Load out Name:", grab("lon").value];
        item.weaponCategory = ["Weapon Category:", grab("weapons").value];
        item.sclass = ["Class Selection:", ("sclass").Value];
        item.fav = ["Often used:", ("fav").Value];
        item.rate = ["rating:", grab("rate").value];
        item.comments = ["comments:", grab("comments").value];
        localStorage.setItem(id, JSON.stringify(item));
        alert("Load out created!");
    }

    function autoFillData(){
        for(var n in json){
            var id = Math.floor(Math.random()*100000001);
            localStorage.setItem(id, JSON.stringify(json[n]));
        }
    }

    function getData(){
        toggleControls("on");
        if(localStorage.length === 0){
            var ask = confirm("There are no created load outs. Would you like to auto create them?");
            if(ask){
                autoFillData();
            } else {
                window.location.reload();
            }
        }
        var makeDiv = document.createElement("div");
        makeDiv.setAttribute("id", "items");

        makeDiv.setAttribute("data-role", "page");
        var makeList = document.createElement("ul");
        makeList.setAttribute("data-role","pageview");
        makeList.setAttribute("data-inset","true");
        makeList.setAttribute("data-class","ui-li-icon");
        makeList.setAttribute("data-theme", "a")

        makeDiv.appendChild(makeList);
        document.body.appendChild(makeDiv);
        grab("items").style.display = "block";
        for(var i = 0, len=localStorage.length; i < len; i++){
            var makeli = document.createElement("li");
            var linksLi = document.createElement("li");
            makeList.appendChild(makeli);
            var key = localStorage.key(i);
            var value = localStorage.getItem(key);
            var obj = JSON.parse(value);
            var makeSubList = document.createElement("ul");
            makeli.appendChild(makeSubList);
            getImage(obj.weaponCategory[1], makeSubList);
            for(var n in obj){
                var makeSubli = document.createElement("li");
                makeSubList.appendChild(makeSubli);
                var optSubText = obj[n][0] + " " + obj[n][1];
                makeSubli.innerHTML = optSubText;
                makeSubList.appendChild(linksLi);
            }
            makeItemLinks(localStorage.key(i), linksLi)
        }
    }

    function getImage(catName, makeSubList){
        var imageLi = document.createElement("li");
        makeSubList.appendChild(imageLi);
        var newImage = document.createElement("img");
        var setSrc = newImage.setAttribute("src", "images/" + catName + ".svg");
        imageLi.appendChild(newImage);

    }

    function makeItemLinks(key, linksLi){
        var editLink = document.createElement("a");
        editLink.href = "#";
        editLink.key = key;
        var editText = "Edit Load out";
        editLink.addEventListener("click", editItem);
        editLink.innerHTML = editText;
        linksLi.appendChild(editLink);

        var breakTag = document.createElement('br');
        linksLi.appendChild(breakTag);

        var deleteLink = document.createElement("a");
        deleteLink.href = "#";
        deleteLink.key = key;
        var deleteText = "Delete Load out";
        deleteLink.addEventListener("click", deleteItem);
        deleteLink.innerHTML = deleteText;
        linksLi.appendChild(deleteLink);
    }

    function editItem(){
        var value = localStorage.getItem(this.key);
        var item = JSON.parse(value);

        toggleControls("off");

        grab("lon").value = item.loadoutName[1];
        grab("weapons").value = item.weaponCategory[1];
        var radios = document.forms[0].sclass;
        for(var i = 0; i < radios.length; i++){
            if(radios[i].value == "Assault" && item.sclass[1] == "Assault"){
                radios[i].setAttribute("checked", "checked");
            } else if(radios[i].value == "Sniper" && item.sclass[1] == "Sniper"){
                radios[i].setAttribute("checked", "checked");
            } else if(radios[i].value == "support" && item.sclass[1] == "Support"){
                radios[i].setAttribute("checked", "checked");
            }
        }
        if(item.fav[1] == "Yes"){
            grab('fav').setAttribute("checked", "checked");
        }
        grab("rate").value = item.rate[1];
        grab("comments").value = item.comments[1];

        saveData.removeEventListener("click", storeData);

        grab("saveData").value = "Edit Load out";
        var editSubmit = grab("saveData");

        editSubmit.addEventListener("click", validate);
        editSubmit.key = this.key;
    }

    function deleteItem(){
        var ask = confirm("Are you sure you want to delete this load out?");
        if(ask){
            localStorage.removeItem(this.key);
            alert("Load out deleted.");
            window.location.reload();
        } else {
            alert("Load out was not deleted.");
        }
    }

    function eraseData(){
        if(localStorage.length === 0){
            alert("there are no created load outs.");
        } else {
            var ask = confirm("Are you sure you want to delete all load outs?")
            if(ask){
                localStorage.clear();
                alert("Load outs have been deleted.");
                window.location.reload();
                return false;
            } else {
                alert("Load outs were not deleted.");
                window.location.reload();
            }
        }
    }

    var weaponType = ["--Weapon Category--", "--pistol--","Beretta 9mm","Kap40","Tac-45", "--SMG--","Skorpion evo","MP7","Uzi", "--Shotgun--","Remington 870","KSG","Spaz", "--Assault rifles--","M16","Ak47","M4a1", "--RPG--","SMAW","FHJ", "--Sniper rifles--","Ballista 50cal","Dragonov","M21 scout", "--Shield--","Ballistic shield", "--Knife--","Tac Knife","Ballistic knife", "--Grenade--","Frag","Semtex","concussion", "--LMG--","LSAT","HMAR","M60", "--Launcher--","underbarrel"],
        sclassValue,
        favValue = "No",
        errMsg = grab("errors");

    makeSelect();

    var saveData = grab("saveData");
    saveData.addEventListener("click", validate);
    var displayData = grab("displayData");
    displayData.addEventListener("click", getData);
    var clearData = grab("clearData");
    clearData.addEventListener("click", eraseData);
});