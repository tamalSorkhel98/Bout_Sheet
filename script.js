let form = document.querySelector('form');
// submit button
const submitBtn = document.querySelector('.submit');
//modal 
let modal =document.querySelector('.modal');
// player object
let players=[];
// players history
let playerHistory = JSON.parse(localStorage.getItem("players"));
if(playerHistory){
    players=playerHistory;
}
// select age and fightCategory for find fight category
let age = document.querySelector('#age');
let fightCategory= document.querySelector('#fightCategory');
// generate group btn
const generateGroup = document.querySelector("#generateGroup");
// group for boutsheet
let group ={}
// groupList to display groups in output 
let groupList = document.querySelector('.groupList');
//  generate bout sheet
const genBout = document.querySelector('.genBout');
// it will displays boutsheet
let boutSheet = document.querySelector('.boutSheet');



//sbumit button clicked
submitBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    // selecting all input values
    const name = document.querySelector('#name').value;
    const gender = document.querySelector('#gender').value;
    const weight = document.querySelector('#weight').value;
    const age= document.querySelector('#age').value;
    const adhar = document.querySelector('#adhar').value;
    const club = document.querySelector('#club').value;
    const fightCategory = document.querySelector('#fightCategory').value;
    const ageCategory=findAgeCategory(age);
    // if form is empty then error shows
    if(name.trim()==="" ||weight.trim()===""|| age==""||adhar===""||club===""||fightCategory===""||ageCategory===""){
        alert('input all field');
        return;
    }
    // if same players register two times
    if(check(adhar)){
        alert(`${name} already registered`);
        return;
    }
    //assigns all values inside player object
    let player = {
    name:name,
    gender:gender,
    adhar:adhar,
    club:club,
    weight:weight,
    age:age,
    ageCategory:ageCategory,
    weightCategory:findWeightCategory(weight,ageCategory),
    fightCategory:fightCategory
} 
    players.push(player) ;  
// it displays player details saved
modal.innerText = `
${player.name}, ${player.gender}, ${player.club}, ${player.ageCategory}, ${player.weight}, ${player.fightCategory} saved`;

    // saved in local storage
    localStorage.setItem("players",JSON.stringify(players));
    // modal value cleared
    setTimeout(() => {
    modal.innerText="";
}, 5000);
// it will reset valu of input box after submit then it will be empty field
form.reset();
})

// check if one player register two times 
function check(adhar){
for(let p of players){
    if(p.adhar==adhar)return true;
}
return false;
}

// it finds the correct age category
function findAgeCategory(age){
        if(age<=13) return "sub-jr";
        else if(age<=15)return "teenegers";
        else if(age<18)return "jr";
        else return "sr";
}

// it finds the correct fight category
age.addEventListener("input",()=>{
    let ageInput = Number(age.value);
    fightCategory.innerHTML=`<option value="">not select</option>`;
    if(ageInput<=13) 
        fightCategory.innerHTML=`
        <option value= "semi-contact">semi-contact</option>`;
    else if(ageInput<=15) 
        fightCategory.innerHTML=`
        <option value= "semi-contact">semi-contact</option>`;
    else if(ageInput<18)
        fightCategory.innerHTML=`
        <option value= "semi-contact">semi-contact</option>
        <option value= "light-contact">light-contact</option>`;
    else fightCategory.innerHTML=`
        <option value= "full-contact">full-contact</option>
        <option value= "low-kick">low-kick</option>
        <option value= "point-fight">point-fight</option>
        <option value= "kick-lite">kick-lite</option>`;
})

// it finds the weight category
function findWeightCategory(weight,ageCategory){
    if(ageCategory==="sr"){
        if(weight<50) return 50;
        if(weight>=50 && weight<=60)return 60;
        else if(weight>60 && weight<=70) return 70;
        else if(weight>70 && weight<=80)return 80;
        else return 80+"+";
    }
    else{
       if(weight>=40 && weight<=50)return 50;
        else if(weight>50 && weight<=60) return 60;
        else if(weight>60 && weight<=70)return 70;
        else return 80+"+";
    }
}

// generateGroup function to create group of fighters
generateGroup.addEventListener("click",(e)=>{
    e.preventDefault();
    if(players.length==0){
        alert('No player for grouping')
        return;
    }
    group = {}
    console.log("generating...")
    players.forEach(p=>{
        // bout list heading
        // age category - wight category - fight category
        let key = `${p.ageCategory} - ${p.weightCategory} - ${p.gender} - ${p.fightCategory}`;
        if(!group[key]){
            group[key]=[];
        }
        group[key].push(p);
        
        
        genBout.hidden = false;
    })
    renderGroup();
})
//  it will display all the groups of event
function renderGroup(){
    groupList.innerHTML=``;
    
    for(let k in group){
        let grpContainer=document.createElement('div');
        grpContainer.classList.add('grpContainer');
        let h = document.createElement('h2');
        h.innerText = `${k}`
        grpContainer.appendChild(h);
        let arr = group[k];
        for(let val of arr){
            let row = document.createElement('div');
            row.classList.add('groupRow');
            let p1 = document.createElement('p');
            p1.innerText = `${val.name} (${val.club.split(" ")[0]}) wt - ${val.weight}kg`
            let removeBtn = document.createElement('button');//remove button to remove player from group
            removeBtn.innerHTML=`<i class="ri-delete-bin-line"></i>`;
            row.appendChild(p1); 
            row.appendChild(removeBtn);
            grpContainer.appendChild(row);
            groupList.appendChild(grpContainer);  
            // it will remove the player from group
            removeBtn.addEventListener("click",()=>{
                removePlayer(removeBtn,val)
            })       
        }
        
    }
    
}
// function for remove player from group
function removePlayer(btn,val){
    const isConfirm = confirm(`do u want to remove ${val.name}`)
    if(!isConfirm) return;
    // it removes player from registered player array
 players=players.filter( p => val.adhar!=p.adhar);
//  it will remove player from groups
 for(let k in group){
    group[k]=group[k].filter(key => key.adhar!=val.adhar);
 }
 localStorage.setItem("players",JSON.stringify(players));
 renderGroup();
}


// it will generate boutSheet
genBout.addEventListener("click",(e)=>{
    e.preventDefault();
    boutSheet.innerHTML=``;
    for(key in group){
        let grpContainer=document.createElement('div');
        grpContainer.classList.add('grpContainer');
        let h = document.createElement('h2');
        h.innerText = `${key}`
        grpContainer.appendChild(h);
        let category = group[key];

         let bout = (findBout(category));
         for(let i=0;i<bout.length;i++){
        let p =document.createElement('p');
        p.innerText=bout[i];
        grpContainer.appendChild(p);
        boutSheet.appendChild(grpContainer);
        boutSheet.style.display='flex';
        }
    }
    // current create bout sheet
    
    
})
// find bout sheet function
function findBout(newCategory){
    let category = shuffle(newCategory);//it will suffle each group on every generateBoutsheet button click
    let bout = [];
    for(let i=0;i<category.length;i+=2){
        if(category[i+1])
        {bout.push(`${category[i].name} (${category[i].club.split(" ")[0]}) vs ${category[i+1].name} (${category[i+1].club.split(" ")[0]})`)}
        else bout.push(`${category[i].name} (${category[i].club.split(" ")[0]})`);
    }
    
    return bout;
}

// suffling the boutSheet
function shuffle(arr){
    let newArr = [...arr];
    for(let i=newArr.length-1;i>=0;i--){
        let j = Math.floor(Math.random()*(i+1));
        [newArr[i],newArr[j]]=[newArr[j],newArr[i]];
    }
    return newArr;
}