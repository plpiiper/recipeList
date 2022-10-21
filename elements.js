function createSite(){
var body = document.getElementById("content");

var div = document.createElement("div"); div.id = "mDiv"; body.appendChild(div)

  var sb = document.createElement("div"); sb.id = "sideBar"; div.appendChild(sb);  createSideBar(sb);

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
div.onclick = function(event){removeAround(event)}

return div
}

function removeAround(event){
  var r = event.composedPath()[0]; var cover = r
while (cover.className !== "coverDiv") {cover = cover.parentNode}
r = cover.childNodes[0]

r = r.getBoundingClientRect()
var cW = event.clientX; var cH = event.clientY
var totalW = r.width + r.x; var totalH = r.height + r.y
var w = r.x; var h = r.y

if ((cH < h || cH > totalH) || (cW < w || cW > totalW)) {
cover.remove()
}


}


function toggleSideBar(){
    var sb = document.getElementById("sideBar");
if (sb.style.display == "flex") {sb.style.display = "none"}
else {sb.style.display = "flex"}
}