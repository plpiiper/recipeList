ing_list = getSearchList("i")

/*
if (localStorage.savedRecipes !== undefined){
    recipes = JSON.parse(localStorage.savedRecipes)
} */

function getDataset(elem,data){
    let e = elem; if (typeof elem === "string"){e = document.getElementById(elem);}
    let d = e.dataset[data]
return [e,d]
}






function getSearchList(x,list){
var li = {}
    if (x == "i"){
for (var i=0; i<recipes.length; i++){
      var inl = getIngredients(recipes[i]);
          for (var l=0; l<inl.length; l++){
            if (inl[l] in li) {li[inl[l]] += 1}
            else {li[inl[l]] = 1} } } // if obj
} // ingredients
else if (x.includes("x")){
for (var i=0; i<list.length; i++){
var ig = list[i];
  if (ig in li) {li[ig] += 1} else {li[ig] = 1}
}}

if (list == "list" || x.includes("list")) {
var new_li = []; for (ingr in li) {new_li.push(ingr)};
  if (x.includes("x")) {return new_li} else {return new_li.sort()}
}
else { return li}
}



function getIngredients(obj){ // for a specific recipe
let abnormal = false; var il;
if (typeof obj == "object" && (obj.nodeType === undefined || obj.nodeType === null)) {il = obj["ingredients"]} // if an object (and not an element)

else if ((typeof obj == "object" && !Array.isArray(obj)) || typeof obj == "string"){  // else, if an object (and not a string), OR is string
        if (typeof obj == "string") {var div=document.getElementById(obj)}
          //referring to an element list
        else {var div = obj}  // referring to the elemenet directly
        var il = [];
        for (var i=0; i<div.childNodes.length; i++){ let divC = div.childNodes[i];
            if (divC.dataset.data !== undefined && divC.dataset.data !== null) {il.push(JSON.parse(divC.dataset.data))}
            else {
                if (divC.className === "raCategoryInside") {
                    if (divC.dataset.name.includes("[\"cat\",\"")) {
                        (il = JSON.parse(divC.dataset.name)).concat(il); abnormal = true; }
                    else {il.push(divC.innerText.toLowerCase()); abnormal = true;}
                }
                if (divC.className === "fSelectedIngr") { // ingredient list
                    il.push(divC.innerText) }
                }
                } ///gets list
    if (abnormal){ return il }
    }
else {console.log("err")}

var i_list = [];

// il = ["array"]
for (var x=0; x<il.length; x++){  let i = il[x];
// go through each object[x] --> ingredient array
  if (typeof i == "string") {i_list.push(i)  }
  else { var filed = fileIngr(i); if (typeof filed == "string") {i_list.push(filed)} else {i_list = i_list.concat(filed)} }
} //loop
return getSearchList("xlist",i_list)
}


function fileIngr(obj){
var list = []; var c = ["and","alt","cat"]

  if (!c.includes(obj[0])){ // if normal (not "and" "alt" "cat")
var read = readIngr(obj); if (typeof read == "string") {list.push(read)} else {list = list.concat(read)}
}
  else {
if (obj[0] == "cat") {var offset = 2} else {var offset = 1}
    for (var i=offset; i<obj.length; i++){
var smObj = obj[i]; var s_list = [];

if (["and","alt","cat"].includes(smObj[0])) { // if there's an obj included
  if (smObj[0] == "cat") {var os = 2} else {var os = 1}
var sl = []
for (var x=os; x<smObj.length; x++){
var r = readIngr(smObj[x]); if (typeof r == "string") {sl.push(r)} else {sl = sl.concat(r)}
}
s_list = s_list.concat(sl);
}
    else {
var read = readIngr(smObj); if (typeof read == "string") {s_list.push(read)} else {s_list = s_list.concat(read)}
}
list = list.concat(s_list)
    }}
return list
}



function readIngr(obj){
if (typeof obj == "string") {return obj}
  var prep = obj.findIndex(x => x[0] == "(" && x.at(-1) == ")" )
  var comm = obj.findIndex(x => x[0] == "-" && x.at(-1) == "-" )
if (prep + comm == -2) {
  if (obj.length == 2) {return obj[1]}
  else {return obj[2] }
}
else if (prep !== -1 && comm == -1){ return obj[prep-1]}
else if (comm !== -1 && prep == -1){ return obj[comm-1]}
else if (comm !== -1 && prep !== -1){ return obj[comm-2]}
else {console.log("error")}

}



function interpretIngr(obj,inside){
var o = {}
/*
var types = ["amount","size","ingredient","comment"]
*/

if (typeof obj == "string") {o["ingredient"] = obj; return o}
else if (["alt","cat","and"].includes(obj[0])){
  var new_o = []; if (!inside) {new_o.push(obj[0]);}
  var offset = 1; if (obj[0] == "cat") {offset = 2; new_o.push(obj[1])}
  for (var i=offset; i<obj.length; i++){
    new_o.push(interpretIngr(obj[i],true));
  }
if (inside) {return [obj[0]].concat(new_o) }
else { return new_o }}

else { o = iIngrF(obj); return o
}}


function iIngrF(obj){
var o = {}
// just an "ingredient" (meant for "creating ingredients")
    if ((typeof obj == "string") || (obj.length == 1 && typeof obj == "object" && typeof obj[0] == "string")){
        if (typeof obj == "object"){o["ingredient"] = obj[0];}
        else {o["ingredient"] = obj}
        return o }
    if (typeof obj == "object" && !Array.isArray(obj)){return obj} // if just the same
  var prep = obj.findIndex(x => x[0] == "(" && x.at(-1) == ")" )
  var comm = obj.findIndex(x => x[0] == "-" && x.at(-1) == "-" )

// Either: [ingr,comm] OR [amount,ingr]
  if (obj.length == 2){
    if (prep + comm !== -2) {
      o["ingredient"] = obj[0]
      o["comment"] = [];    o["comment"].push(obj[1])
    }
    else {
      o["amount"] = obj[0]; o["ingredient"] = obj[1];
}
}
// Options: [ingr,comm1,comm2] OR [amount,ingr,comm1] OR [amount,size,ingr]
  else if (obj.length == 3){
    if (prep + comm !== -2){
        if (prep !== -1 && comm !== -1) {
            o["ingredient"] = obj[0];   o["comment"] = [obj[1],obj[2]]
          }
        else {
            o["amount"] = obj[0]; o["ingredient"] = obj[1];
            o["comment"] = [obj[2]]
          }
        } // if comments exist
    else {
      o["amount"] = obj[0]; o["size"] = obj[1]; o["ingredient"] = obj[2];
}
      }
// Either: [amount,ingr,comm1,comm2] OR [amount,size,ingr,comm1]
  else if (obj.length == 4){
      if (prep + comm !== -2){ // comments exist
          if (prep !== -1 && comm !== -1) { // if 2 comments
            o["amount"] = obj[0]; o["ingredient"] = obj[1]; o["comment"] = [obj[2],obj[3]];
          }
          else { // 1 comment
            o["amount"] = obj[0]; o["size"] = obj[1]; o["ingredient"] = obj[2]; o["comment"] = [obj[3]]
          }
      }
    else {console.log("erorr"); console.log(obj)}
}
  else if (obj.length == 5){
o["amount"] = obj[0]; o["size"] = obj[1]; o["ingredient"] = obj[2]; o["comment"] = [obj[3],obj[4]];
    }
  else {console.log("error"); console.log(obj)}
return o;
} // end of function

function recallIngrToArr(obj){
    // taking example: {amount: '4', size: 'Bubbles', ingredient: 'Red'}
    // into [4,"Bubbles","Red"]
    var arr = []
    for (key in obj) {
        if (key !== "comment") {arr.push(obj[key])}
        else if (key == "comment" && typeof obj[key] == "object"){
        var c = obj["comment"];
            for (var i=0; i<c.length; i++){ arr.push(c[i]) }  }}
    if (arr.length == 1) { arr = obj.ingredient }
    return arr
}



function makeMinutes(time){
if (typeof time == "object"){
  var minutes = 0;
  var n = time[0]; // number (ex: "3" or "2¼")
  var t = time[1]; // type (ex: "Hour" or "Minute")
if (typeof n == "number" && t.includes("Hour")) {  minutes += (n*60)  }
else if (typeof n == "string" && t.includes("Hour")) {
  var h = n[0]; var x = n[1]; minutes += ((JSON.parse(h))*60)
    if (x == "¼") {minutes +=15}
    if (x == "½") {minutes +=30}
    if (x == "¾") {minutes +=45}
}
else if (typeof n == "number" && t == "Minutes") {minutes += n}
else {return false}

return minutes
}
else {return false}
}

function getTime(time){
var totalmin = makeMinutes(time)
var h = Math.floor(totalmin/60); var m = totalmin%60
  if (h == 0){
return m + " Min"
}
  else if (h == 0 && m > 60){
  return totalmin + " Min"
}
  else {
      var str = h
      if (m > 0) {
          if (m%15 == 0) {
              var alt = m/15; if (alt == 1) {str += "¼"} else if (alt == 2) {str += "½"} else {str += "¾"}
              if (h == 1) {str += " Hour"}
              else {str += " Hours"}
          }
         else {str+=" Hour"; if (h>0) {str += "s"} str += " " +  m + " Min"}
      }
      else {str += " Hour"; if (h > 0) {str += "s"}}
  return str
}

}



function sortRec(array,type,mode){
var list = array
if (type == "lName") {var search = "name"}
if (type == "lType") {var search = "cat"}
if (type == "lTime") {var search = "time"}

    if (type !== "lTime"){
if (mode == 0) {return list}
if (mode == 1) {
    list.sort(function(a, b) {
    let x = a[search].toLowerCase(); let y = b[search].toLowerCase()
    if (x<y) {return -1;}
    if (x>y) {return 1}
    return 0
})}
if (mode == 2) {
    list.sort(function(a, b) {
    let x = b[search].toLowerCase(); let y = a[search].toLowerCase()
    if (x<y) {return -1;}
    if (x>y) {return 1}
    return 0
})}

}
else if (type == "lTime"){
if (mode == 0) {return list}
if (mode == 1){
  list.sort(function(a, b){
let x = makeMinutes(a["time"]); let y = makeMinutes(b["time"]);
  return (x-y)  }
)}
if (mode == 2){
  list.sort(function(a, b){
let x = makeMinutes(b["time"]); let y = makeMinutes(a["time"]);
  return (x-y)  }
)}

} //specific etc
return list
}




function getStat(rank,type){
// rank >> lowest, highest
// type = "time", "most steps", "most ingredients", etc

if (type === "time"){
  var arr = [makeMinutes(recipes[0]["time"]),recipes[0]]
    // [0] = # minutes    [1] = object Recipe
for (var i=1; i<recipes.length-1; i++) {
if ("time" in recipes[i]) {
    var m = makeMinutes(recipes[i]["time"])
        if (rank === "highest" && (arr[0]<m)) {arr[0] = m; arr[1] = recipes[i]}
        if (rank === "lowest" && (arr[0]>m)) {arr[0] = m; arr[1] = recipes[i]}
}}  return arr  } //time


}


function measurementShortcut(type,div){
var m_list = [
  {n: "Teaspoon", sh: "Tsp"},
  {n: "Tablespoon", sh: "Tbsp"},
  {n: "Pound", sh: "lbs"},
  {n: "Ounce", sh: "Oz"},
  {n: "Quart", sh: "Qt"}
]
var x = m_list.find(x => type.toLowerCase().includes(x.n.toLowerCase()))

if (x !== undefined){  div.innerText = x["sh"]  }

}



function startFilters(r){ // r = recipes (obj)
let nm = document.getElementById("fSearchBarDiv").value.toLowerCase();
let ct = document.getElementById("fSelectCats").childNodes[0].innerText.toLowerCase();
let ing_list = getIngredients("fIngListDiv");
let tt = JSON.parse(document.getElementById("timerDiv").childNodes[0].value)
// filtering:
let filtered = r;
if (nm.length > 0) { filtered = filtered.filter(f => f.name.toLowerCase().includes(nm)) }
if (ct !== "select cat") {
filtered = filtered.filter(f => ("cat" in f) && f.cat.toLowerCase().includes(ct)) }
if (ing_list.length > 0){

filtered = filtered.filter( r=>
ing_list.every(ing => getIngredients(r).includes(ing))
) // if all filtered ingredients (in "ing_list" are present in every recipe)

}
filtered = filtered.filter(r => makeMinutes(r.time) <= tt)
createRecipes(filtered)
return filtered
}


/* element.js */
// raFunctions
function raGetRecipe(){
    let bd = document.getElementById("raMainDiv"); let obj = {}
    //name, cat, time, ingredients, steps
        let n = document.getElementById("raName").childNodes[0].value;
        let c = document.getElementById("raCat").value;
        let ingr = raGetIngredients();
        let steps = raGetSteps();
        let time = raGetTime()
if (n.length > 0){obj.name = n}
if (c.length > 0){obj.cat = c}
if (ingr.length > 0) {obj.ingredients = ingr}
if (steps.length > 0) {obj.steps = steps}
if (time.length > 0){obj.time = time}
    return obj
}


function raGetIngredients(){ let b = document.getElementById("raiList"); let li = [];
    for (var i=0; i<b.childNodes.length; i++){li.push(JSON.parse(b.childNodes[i].dataset.data)) }
    return li
}
function raGetSteps(){let b = document.getElementById("raslContainer"); let li = [];
    for (var i=0; i<b.childNodes.length; i++){li.push(b.childNodes[i].childNodes[0].value) }
    return li
}
function raGetTime(){let b = document.getElementById("raTimeDiv"); let time = [];
    if (b.childNodes[0].childNodes[0].innerText === "check_box"){
    let hrs = b.childNodes[1].childNodes[0].childNodes[0].value
    let mins = b.childNodes[1].childNodes[1].childNodes[0].value
        if (mins > 0 || hrs > 0){
    let minutes = 0
        if (hrs.length > 0 && hrs > 0){minutes += JSON.parse(60*hrs)}
        if (mins.length > 0 && mins > 0){minutes += JSON.parse(mins)}
    time = [minutes,"Minutes"]
    }}
return time
}




function raDragStart(event){
    let slct = document.getElementById("raSelected"); if (slct !== null) {slct.id = ""}
    event.currentTarget.id = "raSelected";
}
function raDragDrop(event){
    let dropInto = event.target;
    let elem = document.getElementById("raSelected");
        if (elem === dropInto.element){elem.id = ""; return}
    if (dropInto.classList.contains("raiColumn")){ dropInto.appendChild(elem); }
        if (elem !== null) {
        elem.parentNode.dataset.data = JSON.stringify(raGetColIngr(elem.parentNode))
        raRefreshIngredientsBack(elem); elem.id = ""; }
}

function raRefreshIngredientsBack(start){
    let col = start.parentNode;
    while (col.previousSibling !== null) { let newList = raGetColIngr(col); col.element.dataset.data = JSON.stringify(newList); col = col.previousSibling; }
    if (col.parentNode.id === "raiSubBody"){let newList = raGetColIngr(col); col.element.dataset.data = JSON.stringify(newList); }
    let r = raGetRecipe();
    document.getElementById("raMainDiv").dataset.data = JSON.stringify(r);
}


function raGetColIngr(col){
let arr = []; let cn = col.childNodes
    for (var i=0; i<cn.length; i++){
        if (cn[i].classList.contains("raicTitle")){
            let val = JSON.parse(cn[i].dataset.data); arr = arr.concat(val); }
        else {arr.push(JSON.parse(cn[i].dataset.data))}}
return arr
}

function matchRecipe(rec1,rec2){
    for (key in rec1){if (rec2[key]) { if (rec1[key]!==rec2[key]){return false}} }
    return true
}

function recipeData(type){
    try{
    if (type === "save"){
        localStorage.recipeList = JSON.stringify(recipes);
    }
    if (type === "load"){
        if (localStorage.recipeList){recipes = JSON.parse(localStorage.recipeList)}
    }}
    catch(err) {console.log(err)}

}

recipeData("load"); createSite(); createRecipes(recipes)
