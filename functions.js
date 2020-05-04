let state = 0;
let selectedChar = true;
let gameOver = false;

const charList = [
    beleth,
    carver,
    charisBraveheart,
    curtis,
    ellie,
    nagisaRin,
    rieze,
    steveBlizzardCoat
]

let attackMethod = {
    basicAttack: "Attacked",
    withSkill: "Used"
}

let char1 = [];
let char2 = [];

let char1Health = 0;
let char1Armor = 0;
let char1MaxAttack = 0;
let char1MinAttack = 0;
let char1Skills = [];

let char2Health = 0;
let char2Armor = 0;
let char2MaxAttack = 0;
let char2MinAttack = 0;
let char2Skills = [];

const char1Select = charList.forEach((data, rowNum) => {
    ++rowNum;

    let row = document.createElement("tr");

    let num = document.createElement("td");
    let nodeNum = document.createTextNode(rowNum);
    num.appendChild(nodeNum);
    row.appendChild(num);

    let name = document.createElement("td");
    let nodeName = document.createTextNode(data.name);
    name.appendChild(nodeName);
    row.appendChild(name);

    let desc = document.createElement("td");
    let nodeDesc = document.createTextNode(data.description);
    desc.appendChild(nodeDesc);
    row.appendChild(desc);

    let baseAtt = document.createElement("td");
    let nodeBaseAtt = document.createTextNode(data.stats.minAtt + " - " + data.stats.maxAtt);
    baseAtt.appendChild(nodeBaseAtt);
    row.appendChild(baseAtt);

    let sel = document.createElement("td");
    let selBtn = document.createElement('button');
    selBtn.innerHTML = 'Select';

    selBtn.onclick = function () {
        if(char1.id != null) {
            char2 = charList.find(({ id }) => id === data.id);
            loadChar2(char2);

            toggleModal();

        } else {
            char1 = charList.find(({ id }) => id === data.id);
            loadChar1(char1);

            toggleModal();
            document.getElementById("selectChar1Btn").innerHTML = "Select 2nd Character";
            document.getElementById("selectCharHead").innerHTML = "Select Second Character";
        }
        
        if(char1.id != null && char2.id != null){
            document.getElementById("attackButton1").style.display = "block";
            document.getElementById("selectChar1Btn").style.visibility ="hidden";
            document.getElementById("char1Skills").style.display="block";
        }
    }

    sel.appendChild(selBtn);
    row.appendChild(sel);

    let element = document.getElementById("list");
    element.appendChild(row);
});

selectChar1 = () => {
    return char1Select;
}

loadChar1 = (char1) => {
    char1Health = char1.stats.health;
    char1Armor = char1.stats.armor;
    char1MaxAttack = char1.stats.maxAtt;
    char1MinAttack = char1.stats.minAtt;

    if(char1.img != ""){
        document.getElementById("char1-img").src = char1.img;
    }
    
    char1Skills = char1.skills.map((skills) => {
        return skills;
    })

    document.getElementById("char1-name").innerHTML = char1.name;
    document.getElementById("char1-health").innerHTML = char1Health;

    char1.skills.forEach((skill) => {
        let skillBulletPoint = document.getElementById("char1Skills");
        let skillLi = document.createElement("li");
        let skillBtn  = document.createElement("button")

        skillBtn.onclick = function(){
            useSkill(skill);
        }

        let skillNode = document.createTextNode(skill.name);
        skillBtn.appendChild(skillNode);
        skillLi.appendChild(skillBtn);
        skillBulletPoint.appendChild(skillLi);
    })
}

loadChar2 = (char2) => {
    char2Health = char2.stats.health;
    char2Armor = char2.stats.armor;
    char2MaxAttack = char2.stats.maxAtt;
    char2MinAttack = char2.stats.minAtt;
    
    char2Skills = char2.skills.map((skills) => {
        return skills;
    })
    
    if(char2.img != ""){
        document.getElementById("char2-img").src = char2.img;
    }
    document.getElementById("char2-name").innerHTML = char2.name;
    document.getElementById("char2-health").innerHTML = char2Health;

    char2.skills.forEach((skill) => {
        let skillBulletPoint = document.getElementById("char2Skills");
        let skillLi = document.createElement("li");
        let skillBtn  = document.createElement("button")

        skillBtn.onclick = function(){
            useSkill(skill);
        }

        let skillNode = document.createTextNode(skill.name);
        skillBtn.appendChild(skillNode);
        skillLi.appendChild(skillBtn);
        skillBulletPoint.appendChild(skillLi);
    })
}

document.getElementById("attackButton1").style.display="none";
document.getElementById("attackButton2").style.display="none";
document.getElementById("char1Skills").style.display="none";
document.getElementById("char2Skills").style.display="none";
document.getElementById("reloadBtn").style.display="none";

console.log(char1Skills);
console.log(char2Skills);

attack = () => {
    if(selectedChar === true) {
        //CHAR 1 ATTACK
        let totalDamage = Math.floor(Math.random() * (char1MaxAttack - char1MinAttack + 1) + char1MinAttack);
        char2Health = char2Health - totalDamage;
        console.log("Total = " + totalDamage + " Char: " + char1.name + " - " + selectedChar + " Health: " + char2Health);
        changeElement(selectedChar, totalDamage, attackMethod.basicAttack, "");
        changeChar(selectedChar);
    }
    else {
        //CHAR 2 Attack
        let totalDamage = Math.floor(Math.random() * (char2MaxAttack - char2MinAttack + 1) + char2MinAttack);
        char1Health = char1Health - totalDamage;
        console.log("Total = " + totalDamage + " Char: " + selectedChar + " Health: " + char1Health);
        changeElement(selectedChar, totalDamage, attackMethod.basicAttack, "")
        changeChar(selectedChar);
    }
}

changeChar = (charState) => {
    if(charState === true){
        selectedChar = false;
        document.getElementById("attackButton1").style.display="none";
        document.getElementById("attackButton2").style.display="block";
        document.getElementById("char1Skills").style.display="none";
        document.getElementById("char2Skills").style.display="block";
    } else {
        selectedChar = true;
        document.getElementById("attackButton2").style.display="none";
        document.getElementById("attackButton1").style.display = "block";
        document.getElementById("char2Skills").style.display="none";
        document.getElementById("char1Skills").style.display="block";
    }
    if(gameOver === true){
        document.getElementById("attackButton2").style.display="none";
        document.getElementById("attackButton1").style.display = "none";
        document.getElementById("char2Skills").style.display="none";
        document.getElementById("char1Skills").style.display="none";
    }
}

changeElement = (charState, totalDamage, attackMethod, skill) => {
    if(charState === true){

        if(char2Health <= 1){
            char2Health = 0;
            defeatMessage(char2.name, totalDamage, "char2-healthBar");
        }

        if(char2Health <= 100) {
            criticalHealth("char2-healthBar");
        }

        document.getElementById("char1-health").innerHTML=char1Health;
        document.getElementById("char2-health").innerHTML=char2Health;
        document.getElementById("dmgMessage").innerHTML=char1.alias + " " + attackMethod + " " + skill;
        document.getElementById("totalDamage").innerHTML=totalDamage + " dmg";
        document.getElementById("char2-healthBar").style.width=char2Health / 3;
    } else {

        if(char1Health <= 1) {
            char1Health = 0;
            defeatMessage(char1.name, totalDamage, "char1-healthBar");
        }

        if(char1Health <= 100) {
            criticalHealth("char1-healthBar");
        }

        document.getElementById("char2-health").innerHTML=char2Health;
        document.getElementById("char1-health").innerHTML=char1Health;
        document.getElementById("dmgMessage").innerHTML=char2.alias + " " + attackMethod + " " + skill;
        document.getElementById("totalDamage").innerHTML=totalDamage + " dmg";
        document.getElementById("char1-healthBar").style.width=char1Health / 3;
    }
}

const char1Skillset = document.getElementById("char1Skills");
const char2Skillset = document.getElementById("char2Skills");

let char1ElementName = document.getElementById("char1-name");
let char2ElementName = document.getElementById("char2-name");

useSkill = (skill) => {
    if(selectedChar === true){
        char2Health = char2Health - skill.damage;
        if(skill.addHealth != 0){
            char1Health = char1Health + skill.addHealth;
        }
    } else {
        char1Health = char1Health - skill.damage;
        if(skill.addHealth != 0){
            char2Health = char2Health + skill.addHealth;
        }
    }
    alert(skill.name + " used!")
    changeElement(selectedChar, skill.damage, attackMethod.withSkill, skill.name);
    changeChar(selectedChar);
}

criticalHealth = (healthBar) => {
    document.getElementById(healthBar).innerHTML="Critical";
    document.getElementById(healthBar).style.backgroundColor="red";
}

defeatMessage = (charName, totalDamage, healthBar) => {
    alert(charName + " has been defeated with a final damage of " + totalDamage);
    gameOver = true;

    document.getElementById(healthBar).innerHTML="Defeated";
    document.getElementById("attackButton1").style.visibility = "hidden";
    document.getElementById("attackButton2").style.visibility = "hidden";
    document.getElementById("selectChar1Btn").remove();
    document.getElementById("reloadBtn").style.display="block";
}

console.log(selectedChar);
console.log(char1Health);
console.log(char2Health);