function createSite(){
var body = document.getElementById("content");

var div = document.createElement("div"); div.id = "mDiv"; body.appendChild(div)

  var sb = document.createElement("div"); sb.id = "sideBar"; div.appendChild(sb);  sb.className = "openSB"; createSideBar(sb);

  var li = document.createElement("div"); li.id = "mainList";
  div.appendChild(li);

var div = document.createElement("div"); div.id = "toast";
document.getElementById("content").appendChild(div);
}

function toast(text){
var div = document.getElementById("toast");
div.innerText = text; div.className = "visible"
setTimeout(function(){   div.className = div.className.replace("visible","");   },3000)
}




function createSideBar(p){
/*
SEARCH BAR
*/
var s = document.createElement("div"); s.id = "fSearchBarDiv"; s.placeholder = "Search Recipes"; p.appendChild(s); s.contentEditable = true;
s.onkeyup = function(){startFilters(recipes)}


/*
CATEGORY SELECT
*/
var cd = document.createElement("div"); cd.id = "fSelectCats"; p.appendChild(cd)
  var div = document.createElement("div"); div.innerText = "Select Cat"; cd.appendChild(div)
var cl = document.createElement("div"); cl.id = "fSelectCatsDivs"; cd.appendChild(cl);
    changeElements("fSelectCatsDivs","override","category")


/*
INGREDIENT SELECT
*/
var ild = document.createElement("div"); ild.id = "fIngLDiv"; p.appendChild(ild);
    var il = document.createElement("div"); il.id = "fIngListDiv"; ild.appendChild(il);
    var is = document.createElement("div"); is.id = "fIngSearchDiv"; ild.appendChild(is)
          var search = document.createElement("input"); search.type = "text"; search.id = "fIngSearchInp"; is.appendChild(search); search.placeholder = "Add Ingredients";
          var ingL = document.createElement("div"); ingL.id = "fIngList"; is.appendChild(ingL);

search.addEventListener("click", function() {  changeElements(document.getElementById("fIngList"),"override","ingredient")  })

search.addEventListener("focusin", function(event){
document.getElementById("fIngList").style.maxHeight = "160px";
})

search.addEventListener("focusout", function(event){
setTimeout(function(){
document.getElementById("fIngList").style.maxHeight = "0px";
}, 200);

})




search.addEventListener("keyup", function(event){
var par = document.getElementById("fIngList"); var tx = event.composedPath()[0].value.toLowerCase();
    for (var i=0; i<par.childNodes.length; i++){
var chi = par.childNodes[i]
  if (chi.innerText.toLowerCase().includes(tx)) {chi.style.display = "flex"}
  else {chi.style.display = "none"}
}})

//
var tdh = document.createElement("h2"); tdh.innerText = "Filter Timer"; p.appendChild(tdh); tdh.className = "inputHeader";
  var tdc = document.createElement("p"); tdc.innerText = "Lower the timer for filtering recipes that take less time."; p.appendChild(tdc); tdc.className = "inputCaption"
//

var td = document.createElement("div"); td.id = "timerDiv"; p.appendChild(td)
var high = getStat("highest","time")[0];
    var ti = document.createElement("input"); ti.type = "range"; ti.id = "timerInp"; ti.min = getStat("lowest","time")[0]; ti.max = high; ti.value = high; td.appendChild(ti); ti.step = 15;
ti.oninput = function(){
var val = document.getElementById("timerInp").value;
var x = document.getElementById("timerText").innerText = Math.floor(val/60) + "H " + val%60 + "M"
startFilters(recipes)
}

    var tx = document.createElement("div"); tx.id = "timerText"; tx.innerText = Math.floor(high/60) + "H " + high%60 + "M"; td.appendChild(tx);

    var arr = document.createElement("div"); arr.id = "sideBarTHide"; p.appendChild(arr); arr.innerText = ">"; arr.onclick = function(){toggleSideBar(); console.log("arr")}

var crBtn = document.createElement("div"); crBtn.innerText = "+ Add Recipe"; p.appendChild(crBtn); crBtn.onclick = recipeAdderDiv; crBtn.id = "addRecipeBtn";
}





function createRecipes(x){
var parent = document.getElementById("mainList")

if (parent.childNodes.length == 0){
var li = document.createElement("div"); li.id = "listMenu"; parent.appendChild(li)
      var nc = document.createElement("div"); nc.innerText = "Name"; nc.className = "hoverMenu recipeName"; nc.id = "lName"; nc.dataset.type = "0"; li.appendChild(nc);
      var cc = document.createElement("div"); cc.innerText = "Type"; cc.className = "hoverMenu recipeCat"; cc.id = "lType"; cc.dataset.type = "0"; li.appendChild(cc);
      var tc = document.createElement("div"); tc.innerText = "Time"; tc.className = "hoverMenu recipeTime"; tc.id = "lTime"; tc.dataset.type = "0"; li.appendChild(tc);
} // if doesn't exist
else {
var p_len = parent.childNodes.length-1;
for (var i=0; i<p_len; i++) {parent.childNodes[1].remove()}
}

    for (var i=0; i<x.length; i++){
var r = x[i];
var div = document.createElement("div"); div.className = "recipeRow";
div.dataset.id = recipes.findIndex(x=>x.name == r.name);
      var td = document.createElement("div"); td.className = "recipeName"; td.innerText = r["name"]; div.appendChild(td);
      var cat = document.createElement("div"); cat.innerText = r["cat"]; cat.className = "recipeCat"; div.appendChild(cat);
      var time = document.createElement("div");
if ("time" in r) {  time.innerText = getTime(r["time"])  }

time.className = "recipeTime"; div.appendChild(time);
td.dataset.name = r["name"]; cat.dataset.cat = r["cat"];
time.dataset.time = makeMinutes(r["time"])

div.onclick = function(event) {openRecipe(event)}
parent.appendChild(div)
}
}





function changeElements(parent,style,type,obj){
var p = parent; if (typeof parent == "string") {p = document.getElementById(parent); }

/*
parent = parent to append child elems into
style = "override", "add" (either reset elements, or add one)
type = what type (string)
*/
if (style == "override") {
var pl = p.childNodes.length;
  if (pl > 0) {
var i=0; if (["fSelectCatsDivs","mainList"].includes(parent.id)) {i = 1; pl -= 1;}
for (var i=0; i<pl; i++) {p.childNodes[0].remove()}
}}

if (type == "category"){
var cats = [];
for (var i=0; i<recipes.length; i++) { //get cats
if (!cats.includes(recipes[i]["cat"])) {cats.push(recipes[i]["cat"])}}
// create cat elems
    for (var i=0; i<cats.length; i++){
var d = document.createElement("div"); p.appendChild(d); d.className = "fCatsDiv";
    var o = document.createElement("input"); o.type = "radio";
    o.value = cats[i]; o.id = cats[i]; o.name = "category"; o.className = "fCatsCheck"; d.appendChild(o);
    var f = document.createElement("label"); f.htmlFor = cats[i];
    f.innerText = cats[i]; f.className = "fCatsFor"; d.appendChild(f)
o.onclick = function(event){
if (document.getElementById("fSelectCats").childNodes[0].innerText == event.composedPath()[0].value) {event.composedPath()[0].checked = false; document.getElementById("fSelectCats").childNodes[0].innerText = "Select Cat"; startFilters(recipes);}
else {
document.getElementById("fSelectCats").childNodes[0].innerText = event.composedPath()[0].value;
startFilters(recipes)
}}
}} //categories


if (type == "ingredient"){
if (obj !== undefined) { var ing = obj;}
var ing = getSearchList("i","list");
//create ingredients
    for (var i=0; i<ing.length; i++){
var div = document.createElement("div"); div.className = "ingredientDiv"
    var ch = document.createElement("input"); ch.type = "checkbox"; ch.name = "ingredientList"; ch.id = "ing_"+ing[i].replaceAll(" ",""); ch.dataset.id = ing[i]; div.appendChild(ch)
        if (getIngredients("fIngListDiv").includes(ing[i])) {ch.checked = true}

    var tx = document.createElement("label"); tx.htmlFor = ch.id; tx.innerText = ing[i]; tx.className = "ingredientLbl"; div.appendChild(tx);

p.appendChild(div)

ch.onclick = function(event){
var ingr = event.composedPath()[0]
    if (!ingr.checked) { document.getElementById("checked_"+ingr.id.substring(4)).remove()  }
  else {
var div = document.createElement("div"); div.innerText = ingr.dataset.id; document.getElementById("fIngListDiv").appendChild(div); div.id = "checked_" + ingr.id.substring(4); div.className = "fSelectedIngr"
  div.onclick = function(event){
var d = event.composedPath()[0];
document.getElementById("ing_"+d.id.substring(8)).checked = false; d.remove(); startFilters(recipes) }
}
document.getElementById("fIngSearchInp").value = ""
startFilters(recipes)
} // function
}} //ingredients




}



function openRecipe(ev){
if (typeof ev !== "number") {var i = JSON.parse(ev.composedPath()[1].dataset.id);}
else {var i = ev}
 var r = recipes[i]

var div = document.createElement("div"); div.id = "openedRecipe";
    var up = document.createElement("div"); up.id = "oUpper"; div.appendChild(up)
        var n = document.createElement("span"); n.id = "oTitle"; n.innerText = r["name"]; up.appendChild(n)
        var cat = document.createElement("span"); cat.className = "oUSpan"; cat.innerText = r["cat"];  up.appendChild(cat)
        var time = document.createElement("span"); time.className = "oUSpan"; up.appendChild(time)
        var edit = document.createElement("span"); edit.className = "oUEdit SVGD"; up.appendChild(edit); edit.onclick = function(){recipeAdderDiv(JSON.stringify(r))};
            edit.style.backgroundImage = "url(\"assets/images/edit.svg\")";
// TIME //
time.innerText = getTime(r["time"])

  var main = document.createElement("div"); main.id = "oDown"; div.appendChild(main);
      var sD = document.createElement("div"); sD.id = "oStepsDiv"; sD.className = "oScrollBar"; main.appendChild(sD);
      openSteps(r,sD);
      var iD = document.createElement("div"); iD.id = "oIngredientsDiv"; iD.className = "oScrollBar"; main.appendChild(iD);
      openIngredients(r,iD);

coverDiv(document.getElementById("content")).appendChild(div)
}

function openSteps(arr,parent){
var h = document.createElement("div"); h.innerText = "Steps"; parent.appendChild(h); h.className = "oHeaderDiv";
var sa = arr["steps"]

for (var i=0; i<sa.length; i++){
var s = sa[i];
  var sd = document.createElement("div"); sd.className = "stepDiv"; parent.appendChild(sd);
      var num = document.createElement("div"); num.innerText = i+1; sd.appendChild(num); num.className = "stepDivNum"
      var stxt = document.createElement("div"); stxt.innerHTML = sa[i]; sd.appendChild(stxt); stxt.className = "stepDivText"
}}

function openIngredients(arr,parent){
var h = document.createElement("div"); h.innerText = "Ingredients"; h.className = "oHeaderDiv";
  if (Array.isArray(arr) && ["cat","and","alt"].includes(arr[0])){
var ia = arr; var offset = 1; if (arr[0] == "cat") {offset = 2}
}
else if (Array.isArray(arr)){ createIngredientDiv(interpretIngr(arr),parent); return}
else {var ia = arr["ingredients"]; var offset = 0; parent.appendChild(h);}

for (var i=offset; i<ia.length; i++){
    if (offset !== 0 && ["cat","and","alt"].includes(ia[i][0])) { var ing = ia[i] }
    else if (typeof ia[i] == "object" && "ingredient" in ia[i]) {var ing = ia[i]}
    else {var ing = interpretIngr(ia[i]);}
  // if (includes "cats,ands,alts")
  if (Array.isArray(ing) && ["cat","and","alt"].includes(ing[0])){ // if an array, includes "cats,ands,alts"
var container = document.createElement("div"); container.className = "altOIngrDiv"; parent.appendChild(container)
var chd = document.createElement("div"); container.appendChild(chd); chd.className = "altIngrHeader";
    if (ing[0] == "cat"){ chd.innerText = ing[1];}
    else if (ing[0] == "alt") {chd.innerText = "Alternate"}
    else if (ing[0] == "and") {chd.innerText = "And"}

    var sOff = 1; if (ing[0] == "cat") {sOff = 2};
    for (var y=sOff; y<ing.length; y++){
      if (typeof ing[y] == "string") { createIngredientDiv(interpretIngr(ing[y]),container)}
      else if (!Array.isArray(ing[y])) { createIngredientDiv(ing[y],container)}
      else {
var smc = document.createElement("div"); smc.className = "altOIngrDiv"; container.appendChild(smc)
var smh = document.createElement("div"); smc.appendChild(smh); smh.className = "altIngrHeader"
    if (ing[y][0] == "cat"){ smh.innerText = ing[y][1];}
    else if (ing[y][0] == "alt") {smh.innerText = "Alternate"}
    else if (ing[y][0] == "and") {smh.innerText = "And"}
openIngredients(ing[y],smc) }
          } //for
      } // if special inside
      else { //console.log(ing)
      createIngredientDiv(ing,parent)
}}
}

function createIngredientDiv(ing,parent){
var id = document.createElement("div"); id.className = "oIngrDiv"; parent.appendChild(id);
      if ("amount" in ing || "size" in ing){
    var szd = document.createElement("div"); szd.className = "ingSizeDiv"; id.appendChild(szd);
      if ("amount" in ing) {
        var am = document.createElement("div"); am.className = "sizeText"; am.innerText = ing["amount"]; szd.appendChild(am)
      }
      if ("size" in ing) {
        var sz = document.createElement("div"); sz.className = "sizeText"; sz.innerText = ing["size"]; szd.appendChild(sz)
            measurementShortcut(ing["size"],sz)
      }
    } // if amount/size exists
      var iNd = document.createElement("div"); iNd.className = "ingNameDiv"; id.appendChild(iNd);
          // name div
          if (typeof ing["ingredient"] == "string") {
          var nd = document.createElement("div"); nd.className = "ingName"; iNd.appendChild(nd); nd.innerText = ing["ingredient"]; }
          else {
          for (var di=0; di<ing["ingredient"].length; di++){
                var nd = document.createElement("div"); nd.className = "ingName altName"; iNd.appendChild(nd); nd.innerText = ing["ingredient"][di];
        if (di >= 0 && di < ing["ingredient"].length-1){
                  var sp = document.createElement("span"); sp.className = "altNameOR"; sp.innerText = "OR"; iNd.appendChild(sp);
                            }
                }
          }
        if ("comment" in ing){
  var star = document.createElement("div"); star.className = "ingStar"; star.innerText = "*"; id.appendChild(star);
  star.onclick = function(){toggleComments(id,ing["comment"])}
}
}




function toggleComments(div,obj){
var li = Array.from(div.parentNode.childNodes);

if (li.findIndex(x => x == div) !== li.length-1 &&  div.nextSibling.className == "ingCommDiv"){ div.nextSibling.remove()}
  else if (obj !== undefined){
var hold = document.createElement("div"); hold.className = "ingCommDiv";
if (li.findIndex(x => x == div) == li.length-1) {div.parentNode.appendChild(hold)}
else {div.after(hold)}

var close = document.createElement("div"); close.className = "ingCommX"; hold.appendChild(close); close.innerText = "Close Comments (X)"; close.onclick = function(){toggleComments(div)}

    for (var i=0; i<obj.length; i++){
    var c = document.createElement("li"); c.className = "ingCommTxt"; hold.appendChild(c);
    var txt  = obj[i].substring(1,obj[i].length-1)
    c.innerText = txt[0].toUpperCase() + txt.substring(1)
        if (i == 0) {c.style.fontWeight = "bold"}
        else {c.style.fontStyle = "italic"}
}}
else {return}
}



function coverDiv(parent){
var div = document.createElement("div"); div.className = "coverDiv"; parent.appendChild(div)
div.onclick = function(event){removeAround(event);}
return div
}
function removeAround(event){
  var r = event.composedPath()[0]; var cover = r
while ((cover.parentNode !== null && cover.parentNode !== undefined) && cover.className !== "coverDiv") {cover = cover.parentNode}
if (cover.parentNode == null || cover.parentNode == undefined) {return}
r = cover.childNodes[0]

var rc = r.getBoundingClientRect()
var cW = event.clientX; var cH = event.clientY
var w = rc.x; var h = rc.y;

var totalW = rc.width + w; var totalH = rc.height + h;
if ((cH < h || cH > totalH) || (cW < w || cW > totalW)) {
    if (r.id == "recipeAdderDiv"){ createRecipes(recipes) }
cover.remove()
}}


function toggleSideBar(){
    var sb = document.getElementById("sideBar");
if (sb.className == "openSB") {sb.className = "closeSB"; sb.addEventListener("mouseover",toggleSideBar) }
else {sb.className = "openSB"; sb.removeEventListener("mouseover",toggleSideBar)}
}

function recipeAdderDiv(x){
var div = document.createElement("div"); div.id = "recipeAdderDiv";
    if (x !== undefined){div.dataset.data = x; div.dataset.og = x;}

    var sb = document.createElement("div"); sb.id = "raSideBar"; div.appendChild(sb);
    var m = document.createElement("div"); m.id = "raContent"; div.appendChild(m)
if (x !== undefined) {
    if (document.getElementById("openedRecipe") !== null){
    coverDiv(document.getElementById("openedRecipe").parentNode).appendChild(div)
    }
    else {coverDiv(document.getElementById("content")).appendChild(div)}
    }
else {coverDiv(document.getElementById("content")).appendChild(div)}
    changeRAops("Help")
}

function changeRAops(option){
var sb = document.getElementById("raSideBar"); var m = document.getElementById("raContent");

// sb parts
    var sbl = sb.childNodes.length;
    for (var i=0; i<sbl; i++) {sb.childNodes[0].remove()}
    for (var i=0; i<raOptions.length;i++){
        let rao = raOptions[i]
        var op = document.createElement("div"); op.innerText = rao["name"]; sb.appendChild(op); op.className = "raSBOpDiv"; op.onclick = function(){ changeRAops(rao.name) }
        if (op.innerText == option) {op.style.textDecoration = "underline"; op.id = "selectedRAOp"}
    }

// m parts
var ml = m.childNodes.length;
for (var i=0; i<ml; i++) {m.childNodes[0].remove()}
var look = raOptions.find(x => x.name == option)
    for (var i=0; i<look.texts.length; i++) {changeRAContent(look.texts[i],m)}
if ("functions" in look) {
    var set;
    for (var f=0; f<look["functions"].length; f++) {
    var func = look["functions"][f]
    if (func[0] == "onload") { set = func[1]  }
    else {
     document.getElementById("raContent")[func[0]] = func[1] }}
    if (set !== undefined) {set()}
     }
    loadDataset()
}

function changeRAContent(obj,parent){
var type = obj["type"];
var div = document.createElement(type); parent.appendChild(div)
    if ("className" in obj) {div.className = obj["className"]}
    if ("id" in obj) {div.id = obj["id"]}
    if ("dataset" in obj){
        for (var i=0; i<obj["dataset"].length; i++){
        div["dataset"][obj["dataset"][i][0]] = obj["dataset"][i][1]
        }}
    if ("style" in obj) {div["style"] = obj["style"]}
    if ("onfunction" in obj) {
        let fList = obj["onfunction"]
        for (var f=0; f<fList.length; f++) {
        if (fList[f][0] !== "onload") {div[fList[f][0]] = fList[f][1] }


    if (fList.findIndex(x => x[0] == "onload") !== -1){
        fList.find(x => x[0] == "onload")[1]()}
        }
    }
if (["ul","ol","select","datalist","input"].includes(type)) {
    // special stuff (<ul> for example
    if (type == "input"){
        for (var i=0; i<obj["ops"].length; i++){
        div.setAttribute(obj["ops"][i][0],obj["ops"][i][1]) }}
    else {
        var chT = "option"
        if (["ul","ol"].includes(type)){ chT = "li"}
        for (var i=0; i<obj["ops"].length; i++){
            var sl = document.createElement(chT); sl.innerText = obj["ops"][i]; sl.value = obj["ops"][i];
                if (typeof obj["ops"][i] !== "string"){
                    for (key in obj["ops"][i]) { sl.setAttribute(key,obj["ops"][i][key]) }}
        div.appendChild(sl)
        }
    }

}
else if ("children" in obj) {
    for (var i=0; i<obj["children"].length; i++){
        var sd = changeRAContent(obj["children"][i],div)
    }
}
else{ // normal stuff
    if ("tx" in obj){
        div.innerHTML = obj["tx"];
    }
}

if ("function" in obj){
    obj["function"]
}
// function that activate after element is appended

return div
}



function changeDataset(){
var b = document.getElementById("recipeAdderDiv")
if (b.dataset.data !== undefined){ var r = JSON.parse(b.dataset.data)  }
else { var r = {} }

// When in overview
if (document.getElementById("selectedRAOp").innerText == "Overview"){
r.name = document.getElementById("raRecipeName").childNodes[1].value; r.cat = document.getElementById("raCatOp").value;
// TIME //
    if (document.getElementById("raTimeInput1").value !== ""){
var mins = 0; var type = document.getElementById("raTimeSelect").value;
var v1 = JSON.parse(document.getElementById("raTimeInput1").value);
var v2 = document.getElementById("raTimeInput2").value;
        if (type == "Minutes") { mins += v1 }
        else { mins += v1*60; if (v2 !== "") {mins += JSON.parse(v2)}  }
r.time = [mins,"Minutes"]
// TIME //
}}

// if content is ingredients
// if content is steps
var str = JSON.stringify(r); b.dataset.data = str; turnRaToRecipe();
}

function loadDataset(){
var b = document.getElementById("recipeAdderDiv").dataset.data
var type = document.getElementById("selectedRAOp").innerText
if (b !== undefined){
let d = JSON.parse(b)
if (type == "Overview"){
// Recipe Name
document.getElementById("raRecipeName").childNodes[1].value = d.name
// Category
document.getElementById("raCatOp").value = d.cat
// Time
let tm = makeMinutes(d.time)
if (tm >= 60){
   document.getElementById("raTimeInput1").value = Math.floor(tm/60);
   document.getElementById("raTimeInput2").value = tm%60;
        document.getElementById("raTimeSelect").value = "Hours"; document.getElementById("raTimeInput2").style.display = "block"
     }
else { document.getElementById("raTimeInput1").value = d.time[0] }
// Ingredient List & Step List do this on its own function
    let il = document.getElementById("raIIList")
    let sl = document.getElementById("raISList");
        let id = getIngredients(d);
        for (var i=0; i<id.length; i++){
            let idv = document.createElement("div"); idv.className = "raItemsI"; idv.innerText = id[i]; il.appendChild(idv)
        }
        for (var i=0; i<d.steps.length;i++){
            let sdv = document.createElement("div"); sdv.className = "raItemsS";
                let s1 = document.createElement("div"); s1.innerText = i+1; sdv.appendChild(s1)
                let s2 = document.createElement("div"); s2.innerText = d.steps[i]; sdv.appendChild(s2);
            sl.appendChild(sdv)
        }
}
if (type == "Ingredients"){
    let m = document.getElementById("raIngredientListC");
        m.classList.add("oScrollBar"); m.classList.add("dropZone");
            m.ondrop = raIDragDrop; m.ondragenter = raIDragEnter; m.ondragleave = raIDragLeave; m.ondragover = adr;

    let s = document.getElementById("raIngredientFileList");
        while (m.childNodes.length > 1) { m.childNodes[0].remove() }
        while (s.childNodes.length > 0) {s.childNodes[0].remove()}
    if ("ingredients" in d){
        console.log(d.ingredients)
        while (m.childNodes.length > 0) {m.childNodes[0].remove()}
        for (var i=0; i<d.ingredients.length;i++){
            let norm = d.ingredients[i]
            raCID(norm,m)
        } // loop
    }
}
if (type == "Steps"){
    let sl = d.steps;
    for (var i=0; i<sl.length; i++){ raCStep(sl[i]) }
}}

//
}

function raCID(obj,parent){
    let norm = obj;
    if (["cat","alt","and"].includes(norm[0])){ // if CAT
        let cd = document.createElement("div"); cd.classList.add("raCategory"); cd.classList.add("rac" + norm[0][0].toUpperCase() + norm[0].substring(1));
            cd.classList.add("dropZone")
        if (norm[0] == "cat") { cd.innerText = "Cat: " + norm[1]}
        else {cd.innerText = norm[0][0].toUpperCase() + norm[0].substring(1)}
        cd.onclick = function(){ raOpenCat(norm,cd) }; cd.dataset.data = JSON.stringify(norm);
        parent.appendChild(cd); cd.draggable = true; cd.ondragstart = raIDragStart;
    }
    else { // Else, ingredients
        let id = document.createElement("div"); id.className = "raIngredient"; parent.appendChild(id);
        if (typeof norm == "string") {id.innerText = norm}
        else { let ingr = iIngrF(norm); id.innerText = ingr.ingredient;}

        id.dataset.data = JSON.stringify(norm);
        id.onclick = function(){ raCIngredientDiv(iIngrF(norm)) }
        id.draggable = true; id.ondragstart = raIDragStart;
    } // if an object INGREDIENT
}


function raCreateIngredients(){
var b = document.getElementById("raItemsIngredientDiv")
console.log(b)
    var top = document.createElement("div"); top.id = "raIIH"; top.className = "raIH"; b.appendChild(top); top.innerText = "Ingredients";
    var bot = document.createElement("div"); bot.id = "raIIList"; b.appendChild(bot); bot.className = "raIC";

var d = document.getElementById("recipeAdderDiv").dataset.data
if (d !== undefined && ("ingredients" in JSON.parse(d))) {
    var il = JSON.parse(d);
        var lil = getIngredients(il)
        console.log(lil)
    } // put in ingredients
else {
    let er = document.createElement("div"); er.innerText = "Add Ingredients"; er.className = "raItemsBtn"; bot.appendChild(er); er.onclick = function(){
        changeRAops("Ingredients")
    }
}

}
function raCreateSteps(){
    var b = document.getElementById("raItemsStepsDiv")
    var top = document.createElement("div"); top.id = "raISH"; top.className = "raIH"; b.appendChild(top); top.innerText = "Steps";
    var bot = document.createElement("div"); bot.id = "raISList"; b.appendChild(bot); bot.className = "raIC";

    var d = document.getElementById("recipeAdderDiv").dataset.data
    if (d !== undefined && ("steps" in JSON.parse(d))) {
        var iss = JSON.parse(d).steps;
    } // put in ingredients
    else {
        let er = document.createElement("div"); er.innerText = "Add Steps"; er.className = "raItemsBtn"; bot.appendChild(er); er.onclick = function(){
            changeRAops("Steps")
        }
    }
}

/* onclick stuff fc */
    function raIOpenC(){
    let p = document.getElementById("raIMCO");
if (p !== null){
    if (p.style.maxHeight == "0px") { p.style.maxHeight = "1000px"; p.classList.remove("noOverflow") }
    else {p.style.maxHeight = "0px"; p.classList.add("noOverflow");}
    let pb = document.getElementById("raIMDCD").childNodes[1]
    if (pb.style.backgroundImage.includes("comment.")){
        pb.style.backgroundImage = pb.style.backgroundImage.replace("comment.","commentRem."); document.getElementById("raIMDCD").childNodes[0].innerText = "Hide"
    }
    else {pb.style.backgroundImage = pb.style.backgroundImage.replace("commentRem","comment"); document.getElementById("raIMDCD").childNodes[0].innerText = "Show";}
    }}


/* end fc */


function raCIngredientDiv(obj){
    var bod = coverDiv(document.getElementById("recipeAdderDiv").parentNode)
        var div = document.createElement("div"); div.id = "raCID"; bod.appendChild(div);
            var tl = document.createElement("div"); tl.innerText = "Create Ingredient"; div.appendChild(tl); tl.style = "font-size: 1.3em; font-weight: bold; font-family: Chakra;"
            var sub = document.createElement("div"); sub.innerText = "Fill in the input right below for every ingredient, and then make sure it shows exactly how you want it to in the example container on the bottom. Then, finalize it by adding the ingredient with the \Create Ingredient\" button. Toggle \"Comments\" by hovering over the \"Show\" / \"Hide\" button."; sub.style.fontSize = "0.9em"; div.appendChild(sub); sub.style.marginBottom = "40px"
            var main = document.createElement("div"); main.id = "raIMD"; div.appendChild(main);
                var num = document.createElement("input"); num.placeholder = "#"; main.appendChild(num); num.className = "raCIInput"; num.id = "raciiN";
                var portion = document.createElement("input"); portion.placeholder = "Size"; main.appendChild(portion); portion.className = "raCIInput"; portion.id = "raciiP";
                var ingr = document.createElement("input"); ingr.placeholder = "Ingredient"; main.appendChild(ingr); ingr.className = "raCIInput"; ingr.id = "raciiI";
                var cd = document.createElement("button"); main.appendChild(cd); cd.id = "raIMDCD";
                cd.onclick = raIOpenC
                    var tcd = document.createElement("div"); tcd.innerText = "Show"; cd.appendChild(tcd);
                    var bcd = document.createElement("div"); cd.appendChild(bcd); bcd.style.backgroundImage = "url(assets/images/comment.svg)"; bcd.className = "SVGD";
        // comment open/close
        var ocd = document.createElement("div"); ocd.id = "raIMCO"; div.appendChild(ocd); ocd.style.maxHeight = "0px"; ocd.classList.add("noOverflow")
            var sc1 = document.createElement("div"); sc1.innerText = "Comment 1"; ocd.appendChild(sc1);
            var in1 = document.createElement("input"); in1.className = "raCommentI"; ocd.appendChild(in1)
            var sc2 = document.createElement("div"); sc2.innerText = "Comment 2"; ocd.appendChild(sc2);
            var in2 = document.createElement("input"); in2.className = "raCommentI"; ocd.appendChild(in2); in2.placeholder = "Will only activate when \"Comment 1\" is filled."
            var tcc = document.createElement("div"); tcc.innerText = "Add comments, styles, etc about this ingredient here. Comments will only show when this window is open.";  ocd.appendChild(tcc); tcc.style.fontSize = "0.8em"
    function oku(){ raPreviewIngredient(writeIngredient(),"raCIXX")}

    num.onkeyup = oku; portion.onkeyup = oku; ingr.onkeyup = oku; in1.onkeyup = oku; in2.onkeyup = oku
var lower = document.createElement("div"); lower.id = "racl"; div.appendChild(lower);
    var x = document.createElement("div"); x.id = "raCIX"; lower.appendChild(x);
        var tx = document.createElement("div"); tx.innerText = "Preview: "; x.appendChild(tx)
        var xx = document.createElement("div"); xx.id = "raCIXX"; x.appendChild(xx);

    var abtn = document.createElement("button"); abtn.id = "raCIB"; abtn.innerText = "Create Ingredient"; lower.appendChild(abtn);
    abtn.onclick = function(){raCIBtnOC("add") }


    if (obj !== undefined){
    let ro = iIngrF(obj); console.log(ro)
        if ("ingredient" in ro) { ingr.value = ro["ingredient"]}
        if ("amount" in ro) {num.value = ro["amount"]}
        if ("size" in ro) {portion.value = ro["size"]}
        if ("comment" in ro){
            let c = ro["comment"]; raIOpenC()
            in1.value = c[0].substring(1,c[0].length-1)
            if (c.length == 2){ in2.value = c[1].substring(1,c[1].length-1)
                 }
        }
        abtn.innerText = "Change Ingredient"; abtn.onclick = function(){raCIBtnOC(obj)}
        raPreviewIngredient(writeIngredient(),"raCIXX")
    } // if changing ingr
}

function raPreviewIngredient(obj,parent){
if (typeof parent == "string") { var p = document.getElementById(parent) } else {var p = parent}
while (p !== null && p.childNodes.length > 0) {p.childNodes[0].remove()}
    createIngredientDiv(obj,p)
}

function raAddIngredient(obj,parent){
var b = document.getElementById("recipeAdderDiv");
    var bd = b.dataset.data
    var objA = recallIngrToArr(obj)
    if (bd == undefined) {
        var l = {ingredients: [objA]}
        b.dataset.data = JSON.stringify(l) }
    else {
        var l = JSON.parse(bd);
        if ("ingredients" in JSON.parse(bd)){ l["ingredients"].push(objA); }
        else {l["ingredients"] = [objA]}
        b.dataset.data = JSON.stringify(l);
    }

loadDataset()
var close = document.getElementById("raCID").parentNode; close.remove()
    }



function raCCatDiv(){
    var bod = coverDiv(document.getElementById("recipeAdderDiv").parentNode)
    var div = document.createElement("div"); div.id = "raCCD"; bod.appendChild(div)
    let ops = [
        {name: "AND", text: "Creates a list that groups ingredients together (like ingredients for a salad separate from the whole recipe)"},
        {name: "ALT", text: "Creates a list that groups ingredients that can be alternated with each other (AKA, interchangable)"},
        {name: "CAT", text: "Creates a list that groups ingredients into a specific category of a recipe (like a sauce separate from the whole recipe)"}
    ]
    let b = document.createElement("div"); b.innerText = "Create Category"; div.appendChild(b); b.className = "raCCDHeader"
    let con = document.createElement("div"); div.appendChild(con); con.className = "raCCDContainer";
    let tx = document.createElement("div"); div.appendChild(tx); tx.className = "raCCDText"
    for (var i=0; i<ops.length;i++){
        let o = ops[i];
        let d = document.createElement("div"); d.innerText = o.name; d.className = "raCCDOp"; con.appendChild(d); d.dataset.name = o.name.toLowerCase(); d.dataset.text = o.text;
        d.onmouseenter = function(){ tx.innerText = o.text; d.classList.add("raCCSelected")
        }
        d.onmouseleave = function(){ d.classList.remove("raCCSelected")}
        d.onclick = function(){
            let m = document.getElementById("recipeAdderDiv");
                let mc = m.dataset.data
                var val = [d.dataset.name]; if (d.dataset.name == "cat") {val.push("New Cat")}
                if (mc == undefined){ m.dataset.data = {val} }
                else if ("ingredients" in JSON.parse(mc)) {
                    mc = JSON.parse(mc); mc.ingredients.push(val)
                }
                else { mc = JSON.parse(mc); mc.ingredients = {val}}
            div.parentNode.remove()
            m.dataset.data = JSON.stringify(mc)
            loadDataset()
        }

    }

}

function raOpenCat(obj,child){// object, and "cat" location
    let p = child.parentNode;
    let rf = document.getElementById("raIngredientFileList");
    if (p.id == "raIngredientListC"){
        while (rf.childNodes.length > 0) { rf.childNodes[0].remove() } }
        // remove children of "raIngredientFileList"
     let fl = document.createElement("div"); fl.id = "raIFL" + rf.childNodes.length+1; rf.appendChild(fl); fl.classList.add("raFileDiv"); fl.classList.add("dropZone"); fl.ondragover = adr;
     fl.ondrop = raIDragDrop; fl.ondragenter = raIDragEnter; fl.ondragleave = raIDragLeave;

     let nm = document.createElement("div"); nm.className = "raCategoryInside"; nm.innerText = child.innerText; fl.appendChild(nm);
        if (child.innerText.substring(0,5) == "Cat: "){
            nm.innerText = ""
           let n = document.createElement("div"); n.innerText = "Cat: "; nm.appendChild(n); n.className = "raCIN";
           edit = document.createElement("input"); edit.value = child.innerText.substring(5); edit.contentEditable = true; nm.appendChild(edit); edit.className = "raCIE";
                edit.onkeyup = function(){
                    let c = child; let cd = JSON.parse(child.dataset.data); cd[1] = edit.value; c.dataset.data = JSON.stringify(cd); c.innerText = "Cat: " + cd[1]; raRefreshList()
                }

           var eb = document.createElement("div"); eb.style.backgroundImage = "url(\"assets/images/edit.svg\")"; eb.className = "SVGD"; nm.appendChild(eb); eb.style.width = "1.5em"; eb.style.height = "1.5em"; eb.style.paddingLeft = "0.2em"; eb.onclick = function(){ edit.focus() }

        }


     let list = obj; let start = 1; if (list[0] == "cat") {start = 2}
     for (var i=start; i<list.length; i++){ raCID(list[i],fl);  }
}

/* STEPS */
function raCStep(x){
    let ab = document.getElementById("raStepDiv");
    let s = document.createElement("div"); s.className = "raStep"; ab.appendChild(s);
        let sn = document.createElement("div"); sn.className = "raStepNum";  sn.innerText = document.getElementById("raStepDiv").childNodes.length; s.appendChild(sn);
        let st = document.createElement("textarea"); st.className = "raStepText"; s.appendChild(st); if (x !== undefined) { st.value = x }; st.placeholder = "Click here to input the step";
        let md = document.createElement("div"); md.className = "raStepMD"; s.appendChild(md);
            let mu = document.createElement("div"); mu.className = "rasmOp SVGD"; mu.dataset.text = "Move Up"; md.appendChild(mu); mu.style.backgroundImage = "url(\"assets/images/arrow_up.svg\")";
            let mt = document.createElement("div"); mt.className = "rasmOp SVGD"; mt.dataset.text = "Delete"; md.appendChild(mt); mt.style.backgroundImage = "url(\"assets/images/delete.svg\")";
            let ml = document.createElement("div"); ml.className = "rasmOp SVGD"; ml.dataset.text = "Move Down"; md.appendChild(ml); ml.style.backgroundImage = "url(\"assets/images/arrow_down.svg\")";
            mu.onclick = function(){ raCSEdit(s,"u") }; ml.onclick = function() { raCSEdit(s,"l")}; mt.onclick = function(){ raCSEdit(s,"d")  }
if (x == undefined){ ab.scroll({top: ab.scrollHeight, behavior: "smooth"}) }
}