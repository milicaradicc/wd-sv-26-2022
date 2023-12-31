var firebaseUrl = "https://webprojekat-5430f-default-rtdb.europe-west1.firebasedatabase.app";
var destinations = {};
var destinationsID = []
var agencies = {};
var request=new XMLHttpRequest();
request.onreadystatechange=function(){
    if (this.readyState == 4) {
        if (this.status == 200) {
          agencies= JSON.parse(request.responseText);
        } else {
            window.location.href = "greska.html";
        }
    }
}
request.open('GET', firebaseUrl + '/agencije.json');
request.send();

console.log(agencies);

var table = document.getElementById("table");
var body = table.querySelector("tbody");
var cells;
var row;

table.addEventListener("click", function(event) {
  var target = event.target;
  if (target.tagName === "TD" && target.parentNode !== body.firstElementChild) {
    row = target.parentNode;
    cells = row.getElementsByTagName("td");
    console.log(cells);

    var checkboxesContainer = document.getElementById("check");
    checkboxesContainer.innerHTML = "";

    var agencyname = cells[0].innerHTML;
    oldname = cells[0].innerHTML;
    var agencyadress = cells[1].innerHTML;
    var agencyyear = cells[2].innerHTML;
    var agencyemail = cells[3].innerHTML;
    var agencyphone = cells[4].innerHTML;
    var agencydest = cells[5].innerHTML.split(",").map(item => item.trim());
    var agencypic = cells[6].innerHTML;

    document.getElementById("formagencyname").value = agencyname;
    document.getElementById("formagencyadress").value = agencyadress;
    document.getElementById("formagencyyear").value = agencyyear;
    document.getElementById("formagencyemail").value = agencyemail;
    document.getElementById("formagencyphone").value = agencyphone;
    document.getElementById("formagencypic").value = agencypic;

    var addedDestinations = []; 

    for (var groupID in destinations) {
      for (var id in destinations[groupID]) {
        var destinationValue = destinations[groupID][id]['naziv'];

        if (!addedDestinations.includes(destinationValue)) {
          var checkboxDiv = document.createElement("div");
          checkboxDiv.style.margin = "0.4rem";
          var checkbox = document.createElement("input");
          checkbox.className = "ch";
          checkbox.style.display = "inline-block";
          checkbox.type = "checkbox";
          checkboxDiv.appendChild(checkbox);
          var label = document.createElement("label");
          label.innerHTML = destinationValue;
          checkboxDiv.appendChild(label);
          checkboxesContainer.appendChild(checkboxDiv);
          checkbox.value = destinationValue;
          if (agencydest.includes(destinationValue)) {
            checkbox.checked = true;
            checkbox.value = destinationValue;
          } else {
            checkbox.checked = false;
          }

          addedDestinations.push(destinationValue); 
        }
      }
    }

    checkboxesContainer.style.display = "block"; 
  }
});


function editTableDisplay() {
  document.getElementById("editTable").style.display = "block";
  document.getElementById("createTable").style.display = "none";
}

function editTableDisplay1() {
  document.getElementById("createTable").style.display = "block";
  document.getElementById("editTable").style.display = "none";

  
  var table = document.getElementById("table");
  row;
  table.addEventListener("click", function(event) {
    var target = event.target;
    if (target.tagName === "TD" && target.parentNode !== body.firstElementChild) {
      row = target.parentNode;
      console.log(row.children[0].textContent)
      document.getElementById("createagency").value = row.children[0].textContent;
    }
  });
}


document.getElementById("editRowBtn1").addEventListener("click",function(){
    var checkedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    var list = [];
    //prikazivanje vrednosti selektovanih checkboxova
    for (var i = 0; i < checkedCheckboxes.length; i++) {
      var checkbox = checkedCheckboxes[i];
      console.log(checkbox)
      var checkboxValue = checkbox.value;
      list.push(checkboxValue);
    }
    console.log(list);

    var destinationsRequest=new XMLHttpRequest();
    destinationsRequest.onreadystatechange=function(){
      if (this.readyState == 4) {
          if (this.status == 200) {
           destinations= JSON.parse(destinationsRequest.responseText);
          } else {
              window.location.href = "error.html";
            }
        }
    }
    destinationsRequest.open('GET', firebaseUrl + '/destinacije.json');
    destinationsRequest.send();

    console.log(destinations);
    console.log(agencies);

    var updatedagencyname = document.getElementById("formagencyname").value;
    var updatedagencyadress = document.getElementById("formagencyadress").value;
    var updatedagencyyear = document.getElementById("formagencyyear").value;
    var updatedagencyemail = document.getElementById("formagencyemail").value;
    var updatedagencyphone = document.getElementById("formagencyphone").value;
    var updatedagencypic = document.getElementById("formagencypic").value;

    console.log(updatedagencyname);

    var update = true;
    var message;
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(updatedagencyadress === "" || updatedagencyadress === null){
        update = false;
        message = "Morate da unesete adresu";
    }
    if (updatedagencyphone === "" || updatedagencyphone === null) {
        update = false;
        message = "Morate da unesete broj telefona!";
    }    
    if(!updatedagencyphone.match(/^\d{3}\/\d{4}-\d{6}$/)){
      update = false;
      message = "Format broja telefona nije dobar koristite format 000/0000-00000";
    }
    if (!updatedagencyyear.match(/^\d+$/)) {
        update = false;
        message = "Unesite validnu godinu";
    }
    if (updatedagencyyear === "" || updatedagencyyear === null) {
        update = false;
        message = "Morate da unesete datum rodjenja!";
    } 
    if (!re.test(updatedagencyemail)) {
        signIn = false;
        message.innerHTML = "Email nije ispravan";
    }   
    if (updatedagencyemail === "" || updatedagencyemail === null) {
        update = false;
        message = "Morate da unesete email";
    }
    if (updatedagencyname === "" ||  updatedagencyname === null) {
        update = false;
        message = "Morate da unesete naziv agencije";
    }

    console.log(update);
    if (update) {
        message = "Refresujte stranicu";
        console.log(document.getElementsByClassName("popup"));
        document.getElementById("description4").innerHTML = message;
        document.getElementById("proslo1").classList.add("active");
        document.getElementById("dismiss-popup-btn0.1").addEventListener("click", function() {
          document.getElementsByClassName("popup")[2].classList.remove("active");
        });
        console.log(oldname);
        for (var id in agencies) {
          if (agencies[id]['naziv'] === oldname) {
            agencies[id]['adresa'] = updatedagencyadress;
            agencies[id]['brojTelefona'] = updatedagencyphone;
            agencies[id]['email'] = updatedagencyemail;
            agencies[id]['naziv'] = updatedagencyname;
            agencies[id]['godina'] = updatedagencyyear;
            agencies[id]['logo'] = updatedagencypic;

            row.children[0].innerHTML = updatedagencyname;
            row.children[1].innerHTML = updatedagencyadress;
            row.children[2].innerHTML = updatedagencyyear;
            row.children[3].innerHTML = updatedagencyemail;
            row.children[4].innerHTML = updatedagencyphone;
            row.children[5].innerHTML = list;
            row.children[6].innerHTML = updatedagencypic;

            changeDestinationGroup(destinations,list, agencies[id]['destinacije'],id);
      
            var putRequest = new XMLHttpRequest();
            putRequest.open('PUT', firebaseUrl + '/agencije/' + id + '.json', true);
            putRequest.setRequestHeader('Content-Type', 'application/json');
            console.log(JSON.stringify(agencies[id]));
            putRequest.send(JSON.stringify(agencies[id]));
          }
        }
      } else {
        document.getElementById("description5").innerHTML = message;
        document.getElementById("nijeProslo1").classList.add("active");
        console.log(document.getElementsByClassName("popup"));
        document.getElementById("dismiss-popup-btn1.1").addEventListener("click", function() {
            document.getElementsByClassName("popup")[3].classList.remove("active");
        });
      }
      
});


table.addEventListener("click", function(event) {
    var target = event.target;
    if (target.classList.contains("delete-btn-agency")) {
      var row = target.parentNode.parentNode;
      console.log(row);
  
      // Prikazivanje potvrde brisanja korisnika (popup-a)
      document.getElementById("areYouSure1").classList.add("active");

      // Dugme za odbijanje potvrde brisanja
      document.getElementById("dismiss-popup-btn2.1").addEventListener("click", function() {
        document.getElementsByClassName("popup")[4].classList.remove("active");
      });
  
      // Dugme za potvrdu brisanja
      document.getElementById("ok-popup-btn0.1").addEventListener("click", function() {
        document.getElementsByClassName("popup")[4].classList.remove("active");
        console.log(document.getElementsByClassName("popup"));

        var httpRequest = new XMLHttpRequest();
        console.log(agencies);
        for(var id in agencies) {
          console.log(id);
          if (agencies[id]['naziv'] === row.children[0].textContent) {
            console.log(id);
            httpRequest.onreadystatechange = function() {
              if (this.readyState == 4) {
                if (this.status == 200) {
                  // Obrada uspešnog brisanja korisnika
                  console.log(document.getElementsByClassName("popup"));
                  document.getElementById("obrisano1").classList.add("active");
                  document.getElementById("dismiss-popup-btn3.1").addEventListener("click", function() {
                    document.getElementsByClassName("popup")[5].classList.remove("active");
                  });
                  row.parentNode.removeChild(row);
                } else {
                  window.location.href = "greska.html";
                }
              }
            };
  
            httpRequest.open('DELETE', firebaseUrl + '/agencije/' + id + '.json');
            httpRequest.send();
          }
        }
      });
    }
  });
  
  table.addEventListener("click", function(event) {
    var target = event.target;
    if (target.classList.contains("create")) {
      var row = target.parentNode.parentNode;
      console.log(row);
  
      // Prikazivanje potvrde brisanja korisnika (popup-a)
      document.getElementById("kreiraj").classList.add("active");

    }
  });

function changeDestinationGroup(destinations,list,ID,id){
    var newDest = {}; 
    console.log(list)

    for (var groupId in destinations) {
      for (var Id in destinations[groupId]) {
        if (list.includes(destinations[groupId][Id]["naziv"])) {
          newDest[Id] = destinations[groupId][Id];
          var index = list.indexOf(destinations[groupId][Id]["naziv"]);
          if (index > -1) {
            list.splice(index, 1); //uklanja ime destinacije iz liste
          }
        }
      }
    }
    
    var putRequest = new XMLHttpRequest();
    console.log(newDest);
    for(var groupId in destinations){
      if(groupId === agencies[id]['destinacije']){
        destinations[groupId] = newDest;
        break;
      }
    }
    console.log(newDest);
    console.log(destinations[groupId]);


    putRequest.open('PUT', firebaseUrl + '/destinacije/' + ID + '.json', true);
    putRequest.setRequestHeader('Content-Type', 'application/json');
    console.log(JSON.stringify(destinations[ID]));
    putRequest.send(JSON.stringify(destinations[ID]));

  }