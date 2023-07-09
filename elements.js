// noinspection SpellCheckingInspection

function createSite(){
var body = document.getElementById("content");

var div = document.createElement("div"); div.id = "mDiv"; body.appendChild(div)

  var sb = document.createElement("div"); sb.id = "sideBar"; div.appendChild(sb);  sb.className = "openSB"; createSideBar(sb);

  var li = document.createElement("div"); li.id = "mainList";
  div.appendChild(li);

var div = document.createElement("div"); div.id = "toast";
document.getElementById("content").appendChild(div);
}
function ic(name,ops){
    let c = document.createElement("span"); c.classList.add("material-symbols-outlined"); c.classList.add("icon"); c.innerText = name;
    if (ops !== undefined){
        // [["dataset","data","Text"],["style",["bg","yel"]],["checked","true"]]
        for (var i=0; i<ops.length; i++){ let o = ops[i];
            if (o[0] === "dataset"){ c["dataset"][o[1]] = o[2]; }
            if (o[0] !== "style" && o[0] !== "dataset"){ c[o[0]] = o[1] }
            if (o[0] === "style") { for (var x=1; x<o.length; x++){ let st = o[x];
                c["style"][st[0]] = st[1] }}
        }}
    return c
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
let sbd = document.createElement("div"); p.appendChild(sbd); sbd.style = "display: flex; align-items: center; height: 45px"
    var s = document.createElement("input"); s.id = "fSearchBarDiv"; s.placeholder = "Search Recipes"; sbd.appendChild(s); s.contentEditable = true;
    s.onkeyup = function(){startFilters(recipes)}
    let sbdarrdiv = document.createElement("div"); sbd.appendChild(sbdarrdiv); sbdarrdiv.id = "fSearchBarDivRight"; sbdarrdiv.onclick = function(){s.select();};
    let sbdarr = ic("search"); sbdarrdiv.appendChild(sbdarr);
        sbdarr.style = "background-color: transparent; user-select: none;"


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

var crBtn = document.createElement("div"); crBtn.innerText = "+ Add Recipe"; p.appendChild(crBtn); crBtn.onclick = function(){raRecipeCreator()}; crBtn.id = "addRecipeBtn";
}





function createRecipes(x){
var parent = document.getElementById("mainList")

// noinspection GrazieInspection
    if (parent.childNodes.length == 0){
var li = document.createElement("div"); li.id = "listMenu"; parent.appendChild(li)
      var nc = document.createElement("div"); nc.innerText = "Name"; nc.className = "hoverMenu recipeName"; nc.id = "lName"; nc.dataset.type = "0"; li.appendChild(nc);
      var cc = document.createElement("div"); cc.innerText = "Type"; cc.className = "hoverMenu recipeCat"; cc.id = "lType"; cc.dataset.type = "0"; li.appendChild(cc);
      var tc = document.createElement("div"); tc.innerText = "Time"; tc.className = "hoverMenu recipeTime"; tc.id = "lTime"; tc.dataset.type = "0"; li.appendChild(tc);
} // if doesn't exist (First time only)
else {
while (parent.childNodes.length > 1){parent.childNodes[1].remove()}
}

    for (var i=0; i<x.length; i++){
let r = x[i];
let div = document.createElement("div"); div.className = "recipeRow";
div.dataset.id = recipes.findIndex(x=> x.name == r.name);
      let td = document.createElement("div"); td.className = "recipeName"; td.innerText = r["name"]; div.appendChild(td);
      let cat = document.createElement("div"); cat.innerText = r["cat"]; cat.className = "recipeCat"; div.appendChild(cat);
      let time = document.createElement("div");
if ("time" in r) {  time.innerText = getTime(r["time"])  }

time.className = "recipeTime"; div.appendChild(time);
td.dataset.name = r["name"]; cat.dataset.cat = r["cat"];
time.dataset.time = makeMinutes(r["time"])

div.onclick = function(event) {openRecipe(event)}
parent.appendChild(div)
}}





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



function openRecipe(ev){ let i = ev;
if (typeof ev !== "number") { console.log(ev.currentTarget); i = ev.target
while (i.className !== "recipeRow"){i = i.parentNode}
i = JSON.parse(ev.target.parentNode.dataset.id);}
 let r = recipes[i];

let div = document.createElement("div"); div.id = "openedRecipe";
    let up = document.createElement("div"); up.id = "oUpper"; div.appendChild(up)
        let n = document.createElement("span"); n.id = "oTitle"; n.innerText = r["name"]; up.appendChild(n);
        let cat = document.createElement("span"); cat.className = "oUSpan"; cat.innerText = r["cat"];  up.appendChild(cat)
        let time = document.createElement("span"); time.className = "oUSpan"; up.appendChild(time)
        let edit = ic("edit"); edit.classList.add("oUEdit"); up.appendChild(edit); edit.onclick = function(){raRecipeCreator(r)};
// TIME //
time.innerText = getTime(r["time"])

  let main = document.createElement("div"); main.id = "oDown"; div.appendChild(main);
      let sD = document.createElement("div"); sD.id = "oStepsDiv"; sD.className = "oScrollBar"; main.appendChild(sD);
      openSteps(r,sD);
      let iD = document.createElement("div"); iD.id = "oIngredientsDiv"; iD.className = "oScrollBar"; main.appendChild(iD);
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
  var star = document.createElement("div"); star.className = "ingStar"; id.appendChild(star); let starIcon = ic("comment"); star.appendChild(starIcon)
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
    if (event.target.className === "coverDiv") {
    if (event.target.childNodes.length > 0 && event.target.childNodes[0].id === "recipeAdderDiv"){ createRecipes(recipes) }
        event.target.remove()
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
    //loadDataset()
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
    if ("attributes" in obj){ let al = obj["attributes"]
        for (var i=0; i<al.length; i++) { div.setAttribute(al[i][0],al[i][1]) }
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
                    for (key in obj["ops"][i]) {
                        if (key !== "tx"){sl.setAttribute(key,obj["ops"][i][key]) }};
                    if ("tx" in obj["ops"][i]) { sl.innerHTML = obj["ops"][i]["tx"]  }
                    }
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

var str = JSON.stringify(r); b.dataset.data = str; turnRaToRecipe();
}





    function raInput(type,text,style,val){
    let inpD = document.createElement("div"); inpD.className = "raInput";
        let inp = document.createElement("input"); inp.type = type; inpD.appendChild(inp);
            if (val) {inp.value = val}
        let tx = document.createElement("span"); tx.innerText = text; inpD.appendChild(tx);
        if (style) {inpD.style = style;}
    return inpD
    }
    function raDropdown(text,options,id,val){
    let cov = document.createElement("div");
    let dpD = document.createElement("div"); dpD.className = "raDropdown"; dpD.id = id+"Div";
        cov.appendChild(dpD); cov.className = "raDropdownDiv"
        let top = document.createElement("div"); top.className = "raInputDiv"; dpD.appendChild(top);
            let inp = document.createElement("input"); inp.id = id; top.appendChild(inp);
                if (val){inp.value = val}
                inp.onkeyup = function(){
                    if (inp.value.replaceAll(" ").length === 0){
                        for (var i=0; i<bot.childNodes.length; i++){bot.childNodes[i].classList.remove("hide")}
                    }
                    else { let filter = inp.value.toLowerCase();
                        for (var i=0; i<bot.childNodes.length; i++){ let bc = bot.childNodes[i];
                            if (bc.innerText.toLowerCase().includes(filter)){bc.classList.remove("hide");} else {bc.classList.add("hide")}
                        }
                    }
                }

                inp.addEventListener("focusin", function(){bot.classList.remove("hide");})
                inp.addEventListener("focusout",  function(){bot.classList.add("hide");})
        let bot = document.createElement("div"); bot.className = "raOptionsDiv"; dpD.appendChild(bot); bot.classList.add("hide")
            for (var i=0; i<options.length; i++){let od = document.createElement("div"); od.innerText = options[i]; bot.appendChild(od); od.className = "raOption";
            }
    let tx = document.createElement("span"); tx.innerText = text; cov.appendChild(tx);
    //return dpD
    return cov
    }
function raRecipeCreator(obj){
let p = document.getElementById("content"); let c = coverDiv(p);
let div = document.createElement("div"); div.id = "raMainDiv"; c.appendChild(div)

    if (obj){div.dataset.data = JSON.stringify(obj)}
    else {div.dataset.data = JSON.stringify(
        {name: "Untitled Recipe", ingredients: [], steps: []}
    )}
    let rec = JSON.parse(div.dataset.data)

    let top = document.createElement("div"); top.id = "raRecipeInfoDiv"; div.appendChild(top);
    // Name, Cat, time, show Ingredients/Step
    let n = raInput("text","Name",undefined,rec.name); top.appendChild(n); n.id = "raName";

    let catList = []; for (var i=0; i<recipes.length; i++){if (!catList.includes(recipes[i]["cat"])){catList.push(recipes[i]["cat"])}}
        let dp;
        if ("cat" in rec){dp = raDropdown("Cat",catList,"raCat",rec.cat)}
        else {dp = raDropdown("Cat",catList,"raCat")}
        top.appendChild(dp);

    let vwd = document.createElement("div"); vwd.id = "raViewDiv"; top.appendChild(vwd)
        let vt = document.createElement("span"); vwd.appendChild(vt); vt.innerText = "Ingredients"
        vwd.onclick = function(){ console.log(vt.innerText)
            if (vt.innerText === "Ingredients"){vt.innerText = "Steps";
                document.getElementById("raIngredientListDiv").style.display = "none";
                document.getElementById("raStepsListDiv").style.display = null;
                }
            else {vt.innerText = "Ingredients";
                document.getElementById("raStepsListDiv").style.display = "none";
                document.getElementById("raIngredientListDiv").style.display = null;
                }
        }
        let vic = ic("autorenew"); vwd.appendChild(vic); vic.id = "ravdIcon"


    let timeDiv = document.createElement("div"); timeDiv.id = "raTimeDiv"; top.appendChild(timeDiv);
        // checkbox
        let cbd = document.createElement("div"); cbd.className = "checkboxDiv"; timeDiv.prepend(cbd);
            let sp = ic("check_box"); cbd.appendChild(sp);
                sp.onclick = function(){
                    if (sp.innerText === "check_box_outline_blank"){
                        sp.innerText = "check_box"; tTop.style.display = "flex";}
                    else {
                        sp.innerText = "check_box_outline_blank"; tTop.style.display = "none";}
                }
            let spt = document.createElement("span"); spt.innerText = "Time"; cbd.appendChild(spt); spt.style = "font-size: 0.8rem; user-select: none; cursor: pointer;"; spt.onclick = sp.onclick



        let tTop = document.createElement("div"); tTop.style = "display: flex"; timeDiv.appendChild(tTop);
            let h = raInput("number","H","width: 1.6em; "); tTop.appendChild(h); h.childNodes[1].style = "margin-left: 0px; text-align: center;"; h.childNodes[0].style = "padding-left: 0.5em;"
                h.childNodes[0].onkeyup = function(){
                    if (h.childNodes[0].value.length >= 1){h.childNodes[0].value = h.childNodes[0].value[0]; min.childNodes[0].select();}
                }

            let min = raInput("number","MM","width: 1.8em; "); tTop.appendChild(min); min.childNodes[1].style = "margin-left: 0px; text-align: center;"; min.childNodes[0].style = "padding-left: 0.5em;"
                min.childNodes[0].onkeyup = function(){
                    if (min.childNodes[0].value.length > 0){
                    if (JSON.parse(min.childNodes[0].value) >=   60){
                        let hr = Math.floor(min.childNodes[0].value/60);
                        let ms = min.childNodes[0].value%60;
                            if (h.childNodes[0].value.length == 0){h.childNodes[0].value = hr}
                            else {h.childNodes[0].value = JSON.parse(h.childNodes[0].value) + hr;}
                        min.childNodes[0].value = ms;
                        }}
                    if (event !== undefined && event.key == "Backspace" && min.childNodes[0].value.length == 0){h.childNodes[0].select()}
                }
            if ("time" in rec){
                let minutes = makeMinutes(rec.time);
                    min.childNodes[0].value = minutes; min.childNodes[0].onkeyup()
            }




        let chBtn = document.createElement("div"); chBtn.innerText = "Add Recipe"; top.appendChild(chBtn); chBtn.id = "changeRecipeBtn";
        if (obj) {chBtn.innerText = "Change Recipe";}
            chBtn.onclick = function(){ let no = raGetRecipe()
                loc = recipes.findIndex(x => JSON.stringify(x) === JSON.stringify(obj))
                    console.log(no,loc)
                if (loc !== -1){recipes[loc] = no; } // exists, replace old!
                else { // add
                if ("name" in no && "cat" in no && "ingredients" in no && "steps" in no){
                    if (no["ingredients"].length > 1 && no["steps"].length > 1){ recipes.push(no);} else {toast("There should be at least 1 ingredient and 1 step added!"); return}}
                else {toast("There should be at least a name, category, ingredients, and steps to add this recipe."); return}
                } // adding
                c.remove(); toast("Recipe: \"" + no.name + "\" has been successfully added!");
                recipeData("save");
                createRecipes(recipes);
                let sb = document.getElementById("sideBar"); while (sb.childNodes.length > 0){sb.childNodes[0].remove();}
                createSideBar(sb);
                }





    let bot = document.createElement("div"); bot.id = "raISdiv"; div.appendChild(bot);
        let ingD = document.createElement("div"); ingD.id = "raIngredientListDiv"; bot.appendChild(ingD);
            let ml = document.createElement("div"); ml.id = "raiMainBody"; ingD.appendChild(ml);
                let lis = document.createElement("div"); lis.id = "raiList"; ml.appendChild(lis); lis.className = "raiColumn"; lis.ondragend = raDragDrop;
                let menu = document.createElement("div"); menu.id = "raiMenu"; ml.appendChild(menu); menu.innerText = "+";
                    let popup = document.createElement("div"); menu.appendChild(popup); popup.id = "raimPopup"
                        // Or, And, Cat, Ingr
                        let opO = document.createElement("div"); opO.className = "raimOp"; popup.appendChild(opO); let icO = ic("radio_button_checked"); opO.appendChild(icO); let txO = document.createElement("div"); txO.innerText = "OR"; opO.appendChild(txO); opO.onclick = function(){raiAdd("or",lis);}
                        let opA = document.createElement("div"); opA.className = "raimOp"; popup.appendChild(opA); let icA = ic("conversion_path"); opA.appendChild(icA); let txA = document.createElement("div"); txA.innerText = "AND"; opA.appendChild(txA); opA.onclick = function(){raiAdd("and",lis);}
                        let opC = document.createElement("div"); opC.className = "raimOp"; popup.appendChild(opC); let icC = ic("table_chart"); opC.appendChild(icC); let txC = document.createElement("div"); txC.innerText = "CATEGORY"; opC.appendChild(txC); opC.onclick = function(){raiAdd("cat",lis);}
                        let opI = document.createElement("div"); opI.className = "raimOp"; popup.appendChild(opI); let icI = ic("restaurant"); opI.appendChild(icI); let txI = document.createElement("div"); txI.innerText = "Ingredient"; opI.appendChild(txI); opI.onclick = function(){
                            //ingredient popup
                            let r = raIngrPopup(div)
                        }
            let remaining = document.createElement("div"); remaining.id = "raiSubBody"; ingD.appendChild(remaining);
            if (obj && "ingredients" in obj){
                for (var i=0; i<obj["ingredients"].length; i++){
                    let ingr = obj["ingredients"][i];
                    if (!["cat","alt","and"].includes(ingr[0])) {
                        let ingrD = raIngredient(ingr); lis.appendChild(ingrD);
                        }
                    else {raiAdd(ingr[0],lis,ingr)}
                }
            }

        let stpD = document.createElement("div"); stpD.id = "raStepsListDiv"; bot.appendChild(stpD);
            stpD.style.display = "none"
            let stepDiv = document.createElement("div"); stepDiv.id = "raslContainer"; stpD.appendChild(stepDiv);
            let asBtn = document.createElement("button"); asBtn.className = "raBtn"; asBtn.innerText = "+ Add Step"; stpD.appendChild(asBtn);
                asBtn.onclick = function(step){
                    let s = document.createElement("div"); s.className = "raslStepD"; stepDiv.appendChild(s);
                        let sl = document.createElement("textarea"); s.appendChild(sl); sl.placeholder = "Enter information about step here..."
                            if (step && typeof step === "string"){sl.value = step}
                        let sr = document.createElement("div"); sr.className = "raslOpDiv"; s.appendChild(sr);
                            let ct1 = document.createElement("div"); ct1.className = "raslOp"; sr.appendChild(ct1); let up = ic("arrow_drop_up"); ct1.appendChild(up); up.onclick = function(){if (s.previousSibling !== null){s.previousSibling.before(s)}}
                            let ct2 = document.createElement("div"); ct2.className = "raslOp"; sr.appendChild(ct2); let dn = ic("arrow_drop_down"); ct2.appendChild(dn); dn.onclick = function(){if (s.nextSibling !== null){s.nextSibling.after(s)}}
                            let ct3 = document.createElement("div"); ct3.className = "raslOp"; sr.appendChild(ct3); let dl = ic("delete"); ct3.appendChild(dl); dl.onclick = function(){s.remove()}
                    stepDiv.scroll(0,100000)
                }
        if (obj && "steps" in obj){
            for (var i=0; i<obj["steps"].length; i++){
            asBtn.onclick(obj["steps"][i]);
            }}
}


function raIngredient(arr){
let div = document.createElement("div"); div.className = "raiIngredient"; div.dataset.data = JSON.stringify(arr);
    let extract = readIngr(arr); div.innerText = extract;
    div.onclick = function(){raIngrPopup(document.getElementById("raMainDiv"),JSON.parse(div.dataset.data),div)}


    div.ondragstart = raDragStart; div.draggable = true;


    div.oncontextmenu = function(event){
        event.preventDefault()
        console.log("wow")
    }
return div
}


function raiAdd(type,parent,ingr){ let p = parent; if (typeof parent === "string"){p = document.getElementById(parent);}
    let div = document.createElement("div"); div.className = "raiOption";


            div.ondragstart = raDragStart; div.draggable = true;


        let n = document.createElement("div"); n.innerText = type[0].toUpperCase() + type.substring(1); div.appendChild(n); if (ingr && ingr[0] === "cat"){n.innerText = "Cat: " + ingr[2]}
        let icon = ic("chevron_right"); div.appendChild(icon)
    let data = [type]; if (type === "cat"){data.push("New Cat")}
        if (ingr){data = ingr}
    div.dataset.data = JSON.stringify(data);

    p.appendChild(div); div.onclick = function(){addSubBody(div,JSON.parse(div.dataset.data));}
    return div
}

function addSubBody(elem,array){ let parent;

if (elem.parentNode.id != "raiList"){
    parent = document.getElementById("raiSubBody")
    let pos = Array.from(parent.childNodes).findIndex(x => x === event.currentTarget.parentNode)
    if (parent.childNodes.length > pos){
        for (var i=pos+1; i<parent.childNodes.length; i++){parent.childNodes[pos].remove()}
    }
} // remove next (if open), then add new body
else {
    parent = document.getElementById("raiSubBody"); if (parent !== null){
    while (parent.childNodes.length > 0){parent.childNodes[0].remove();}}

} // remove all of raViewDiv, then add new

    let body = document.createElement("div"); body.className = "raiColumn"; body.dataset.data = JSON.stringify(array); body.element = elem;


    body.ondragover = function(){event.preventDefault()}
    body.ondrop = raDragDrop;


        let top = document.createElement("div"); top.className = "raicTitle"; top.innerText = array[0][0].toUpperCase() + array[0].substring(1); body.appendChild(top); top.dataset.data = JSON.stringify([array[0]]); if (array[0] === "cat"){top.dataset.data = JSON.stringify([array[0],array[1]])}
        // remaining
        let start = 1; if (array[0] === "cat"){start = 2}
            for (var i=start; i<array.length; i++){
                if (["cat","and","or"].includes(array[i][0])){
                    raiAdd(array[i][0],body,array[i])}
                else {
                    let ing = raIngredient(array[i]);
                body.appendChild(ing);}
            }
parent.appendChild(body)

// console.log(elem,array)
return body
}


function raIngrPopup(parent,obj,elem){ let c = coverDiv(parent);
let div = document.createElement("div"); div.id = "raIngredientPopup"; c.appendChild(div);
    let prev = document.createElement("div"); prev.id = "raIPPrev"; div.appendChild(prev);
    let row2 = document.createElement("div"); row2.style = "display: flex; margin-top: 0.25em;"; div.appendChild(row2);
        let num = raInput("text","#","width: 5em"); row2.appendChild(num)
        let size = raInput("text","Size","width: 12em"); row2.appendChild(size);
        let ing = raInput("text","Ingredient *REQUIRED","width: 100%;"); row2.appendChild(ing);
    let row3 = document.createElement("div"); row3.style = "display: flex; margin-top: 1.5em;"; div.appendChild(row3);
        let com1 = raInput("text","Comment 1 (optional)","width: 48%; margin-right: 1%;"); row3.appendChild(com1);
        let com2 = raInput("text","Comment 2 (optional)","width: 48%; margin-right: 1%;"); row3.appendChild(com2);
    let cbtn = document.createElement("button"); cbtn.innerText = "Add Ingredient"; div.appendChild(cbtn);
        cbtn.onclick = function(){
            let ob = update();
            if ("ingredient" in ob){
                if (obj){
                    elem.after(raIngredient(recallIngrToArr(ob))); elem.remove();
                }
                else {
                document.getElementById("raiList").appendChild(raIngredient(recallIngrToArr(ob)));}
                c.remove();
            } else {toast("You must have an \"Ingredient\" name present to add this!")}
        }

function update(){ let obj = {}
    let n = num.childNodes[0].value; let s = size.childNodes[0].value; let i = ing.childNodes[0].value; let c1 = com1.childNodes[0].value; let c2 = com2.childNodes[0].value;
        if (n !== undefined && n.length > 0){obj.amount = n}
        if (s !== undefined && s.replaceAll(" ","").length > 0){obj.size = s}
        if (i !== undefined && i.replaceAll(" ","").length > 0){obj.ingredient = i}
            if (c1.length > 0 || c2.length > 0){
                obj.comment = [];
                if (c1.length > 0){obj.comment.push("(" + c1 + ")")}
                if (c2.length > 0){obj.comment.push("-" + c2 + "-")}
            }
    // preview
        while (prev.childNodes.length > 0){prev.childNodes[0].remove()}
        createIngredientDiv(obj,prev)
    return obj
    }

if (obj){ let o = iIngrF(obj); console.log(o,obj)
    if ("ingredient" in o){ing.childNodes[0].value = o["ingredient"]}
    if ("size" in o){size.childNodes[0].value = o["size"]}
    if ("amount" in o){num.childNodes[0].value = o["amount"]}
    if ("comment" in o){
        com1.childNodes[0].value = o["comment"][0].substring(1,o.comment[0].length-1);
        if (o["comment"].length === 2){com2.childNodes[0].value = o["comment"][1].substring(1,o.comment[1].length-1)}
    }
    update()
}

num.childNodes[0].onkeyup = update; size.childNodes[0].onkeyup = update; ing.childNodes[0].onkeyup = update; com1.childNodes[0].onkeyup = update; com2.childNodes[0].onkeyup = update;
    return div
}
